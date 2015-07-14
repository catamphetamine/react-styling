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

		if (!matches)
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
				return { line, index }
			})
			// filter out blank lines
			.filter(line => !is_blank(line.line))

		// calculate each line's indentation
		lines.forEach(line => 
		{
			line.original_line = line.line
			line.tabs = this.calculate_indentation(line.line)
			line.line = this.reduce_indentation(line.line, line.tabs)

			// check for messed up space indentation
			if (starts_with(line.line, ' '))
			{
				throw new Error(`Invalid indentation (extra leading spaces) at line ${line.index}: "${line.original_line}"`)
			}

			if (starts_with(line.line, '\t'))
			{
				throw new Error(`Invalid indentation (mixed tabs and spaces) at line ${line.index}: "${line.original_line}"`)
			}
		})

		// get the minimum indentation level
		const minimum_indentation = lines
			.reduce((minimum, line) => Math.min(minimum, line.tabs), Infinity)

		/* istanbul ignore else: do nothing on else */
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
		if (lines[0].tabs !== 1)
		{
			throw new Error(`Invalid indentation at line ${lines[0].index}: "${lines[0].original_line}"`)
		}

		return lines
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
				regexp: new RegExp(`^(\t)+`, 'g')
			}

			return tab
		}
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
		throw new Error(`Couldn't decide on tabulation type. Not enough lines.`)
	}

	/* istanbul ignore next: not a probable case in styles scenario */
	if (lines.length === 1)
	{
		const tab = is_tabulated(lines[0])
		if (tab)
		{
			return tab
		}

		return calculate_leading_spaces(lines[0])
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
	const tab_width = Math.abs(substract(
		lines
			.slice(0, 2)
			.map(calculate_leading_spaces)
	))

	if (tab_width === 0)
	{
		throw new Error(`Couldn't decide on tabulation type. Same indentation.`)
	}

	const symbol = repeat(' ', tab_width)

	const spaced_tab = 
	{
		symbol: symbol,
		regexp: new RegExp(`^(${symbol})+`, 'g')
	}

	return spaced_tab
}