(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["react-styling"] = factory();
	else
		root["react-styling"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = styler;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _helpers = __webpack_require__(1);
	
	var _tabulator = __webpack_require__(2);
	
	var _tabulator2 = _interopRequireDefault(_tabulator);
	
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
	
		return parse_style_json_object(style);
	}
	
	// converts text to JSON object
	function parse_style_json_object(text) {
		// remove multiline comments
		text = text.replace(/\/\*([\s\S]*?)\*\//g, '');
	
		// ignore curly braces for now.
		// maybe support curly braces along with tabulation in future
		text = text.replace(/[\{\}]/g, '');
	
		var lines = text.split('\n');
	
		// helper class for dealing with tabulation
		var tabulator = new _tabulator2['default'](_tabulator2['default'].determine_tabulation(lines));
	
		// parse text into JSON object
		var style_json = parse_node_json([], tabulator.extract_tabulation(lines));
	
		// expand "modifier" style classes
		return expand_modifier_style_classes(style_json);
	}
	
	// parse child nodes' lines (and this node's styles) into this node's style JSON object
	function parse_node_json(styles, children_lines) {
		// transform this node's style lines from text to JSON properties and their values
		var style_object = styles.map(function (style) {
			var parts = style.split(':');
	
			var key = parts[0].trim();
			var value = parts[1].trim();
	
			// support old CSS syntax
			value = value.replace(/;$/, '');
	
			// transform dashed key to camelCase key (it's required by React)
			key = key.replace(/([-]{1}[a-z]{1})/g, function (character) {
				return character.substring(1).toUpperCase();
			});
	
			return { key: key, value: value };
		})
		// combine the styles into a JSON object
		.reduce(function (styles, style) {
			styles[style.key] = style.value;
			return styles;
		}, {});
	
		// parse child nodes and add them to this node's JSON object
		return (0, _helpers.extend)(style_object, parse_children(children_lines));
	}
	
	// parses child nodes' lines of text into the corresponding child node JSON objects
	function parse_children(lines) {
		// preprocess the lines (filter out comments, blank lines, etc)
		lines = filter_lines_for_parsing(lines);
	
		// return empty object if there are no lines to parse
		if (lines.length === 0) {
			return {};
		}
	
		// parse each child node's lines
		return split_lines_by_child_nodes(lines).map(function (lines) {
			// the first line is this child node's name
			var name = lines.shift().line;
	
			// is it a "modifier" style class
			var is_a_modifier = false;
	
			// detect modifier style classes
			if ((0, _helpers.starts_with)(name, '&')) {
				name = name.substring('&'.length);
				is_a_modifier = true;
			}
	
			// support old-school CSS syntax
			if ((0, _helpers.starts_with)(name, '.')) {
				name = name.substring('.'.length);
			}
	
			// if someone forgot a trailing colon in the style class name - trim it
			// (or maybe these are Python people)
			if ((0, _helpers.ends_with)(name, ':')) {
				name = name.substring(0, name.length - ':'.length)
				// throw new Error(`Remove the trailing colon at line: ${original_line}`)
				;
			}
	
			// this child node's styles
			var styles = lines.filter(function (line) {
				// styles always have indentation of 2
				if (line.tabs !== 2) {
					return false;
				}
	
				// detect generic css style line
				var colon_index = line.line.indexOf(':');
				return colon_index > 0 && colon_index < line.line.length - 1 && !(0, _helpers.starts_with)(line.line, '@');
			});
	
			// the lines corresponding to this child node's child nodes and all their children, etc
			var children_lines = lines.filter(function (line) {
				return styles.indexOf(line) < 0;
			});
	
			// convert style lines info to just text lines
			styles = styles.map(function (line) {
				return line.line;
			});
	
			// reduce tabulation for this child node's child nodes' lines
			children_lines.forEach(function (line) {
				return line.tabs--;
			});
	
			// using this child node's style lines
			// and this child node's child nodes' lines,
			// generate this child node's style JSON object
			// (this is gonna be a recursion)
			var json = parse_node_json(styles, children_lines);
	
			// set the modifier flag if it's the case
			if (is_a_modifier) {
				json._is_a_modifier = true;
			}
	
			// this child node's style JSON object is ready
			return { name: name, json: json };
		})
		// combine all the child nodes into a single JSON object
		.reduce(function (nodes, node) {
			nodes[node.name] = node.json;
			return nodes;
		}, {});
	}
	
	// filters out commets, blank lines, etc
	function filter_lines_for_parsing(lines) {
		// filter out blank lines
		lines = lines.filter(function (line) {
			return !(0, _helpers.is_blank)(line.line);
		});
	
		lines.forEach(function (line) {
			// remove single line comments
			line.line = line.line.replace(/\/\/.*/, '');
			// remove any trailing whitespace
			line.line = line.line.trim();
		});
	
		return lines;
	}
	
	// takes the whole lines array and splits it by its top-tier child nodes
	function split_lines_by_child_nodes(lines) {
		// determine lines with indentation = 1 (child node entry lines)
		var node_entry_lines = lines.map(function (line, index) {
			return { tabs: line.tabs, index: index };
		}).filter(function (line) {
			return line.tabs === 1;
		}).map(function (line) {
			return line.index;
		});
	
		// deduce corresponding child node ending lines
		var node_ending_lines = node_entry_lines.map(function (line_index) {
			return line_index - 1;
		});
		node_ending_lines.shift();
		node_ending_lines.push(lines.length - 1);
	
		// each child node boundaries in terms of starting line index and ending line index
		var from_to = (0, _helpers.zip)(node_entry_lines, node_ending_lines);
	
		// now lines are split by child nodes
		return from_to.map(function (from_to) {
			return lines.slice(from_to[0], from_to[1] + 1);
		});
	}
	
	// expand modifier style classes
	function expand_modifier_style_classes(node) {
		var style = get_node_style(node);
	
		Object.keys(node)
		// get all modifier style class nodes
		.filter(function (name) {
			return typeof node[name] === 'object' && node[name]._is_a_modifier;
		})
		// for each modifier style class node
		.forEach(function (name) {
			// delete the modifier flags
			delete node[name]._is_a_modifier;
	
			// include parent node styles into the modifier style class node
			node[name] = (0, _helpers.extend)({}, style, node[name]);
		});
	
		Object.keys(node)
		// get all style class nodes
		.filter(function (name) {
			return typeof node[name] === 'object';
		})
		// for each style class node
		.forEach(function (name) {
			// recurse
			expand_modifier_style_classes(node[name]);
		});
	
		return node;
	}
	
	// extracts root css styles of this style class node
	function get_node_style(node) {
		return Object.keys(node)
		// get all CSS styles of this style class node
		.filter(function (property) {
			return typeof node[property] !== 'object';
		})
		// for each CSS style of this style class node
		.reduce(function (style, style_property) {
			style[style_property] = node[style_property];
			return style;
		}, {});
	}
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	// if the variable is defined
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.starts_with = starts_with;
	exports.ends_with = ends_with;
	exports.repeat = repeat;
	exports.is_blank = is_blank;
	exports.zip = zip;
	exports.extend = extend;
	var exists = function exists(what) {
		return typeof what !== 'undefined';
	};
	
	exports.exists = exists;
	// if the string starts with the substring
	
	function starts_with(string, what) {
		return string.indexOf(what) === 0;
	}
	
	// if the string ends with the substring
	
	function ends_with(string, what) {
		var index = string.lastIndexOf(what);
		if (index < 0) {
			return;
		}
		return index === string.length - what.length;
	}
	
	// repeat string N times
	
	function repeat(what, times) {
		var result = '';
		while (times > 0) {
			result += what;
			times--;
		}
		return result;
	}
	
	// if the text is blank
	
	function is_blank(text) {
		return !exists(text) || !text.replace(/\s/g, '');
	}
	
	// zips two arrays
	
	function zip(a, b) {
		return a.map(function (_, index) {
			return [a[index], b[index]];
		});
	}
	
	// extends the first object with
	
	function extend(_x, _x2, _x3) {
		var _this = this,
		    _arguments = arguments;
	
		var _again = true;
	
		_function: while (_again) {
			var to = _x,
			    from = _x2,
			    or_more = _x3;
			parameters = last = intermediary_result = _iteratorNormalCompletion = _didIteratorError = _iteratorError = undefined;
			_again = false;
	
			var parameters = Array.prototype.slice.call(_arguments, 0);
	
			if (exists(or_more)) {
				var last = parameters.pop();
				var intermediary_result = extend.apply(_this, parameters);
				// pass undefined as the third argument because of either Babel.js bug, or some other bug
				// (the third argument is supplied and is equal to the second argument which is weird)
				_this = undefined;
				_arguments = [_x = intermediary_result, _x2 = last, _x3 = undefined];
				_again = true;
				continue _function;
			}
	
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;
	
			try {
				for (var _iterator = Object.keys(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;
	
					if (typeof from[key] === 'object' && exists(to[key])) {
						to[key] = extend(to[key], from[key]);
					} else {
						to[key] = from[key];
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
	
			return to;
		}
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _helpers = __webpack_require__(1);
	
	// tabulation utilities
	
	var Tabulator = (function () {
		function Tabulator(tab) {
			_classCallCheck(this, Tabulator);
	
			this.tab = tab;
		}
	
		_createClass(Tabulator, [{
			key: 'reduce_indentation',
	
			// remove some tabs in the beginning
			value: function reduce_indentation(line) {
				var how_much = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	
				return line.substring(this.tab.symbol.length * how_much);
			}
		}, {
			key: 'calculate_indentation',
	
			// how many "tabs" are there before content of this line
			value: function calculate_indentation(line) {
				var matches = line.match(this.tab.regexp);
	
				if (!matches) {
					return 0;
				}
	
				return matches[0].length / this.tab.symbol.length;
			}
		}, {
			key: 'extract_tabulation',
			value: function extract_tabulation(lines) {
				var _this = this;
	
				lines = lines
				// preserve line indexes
				.map(function (line, index) {
					return { line: line, index: index };
				})
				// filter out blank lines
				.filter(function (line) {
					return !(0, _helpers.is_blank)(line.line);
				});
	
				// calculate each line's indentation
				lines.forEach(function (line) {
					line.original_line = line.line;
					line.tabs = _this.calculate_indentation(line.line);
					line.line = _this.reduce_indentation(line.line, line.tabs);
	
					// check for messed up space indentation
					if ((0, _helpers.starts_with)(line.line, ' ')) {
						throw new Error('Invalid indentation (some extra leading spaces) at line ' + line.index + ': "' + line.original_line + '"');
					}
				});
	
				// get the minimum indentation level
				var minimum_indentation = lines.reduce(function (minimum, line) {
					return Math.min(minimum, line.tabs);
				}, Infinity);
	
				// if there is initial tabulation missing - add it
				if (minimum_indentation === 0) {
					lines.forEach(function (line) {
						line.tabs++;
					});
				}
				// if there is excessive tabulation - trim it
				else if (minimum_indentation > 1) {
					lines.forEach(function (line) {
						line.tabs -= minimum_indentation - 1;
					});
				}
	
				// check for messed up tabulation
				if (lines[0].tabs !== 1) {
					throw new Error('Invalid indentation at line ' + lines[0].index + ': "' + lines[0].original_line + '"');
				}
	
				return lines;
			}
		}]);
	
		return Tabulator;
	})();
	
	exports['default'] = Tabulator;
	
	// decide whether it's tabs or spaces
	Tabulator.determine_tabulation = function (lines) {
		var substract = function substract(pair) {
			return pair[0] - pair[1];
		};
	
		function calculate_leading_spaces(line) {
			var counter = 0;
			line.replace(/^( )+/g, function (match) {
				counter = match.length;
			});
			return counter;
		}
	
		// take all meaningful lines
		lines = lines.filter(function (line) {
			return !(0, _helpers.is_blank)(line);
		});
	
		// has to be at least two of them
		if (lines.length < 2) {
			throw new Error('Couldn\'t decide on tabulation type. Not enough lines.');
		}
	
		// if we're using tabs for tabulation
		if ((0, _helpers.starts_with)(lines[1], '\t')) {
			var tab = {
				symbol: '\t',
				regexp: new RegExp('^(\t)+', 'g')
			};
	
			return tab;
		}
	
		// take the first two lines,
		// calculate their indentation,
		// substract it and you've got the tab width
		var tab_width = Math.abs(substract(lines.slice(0, 2).map(calculate_leading_spaces)));
	
		if (tab_width === 0) {
			throw new Error('Couldn\'t decide on tabulation type. Invalid tabulation.');
		}
	
		var symbol = (0, _helpers.repeat)(' ', tab_width);
	
		var spaced_tab = {
			symbol: symbol,
			regexp: new RegExp('^(' + symbol + ')+', 'g')
		};
	
		return spaced_tab;
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-styling.js.map