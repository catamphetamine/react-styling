// if the variable is defined
const exists = what => typeof what !== 'undefined'

// if the string starts with the substring
function starts_with(string, what)
{
	return string.indexOf(what) === 0
}

// if the string ends with the substring
function ends_with(string, what)
{
	const index = string.lastIndexOf(what)
	if (index < 0)
	{
		return
	}
	return index === string.length - what.length
}

// repeat string N times
function repeat(what, times)
{
	let result = ''
	while (times > 0)
	{
		result += what
		times--
	}
	return result
}

// if the text is blank
function is_blank(text)
{
	return !text.replace(/\s/g, '')
}

// extends the first object with 
function extend(to, from, or_more)
{
	const parameters = Array.prototype.slice.call(arguments, 0)

	if (exists(or_more))
	{
		const last = parameters.pop()
		const intermediary_result = extend.apply(this, parameters)
		// pass undefined as the third argument because of either Babel.js bug, or some other bug
		// (the third argument is supplied and is equal to the second argument which is weird)
		return extend(intermediary_result, last, undefined)
	}

	for (let key of Object.keys(from))
	{
		if (typeof from[key] === 'object' && exists(to[key]))
		{
			to[key] = extend(to[key], from[key])
		}
		else
		{
			to[key] = from[key]
		}
	}

	return to
}

// decide whether it's tabs or spaces
function determine_tabulation(lines)
{
	const substract = pair => pair[0] - pair[1]

	function calculate_leading_spaces(line)
	{
		let counter = 0
		line.replace(/^( )+/g, function(match) { counter = match.length })
		return counter
	}

	// take all meaningful lines
	lines = lines.filter(line => !is_blank(line))

	// has to be at least two of them
	if (lines.length < 2)
	{
		throw new Error(`Couldn't decide on tabulation type. Not enough lines.`)
	}

	// if we're using tabs for tabulation
	if (starts_with(lines[1], '\t'))
	{
		const tab = 
		{
			symbol: '\t',
			regexp: new RegExp(`^(\t)+`, 'g')
		}

		return tab
	}

	// take the first two lines,
	// calculate their indentation,
	// substract it and you've got the tab width
	const tab_width = Math.abs(substract(
		lines
			.slice(0, 2)
			.map(calculate_leading_spaces)
	))

	if (tab_width === 0)
	{
		throw new Error(`Couldn't decide on tabulation type. Invalid tabulation.`)
	}

	const symbol = repeat(' ', tab_width)

	const spaced_tab = 
	{
		symbol: symbol,
		regexp: new RegExp(`^(${symbol})+`, 'g')
	}

	return spaced_tab
}

// converts text to JSON object
function parse_json_object(text)
{
	// ignore opening curly braces for now.
	// maybe support curly braces along with tabulation in future
	text = text.replace(/[\{\}]/g, '')

	return parse_lines(text.split('\n'))
}

class Node
{
	constructor(name)
	{
		this.name = name
		this.lines = []
		this.styles = []
	}

	// parse lines (using styles) into a JSON object with child nodes of this child node
	json()
	{
		const object = {}

		// add own styles
		const own_style = {}
		for (let style of this.styles)
		{
			const parts = style.split(':')

			let key     = parts[0].trim()
			const value = parts[1].trim()

			// transform dashed key to camelCase key (it's required by React)
			key = key.replace(/([-]{1}[a-z]{1})/g, character => character.substring(1).toUpperCase())

			own_style[key] = value
		}

		// apply the style to the object itself
		extend(object, own_style)

		// process child lines recursively
		const children = parse_lines(this.lines)

		// detect and expand modifier style classes
		Object.keys(children).filter(name => starts_with(name, '.')).forEach(function(name)
		{
			// remove the leading dot from the name
			children[name.substring('.'.length)] = extend({}, own_style, children[name])
			delete children[name]
		})

		// add children to the parent
		extend(object, children)

		// end this block
		return object
	}

	add_style(style)
	{
		this.styles.push(style)
	}

	add_line(line)
	{
		this.lines.push(line)
	}
}

function parse_lines(lines)
{
	// return if no lines
	if (!lines.length)
	{
		return {}
	}

	// ensure there are no blank lines at the start
	if (is_blank(lines[0]))
	{
		lines.splice(0, 1)
		return parse_lines(lines)
	}

	// has tab in the beginning
	const is_tabulated = line => starts_with(line, tab.symbol)

	// add one tab in the beginning
	const tablulate = line => tab.symbol + line

	// remove some tabs in the beginning
	const reduce_tabulation = (line, how_much) => line.substring(tab.symbol.length * how_much)

	// remove one tab in the beginning
	const chop_one_tab_off = (line) => reduce_tabulation(line, 1)

	// how many "tabs" are there before content of this line
	function calculate_indentation(line)
	{
		const matches = line.match(tab.regexp)

		if (!matches)
		{
			return 0
		}

		return matches[0].length / tab.symbol.length
	}

	function normalize_initial_tabulation(lines)
	{
		// filter out blank lines,
		// calculate each line's indentation,
		// and get the minimum one
		const minimum_indentation = lines
			.filter(line => !is_blank(line))
			.map(calculate_indentation)
			.reduce((minimum, indentation) => Math.min(minimum, indentation), Infinity)

		// if there is initial tabulation missing - add it
		if (minimum_indentation === 0)
		{
			lines = lines.map(line => tablulate(line))
		}
		// if there is excessive tabulation - trim it
		else if (minimum_indentation > 1)
		{
			lines = lines.map(line => reduce_tabulation(line, minimum_indentation - 1))
		}

		return lines
	}

	const tab = determine_tabulation(lines)
	lines = normalize_initial_tabulation(lines)

	// last intentation level
	let previous_indendation = 0
	let child

	const nodes = {}

	function finalize_child_node()
	{
		nodes[child.name] = child.json()
		child = null
	}

	lines.filter(function(line)
	{
		// ignore blank lines,
		// ignore single line comments (//)
		return !is_blank(line) && !line.match(/^[\s]*\/\//)
	})
	.map(function(line)
	{
		let original_line = line

		// count current line indentation level
		let indentation = 0
		while (is_tabulated(line))
		{
			indentation++
			line = chop_one_tab_off(line)
		}

		// check for messed up tabulation
		if (starts_with(line, ' '))
		{
			// #${line_index}
			throw new Error(`Invalid tabulation (some extra leading spaces) at line: "${line}"`)
		}

		// remove any trailing whitespace
		line = line.trim()

		const result = 
		{
			line          : line,
			original_line : original_line,
			indentation   : indentation
		}

		return result
	})
	.forEach(function(line_data)
	{
		let line = line_data.line
		const original_line = line_data.original_line
		const indentation = line_data.indentation

		// if the indentation level is 1, then it's the start of a new block
		if (indentation === 1)
		{
			// if there is a previously started block - finish it
			if (child)
			{
				finalize_child_node()
			}

			// if someone forgot a trailing colon in the style class name - trim it
			// (or maybe these are Python people)
			if (ends_with(line, ':'))
			{
				line = line.substring(0, line.length - ':'.length)
				// throw new Error(`Remove the trailing colon at line: ${original_line}`)
			}

			// start a new block for this style class
			child = new Node(line)
		}
		else
		{
			const colon_index = line.indexOf(':')
			const seems_like_css = colon_index > 0 && colon_index < line.length - 1

			// if it's a generic style for this style class - 
			// simply add it to the styles array and continue the cycle
			if (indentation === 2 && seems_like_css && !starts_with(line, '@'))
			{
				child.add_style(line)
			}
			else
			{
				// if it's not a generic style, then it's a descendant node
				child.add_line(chop_one_tab_off(original_line))
			}
		}

		// update the will-be-previous indentation level
		previous_indendation = indentation
	})

	// if there is a previously started block - finish it
	if (child)
	{
		finalize_child_node()
	}

	// done
	return nodes
}

// using ES6 template strings
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings
export default function styler(strings, ...values)
{
	let style = ''

	// restore the whole string from "strings" and "values" parts
	let i = 0
	while (i < strings.length)
	{
		style += strings[i]
		if (exists(values[i]))
		{
			style += values[i]
		}
		i++
	}

	return parse_json_object(style)
}