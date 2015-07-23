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
/* istanbul ignore next: some weird transpiled code, not testable */

function extend() {
	var _this = this,
	    _arguments = arguments;

	var _again = true;

	_function: while (_again) {
		_len = objects = _key = to = from = last = intermediary_result = _iteratorNormalCompletion = _didIteratorError = _iteratorError = undefined;
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