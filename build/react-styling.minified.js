!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):"object"==typeof exports?exports["react-styling"]=e():t["react-styling"]=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t){for(var e="",n=0;n<t.length;){e+=t[n];for(var r=arguments.length,o=Array(r>1?r-1:0),u=1;r>u;u++)o[u-1]=arguments[u];p.exists(o[n])&&(e+=o[n]),n++}return i(e)}function i(t){t=t.replace(/\/\*([\s\S]*?)\*\//g,""),t=t.replace(/[\{\}]/g,"");var e=t.split("\n"),n=new g["default"](g["default"].determine_tabulation(e)),r=o([],n.extract_tabulation(e));return f(r)}function o(t,e){var n=t.map(function(t){var e=t.split(":"),n=e[0].trim(),r=e[1].trim();return r=r.replace(/;$/,""),n=n.replace(/([-]{1}[a-z]{1})/g,function(t){return t.substring(1).toUpperCase()}),{key:n,value:r}}).reduce(function(t,e){return t[e.key]=e.value,t},{});return p.extend(n,u(e))}function u(t){return t=a(t),0===t.length?{}:c(t).map(function(t){var e=t.shift().line,n=!1;p.starts_with(e,"&")&&(e=e.substring("&".length),n=!0),p.starts_with(e,".")&&(e=e.substring(".".length)),p.ends_with(e,":")&&(e=e.substring(0,e.length-":".length));var r=t.filter(function(t){if(2!==t.tabs)return!1;var e=t.line.indexOf(":");return e>0&&e<t.line.length-1&&!p.starts_with(t.line,"@")}),i=t.filter(function(t){return r.indexOf(t)<0});r=r.map(function(t){return t.line}),i.forEach(function(t){return t.tabs--});var u=o(r,i);return n&&(u._is_a_modifier=!0),{name:e,json:u}}).reduce(function(t,e){return t[e.name]=e.json,t},{})}function a(t){return t=t.filter(function(t){return!p.is_blank(t.line)}),t.forEach(function(t){t.line=t.line.replace(/\/\/.*/,""),t.line=t.line.trim()}),t}function c(t){var e=t.map(function(t,e){return{tabs:t.tabs,index:e}}).filter(function(t){return 1===t.tabs}).map(function(t){return t.index}),n=e.map(function(t){return t-1});n.shift(),n.push(t.length-1);var r=p.zip(e,n);return r.map(function(e){return t.slice(e[0],e[1]+1)})}function f(t){var e=s(t);return l(t).filter(function(e){return"object"==typeof t[e]&&t[e]._is_a_modifier}).forEach(function(n){delete t[n]._is_a_modifier,t[n]=p.extend({},e,t[n])}),l(t).filter(function(e){return"object"==typeof t[e]}).forEach(function(e){f(t[e])}),t}function s(t){return l(t).filter(function(e){return"object"!=typeof t[e]}).reduce(function(e,n){return e[n]=t[n],e},{})}var l=n(1)["default"],d=n(8)["default"];Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=r;var p=n(9),h=n(26),g=d(h);t.exports=e["default"]},function(t,e,n){t.exports={"default":n(2),__esModule:!0}},function(t,e,n){n(3),t.exports=n(4).core.Object.keys},function(t,e,n){var r=n(4),i=n(6),o=r.isObject,u=r.toObject;r.each.call("freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames".split(","),function(t,e){var a=(r.core.Object||{})[t]||Object[t],c=0,f={};f[t]=0==e?function(t){return o(t)?a(t):t}:1==e?function(t){return o(t)?a(t):t}:2==e?function(t){return o(t)?a(t):t}:3==e?function(t){return o(t)?a(t):!0}:4==e?function(t){return o(t)?a(t):!0}:5==e?function(t){return o(t)?a(t):!1}:6==e?function(t,e){return a(u(t),e)}:7==e?function(t){return a(Object(r.assertDefined(t)))}:8==e?function(t){return a(u(t))}:n(7).get;try{a("z")}catch(s){c=1}i(i.S+i.F*c,"Object",f)})},function(t,e,n){"use strict";function r(t){return isNaN(t=+t)?0:(t>0?g:h)(t)}function i(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}function o(t,e,n){return t[e]=n,t}function u(t){return y?function(e,n,r){return m.setDesc(e,n,i(t,r))}:o}function a(t){return null!==t&&("object"==typeof t||"function"==typeof t)}function c(t){return"function"==typeof t}function f(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}var s="undefined"!=typeof self?self:Function("return this")(),l={},d=Object.defineProperty,p={}.hasOwnProperty,h=Math.ceil,g=Math.floor,v=Math.max,b=Math.min,y=!!function(){try{return 2==d({},"a",{get:function(){return 2}}).a}catch(t){}}(),_=u(1),m=t.exports=n(5)({g:s,core:l,html:s.document&&document.documentElement,isObject:a,isFunction:c,that:function(){return this},toInteger:r,toLength:function(t){return t>0?b(r(t),9007199254740991):0},toIndex:function(t,e){return t=r(t),0>t?v(t+e,0):b(t,e)},has:function(t,e){return p.call(t,e)},create:Object.create,getProto:Object.getPrototypeOf,DESC:y,desc:i,getDesc:Object.getOwnPropertyDescriptor,setDesc:d,setDescs:Object.defineProperties,getKeys:Object.keys,getNames:Object.getOwnPropertyNames,getSymbols:Object.getOwnPropertySymbols,assertDefined:f,ES5Object:Object,toObject:function(t){return m.ES5Object(f(t))},hide:_,def:u(0),set:s.Symbol?o:_,each:[].forEach});"undefined"!=typeof __e&&(__e=l),"undefined"!=typeof __g&&(__g=s)},function(t,e){t.exports=function(t){return t.FW=!1,t.path=t.core,t}},function(t,e,n){function r(t,e){return function(){return t.apply(e,arguments)}}function i(t,e,n){var o,f,s,l,d=t&i.G,p=t&i.P,h=d?u:t&i.S?u[e]:(u[e]||{}).prototype,g=d?a:a[e]||(a[e]={});d&&(n=e);for(o in n)f=!(t&i.F)&&h&&o in h,f&&o in g||(s=f?h[o]:n[o],d&&!c(h[o])?l=n[o]:t&i.B&&f?l=r(s,u):t&i.W&&h[o]==s?!function(t){l=function(e){return this instanceof t?new t(e):t(e)},l.prototype=t.prototype}(s):l=p&&c(s)?r(Function.call,s):s,g[o]=l,p&&((g.prototype||(g.prototype={}))[o]=s))}var o=n(4),u=o.g,a=o.core,c=o.isFunction;i.F=1,i.G=2,i.S=4,i.P=8,i.B=16,i.W=32,t.exports=i},function(t,e,n){function r(t){try{return u(t)}catch(e){return a.slice()}}var i=n(4),o={}.toString,u=i.getNames,a="object"==typeof window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.get=function(t){return a&&"[object Window]"==o.call(t)?r(t):u(i.toObject(t))}},function(t,e){"use strict";e["default"]=function(t){return t&&t.__esModule?t:{"default":t}},e.__esModule=!0},function(t,e,n){"use strict";function r(t,e){return 0===t.indexOf(e)}function i(t,e){var n=t.lastIndexOf(e);if(!(0>n))return n===t.length-e.length}function o(t,e){for(var n="";e>0;)n+=t,e--;return n}function u(t){return!l(t)||!t.replace(/\s/g,"")}function a(t,e){return t.map(function(n,r){return[t[r],e[r]]})}function c(t,e,n){for(var r=this,i=arguments,o=!0;o;){var u=t,a=e,d=n;p=x=w=h=g=v=void 0,o=!1;var p=Array.prototype.slice.call(i,0);if(!l(d)){var h=!0,g=!1,v=void 0;try{for(var b,y=f(s(a));!(h=(b=y.next()).done);h=!0){var _=b.value;"object"==typeof a[_]&&l(u[_])?u[_]=c(u[_],a[_]):u[_]=a[_]}}catch(m){g=!0,v=m}finally{try{!h&&y["return"]&&y["return"]()}finally{if(g)throw v}}return u}var x=p.pop(),w=c.apply(r,p);r=void 0,i=[t=w,e=x,n=void 0],o=!0}}var f=n(10)["default"],s=n(1)["default"];Object.defineProperty(e,"__esModule",{value:!0}),e.starts_with=r,e.ends_with=i,e.repeat=o,e.is_blank=u,e.zip=a,e.extend=c;var l=function(t){return"undefined"!=typeof t};e.exists=l},function(t,e,n){t.exports={"default":n(11),__esModule:!0}},function(t,e,n){n(12),n(23),n(25),t.exports=n(4).core.getIterator},function(t,e,n){n(13);var r=n(4),i=n(16).Iterators,o=n(18)("iterator"),u=i.Array,a=r.g.NodeList,c=r.g.HTMLCollection,f=a&&a.prototype,s=c&&c.prototype;r.FW&&(!a||o in f||r.hide(f,o,u),!c||o in s||r.hide(s,o,u)),i.NodeList=i.HTMLCollection=u},function(t,e,n){var r=n(4),i=n(14),o=n(15).safe("iter"),u=n(16),a=u.step,c=u.Iterators;n(21)(Array,"Array",function(t,e){r.set(this,o,{o:r.toObject(t),i:0,k:e})},function(){var t=this[o],e=t.o,n=t.k,r=t.i++;return!e||r>=e.length?(t.o=void 0,a(1)):"keys"==n?a(0,r):"values"==n?a(0,e[r]):a(0,[r,e[r]])},"values"),c.Arguments=c.Array,i("keys"),i("values"),i("entries")},function(t,e){t.exports=function(){}},function(t,e,n){function r(t){return"Symbol(".concat(void 0===t?"":t,")_",(++i+Math.random()).toString(36))}var i=0;r.safe=n(4).g.Symbol||r,t.exports=r},function(t,e,n){"use strict";function r(t,e){i.hide(t,f,e),s in[]&&i.hide(t,s,e)}var i=n(4),o=n(17),u=o.classof,a=n(20),c=a.obj,f=n(18)("iterator"),s="@@iterator",l=n(19)("iterators"),d={};r(d,i.that),t.exports={BUGGY:"keys"in[]&&!("next"in[].keys()),Iterators:l,step:function(t,e){return{value:e,done:!!t}},is:function(t){var e=Object(t),n=i.g.Symbol;return(n&&n.iterator||s)in e||f in e||i.has(l,u(e))},get:function(t){var e,n=i.g.Symbol;return void 0!=t&&(e=t[n&&n.iterator||s]||t[f]||l[u(t)]),a(i.isFunction(e),t," is not iterable!"),c(e.call(t))},set:r,create:function(t,e,n,r){t.prototype=i.create(r||d,{next:i.desc(1,n)}),o.set(t,e+" Iterator")}}},function(t,e,n){function r(t){return u.call(t).slice(8,-1)}var i=n(4),o=n(18)("toStringTag"),u={}.toString;r.classof=function(t){var e,n;return void 0==t?void 0===t?"Undefined":"Null":"string"==typeof(n=(e=Object(t))[o])?n:r(e)},r.set=function(t,e,n){t&&!i.has(t=n?t:t.prototype,o)&&i.hide(t,o,e)},t.exports=r},function(t,e,n){var r=n(4).g,i=n(19)("wks");t.exports=function(t){return i[t]||(i[t]=r.Symbol&&r.Symbol[t]||n(15).safe("Symbol."+t))}},function(t,e,n){var r=n(4),i="__core-js_shared__",o=r.g[i]||(r.g[i]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,e,n){function r(t,e,n){if(!t)throw TypeError(n?e+n:e)}var i=n(4);r.def=i.assertDefined,r.fn=function(t){if(!i.isFunction(t))throw TypeError(t+" is not a function!");return t},r.obj=function(t){if(!i.isObject(t))throw TypeError(t+" is not an object!");return t},r.inst=function(t,e,n){if(!(t instanceof e))throw TypeError(n+": use the 'new' operator!");return t},t.exports=r},function(t,e,n){var r=n(6),i=n(22),o=n(4),u=n(17),a=n(16),c=n(18)("iterator"),f="@@iterator",s="keys",l="values",d=a.Iterators;t.exports=function(t,e,n,p,h,g,v){function b(t){function e(e){return new n(e,t)}switch(t){case s:return function(){return e(this)};case l:return function(){return e(this)}}return function(){return e(this)}}a.create(n,e,p);var y,_,m=e+" Iterator",x=t.prototype,w=x[c]||x[f]||h&&x[h],j=w||b(h);if(w){var O=o.getProto(j.call(new t));u.set(O,m,!0),o.FW&&o.has(x,f)&&a.set(O,o.that)}if((o.FW||v)&&a.set(x,j),d[e]=j,d[m]=o.that,h)if(y={keys:g?j:b(s),values:h==l?j:b(l),entries:h!=l?j:b("entries")},v)for(_ in y)_ in x||i(x,_,y[_]);else r(r.P+r.F*a.BUGGY,e,y)}},function(t,e,n){t.exports=n(4).hide},function(t,e,n){var r=n(4).set,i=n(24)(!0),o=n(15).safe("iter"),u=n(16),a=u.step;n(21)(String,"String",function(t){r(this,o,{o:String(t),i:0})},function(){var t,e=this[o],n=e.o,r=e.i;return r>=n.length?a(1):(t=i(n,r),e.i+=t.length,a(0,t))})},function(t,e,n){var r=n(4);t.exports=function(t){return function(e,n){var i,o,u=String(r.assertDefined(e)),a=r.toInteger(n),c=u.length;return 0>a||a>=c?t?"":void 0:(i=u.charCodeAt(a),55296>i||i>56319||a+1===c||(o=u.charCodeAt(a+1))<56320||o>57343?t?u.charAt(a):i:t?u.slice(a,a+2):(i-55296<<10)+(o-56320)+65536)}}},function(t,e,n){var r=n(4).core,i=n(16);r.isIterable=i.is,r.getIterator=i.get},function(t,e,n){"use strict";var r=n(27)["default"],i=n(30)["default"];Object.defineProperty(e,"__esModule",{value:!0});var o=n(9),u=function(){function t(e){i(this,t),this.tab=e}return r(t,[{key:"reduce_indentation",value:function(t,e){return t.substring(this.tab.symbol.length*e)}},{key:"calculate_indentation",value:function(t){var e=t.match(this.tab.regexp);return e?e[0].length/this.tab.symbol.length:0}},{key:"extract_tabulation",value:function(t){var e=this;t=t.map(function(t,e){return{line:t,index:e}}).filter(function(t){return!o.is_blank(t.line)}),t.forEach(function(t){if(t.original_line=t.line,t.tabs=e.calculate_indentation(t.line),t.line=e.reduce_indentation(t.line,t.tabs),o.starts_with(t.line," "))throw new Error("Invalid indentation (extra leading spaces) at line "+t.index+': "'+t.original_line+'"');if(o.starts_with(t.line,"	"))throw new Error("Invalid indentation (mixed tabs and spaces) at line "+t.index+': "'+t.original_line+'"')});var n=t.reduce(function(t,e){return Math.min(t,e.tabs)},1/0);if(0===n?t.forEach(function(t){t.tabs++}):n>1&&t.forEach(function(t){t.tabs-=n-1}),1!==t[0].tabs)throw new Error("Invalid indentation at line "+t[0].index+': "'+t[0].original_line+'"');return t}}]),t}();e["default"]=u,u.determine_tabulation=function(t){function e(t){if(o.starts_with(t,"	")){var e={symbol:"	",regexp:new RegExp("^(	)+","g")};return e}}function n(t){var e=0;return t.replace(/^( )+/g,function(t){e=t.length}),e}var r=function(t){return t[0]-t[1]};if(t=t.filter(function(t){return!o.is_blank(t)}),0===t.length)throw new Error("Couldn't decide on tabulation type. Not enough lines.");if(1===t.length){var i=e(t[0]);return i?i:n(t[0])}var u=e(t[1]);if(u)return u;var a=Math.abs(r(t.slice(0,2).map(n)));if(0===a)throw new Error("Couldn't decide on tabulation type. Same indentation.");var c=o.repeat(" ",a),f={symbol:c,regexp:new RegExp("^("+c+")+","g")};return f},t.exports=e["default"]},function(t,e,n){"use strict";var r=n(28)["default"];e["default"]=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),r(t,i.key,i)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),e.__esModule=!0},function(t,e,n){t.exports={"default":n(29),__esModule:!0}},function(t,e,n){var r=n(4);t.exports=function(t,e,n){return r.setDesc(t,e,n)}},function(t,e){"use strict";e["default"]=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},e.__esModule=!0}])});
//# sourceMappingURL=react-styling.minified.js.map