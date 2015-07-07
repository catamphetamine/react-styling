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
function calculate_tab_width(lines)
{
	const substract = pair => pair[0] - pair[1]

	function calculate_leading_spaces(line)
	{
		let counter = 0
		line.replace(/^( )+/g, function(match) { counter = match.length })
		return counter
	}

	lines = lines.filter(line => !is_blank(line))

	if (lines.length < 2)
	{
		throw new Error(`Couldn't decide on tabulation type. Not enough lines.`)
	}

	// if we're using tabs for tabulation
	if (starts_with(lines[1], '\t'))
	{
		return null
	}

	// take the first two meaningful lines,
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

	return tab_width
}

// converts text to JSON object
function parse_json_object(text)
{
	// ignore opening curly braces for now.
	// maybe support curly braces along with tabulation in future
	text = text.replace(/[\{\}]/g, '')

	return parse_lines(text.split('\n'))
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

	const children = {}

	let child_name
	let child_lines
	let own_styles

	function start_child(name)
	{
		child_name = name
		child_lines = []
		own_styles = []
	}

	function finish_child(object)
	{
		if (object)
		{
			children[child_name] = object
		}

		child_name = null
		child_lines = null
		own_styles = null
	}

	function finish()
	{
		const object = {}

		// add own styles
		const own_style = {}
		for (let style of own_styles)
		{
			const key = style.substring(0, style.indexOf(':')).trim()
			const value = style.substring(style.indexOf(':') + 1).trim()

			// transform dashed key to camelCase key (it's required by React)
			const canonical_key = key.replace(/([-]{1}[a-z]{1})/g, character => character.substring(1).toUpperCase())

			own_style[canonical_key] = value
		}

		// apply the style to the object itself
		extend(object, own_style)

		// process child lines recursively
		extend(object, parse_lines(child_lines))

		// detect and expand modifier style classes
		for (let key of Object.keys(object))
		{
			// expand modifier style classes
			if (starts_with(key, '.'))
			{
				object[key.substring('.'.length)] = extend({}, own_style, object[key])
				delete object[key]
			}
		}

		// end this block
		finish_child(object)
	}

	// initialize variables
	finish_child()

	// what is the tab symbol
	function tab_symbol()
	{
		if (tab_width === null)
		{
			return '\t'
		}
		else
		{
			return repeat(' ', tab_width)
		}
	}

	// has tab in the beginning
	const is_tabulated = line => starts_with(line, tab)

	// add one tab in the beginning
	const tablulate = line => tab + line

	// remove some tabs in the beginning
	const reduce_tabulation = (line, how_much) => line.substring(tab.length * how_much)

	// remove one tab in the beginning
	const chop_one_tab_off = (line) => reduce_tabulation(line, 1)

	function calculate_indentation(line)
	{
		// count current line indentation level
		let line_indentation = 0
		while (is_tabulated(line))
		{
			line_indentation++
			line = chop_one_tab_off(line)
		}

		return line_indentation
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

	function process_meaningful_line(line, line_indentation, original_line)
	{
		// validate current line intendation level
		if (line_indentation !== 1 && line_indentation < previous_indendation - 1 || line_indentation > previous_indendation + 1)
		{
			throw new Error(`Invalid indentation (${line_indentation} tabs after ${previous_indendation} tabs for parent) at line #${line_index}: "${original_line}"`)
			// throw new Error(`Invalid indentation at line: ${line}. line_indentation: ${line_indentation}, previous_indendation: ${previous_indendation}`)
		}

		// if the indentation level is 1, then it's the start of a new block
		if (line_indentation === 1)
		{
			// if there is a previously started block - finish it
			if (child_name)
			{
				finish()
			}

			// if someone forgot a trailing colon in the style class name - trim it
			if (ends_with(line, ':'))
			{
				line = line.substring(0, line.length - ':'.length)
				// throw new Error(`Remove the trailing colon at line: ${original_line}`)
			}

			// start a new block for this style class
			start_child(line)
		}
		else
		{
			// if it's a generic style for this style class - 
			// simply add it to the styles array and continue the cycle
			if (line_indentation === 2 && line.indexOf(':') >= 0 && !starts_with(line, ':') && !starts_with(line, '@'))
			{
				own_styles.push(line)
			}
			else
			{
				// if it's not a generic style, then it's a descendant node
				child_lines.push(chop_one_tab_off(original_line))
			}
		}

		// update the will-be-previous indentation level
		previous_indendation = line_indentation
	}

	const tab_width = calculate_tab_width(lines)
	const tab = tab_symbol()

	lines = normalize_initial_tabulation(lines)

	// last intentation level
	let line_index = 1
	let previous_indendation = 0
	for (let line of lines)
	{
		// console.log(line)
		
		let original_line = line

		// count current line indentation level
		let line_indentation = 0
		while (is_tabulated(line))
		{
			line_indentation++
			line = chop_one_tab_off(line)
		}

		// check for messed up tabulation
		if (starts_with(line, ' '))
		{
			throw new Error(`Invalid tabulation (some extra leading spaces) at line #${line_index}: "${line}"`)
		}

		line = line.trim()

		// ignore blank lines
		// ignore comments
		if (line && !starts_with(line, '//'))
		{
			process_meaningful_line(line, line_indentation, original_line)
		}

		// if it's the last line - close the block
		if (line_index === lines.length)
		{
			finish()
		}

		line_index++
	}

	// done
	return children
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