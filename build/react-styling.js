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
					return styles.indexOf(line_info) < 0;
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
		return !text.replace(/\s/g, '');
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
			key: 'tabulate',
	
			// // has tab in the beginning
			// is_tabulated(line)
			// {
			// 	return starts_with(line, this.tab.symbol)
			// }
	
			// add one tab in the beginning
			value: function tabulate(line) {
				var how_much = arguments[1] === undefined ? 1 : arguments[1];
	
				return (0, _helpers.repeat)(this.tab.symbol, how_much) + line;
			}
		}, {
			key: 'reduce_tabulation',
	
			// remove some tabs in the beginning
			value: function reduce_tabulation(line) {
				var how_much = arguments[1] === undefined ? 1 : arguments[1];
	
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
			key: 'normalize_initial_tabulation',
			value: function normalize_initial_tabulation(lines) {
				var _this = this;
	
				// filter out blank lines,
				// calculate each line's indentation,
				// and get the minimum one
				var minimum_indentation = lines.filter(function (line) {
					return !(0, _helpers.is_blank)(line);
				}).map(function (line) {
					return _this.calculate_indentation(line);
				}).reduce(function (minimum, indentation) {
					return Math.min(minimum, indentation);
				}, Infinity);
	
				// if there is initial tabulation missing - add it
				if (minimum_indentation === 0) {
					lines = lines.map(function (line) {
						return _this.tabulate(line);
					});
				}
				// if there is excessive tabulation - trim it
				else if (minimum_indentation > 1) {
					lines = lines.map(function (line) {
						return _this.reduce_tabulation(line, minimum_indentation - 1);
					});
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