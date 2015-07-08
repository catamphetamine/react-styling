import { starts_with, is_blank, repeat } from './helpers'

// tabulation utilities
export default class Tabulator
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