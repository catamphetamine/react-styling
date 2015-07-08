'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = styler;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpers = require('./helpers');

var _tabulator = require('./tabulator');

var _tabulator2 = _interopRequireDefault(_tabulator);

// converts text to JSON object
function parse_json_object(text) {
	// ignore opening curly braces for now.
	// maybe support curly braces along with tabulation in future
	text = text.replace(/[\{\}]/g, '');

	return parse_lines(text.split('\n'));
}

// a node in style JSON object
// parse lines (using styles) into a JSON object with child nodes of this child node
function generate_node_json(name, styles, children_lines) {
	var object = {};

	// transform styles from text to JSON objects
	var own_style = styles.map(function (style) {
		var parts = style.split(':');

		var key = parts[0].trim();
		var value = parts[1].trim();

		// transform dashed key to camelCase key (it's required by React)
		key = key.replace(/([-]{1}[a-z]{1})/g, function (character) {
			return character.substring(1).toUpperCase();
		});

		return { key: key, value: value };
	})
	// add own styles to the object
	.reduce(function (own_style, style) {
		own_style[style.key] = style.value;
		return own_style;
	}, {});

	// apply the style to the object itself
	(0, _helpers.extend)(object, own_style);

	// process child lines recursively
	var children = parse_lines(children_lines);

	// detect and expand modifier style classes
	Object.keys(children).filter(function (name) {
		return (0, _helpers.starts_with)(name, '.');
	}).forEach(function (name) {
		// remove the leading dot from the name
		children[name.substring('.'.length)] = (0, _helpers.extend)({}, own_style, children[name]);
		delete children[name];
	});

	// add children to the parent
	(0, _helpers.extend)(object, children);

	// end this block
	return object;
}

// parses lines of text into a JSON object
// (recursive function)
function parse_lines(_x) {
	var _again = true;

	_function: while (_again) {
		var lines = _x;
		tabulator = node_entry_lines = node_ending_lines = from_to = each_node_lines = undefined;
		_again = false;

		// return empty object if there are no lines
		if (!lines.length) {
			return {};
		}

		// ensure there are no blank lines at the start
		if ((0, _helpers.is_blank)(lines[0])) {
			lines.shift();
			_x = lines;
			_again = true;
			continue _function;
		}

		// helper class for dealing with tabulation
		var tabulator = new _tabulator2['default'](_tabulator2['default'].determine_tabulation(lines));

		lines = tabulator.normalize_initial_tabulation(lines).filter(function (line) {
			// ignore blank lines,
			// ignore single line comments (//)
			return !(0, _helpers.is_blank)(line) && !line.match(/^[\s]*\/\//);
		}).map(function (line, index) {
			var original_line = line;

			// get this line indentation and also trim the indentation
			var indentation = tabulator.calculate_indentation(line);
			line = tabulator.reduce_tabulation(line, indentation);

			// check for messed up space tabulation
			if ((0, _helpers.starts_with)(line, ' ')) {
				// #${line_index}
				throw new Error('Invalid tabulation (some extra leading spaces) at line: "' + line + '"');
			}

			// remove any trailing whitespace
			line = line.trim();

			var result = {
				line: line,
				index: index,
				indentation: indentation
			};

			return result;
		});

		// determine lines with indentation = 1 (child node entry lines)
		var node_entry_lines = lines.filter(function (line_data) {
			return line_data.indentation === 1;
		}).map(function (line) {
			return line.index;
		});

		// deduce corresponding child node ending lines
		var node_ending_lines = node_entry_lines.map(function (line_index) {
			return line_index - 1;
		});
		node_ending_lines.shift();
		node_ending_lines.push(lines.length - 1);

		// each node boundaries in terms of starting line index and ending line index
		var from_to = (0, _helpers.zip)(node_entry_lines, node_ending_lines);

		// now lines are split by nodes
		var each_node_lines = from_to.map(function (from_to) {
			return lines.slice(from_to[0], from_to[1] + 1);
		});

		return each_node_lines.map(function (lines) {
			// the first line is the node's name
			var name = lines.shift().line;

			// if someone forgot a trailing colon in the style class name - trim it
			// (or maybe these are Python people)
			if ((0, _helpers.ends_with)(name, ':')) {
				name = name.substring(0, name.length - ':'.length)
				// throw new Error(`Remove the trailing colon at line: ${original_line}`)
				;
			}

			// node's own styles
			var styles = lines.filter(function (line_info) {
				var line = line_info.line;
				var indentation = line_info.indentation;

				// own styles always have indentation of 2
				if (indentation !== 2) {
					return;
				}

				// detect generic css style line
				var colon_index = line.indexOf(':');
				return colon_index > 0 && colon_index < line.length - 1 && !(0, _helpers.starts_with)(line, '@');
			});

			// this node child nodes and all their children, etc
			var children_lines = lines.filter(function (line_info) {
				return !styles.includes(line_info);
			});

			// convert from line info to lines
			styles = styles.map(function (line_info) {
				return line_info.line;
			});
			children_lines = children_lines.map(function (line_info) {
				return tabulator.tabulate(line_info.line, line_info.indentation - 1);
			});

			// generate JSON object for this node
			var json = generate_node_json(name, styles, children_lines);

			return { name: name, json: json };
		}).reduce(function (nodes, node) {
			nodes[node.name] = node.json;
			return nodes;
		}, {});
	}
}

// using ES6 template strings
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings

function styler(strings) {
	var style = '';

	// restore the whole string from "strings" and "values" parts
	var i = 0;
	while (i < strings.length) {
		style += strings[i];

		for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			values[_key - 1] = arguments[_key];
		}

		if ((0, _helpers.exists)(values[i])) {
			style += values[i];
		}
		i++;
	}

	return parse_json_object(style);
}

module.exports = exports['default'];