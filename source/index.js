import { exists, starts_with, ends_with, is_blank, zip, extend, not_empty } from './helpers'
import Tabulator from './tabulator'

// using ES6 template strings
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings
export default function(strings, ...values)
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
	const style_json = parse_style_class(tabulator.extract_tabulation(lines), [])

	// expand "modifier" style classes
	return expand_modifier_style_classes(style_json)
}

// parse child nodes' lines (and this node's styles) into this node's style JSON object
function parse_node_json(styles, children_lines, node_names)
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
	return extend(style_object, parse_children(children_lines, node_names))
}

// separates style lines from children lines
function split_into_style_lines_and_children_lines(lines)
{
	// get this node style lines
	const style_lines = lines.filter(function(line)
	{
		// styles always have indentation of 1
		if (line.tabs !== 1)
		{
			return false
		}

		// detect generic css style line (skip modifier classes and media queries)
		const colon_index = line.line.indexOf(':')

		// is not a modifier class
		return !starts_with(line.line, '&') 
			// is not a media query style class name declaration
			&& !starts_with(line.line, '@media') 
			// is not a keyframes style class name declaration
			&& !starts_with(line.line, '@keyframes') 
			// has a colon
			&& colon_index >= 0 
			// is not a state class (e.g. :hover) name declaration
			&& colon_index !== 0
			// is not a yaml-style class name declaration
			&& colon_index < line.line.length - 1
	})

	// get children nodes' lines
	const children_lines = lines.filter(line => style_lines.indexOf(line) < 0)

	// reduce tabulation for this child node's (or these child nodes') child nodes' lines
	children_lines.forEach(line => line.tabs--)

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

	// if there is a trailing colon in the style class name - trim it
	// (Python people with yaml-alike syntax)
	if (ends_with(name, ':'))
	{
		name = name.substring(0, name.length - ':'.length)
		// throw new Error(`Remove the trailing colon at line: ${original_line}`)
	}

	return { name, is_a_modifier }
}

// parses child nodes' lines of text into the corresponding child node JSON objects
function parse_children(lines, parent_node_names)
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
		const declaration_line = lines.shift()

		// check for excessive indentation of the first child style class
		if (declaration_line.tabs !== 0)
		{
			throw new Error(`Excessive indentation (${declaration_line.tabs} more "tabs" than needed) at line ${declaration_line.index}: "${declaration_line.original_line}"`)
		}

		// style class name declaration
		const declaration = declaration_line.line

		// child nodes' names
		const names = declaration.split(',').map(name => name.trim())

		// style class nesting validation
		validate_child_style_class_types(parent_node_names, names)

		// parse own CSS styles and recursively parse all child nodes
		const style_json = parse_style_class(lines, names)

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
	// determine lines with indentation = 0 (child node entry lines)
	const node_entry_lines = lines.map((line, index) => 
	{
		return { tabs: line.tabs, index }
	})
	.filter(line => line.tabs === 0)
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
	const style = get_node_style(node)
	const pseudo_classes_and_media_queries_and_keyframes = get_node_pseudo_classes_and_media_queries_and_keyframes(node)

	const modifiers = Object.keys(node)
		// get all modifier style class nodes
		.filter(name => typeof(node[name]) === 'object' && node[name]._is_a_modifier)
	
	// for each modifier style class node
	modifiers.forEach(function(name)
	{
		// // delete the modifier flags
		// delete node[name]._is_a_modifier

		// include parent node's styles and pseudo-classes into the modifier style class node
		node[name] = extend({}, style, pseudo_classes_and_media_queries_and_keyframes, node[name])

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

// extracts root pseudo-classes and media queries of this style class node
function get_node_pseudo_classes_and_media_queries_and_keyframes(node)
{
	return Object.keys(node)
	// get all child style classes this style class node, 
	// which aren't modifiers and are a pseudoclass or a media query or keyframes
	.filter(property => typeof(node[property]) === 'object' 
		&& (is_pseudo_class(property) || is_media_query(property) || is_keyframes(property))
		&& !node[property]._is_a_modifier)
	// for each child style class of this style class node
	.reduce(function(pseudo_classes_and_media_queries_and_keyframes, name)
	{
		pseudo_classes_and_media_queries_and_keyframes[name] = node[name]
		return pseudo_classes_and_media_queries_and_keyframes
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
	// for all non-pseudo-classes and non-media-queries
	.filter(name => !is_pseudo_class(name) && !is_media_query(name) && !is_keyframes(name))
	// get all non-modifier style class nodes
	.filter(name => typeof(modified_node[name]) === 'object' && !modified_node[name]._is_a_modifier)
	// which are also present as non-modifier style classes
	// in the base style class node
	.filter(name => typeof(node[name]) === 'object' && !node[name]._is_a_modifier)

	// for each such style class node
	.forEach(function(name)
	{
		// style of the original style class node
		const style = get_node_style(node[name])

		// pseudo-classes of the original style class node
		const pseudo_classes_and_media_queries_and_keyframes = get_node_pseudo_classes_and_media_queries_and_keyframes(node[name])

		// mix in the styles
		modified_node[name] = extend({}, style, pseudo_classes_and_media_queries_and_keyframes, modified_node[name])

		// recurse
		return expand_modified_subtree(node[name], modified_node[name])
	})
}

// checks if this style class name designates a pseudo-class
export function is_pseudo_class(name)
{
	return starts_with(name, ':')
}

// checks if this style class name is a media query (i.e. @media (...))
export function is_media_query(name)
{
	return starts_with(name, '@media')
}

export function is_keyframe_selector(name) 
{
	return ends_with(name, '%') || (name === 'from') || (name === 'to');
}


// checks if this style class name is a media query (i.e. @media (...))
export function is_keyframes(name)
{
	return starts_with(name, '@keyframes')
}

// style class nesting validation
function validate_child_style_class_types(parent_node_names, names)
{
	for (let parent of parent_node_names)
	{
		// if it's a pseudoclass, it can't contain any style classes
		if (is_pseudo_class(parent) && not_empty(names))
		{
			throw new Error(`A style class declaration "${names[0]}" found inside a pseudoclass "${parent}". Pseudoclasses (:hover, etc) can't contain child style classes.`)
		}

		// if it's a media query style class, it must contain only pseudoclasses
		if (is_media_query(parent))
		{
			const non_pseudoclass = names.filter(x => !is_pseudo_class(x))[0]

			if (non_pseudoclass)
			{
				throw new Error(`A non-pseudoclass "${non_pseudoclass}" found inside a media query style class "${parent}". Media query style classes can only contain pseudoclasses (:hover, etc).`)
			}
		}
		
		// if it's a keyframes style class, it must contain only keyframe selectors
		if (is_keyframes(parent)) {
			const non_keyframe_selector = names.filter(x => !is_keyframe_selector(x))[0]

			if (non_keyframe_selector) 
			{
				throw new Error(`A non-keyframe-selector "${non_keyframe_selector}" found inside a keyframes style class "${parent}". Keyframes style classes can only contain keyframe selectors (from, 100%, etc).`);
			}
		}
	}
}

// parse CSS style class
function parse_style_class(lines, node_names)
{
	// separate style lines from children lines
	const { style_lines, children_lines } = split_into_style_lines_and_children_lines(lines)

	// convert style lines info to just text lines
	const styles = style_lines.map(line => line.line)

	// using this child node's (or these child nodes') style lines 
	// and this child node's (or these child nodes') child nodes' lines,
	// generate this child node's (or these child nodes') style JSON object
	// (this is gonna be a recursion)
	return parse_node_json(styles, children_lines, node_names)
}