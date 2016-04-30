(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
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
	
	var _Object$keys = __webpack_require__(1)['default'];
	
	var _getIterator = __webpack_require__(13)['default'];
	
	var _interopRequireDefault = __webpack_require__(44)['default'];
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.is_pseudo_class = is_pseudo_class;
	exports.is_media_query = is_media_query;
	exports.is_keyframe_selector = is_keyframe_selector;
	exports.is_keyframes = is_keyframes;
	
	var _helpers = __webpack_require__(45);
	
	var _tabulator = __webpack_require__(46);
	
	var _tabulator2 = _interopRequireDefault(_tabulator);
	
	// using ES6 template strings
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings
	
	exports['default'] = function (strings) {
		var style = '';
	
		// restore the whole string from "strings" and "values" parts
		var i = 0;
		while (i < strings.length) {
			style += strings[i];
			if ((0, _helpers.exists)(arguments[i + 1])) {
				style += arguments[i + 1];
			}
			i++;
		}
	
		return parse_style_json_object(style);
	};
	
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
		var style_json = parse_style_class(tabulator.extract_tabulation(lines), []);
	
		// expand "modifier" style classes
		return expand_modifier_style_classes(style_json);
	}
	
	// parse child nodes' lines (and this node's styles) into this node's style JSON object
	function parse_node_json(styles, children_lines, node_names) {
		// transform this node's style lines from text to JSON properties and their values
		var style_object = styles.map(function (style) {
			var key = style.substring(0, style.indexOf(':')).trim();
			var value = style.substring(style.indexOf(':') + ':'.length).trim();
	
			// transform dashed key to camelCase key (it's required by React)
			key = key.replace(/([-]{1}[a-z]{1})/g, function (character) {
				return character.substring(1).toUpperCase();
			});
	
			// support old CSS syntax
			value = value.replace(/;$/, '').trim();
	
			// check if the value can be parsed into an integer
			if (String(parseInt(value)) === value) {
				value = parseInt(value);
			}
	
			// check if the value can be parsed into a float
			if (String(parseFloat(value)) === value) {
				value = parseFloat(value);
			}
	
			return { key: key, value: value };
		})
		// combine the styles into a JSON object
		.reduce(function (styles, style) {
			styles[style.key] = style.value;
			return styles;
		}, {});
	
		// parse child nodes and add them to this node's JSON object
		return (0, _helpers.extend)(style_object, parse_children(children_lines, node_names));
	}
	
	// separates style lines from children lines
	function split_into_style_lines_and_children_lines(lines) {
		// get this node style lines
		var style_lines = lines.filter(function (line) {
			// styles always have indentation of 1
			if (line.tabs !== 1) {
				return false;
			}
	
			// detect generic css style line (skip modifier classes and media queries)
			var colon_index = line.line.indexOf(':');
	
			// is not a modifier class
			return !(0, _helpers.starts_with)(line.line, '&')
			// is not a media query style class name declaration
			 && !(0, _helpers.starts_with)(line.line, '@media')
			// is not a keyframes style class name declaration
			 && !(0, _helpers.starts_with)(line.line, '@keyframes')
			// has a colon
			 && colon_index >= 0
			// is not a state class (e.g. :hover) name declaration
			 && colon_index !== 0
			// is not a yaml-style class name declaration
			 && colon_index < line.line.length - 1;
		});
	
		// get children nodes' lines
		var children_lines = lines.filter(function (line) {
			return style_lines.indexOf(line) < 0;
		});
	
		// reduce tabulation for this child node's (or these child nodes') child nodes' lines
		children_lines.forEach(function (line) {
			return line.tabs--;
		});
	
		return { style_lines: style_lines, children_lines: children_lines };
	}
	
	// parses a style class node name
	function parse_node_name(name) {
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
	
		// if there is a trailing colon in the style class name - trim it
		// (Python people with yaml-alike syntax)
		if ((0, _helpers.ends_with)(name, ':')) {
			name = name.substring(0, name.length - ':'.length);
			// throw new Error(`Remove the trailing colon at line: ${original_line}`)
		}
	
		return { name: name, is_a_modifier: is_a_modifier };
	}
	
	// parses child nodes' lines of text into the corresponding child node JSON objects
	function parse_children(lines, parent_node_names) {
		// preprocess the lines (filter out comments, blank lines, etc)
		lines = filter_lines_for_parsing(lines);
	
		// return empty object if there are no lines to parse
		if (lines.length === 0) {
			return {};
		}
	
		// parse each child node's lines
		return split_lines_by_child_nodes(lines).map(function (lines) {
			// the first line is this child node's name (or names)
			var declaration_line = lines.shift();
	
			// check for excessive indentation of the first child style class
			if (declaration_line.tabs !== 0) {
				throw new Error('Excessive indentation (' + declaration_line.tabs + ' more "tabs" than needed) at line ' + declaration_line.index + ': "' + declaration_line.original_line + '"');
			}
	
			// style class name declaration
			var declaration = declaration_line.line;
	
			// child nodes' names
			var names = declaration.split(',').map(function (name) {
				return name.trim();
			});
	
			// style class nesting validation
			validate_child_style_class_types(parent_node_names, names);
	
			// parse own CSS styles and recursively parse all child nodes
			var style_json = parse_style_class(lines, names);
	
			// generate style json for this child node (or child nodes)
			return names.map(function (node_declaration) {
				// parse this child node name
	
				var _parse_node_name = parse_node_name(node_declaration);
	
				var name = _parse_node_name.name;
				var is_a_modifier = _parse_node_name.is_a_modifier;
	
				// clone the style JSON object for this child node
				var json = (0, _helpers.extend)({}, style_json);
	
				// set the modifier flag if it's the case
				if (is_a_modifier) {
					json._is_a_modifier = true;
				}
	
				// this child node's style JSON object
				return { name: name, json: json };
			});
		})
		// convert an array of arrays to a flat array
		.reduce(function (array, child_array) {
			return array.concat(child_array);
		}, [])
		// combine all the child nodes into a single JSON object
		.reduce(function (nodes, node) {
			// if style already exists for this child node, extend it
			if (nodes[node.name]) {
				(0, _helpers.extend)(nodes[node.name], node.json);
			} else {
				nodes[node.name] = node.json;
			}
	
			return nodes;
		}, {});
	}
	
	// filters out comments, blank lines, etc
	function filter_lines_for_parsing(lines) {
		// filter out blank lines
		lines = lines.filter(function (line) {
			return !(0, _helpers.is_blank)(line.line);
		});
	
		lines.forEach(function (line) {
			// remove single line comments
			line.line = line.line.replace(/^\s*\/\/.*/, '');
			// remove any trailing whitespace
			line.line = line.line.trim();
		});
	
		return lines;
	}
	
	// takes the whole lines array and splits it by its top-tier child nodes
	function split_lines_by_child_nodes(lines) {
		// determine lines with indentation = 0 (child node entry lines)
		var node_entry_lines = lines.map(function (line, index) {
			return { tabs: line.tabs, index: index };
		}).filter(function (line) {
			return line.tabs === 0;
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
		var pseudo_classes_and_media_queries_and_keyframes = get_node_pseudo_classes_and_media_queries_and_keyframes(node);
	
		var modifiers = _Object$keys(node)
		// get all modifier style class nodes
		.filter(function (name) {
			return typeof node[name] === 'object' && node[name]._is_a_modifier;
		});
	
		// for each modifier style class node
		modifiers.forEach(function (name) {
			// // delete the modifier flags
			// delete node[name]._is_a_modifier
	
			// include parent node's styles and pseudo-classes into the modifier style class node
			node[name] = (0, _helpers.extend)({}, style, pseudo_classes_and_media_queries_and_keyframes, node[name]);
	
			// expand descendant style class nodes of this modifier
			expand_modified_subtree(node, node[name]);
		});
	
		// for each modifier style class node
		modifiers.forEach(function (name) {
			// delete the modifier flags
			delete node[name]._is_a_modifier;
		});
	
		// recurse
		_Object$keys(node)
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
		return _Object$keys(node)
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
	
	// extracts root pseudo-classes and media queries of this style class node
	function get_node_pseudo_classes_and_media_queries_and_keyframes(node) {
		return _Object$keys(node)
		// get all child style classes this style class node,
		// which aren't modifiers and are a pseudoclass or a media query or keyframes
		.filter(function (property) {
			return typeof node[property] === 'object' && (is_pseudo_class(property) || is_media_query(property) || is_keyframes(property)) && !node[property]._is_a_modifier;
		})
		// for each child style class of this style class node
		.reduce(function (pseudo_classes_and_media_queries_and_keyframes, name) {
			pseudo_classes_and_media_queries_and_keyframes[name] = node[name];
			return pseudo_classes_and_media_queries_and_keyframes;
		}, {});
	}
	
	// for each (non-modifier) child style class of the modifier style class,
	// check if "this child style class" is also present
	// as a (non-modifier) "child of the current style class".
	// if it is, then extend "this child style class" with the style
	// from the "child of the current style class".
	// (and repeat recursively)
	function expand_modified_subtree(node, modified_node) {
		// from the modified style class node
		_Object$keys(modified_node)
		// for all non-pseudo-classes and non-media-queries
		.filter(function (name) {
			return !is_pseudo_class(name) && !is_media_query(name) && !is_keyframes(name);
		})
		// get all non-modifier style class nodes
		.filter(function (name) {
			return typeof modified_node[name] === 'object' && !modified_node[name]._is_a_modifier;
		})
		// which are also present as non-modifier style classes
		// in the base style class node
		.filter(function (name) {
			return typeof node[name] === 'object' && !node[name]._is_a_modifier;
		})
	
		// for each such style class node
		.forEach(function (name) {
			// style of the original style class node
			var style = get_node_style(node[name]);
	
			// pseudo-classes of the original style class node
			var pseudo_classes_and_media_queries_and_keyframes = get_node_pseudo_classes_and_media_queries_and_keyframes(node[name]);
	
			// mix in the styles
			modified_node[name] = (0, _helpers.extend)({}, style, pseudo_classes_and_media_queries_and_keyframes, modified_node[name]);
	
			// recurse
			return expand_modified_subtree(node[name], modified_node[name]);
		});
	}
	
	// checks if this style class name designates a pseudo-class
	
	function is_pseudo_class(name) {
		return (0, _helpers.starts_with)(name, ':');
	}
	
	// checks if this style class name is a media query (i.e. @media (...))
	
	function is_media_query(name) {
		return (0, _helpers.starts_with)(name, '@media');
	}
	
	function is_keyframe_selector(name) {
		return (0, _helpers.ends_with)(name, '%') || name === 'from' || name === 'to';
	}
	
	// checks if this style class name is a media query (i.e. @media (...))
	
	function is_keyframes(name) {
		return (0, _helpers.starts_with)(name, '@keyframes');
	}
	
	// style class nesting validation
	function validate_child_style_class_types(parent_node_names, names) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = _getIterator(parent_node_names), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _parent = _step.value;
	
				// if it's a pseudoclass, it can't contain any style classes
				if (is_pseudo_class(_parent) && (0, _helpers.not_empty)(names)) {
					throw new Error('A style class declaration "' + names[0] + '" found inside a pseudoclass "' + _parent + '". Pseudoclasses (:hover, etc) can\'t contain child style classes.');
				}
	
				// if it's a media query style class, it must contain only pseudoclasses
				if (is_media_query(_parent)) {
					var non_pseudoclass = names.filter(function (x) {
						return !is_pseudo_class(x);
					})[0];
	
					if (non_pseudoclass) {
						throw new Error('A non-pseudoclass "' + non_pseudoclass + '" found inside a media query style class "' + _parent + '". Media query style classes can only contain pseudoclasses (:hover, etc).');
					}
				}
	
				// if it's a keyframes style class, it must contain only keyframe selectors
				if (is_keyframes(_parent)) {
					var non_keyframe_selector = names.filter(function (x) {
						return !is_keyframe_selector(x);
					})[0];
	
					if (non_keyframe_selector) {
						throw new Error('A non-keyframe-selector "' + non_keyframe_selector + '" found inside a keyframes style class "' + _parent + '". Keyframes style classes can only contain keyframe selectors (from, 100%, etc).');
					}
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
	}
	
	// parse CSS style class
	function parse_style_class(lines, node_names) {
		// separate style lines from children lines
	
		var _split_into_style_lines_and_children_lines = split_into_style_lines_and_children_lines(lines);
	
		var style_lines = _split_into_style_lines_and_children_lines.style_lines;
		var children_lines = _split_into_style_lines_and_children_lines.children_lines;
	
		// convert style lines info to just text lines
		var styles = style_lines.map(function (line) {
			return line.line;
		});
	
		// using this child node's (or these child nodes') style lines
		// and this child node's (or these child nodes') child nodes' lines,
		// generate this child node's (or these child nodes') style JSON object
		// (this is gonna be a recursion)
		return parse_node_json(styles, children_lines, node_names);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	module.exports = __webpack_require__(9).Object.keys;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(4);
	
	__webpack_require__(6)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(5);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(7)
	  , core    = __webpack_require__(9)
	  , fails   = __webpack_require__(12);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(8)
	  , core      = __webpack_require__(9)
	  , ctx       = __webpack_require__(10)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(11);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(14), __esModule: true };

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(15);
	__webpack_require__(36);
	module.exports = __webpack_require__(39);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(16);
	var Iterators = __webpack_require__(19);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(17)
	  , step             = __webpack_require__(18)
	  , Iterators        = __webpack_require__(19)
	  , toIObject        = __webpack_require__(20);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(23)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(21)
	  , defined = __webpack_require__(5);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(22);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(24)
	  , $export        = __webpack_require__(7)
	  , redefine       = __webpack_require__(25)
	  , hide           = __webpack_require__(26)
	  , has            = __webpack_require__(30)
	  , Iterators      = __webpack_require__(19)
	  , $iterCreate    = __webpack_require__(31)
	  , setToStringTag = __webpack_require__(32)
	  , getProto       = __webpack_require__(27).getProto
	  , ITERATOR       = __webpack_require__(33)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(26);

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(27)
	  , createDesc = __webpack_require__(28);
	module.exports = __webpack_require__(29) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(12)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 30 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(27)
	  , descriptor     = __webpack_require__(28)
	  , setToStringTag = __webpack_require__(32)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(26)(IteratorPrototype, __webpack_require__(33)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(27).setDesc
	  , has = __webpack_require__(30)
	  , TAG = __webpack_require__(33)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(34)('wks')
	  , uid    = __webpack_require__(35)
	  , Symbol = __webpack_require__(8).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(8)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(37)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(23)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(38)
	  , defined   = __webpack_require__(5);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(40)
	  , get      = __webpack_require__(42);
	module.exports = __webpack_require__(9).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(41);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(43)
	  , ITERATOR  = __webpack_require__(33)('iterator')
	  , Iterators = __webpack_require__(19);
	module.exports = __webpack_require__(9).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(22)
	  , TAG = __webpack_require__(33)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// // if the variable is defined
	'use strict';
	
	var _getIterator = __webpack_require__(13)['default'];
	
	var _Object$keys = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.is_object = is_object;
	exports.extend = extend;
	exports.merge = merge;
	exports.clone = clone;
	exports.convert_from_camel_case = convert_from_camel_case;
	exports.replace_all = replace_all;
	exports.starts_with = starts_with;
	exports.ends_with = ends_with;
	exports.is_empty = is_empty;
	exports.not_empty = not_empty;
	exports.repeat = repeat;
	exports.is_blank = is_blank;
	exports.zip = zip;
	var exists = function exists(what) {
		return typeof what !== 'undefined';
	};
	
	exports.exists = exists;
	// used for JSON object type checking
	var object_constructor = ({}).constructor;
	
	// detects a JSON object
	
	function is_object(object) {
		return exists(object) && object !== null && object.constructor === object_constructor;
	}
	
	// extends the first object with
	/* istanbul ignore next: some weird transpiled code, not testable */
	
	function extend() {
		var _this = this,
		    _arguments = arguments;
	
		var _again = true;
	
		_function: while (_again) {
			_again = false;
	
			for (var _len = _arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
				objects[_key] = _arguments[_key];
			}
	
			var to = objects[0];
			var from = objects[1];
	
			if (objects.length > 2) {
				var last = objects.pop();
				var intermediary_result = extend.apply(_this, objects);
				_this = undefined;
				_arguments = [intermediary_result, last];
				_again = true;
				_len = objects = _key = to = from = last = intermediary_result = undefined;
				continue _function;
			}
	
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;
	
			try {
				for (var _iterator = _getIterator(_Object$keys(from)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;
	
					if (is_object(from[key])) {
						if (!is_object(to[key])) {
							to[key] = {};
						}
	
						extend(to[key], from[key]);
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
	
	function merge() {
		var parameters = Array.prototype.slice.call(arguments, 0);
		parameters.unshift({});
		return extend.apply(this, parameters);
	}
	
	function clone(object) {
		return merge({}, object);
	}
	
	// creates camelCased aliases for all the keys of an object
	
	function convert_from_camel_case(object) {
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;
	
		try {
			for (var _iterator2 = _getIterator(_Object$keys(object)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var key = _step2.value;
	
				if (/[A-Z]/.test(key))
					// if (key.indexOf('_') >= 0)
					{
						// const camel_cased_key = key.replace(/_(.)/g, function(match, group_1)
						// {
						// 	return group_1.toUpperCase()
						// })
	
						// if (!exists(object[camel_cased_key]))
						// {
						// 	object[camel_cased_key] = object[key]
						// 	delete object[key]
						// }
	
						var lo_dashed_key = key.replace(/([A-Z])/g, function (match, group_1) {
							return '_' + group_1.toLowerCase();
						});
	
						if (!exists(object[lo_dashed_key])) {
							object[lo_dashed_key] = object[key];
							delete object[key];
						}
					}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	
		return object;
	}
	
	function escape_regexp(string) {
		var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", 'g');
		return string.replace(specials, "\\$&");
	}
	
	function replace_all(where, what, with_what) {
		var regexp = new RegExp(escape_regexp(what), 'g');
		return where.replace(regexp, with_what);
	}
	
	function starts_with(string, substring) {
		return string.indexOf(substring) === 0;
	}
	
	function ends_with(string, substring) {
		var index = string.lastIndexOf(substring);
		return index >= 0 && index === string.length - substring.length;
	}
	
	function is_empty(array) {
		return array.length === 0;
	}
	
	function not_empty(array) {
		return array.length > 0;
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

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = __webpack_require__(47)['default'];
	
	var _classCallCheck = __webpack_require__(50)['default'];
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _helpers = __webpack_require__(45);
	
	// tabulation utilities
	
	var Tabulator = (function () {
		function Tabulator(tab) {
			_classCallCheck(this, Tabulator);
	
			this.tab = tab;
		}
	
		// decide whether it's tabs or spaces
	
		// remove some tabs in the beginning
	
		_createClass(Tabulator, [{
			key: 'reduce_indentation',
			value: function reduce_indentation(line, how_much) {
				return line.substring(this.tab.symbol.length * how_much);
			}
	
			// how many "tabs" are there before content of this line
		}, {
			key: 'calculate_indentation',
			value: function calculate_indentation(line) {
				var matches = line.match(this.tab.regexp);
	
				if (!matches || matches[0] === '') {
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
					index++;
					return { line: line, index: index };
				})
				// filter out blank lines
				.filter(function (line) {
					return !(0, _helpers.is_blank)(line.line);
				});
	
				// calculate each line's indentation
				lines.forEach(function (line) {
					var tabs = _this.calculate_indentation(line.line);
					var pure_line = _this.reduce_indentation(line.line, tabs);
	
					// check for messed up space indentation
					if ((0, _helpers.starts_with)(pure_line, ' ')) {
						var reason = undefined;
						if (_this.tab.symbol === '\t') {
							reason = 'mixed tabs and spaces';
						} else {
							reason = 'extra leading spaces';
						}
	
						throw new Error('Invalid indentation (' + reason + ') at line ' + line.index + ': "' + _this.reveal_whitespace(line.line) + '"');
					}
	
					// check for tabs in spaced intentation
					if ((0, _helpers.starts_with)(pure_line, '\t')) {
						throw new Error('Invalid indentation (mixed tabs and spaces) at line ' + line.index + ': "' + _this.reveal_whitespace(line.line) + '"');
					}
	
					line.tabs = tabs;
					line.original_line = line.line;
					line.line = pure_line;
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
				if (lines.length > 0 && lines[0].tabs !== 1) {
					throw new Error('Invalid indentation at line ' + lines[0].index + ': "' + lines[0].original_line + '"');
				}
	
				return lines;
			}
		}, {
			key: 'reveal_whitespace',
			value: function reveal_whitespace(text) {
				var whitespace_count = text.length - text.replace(/^\s*/, '').length;
	
				var whitespace = text.substring(0, whitespace_count + 1).replace(this.tab.regexp_anywhere, '[indent]').replace(/ /g, '[space]').replace(/\t/g, '[tab]');
	
				var rest = text.substring(whitespace_count + 1);
	
				return whitespace + rest;
			}
		}]);
	
		return Tabulator;
	})();
	
	exports['default'] = Tabulator;
	Tabulator.determine_tabulation = function (lines) {
		var substract = function substract(pair) {
			return pair[0] - pair[1];
		};
	
		function is_tabulated(line) {
			// if we're using tabs for tabulation
			if ((0, _helpers.starts_with)(line, '\t')) {
				var _tab = {
					symbol: '\t',
					regexp: new RegExp('^(\t)+', 'g'),
					regexp_anywhere: new RegExp('(\t)+', 'g')
				};
	
				return _tab;
			}
		}
	
		function spaced_tab(tab_width) {
			var symbol = (0, _helpers.repeat)(' ', tab_width);
	
			var spaced_tab = {
				symbol: symbol,
				regexp: new RegExp('^(' + symbol + ')+', 'g'),
				regexp_anywhere: new RegExp('(' + symbol + ')+', 'g')
			};
	
			return spaced_tab;
		}
	
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
		if (lines.length === 0) {
			return tab;
			// throw new Error(`Couldn't decide on tabulation type. Not enough lines.`)
		}
	
		if (lines.length === 1) {
			var _tab2 = is_tabulated(lines[0]);
			if (_tab2) {
				return _tab2;
			}
	
			return spaced_tab(calculate_leading_spaces(lines[0]));
		}
	
		// if we're using tabs for tabulation
		var tab = is_tabulated(lines[1]);
		if (tab) {
			return tab;
		}
	
		// take the first two lines,
		// calculate their indentation,
		// substract it and you've got the tab width
		var tab_width = Math.abs(substract(lines.slice(0, 2).map(calculate_leading_spaces))) || 1;
	
		// if (tab_width === 0)
		// {
		// 	throw new Error(`Couldn't decide on tabulation type. Same indentation.`)
		// }
	
		return spaced_tab(tab_width);
	};
	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(48)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(49), __esModule: true };

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(27);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-styling.js.map