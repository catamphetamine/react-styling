const exists = what => typeof what !== 'undefined'

function starts_with(string, what)
{
	return string.indexOf(what) === 0
}

function ends_with(string, what)
{
	const index = string.lastIndexOf(what)
	if (index < 0)
	{
		return
	}
	return index === string.length - what.length
}

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

function is_blank(text)
{
	return !text.replace(/\s/g, '')
}

function extend(to, from, or_more)
{
	const parameters = Array.prototype.slice.call(arguments, 0)

	if (exists(or_more))
	{
		const last = parameters.pop()
		const intermediary_result = extend.apply(this, parameters)
		// pass null as the third argument because of either Babel.js bug, or some other bug
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
function decide_on_tabulation(lines)
{
	let previous_spaces = null
	for (let line of lines)
	{
		let spaces = 0
		while (starts_with(line, ' '))
		{
			line = line.substring(' '.length)
			spaces++
		}

		// skip blank lines
		if (is_blank(line))
		{
			continue
		}

		if (starts_with(line, '\t'))
		{
			// using tabs for tabulation
			return null
		}
		else if (spaces === 0)
		{
			throw new Error(`Couldn't decide on tabulation type. Invalid tabulation at line: "${line}"`)
		}

		if (previous_spaces === null)
		{
			previous_spaces = spaces
			continue
		}

		if (previous_spaces !== spaces)
		{
			// tab width
			return Math.abs(previous_spaces - spaces)
		}
	}

	throw new Error('Couldn\'t decide on tabulation type. Not enough lines')
}

// converts text to JSON object
function parse_json_object(text)
{
	let lines = text.split('\n')

	// while the first line is blank
	while (lines.length > 0 && is_blank(lines[0]))
	{
		// remove the first line
		lines.splice(0, 1)
	}

	const blocks = {}

	let block_key
	let descendants
	let own_styles

	function start_block(key)
	{
		block_key = key
		own_styles = []
		descendants = []
	}

	function end_block(object)
	{
		if (object)
		{
			blocks[block_key] = object
		}

		block_key = null
		own_styles = null
		descendants = null
	}

	function finish_current_block()
	{
		// if there is no previously started block - abort
		if (descendants == null)
		{
			return
		}

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

		// process descendants recursively
		extend(object, parse_json_object(descendants.join('\n')))

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
		end_block(object)
	}

	// initialize variables
	end_block()

	function is_tabulated(line)
	{
		if (tab_width === null)
		{
			return starts_with(line, '\t')
		}
		else
		{
			return starts_with(line, repeat(' ', tab_width))
		}
	}

	function chop_one_tab_off(line)
	{
		if (tab_width === null)
		{
			return line.substring('\t'.length)
		}
		else
		{
			return line.substring(tab_width)
		}
	}

	function remove_excessive_tabulation(lines)
	{
		let minimum_indentation = null

		for (let line of lines)
		{
			// skip blank lines
			if (is_blank(line))
			{
				continue
			}

			// count current line indentation level
			let line_indentation = 0
			while (is_tabulated(line))
			{
				line_indentation++
				line = chop_one_tab_off(line)
			}

			if (line_indentation < minimum_indentation || minimum_indentation === null)
			{
				minimum_indentation = line_indentation
			}
		}

		if (minimum_indentation > 1)
		{
			lines = lines.map(function(line)
			{
				let intendation = minimum_indentation
				while (intendation > 1)
				{
					line = chop_one_tab_off(line)
					intendation--
				}
				return line
			})
		}

		return lines
	}

	// if all the lines are blank - then it's an empty object
	if (lines.filter(line => !is_blank(line)).length === 0)
	{
		return {}
	}

	const tab_width = decide_on_tabulation(lines)
	lines = remove_excessive_tabulation(lines)

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
			finish_current_block()

			// if someone forgot a trailing colon in the style class name - trim it
			if (ends_with(line, ':'))
			{
				line = line.substring(0, line.length - ':'.length)
				// throw new Error(`Remove the trailing colon at line: ${original_line}`)
			}

			// start a new block for this style class
			start_block(line)
		}
		else
		{
			// if it's a generic style for this style class - 
			// simply add it to the styles array and continue the cycle
			if (line_indentation === 2 && line.indexOf(':') >= 0 && !starts_with(line, ':'))
			{
				own_styles.push(line)
			}
			else
			{
				// if it's not a generic style, then it's a descendant node
				descendants.push(chop_one_tab_off(original_line))
			}
		}

		// update the will-be-previous indentation level
		previous_indendation = line_indentation
	}

	// last intentation level
	let line_index = 1
	let previous_indendation = 0
	for (let line of lines)
	{
		// ignore opening curly braces for now.
		// maybe support curly braces along with tabulation in future
		line = line.replace(/\{/g, '')
		line = line.replace(/\}/g, '')

		let original_line = line

		// count current line indentation level
		let line_indentation = 0
		while (is_tabulated(line))
		{
			line_indentation++
			line = chop_one_tab_off(line)
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
			finish_current_block()
		}

		line_index++
	}

	// done
	return blocks
}

// using ES6 template strings
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings
export default function styler(strings, ...values)
{
	let style = ''

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