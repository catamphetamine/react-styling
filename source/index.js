import { exists, starts_with, ends_with, is_blank, zip, extend } from './helpers'
import Tabulator from './tabulator'

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

	return parse_style_json_object(style)
}

// converts text to JSON object
function parse_style_json_object(text)
{
	// remove multiline comments
	text = text.replace(/\/\*([\s\S]*?)\*\//g, '')

	// ignore curly braces for now.
	// maybe support curly braces along with tabulation in future
	text = text.replace(/[\{\}]/g, '')

	const lines = text.split('\n')

	// helper class for dealing with tabulation
	const tabulator = new Tabulator(Tabulator.determine_tabulation(lines))

	// parse text into JSON object
	const style_json = parse_node_json([], tabulator.extract_tabulation(lines))

	// expand "modifier" style classes
	return expand_modifier_style_classes(style_json)
}

// (recursive function)
// parse child nodes' lines (and this node's styles) into this node's style JSON object
function parse_node_json(styles, children_lines)
{
	// transform this node's style lines from text to JSON properties and their values
	const style_object = styles.map(function(style)
	{
		const parts = style.split(':')

		let key   = parts[0].trim()
		let value = parts[1].trim()

		// support old CSS syntax
		value = value.replace(/;$/, '')

		// transform dashed key to camelCase key (it's required by React)
		key = key.replace(/([-]{1}[a-z]{1})/g, character => character.substring(1).toUpperCase())

		return { key, value }
	})
	// combine the styles into a JSON object
	.reduce(function(styles, style)
	{
		styles[style.key] = style.value
		return styles
	}, 
	{})

	// parse child nodes and add them to this node's JSON object
	return extend(style_object, parse_lines(children_lines))
}

// parses lines of text into a JSON object
// (recursive function)
function parse_lines(lines)
{
	// return empty object if there are no lines
	if (lines.length === 0)
	{
		return {}
	}

	// remove single line comments
	lines.forEach(function(line)
	{
		// remove single line comments
		line.line = line.line.replace(/\/\/.*/, '')
		// remove any trailing whitespace
		line.line = line.line.trim()
	})

	// filter out blank lines
	lines = lines.filter(line => !is_blank(line.line))

	// determine lines with indentation = 1 (child node entry lines)
	const node_entry_lines = lines.map((line, index) => 
		{
			return { tabs: line.tabs, index }
		})
		.filter(line => line.tabs === 1)
		.map(line => line.index)

	// deduce corresponding child node ending lines
	const node_ending_lines = node_entry_lines.map(line_index => line_index - 1)
	node_ending_lines.shift()
	node_ending_lines.push(lines.length - 1)

	// each node boundaries in terms of starting line index and ending line index
	const from_to = zip(node_entry_lines, node_ending_lines)

	// now lines are split by nodes
	const each_node_lines = from_to.map(from_to => lines.slice(from_to[0], from_to[1] + 1))

	return each_node_lines.map(function(lines)
	{
		// the first line is the node's name
		let name = lines.shift().line

		// is it a "modifier" style class
		let is_a_modifier = false

		// detect modifier style classes
		if (starts_with(name, '&'))
		{
			name = name.substring('&'.length)
			is_a_modifier = true
		}

		// support old-school CSS syntax
		if (starts_with(name, '.'))
		{
			name = name.substring('.'.length)
		}

		// if someone forgot a trailing colon in the style class name - trim it
		// (or maybe these are Python people)
		if (ends_with(name, ':'))
		{
			name = name.substring(0, name.length - ':'.length)
			// throw new Error(`Remove the trailing colon at line: ${original_line}`)
		}

		// node's own styles
		let styles = lines.filter(function(line)
		{
			// own styles always have indentation of 2
			if (line.tabs !== 2)
			{
				return false
			}

			// detect generic css style line
			const colon_index = line.line.indexOf(':')
			return (colon_index > 0 && colon_index < line.line.length - 1) && !starts_with(line.line, '@')
		})

		// this node child nodes and all their children, etc
		let children_lines = lines.filter(function(line)
		{
			return styles.indexOf(line) < 0
		})

		// convert from line info to lines
		styles = styles.map(line => line.line)
		children_lines.forEach(line => line.tabs--)

		// generate JSON object for this node
		const json = parse_node_json(styles, children_lines)

		if (is_a_modifier)
		{
			json._is_a_modifier = true
		}

		return { name, json }
	})
	.reduce(function(nodes, node)
	{
		nodes[node.name] = node.json
		return nodes
	}, 
	{})
}

// expand modifier style classes
function expand_modifier_style_classes(node)
{
	const style = get_node_style(node)

	Object.keys(node)
	// get all modifier style class nodes
	.filter(name => typeof(node[name]) === 'object' && node[name]._is_a_modifier)
	// for each modifier style class node
	.forEach(function(name)
	{
		// delete the modifier flags
		delete node[name]._is_a_modifier

		// include parent node styles into the modifier style class node
		node[name] = extend({}, style, node[name])
	})

	Object.keys(node)
	// get all style class nodes
	.filter(name => typeof(node[name]) === 'object')
	// for each style class node
	.forEach(function(name)
	{
		// recurse
		expand_modifier_style_classes(node[name])
	})

	return node
}

// extracts root css styles of this style class node
function get_node_style(node)
{
	return Object.keys(node)
	// get all CSS styles of this style class node
	.filter(property => typeof(node[property]) !== 'object')
	// for each CSS style of this style class node
	.reduce(function(style, style_property)
	{
		style[style_property] = node[style_property]
		return style
	}, 
	{})
}