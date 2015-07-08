!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):"object"==typeof exports?exports["react-styling"]=n():t["react-styling"]=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t){return t=t.replace(/[\{\}]/g,""),u(t.split("\n"))}function a(t,n,e){var r={},i=n.map(function(t){var n=t.split(":"),e=n[0].trim(),r=n[1].trim();return e=e.replace(/([-]{1}[a-z]{1})/g,function(t){return t.substring(1).toUpperCase()}),{key:e,value:r}}).reduce(function(t,n){return t[n.key]=n.value,t},{});l.extend(r,i);var a=u(e);return Object.keys(a).filter(function(t){return l.starts_with(t,".")}).forEach(function(t){a[t.substring(".".length)]=l.extend({},i,a[t]),delete a[t]}),l.extend(r,a),r}function u(t){for(var n=!0;n;){var e=t;if(r=i=u=o=f=void 0,n=!1,!e.length)return{};if(!l.is_blank(e[0])){var r=new c["default"](c["default"].determine_tabulation(e));e=r.normalize_initial_tabulation(e).filter(function(t){return!l.is_blank(t)&&!t.match(/^[\s]*\/\//)}).map(function(t,n){var e=r.calculate_indentation(t);if(t=r.reduce_tabulation(t,e),l.starts_with(t," "))throw new Error('Invalid tabulation (some extra leading spaces) at line: "'+t+'"');t=t.trim();var i={line:t,index:n,indentation:e};return i});var i=e.filter(function(t){return 1===t.indentation}).map(function(t){return t.index}),u=i.map(function(t){return t-1});u.shift(),u.push(e.length-1);var o=l.zip(i,u),f=o.map(function(t){return e.slice(t[0],t[1]+1)});return f.map(function(t){var n=t.shift().line;l.ends_with(n,":")&&(n=n.substring(0,n.length-":".length));var e=t.filter(function(t){var n=t.line,e=t.indentation;if(2===e){var r=n.indexOf(":");return r>0&&r<n.length-1&&!l.starts_with(n,"@")}}),i=t.filter(function(t){return!e.includes(t)});e=e.map(function(t){return t.line}),i=i.map(function(t){return r.tabulate(t.line,t.indentation-1)});var u=a(n,e,i);return{name:n,json:u}}).reduce(function(t,n){return t[n.name]=n.json,t},{})}e.shift(),t=e,n=!0}}function o(t){for(var n="",e=0;e<t.length;){n+=t[e];for(var r=arguments.length,a=Array(r>1?r-1:0),u=1;r>u;u++)a[u-1]=arguments[u];l.exists(a[e])&&(n+=a[e]),e++}return i(n)}Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=o;var l=e(1),f=e(2),c=r(f);t.exports=n["default"]},function(t,n){"use strict";function e(t,n){return 0===t.indexOf(n)}function r(t,n){var e=t.lastIndexOf(n);if(!(0>e))return e===t.length-n.length}function i(t,n){for(var e="";n>0;)e+=t,n--;return e}function a(t){return!t.replace(/\s/g,"")}function u(t,n){return t.map(function(e,r){return[t[r],n[r]]})}function o(t,n,e){for(var r=this,i=arguments,a=!0;a;){var u=t,f=n,c=e;s=y=_=d=p=v=void 0,a=!1;var s=Array.prototype.slice.call(i,0);if(!l(c)){var d=!0,p=!1,v=void 0;try{for(var b,h=Object.keys(f)[Symbol.iterator]();!(d=(b=h.next()).done);d=!0){var m=b.value;"object"==typeof f[m]&&l(u[m])?u[m]=o(u[m],f[m]):u[m]=f[m]}}catch(g){p=!0,v=g}finally{try{!d&&h["return"]&&h["return"]()}finally{if(p)throw v}}return u}var y=s.pop(),_=o.apply(r,s);r=void 0,i=[t=_,n=y,e=void 0],a=!0}}Object.defineProperty(n,"__esModule",{value:!0}),n.starts_with=e,n.ends_with=r,n.repeat=i,n.is_blank=a,n.zip=u,n.extend=o;var l=function(t){return"undefined"!=typeof t};n.exists=l},function(t,n,e){"use strict";function r(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}(),a=e(1),u=function(){function t(n){r(this,t),this.tab=n}return i(t,[{key:"tabulate",value:function(t){var n=void 0===arguments[1]?1:arguments[1];return a.repeat(this.tab.symbol,n)+t}},{key:"reduce_tabulation",value:function(t){var n=void 0===arguments[1]?1:arguments[1];return t.substring(this.tab.symbol.length*n)}},{key:"calculate_indentation",value:function(t){var n=t.match(this.tab.regexp);return n?n[0].length/this.tab.symbol.length:0}},{key:"normalize_initial_tabulation",value:function(t){var n=this,e=t.filter(function(t){return!a.is_blank(t)}).map(function(t){return n.calculate_indentation(t)}).reduce(function(t,n){return Math.min(t,n)},1/0);return 0===e?t=t.map(function(t){return n.tabulate(t)}):e>1&&(t=t.map(function(t){return n.reduce_tabulation(t,e-1)})),t}}]),t}();n["default"]=u,u.determine_tabulation=function(t){function n(t){var n=0;return t.replace(/^( )+/g,function(t){n=t.length}),n}var e=function(t){return t[0]-t[1]};if(t=t.filter(function(t){return!a.is_blank(t)}),t.length<2)throw new Error("Couldn't decide on tabulation type. Not enough lines.");if(a.starts_with(t[1],"	")){var r={symbol:"	",regexp:new RegExp("^(	)+","g")};return r}var i=Math.abs(e(t.slice(0,2).map(n)));if(0===i)throw new Error("Couldn't decide on tabulation type. Invalid tabulation.");var u=a.repeat(" ",i),o={symbol:u,regexp:new RegExp("^("+u+")+","g")};return o},t.exports=n["default"]}])});
//# sourceMappingURL=react-styling.minified.js.map