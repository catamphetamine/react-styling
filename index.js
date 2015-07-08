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

// zips two arrays
function zip(a, b)
{
	return a.map(function(_, index) 
	{
		return [a[index], b[index]]
	})
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

// converts text to JSON object
function parse_json_object(text)
{
	// ignore opening curly braces for now.
	// maybe support curly braces along with tabulation in future
	text = text.replace(/[\{\}]/g, '')

	return parse_lines(text.split('\n'))
}

// a node in style JSON object
class Node
{
	constructor(name, styles, descendants)
	{
		this.name = name
		this.styles = styles
		this.descendants = descendants
	}

	// parse lines (using styles) into a JSON object with child nodes of this child node
	json()
	{
		const object = {}

		// transform styles from text to JSON objects
		const own_style = this.styles.map(function(style)
		{
			const parts = style.split(':')

			let key     = parts[0].trim()
			const value = parts[1].trim()

			// transform dashed key to camelCase key (it's required by React)
			key = key.replace(/([-]{1}[a-z]{1})/g, character => character.substring(1).toUpperCase())

			return { key, value }
		})
		// add own styles to the object
		.reduce(function(own_style, style)
		{
			own_style[style.key] = style.value
			return own_style
		}, 
		{})

		// apply the style to the object itself
		extend(object, own_style)

		// process child lines recursively
		const children = parse_lines(this.descendants)

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
}

// tabulation utilities
class Tabulator
{
	constructor(tab)
	{
		this.tab = tab
	}

	// // has tab in the beginning
	// is_tabulated(line)
	// {
	// 	return starts_with(line, this.tab.symbol)
	// }

	// add one tab in the beginning
	tabulate(line, how_much = 1)
	{
		return repeat(this.tab.symbol, how_much) + line
	}

	// remove some tabs in the beginning
	reduce_tabulation(line, how_much = 1)
	{
		return line.substring(this.tab.symbol.length * how_much)
	}

	// how many "tabs" are there before content of this line
	calculate_indentation(line)
	{
		const matches = line.match(this.tab.regexp)

		if (!matches)
		{
			return 0
		}

		return matches[0].length / this.tab.symbol.length
	}

	normalize_initial_tabulation(lines)
	{
		// filter out blank lines,
		// calculate each line's indentation,
		// and get the minimum one
		const minimum_indentation = lines
			.filter(line => !is_blank(line))
			.map(line => this.calculate_indentation(line))
			.reduce((minimum, indentation) => Math.min(minimum, indentation), Infinity)

		// if there is initial tabulation missing - add it
		if (minimum_indentation === 0)
		{
			lines = lines.map(line => this.tabulate(line))
		}
		// if there is excessive tabulation - trim it
		else if (minimum_indentation > 1)
		{
			lines = lines.map(line => this.reduce_tabulation(line, minimum_indentation - 1))
		}

		return lines
	}
}

// decide whether it's tabs or spaces
Tabulator.determine_tabulation = function(lines)
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

// parses lines of text into a JSON object
// (recursive function)
function parse_lines(lines)
{
	// return empty object if there are no lines
	if (!lines.length)
	{
		return {}
	}

	// ensure there are no blank lines at the start
	if (is_blank(lines[0]))
	{
		lines.shift()
		return parse_lines(lines)
	}

	const tabulator = new Tabulator(Tabulator.determine_tabulation(lines))

	lines = tabulator.normalize_initial_tabulation(lines)
	.filter(function(line)
	{
		// ignore blank lines,
		// ignore single line comments (//)
		return !is_blank(line) && !line.match(/^[\s]*\/\//)
	})
	.map(function(line, index)
	{
		let original_line = line

		const indentation = tabulator.calculate_indentation(line)
		line = tabulator.reduce_tabulation(line, indentation)

		// check for messed up space tabulation
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
			index         : index,
			indentation   : indentation
		}

		return result
	})

	// determine lines with indentation = 1 (child block entry lines)
	const node_entry_lines = lines.filter(line_data => line_data.indentation === 1).map(line => line.index)

	// deduce corresponding child block ending lines
	const node_ending_lines = node_entry_lines.map(line_index => line_index - 1)
	node_ending_lines.shift()
	node_ending_lines.push(lines.length - 1)

	// each node boundaries in terms of starting line index and ending line index
	const from_to = zip(node_entry_lines, node_ending_lines)

	// now lines are split by blocks
	const node_blocks = from_to.map(from_to => lines.slice(from_to[0], from_to[1] + 1))

	return node_blocks.map(function(lines)
	{
		// the first line is the node's name
		let name = lines.shift().line

		// if someone forgot a trailing colon in the style class name - trim it
		// (or maybe these are Python people)
		if (ends_with(name, ':'))
		{
			name = name.substring(0, name.length - ':'.length)
			// throw new Error(`Remove the trailing colon at line: ${original_line}`)
		}

		// node own styles
		const styles = lines.filter(function(line_info)
		{
			const line        = line_info.line
			const indentation = line_info.indentation

			if (indentation !== 2)
			{
				return
			}

			// detect generic css style line
			const colon_index = line.indexOf(':')
			return (colon_index > 0 && colon_index < line.length - 1) && !starts_with(line, '@')
		})

		// node child nodes and all their descendants if any
		const descendants = lines.filter(function(line_info)
		{
			return !styles.includes(line_info)
		})

		// create a new block for this style class
		const node = new Node(name, styles.map(line_info => line_info.line), descendants.map(line_info => tabulator.tabulate(line_info.line, line_info.indentation - 1)))

		return { name, json: node.json() }
	})
	.reduce(function(nodes, node)
	{
		nodes[node.name] = node.json
		return nodes
	}, 
	{})
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