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

// parse child nodes' lines (and this node's styles) into this node's style JSON object
function parse_node_json(styles, children_lines)
{
	// transform this node's style lines from text to JSON properties and their values
	const style_object = styles.map(function(style)
	{
		let key   = style.substring(0, style.indexOf(':')).trim()
		let value = style.substring(style.indexOf(':') + ':'.length).trim()

		// transform dashed key to camelCase key (it's required by React)
		key = key.replace(/([-]{1}[a-z]{1})/g, character => character.substring(1).toUpperCase())

		// support old CSS syntax
		value = value.replace(/;$/, '').trim()

		// check if the value can be parsed into an integer
		if (String(parseInt(value)) === value)
		{
			value = parseInt(value)
		}

		// check if the value can be parsed into a float
		if (String(parseFloat(value)) === value)
		{
			value = parseFloat(value)
		}

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
	return extend(style_object, parse_children(children_lines))
}

// separates style lines from children lines
function split_into_style_lines_and_children_lines(lines)
{
	// get this node style lines
	const style_lines = lines.filter(function(line)
	{
		// styles always have indentation of 2
		if (line.tabs !== 2)
		{
			return false
		}

		// detect generic css style line (skip modifier classes and media queries)
		const colon_index = line.line.indexOf(':')
		return !starts_with(line.line, '&') 
			&& !starts_with(line.line, '@') 
			&& (colon_index > 0 && colon_index < line.line.length - 1)
	})

	// get children nodes' lines
	const children_lines = lines.filter(line => style_lines.indexOf(line) < 0)

	// reduce tabulation for this child node's (or these child nodes') child nodes' lines
	children_lines.forEach(line => line.tabs--)

	// check for excessive indentation of children
	if (children_lines.length > 0)
	{
		const line = children_lines[0]
		if (line.tabs !== 1)
		{
			throw new Error(`Excessive indentation at line ${line.index}: "${line.original_line}"`)
		}
	}

	return { style_lines, children_lines}
}

// parses a style class node name
function parse_node_name(name)
{
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

	return { name, is_a_modifier }
}

// parses child nodes' lines of text into the corresponding child node JSON objects
function parse_children(lines)
{
	// preprocess the lines (filter out comments, blank lines, etc)
	lines = filter_lines_for_parsing(lines)

	// return empty object if there are no lines to parse
	if (lines.length === 0)
	{
		return {}
	}

	// parse each child node's lines
	return split_lines_by_child_nodes(lines).map(function(lines)
	{
		// the first line is this child node's name (or names)
		const declaration = lines.shift().line

		// child nodes' names
		const names = declaration.split(',').map(name => name.trim())

		// separate style lines from children lines
		const { style_lines, children_lines } = split_into_style_lines_and_children_lines(lines)

		// convert style lines info to just text lines
		const styles = style_lines.map(line => line.line)

		// using this child node's (or these child nodes') style lines 
		// and this child node's (or these child nodes') child nodes' lines,
		// generate this child node's (or these child nodes') style JSON object
		// (this is gonna be a recursion)
		const style_json = parse_node_json(styles, children_lines)

		// generate style json for this child node (or child nodes)
		return names.map(function(node_declaration)
		{
			// parse this child node name
			const { name, is_a_modifier } = parse_node_name(node_declaration)

			// clone the style JSON object for this child node
			const json = extend({}, style_json)

			// set the modifier flag if it's the case
			if (is_a_modifier)
			{
				json._is_a_modifier = true
			}

			// this child node's style JSON object
			return { name, json }
		})
	})
	// convert an array of arrays to a flat array
	.reduce(function(array, child_array)
	{
		return array.concat(child_array);
	}, 
	[])
	// combine all the child nodes into a single JSON object
	.reduce(function(nodes, node)
	{
		// if style already exists for this child node, extend it
		if (nodes[node.name])
		{
			extend(nodes[node.name], node.json)
		}
		else
		{
			nodes[node.name] = node.json
		}
		
		return nodes
	}, 
	{})
}

// filters out comments, blank lines, etc
function filter_lines_for_parsing(lines)
{
	// filter out blank lines
	lines = lines.filter(line => !is_blank(line.line))

	lines.forEach(function(line)
	{
		// remove single line comments
		line.line = line.line.replace(/^\s*\/\/.*/, '')
		// remove any trailing whitespace
		line.line = line.line.trim()
	})

	return lines
}

// takes the whole lines array and splits it by its top-tier child nodes
function split_lines_by_child_nodes(lines)
{
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

	// each child node boundaries in terms of starting line index and ending line index
	const from_to = zip(node_entry_lines, node_ending_lines)

	// now lines are split by child nodes
	return from_to.map(from_to => lines.slice(from_to[0], from_to[1] + 1))
}

// expand modifier style classes
function expand_modifier_style_classes(node)
{
	const style          = get_node_style(node)
	const pseudo_classes = get_node_pseudo_classes(node)

	const modifiers = Object.keys(node)
		// get all modifier style class nodes
		.filter(name => typeof(node[name]) === 'object' && node[name]._is_a_modifier)
	
	// for each modifier style class node
	modifiers.forEach(function(name)
	{
		// // delete the modifier flags
		// delete node[name]._is_a_modifier

		// include parent node's styles and pseudo-classes into the modifier style class node
		node[name] = extend({}, style, pseudo_classes, node[name])

		// expand descendant style class nodes of this modifier
		expand_modified_subtree(node, node[name])
	})
	
	// for each modifier style class node
	modifiers.forEach(function(name)
	{
		// delete the modifier flags
		delete node[name]._is_a_modifier
	})

	// recurse
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

// extracts root pseudo-classes of this style class node
function get_node_pseudo_classes(node)
{
	return Object.keys(node)
	// get all child style classes this style class node, which start with a colon and aren't modifiers
	.filter(property => typeof(node[property]) === 'object' 
		&& is_a_pseudo_class(property)
		&& !node[property]._is_a_modifier)
	// for each child style class of this style class node
	.reduce(function(pseudo_classes, name)
	{
		pseudo_classes[name] = node[name]
		return pseudo_classes
	}, 
	{})
}

// for each (non-modifier) child style class of the modifier style class, 
// check if "this child style class" is also present 
// as a (non-modifier) "child of the current style class".
// if it is, then extend "this child style class" with the style 
// from the "child of the current style class".
// (and repeat recursively)
function expand_modified_subtree(node, modified_node)
{
	// from the modified style class node
	Object.keys(modified_node)
	// for all non-pseudo-classes
	.filter(name => !is_a_pseudo_class(name))
	// get all non-modifier style class nodes
	.filter(name => typeof(modified_node[name]) === 'object' && !modified_node[name]._is_a_modifier)
	// which are also present as non-modifier style classes
	// in the base style class node
	.filter(name => typeof(node[name]) === 'object' && !node[name]._is_a_modifier)

	// for each such style class node
	.forEach(function(name)
	{
		// style of the original style class node
		const style          = get_node_style(node[name])
		// pseudo-classes of the original style class node
		const pseudo_classes = get_node_pseudo_classes(node[name])

		// mix in the styles
		modified_node[name] = extend({}, style, pseudo_classes, modified_node[name])

		// recurse
		return expand_modified_subtree(node[name], modified_node[name])
	})
}

// checks if this style class name designates a pseudo-class
function is_a_pseudo_class(name)
{
	return starts_with(name, ':') || starts_with(name, '@')
}