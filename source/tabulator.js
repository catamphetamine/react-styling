import { starts_with, is_blank, repeat } from './helpers'

// tabulation utilities
export default class Tabulator
{
	constructor(tab)
	{
		this.tab = tab
	}

	// remove some tabs in the beginning
	reduce_indentation(line, how_much)
	{
		return line.substring(this.tab.symbol.length * how_much)
	}

	// how many "tabs" are there before content of this line
	calculate_indentation(line)
	{
		const matches = line.match(this.tab.regexp)

		if (!matches || matches[0] === '')
		{
			return 0
		}

		return matches[0].length / this.tab.symbol.length
	}

	extract_tabulation(lines)
	{
		lines = lines
			// preserve line indexes
			.map((line, index) =>
			{
				index++
				return { line, index }
			})
			// filter out blank lines
			.filter(line => !is_blank(line.line))

		// calculate each line's indentation
		lines.forEach(line => 
		{
			const tabs = this.calculate_indentation(line.line)
			const pure_line = this.reduce_indentation(line.line, tabs)

			// check for messed up space indentation
			if (starts_with(pure_line, ' '))
			{
				let reason
				if (this.tab.symbol === '\t')
				{
					reason = 'mixed tabs and spaces'
				}
				else
				{
					reason = 'extra leading spaces'
				}

				throw new Error(`Invalid indentation (${reason}) at line ${line.index}: "${this.reveal_whitespace(line.line)}"`)
			}

			// check for tabs in spaced intentation
			if (starts_with(pure_line, '\t'))
			{
				throw new Error(`Invalid indentation (mixed tabs and spaces) at line ${line.index}: "${this.reveal_whitespace(line.line)}"`)
			}

			line.tabs          = tabs
			line.original_line = line.line
			line.line          = pure_line
		})

		// get the minimum indentation level
		const minimum_indentation = lines
			.reduce((minimum, line) => Math.min(minimum, line.tabs), Infinity)

		// if there is initial tabulation missing - add it
		if (minimum_indentation === 0)
		{
			lines.forEach(function(line)
			{
				line.tabs++
			})
		}
		// if there is excessive tabulation - trim it
		else if (minimum_indentation > 1)
		{
			lines.forEach(function(line)
			{
				line.tabs -= minimum_indentation - 1
			})
		}

		// check for messed up tabulation
		if (lines.length > 0 && lines[0].tabs !== 1)
		{
			throw new Error(`Invalid indentation at line ${lines[0].index}: "${lines[0].original_line}"`)
		}

		return lines
	}

	reveal_whitespace(text)
	{
		const whitespace_count = text.length - text.replace(/^\s*/, '').length

		const whitespace = text.substring(0, whitespace_count + 1)
			.replace(this.tab.regexp_anywhere, '[indent]')
			.replace(/ /g, '[space]')
			.replace(/\t/g, '[tab]')

		const rest = text.substring(whitespace_count + 1)

		return whitespace + rest
	}
}

// decide whether it's tabs or spaces
Tabulator.determine_tabulation = function(lines)
{
	const substract = pair => pair[0] - pair[1]

	function is_tabulated(line)
	{
		// if we're using tabs for tabulation
		if (starts_with(line, '\t'))
		{
			const tab = 
			{
				symbol: '\t',
				regexp: new RegExp('^(\t)+', 'g'),
				regexp_anywhere: new RegExp('(\t)+', 'g')
			}

			return tab
		}
	}

	function spaced_tab(tab_width)
	{
		const symbol = repeat(' ', tab_width)

		const spaced_tab = 
		{
			symbol: symbol,
			regexp: new RegExp(`^(${symbol})+`, 'g'),
			regexp_anywhere: new RegExp(`(${symbol})+`, 'g')
		}

		return spaced_tab
	}

	function calculate_leading_spaces(line)
	{
		let counter = 0
		line.replace(/^( )+/g, function(match) { counter = match.length })
		return counter
	}

	// take all meaningful lines
	lines = lines.filter(line => !is_blank(line))

	// has to be at least two of them
	if (lines.length === 0)
	{
		return tab
		// throw new Error(`Couldn't decide on tabulation type. Not enough lines.`)
	}

	if (lines.length === 1)
	{
		const tab = is_tabulated(lines[0])
		if (tab)
		{
			return tab
		}

		return spaced_tab(calculate_leading_spaces(lines[0]))
	}

	// if we're using tabs for tabulation
	const tab = is_tabulated(lines[1])
	if (tab)
	{
		return tab
	}

	// take the first two lines,
	// calculate their indentation,
	// substract it and you've got the tab width
	const tab_width = Math.abs(substract
	(
		lines
			.slice(0, 2)
			.map(calculate_leading_spaces)
	)) 
	|| 1

	// if (tab_width === 0)
	// {
	// 	throw new Error(`Couldn't decide on tabulation type. Same indentation.`)
	// }

	return spaced_tab(tab_width)
}