!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):"object"==typeof exports?exports["react-styling"]=n():t["react-styling"]=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t){for(var n="",e=0;e<t.length;){n+=t[e];for(var r=arguments.length,i=Array(r>1?r-1:0),u=1;r>u;u++)i[u-1]=arguments[u];c.exists(i[e])&&(n+=i[e]),e++}return a(n)}function a(t){t=t.replace(/\/\*([\s\S]*?)\*\//g,""),t=t.replace(/[\{\}]/g,"");var n=t.split("\n"),e=new d["default"](d["default"].determine_tabulation(n)),r=u([],e.extract_tabulation(n));return f(r)}function u(t,n){var e=t.map(function(t){var n=t.split(":"),e=n[0].trim(),r=n[1].trim();return r=r.replace(/;$/,""),e=e.replace(/([-]{1}[a-z]{1})/g,function(t){return t.substring(1).toUpperCase()}),{key:e,value:r}}).reduce(function(t,n){return t[n.key]=n.value,t},{});return c.extend(e,o(n))}function o(t){if(0===t.length)return{};t.forEach(function(t){t.line=t.line.replace(/\/\/.*/,""),t.line=t.line.trim()}),t=t.filter(function(t){return!c.is_blank(t.line)});var n=t.map(function(t,n){return{tabs:t.tabs,index:n}}).filter(function(t){return 1===t.tabs}).map(function(t){return t.index}),e=n.map(function(t){return t-1});e.shift(),e.push(t.length-1);var r=c.zip(n,e),i=r.map(function(n){return t.slice(n[0],n[1]+1)});return i.map(function(t){var n=t.shift().line,e=!1;c.starts_with(n,"&")&&(n=n.substring("&".length),e=!0),c.starts_with(n,".")&&(n=n.substring(".".length)),c.ends_with(n,":")&&(n=n.substring(0,n.length-":".length));var r=t.filter(function(t){if(2!==t.tabs)return!1;var n=t.line.indexOf(":");return n>0&&n<t.line.length-1&&!c.starts_with(t.line,"@")}),i=t.filter(function(t){return r.indexOf(t)<0});r=r.map(function(t){return t.line}),i.forEach(function(t){return t.tabs--});var a=u(r,i);return e&&(a._is_a_modifier=!0),{name:n,json:a}}).reduce(function(t,n){return t[n.name]=n.json,t},{})}function f(t){var n=l(t);return Object.keys(t).filter(function(n){return"object"==typeof t[n]&&t[n]._is_a_modifier}).forEach(function(e){delete t[e]._is_a_modifier,t[e]=c.extend({},n,t[e])}),Object.keys(t).filter(function(n){return"object"==typeof t[n]}).forEach(function(n){f(t[n])}),t}function l(t){return Object.keys(t).filter(function(n){return"object"!=typeof t[n]}).reduce(function(n,e){return n[e]=t[e],n},{})}Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=i;var c=e(1),s=e(2),d=r(s);t.exports=n["default"]},function(t,n){"use strict";function e(t,n){return 0===t.indexOf(n)}function r(t,n){var e=t.lastIndexOf(n);if(!(0>e))return e===t.length-n.length}function i(t,n){for(var e="";n>0;)e+=t,n--;return e}function a(t){return!t.replace(/\s/g,"")}function u(t,n){return t.map(function(e,r){return[t[r],n[r]]})}function o(t,n,e){for(var r=this,i=arguments,a=!0;a;){var u=t,l=n,c=e;s=m=_=d=p=b=void 0,a=!1;var s=Array.prototype.slice.call(i,0);if(!f(c)){var d=!0,p=!1,b=void 0;try{for(var h,v=Object.keys(l)[Symbol.iterator]();!(d=(h=v.next()).done);d=!0){var g=h.value;"object"==typeof l[g]&&f(u[g])?u[g]=o(u[g],l[g]):u[g]=l[g]}}catch(y){p=!0,b=y}finally{try{!d&&v["return"]&&v["return"]()}finally{if(p)throw b}}return u}var m=s.pop(),_=o.apply(r,s);r=void 0,i=[t=_,n=m,e=void 0],a=!0}}Object.defineProperty(n,"__esModule",{value:!0}),n.starts_with=e,n.ends_with=r,n.repeat=i,n.is_blank=a,n.zip=u,n.extend=o;var f=function(t){return"undefined"!=typeof t};n.exists=f},function(t,n,e){"use strict";function r(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}(),a=e(1),u=function(){function t(n){r(this,t),this.tab=n}return i(t,[{key:"reduce_indentation",value:function(t){var n=arguments.length<=1||void 0===arguments[1]?1:arguments[1];return t.substring(this.tab.symbol.length*n)}},{key:"calculate_indentation",value:function(t){var n=t.match(this.tab.regexp);return n?n[0].length/this.tab.symbol.length:0}},{key:"extract_tabulation",value:function(t){var n=this;t=t.map(function(t,n){return{line:t,index:n}}).filter(function(t){return!a.is_blank(t.line)}),t.forEach(function(t){if(t.original_line=t.line,t.tabs=n.calculate_indentation(t.line),t.line=n.reduce_indentation(t.line,t.tabs),a.starts_with(t.line," "))throw new Error("Invalid indentation (some extra leading spaces) at line "+t.index+': "'+t.original_line+'"')});var e=t.reduce(function(t,n){return Math.min(t,n.tabs)},1/0);if(0===e?t.forEach(function(t){t.tabs++}):e>1&&t.forEach(function(t){t.tabs-=e-1}),1!==t[0].tabs)throw new Error("Invalid indentation at line "+t[0].index+': "'+t[0].original_line+'"');return t}}]),t}();n["default"]=u,u.determine_tabulation=function(t){function n(t){var n=0;return t.replace(/^( )+/g,function(t){n=t.length}),n}var e=function(t){return t[0]-t[1]};if(t=t.filter(function(t){return!a.is_blank(t)}),t.length<2)throw new Error("Couldn't decide on tabulation type. Not enough lines.");if(a.starts_with(t[1],"	")){var r={symbol:"	",regexp:new RegExp("^(	)+","g")};return r}var i=Math.abs(e(t.slice(0,2).map(n)));if(0===i)throw new Error("Couldn't decide on tabulation type. Invalid tabulation.");var u=a.repeat(" ",i),o={symbol:u,regexp:new RegExp("^("+u+")+","g")};return o},t.exports=n["default"]}])});
//# sourceMappingURL=react-styling.minified.js.map