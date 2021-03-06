/* baobab.js - Version: 1.1.0 - Author: Yomguithereal (Guillaume Plique) */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Baobab=t()}}(function(){var t;return function e(t,r,n){function i(s,a){if(!r[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var c=r[s]={exports:{}};t[s][0].call(c.exports,function(e){var r=t[s][1][e];return i(r?r:e)},c,c.exports,e,t,r,n)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(t,e,r){var n=t("./src/baobab.js"),i=t("./src/cursor.js"),o=t("./src/facet.js"),s=t("./src/helpers.js");Object.defineProperty(n,"version",{value:"1.1.0"}),n.Cursor=i,n.Facet=o,n.getIn=s.getIn,e.exports=n},{"./src/baobab.js":4,"./src/cursor.js":5,"./src/facet.js":6,"./src/helpers.js":7}],2:[function(t,e,r){e.exports={autoCommit:!0,asynchronous:!0,facets:{},immutable:!1,validate:null,validationBehavior:"rollback",syncwrite:!1}},{}],3:[function(e,r,n){(function(){"use strict";function e(t,e){var r,n={};for(r in t)n[r]=t[r];for(r in e)n[r]=e[r];return n}function i(t){return!(!t||"object"!=typeof t||Array.isArray(t)||t instanceof Function||t instanceof RegExp)}function o(t,e){t=t||[];var r,n,i=[];for(n=0,r=t.length;r>n;n++)t[n].fn!==e&&i.push(t[n]);return i}var s={once:"boolean",scope:"object"},a=0,u=function(){this._enabled=!0,this.unbindAll()};u.prototype.unbindAll=function(){return this._handlers={},this._handlersAll=[],this._handlersComplex=[],this},u.prototype.on=function(t,e,r){var n,o,u,h,c,l,f;if(i(t)){for(h in t)this.on(h,t[h],e);return this}for("function"==typeof t&&(r=e,e=t,t=null),c=[].concat(t),n=0,o=c.length;o>n;n++){if(h=c[n],f={order:a++,fn:e},"string"==typeof h)this._handlers[h]||(this._handlers[h]=[]),l=this._handlers[h];else if(h instanceof RegExp)l=this._handlersComplex,f.pattern=h;else{if(null!==h)throw Error("Emitter.on: invalid event.");l=this._handlersAll}for(u in r||{})s[u]&&(f[u]=r[u]);f.once&&(f.parent=l),l.push(f)}return this},u.prototype.once=function(){var t=Array.prototype.slice.call(arguments),r=t.length-1;return i(t[r])&&t.length>1?t[r]=e(t[r],{once:!0}):t.push({once:!0}),this.on.apply(this,t)},u.prototype.off=function(t,e){var r,n,s,a;if(1===arguments.length&&"function"==typeof t){e=arguments[0];for(s in this._handlers)this._handlers[s]=o(this._handlers[s],e),0===this._handlers[s].length&&delete this._handlers[s];this._handlersAll=o(this._handlersAll,e),this._handlersComplex=o(this._handlersComplex,e)}else if(1===arguments.length&&"string"==typeof t)delete this._handlers[t];else if(2===arguments.length){var u=[].concat(t);for(r=0,n=u.length;n>r;r++)a=u[r],this._handlers[a]=o(this._handlers[a],e),0===(this._handlers[a]||[]).length&&delete this._handlers[a]}else if(i(t))for(s in t)this.off(s,t[s]);return this},u.prototype.listeners=function(t){var e,r,n,i=this._handlersAll||[],o=!1;if(!t)throw Error("Emitter.listeners: no event provided.");for(i=i.concat(this._handlers[t]||[]),r=0,n=this._handlersComplex.length;n>r;r++)e=this._handlersComplex[r],~t.search(e.pattern)&&(o=!0,i.push(e));return this._handlersAll.length||o?i.sort(function(t,e){return t.order-e.order}):i.slice(0)},u.prototype.emit=function(t,e){if(!this._enabled)return this;if(i(t)){for(var r in t)this.emit(r,t[r]);return this}var n,o,s,a,u,h,c,l=[].concat(t),f=[];for(a=0,h=l.length;h>a;a++){for(o=this.listeners(l[a]),u=0,c=o.length;c>u;u++)s=o[u],n={type:l[a],target:this},arguments.length>1&&(n.data=e),s.fn.call("scope"in s?s.scope:this,n),s.once&&f.push(s);for(u=f.length-1;u>=0;u--)f[u].parent.splice(f[u].parent.indexOf(f[u]),1)}return this},u.prototype.kill=function(){this.unbindAll(),this._handlers=null,this._handlersAll=null,this._handlersComplex=null,this._enabled=!1},u.prototype.disable=function(){return this._enabled=!1,this},u.prototype.enable=function(){return this._enabled=!0,this},u.version="3.0.0","undefined"!=typeof n?("undefined"!=typeof r&&r.exports&&(n=r.exports=u),n.Emitter=u):"function"==typeof t&&t.amd?t("emmett",[],function(){return u}):this.Emitter=u}).call(this)},{}],4:[function(t,e,r){function n(t,e){function r(t){this[t]=function(){var e=this.root[t].apply(this.root,arguments);return e instanceof i?this:e}}if(arguments.length<1&&(t={}),!(this instanceof n))return new n(t,e);if(!l.Object(t)&&!l.Array(t))throw Error("Baobab: invalid data.");if(o.call(this),this.options=a.shallowMerge(c,e),this._transaction={},this._future=void 0,this._cursors={},this._identity="[object Baobab]",this.log=[],this.previousData=null,this.data=t,this.root=this.select(),this.facets={},this.options.immutable&&a.deepFreeze(this.data),["get","set","unset","update"].forEach(r.bind(this)),!l.Object(this.options.facets))throw Error("Baobab: invalid facets.");for(var s in this.options.facets)this.addFacet(s,this.options.facets[s])}var i=t("./cursor.js"),o=t("emmett"),s=t("./facet.js"),a=t("./helpers.js"),u=t("./update.js"),h=t("./merge.js"),c=t("../defaults.js"),l=t("./type.js"),f=function(){var t=0;return function(){return t++}}();a.inherits(n,o),n.prototype.addFacet=function(t,e,r){return this.facets[t]=this.createFacet(e,r),this},n.prototype.createFacet=function(t,e){return new s(this,t,e)},n.prototype.select=function(t){if(t=t||[],arguments.length>1&&(t=a.arrayOf(arguments)),!l.Path(t))throw Error("Baobab.select: invalid path.");t=[].concat(t);var e,r=t.map(function(t){return l.Function(t)||l.Object(t)?"$"+f()+"$":t}).join("|λ|");return this._cursors[r]?e=this._cursors[r]:(e=new i(this,t,r),this._cursors[r]=e),this.emit("select",{path:t,cursor:e}),e},n.prototype.stack=function(t,e){var r=this;if(!l.Object(t))throw Error("Baobab.update: wrong specification.");if(this.previousData||(this.previousData=this.data),this.options.syncwrite){var n=u(this.data,t,this.options);this.data=n.data,this.log=[].concat(this.log).concat(n.log)}else this._transaction=e&&!Object.keys(this._transaction).length?t:h(this._transaction,t);return this.options.autoCommit?this.options.asynchronous?(this._future||(this._future=setTimeout(r.commit.bind(r,null),0)),this):this.commit():this},n.prototype.commit=function(){if(this._future&&(this._future=clearTimeout(this._future)),!this.options.syncwrite){var t=u(this.data,this._transaction,this.options);this.data=t.data,this.log=t.log}this._transaction={};var e=this.options.validate,r=this.options.validationBehavior;if("function"==typeof e){var n=e.call(this,this.previousData,this.data,this.log);if(n instanceof Error&&(this.emit("invalid",{error:n}),"rollback"===r))return this.data=this.previousData,this}return this.emit("update",{log:this.log,previousData:this.previousData,data:this.data}),this.log=[],this.previousData=null,this},n.prototype.release=function(){var t;delete this.data,delete this._transaction;for(t in this._cursors)this._cursors[t].release();delete this._cursors;for(t in this.facets)this.facets[t].release();delete this.facets,this.kill()},n.prototype.toJSON=function(){return this.get()},n.prototype.toString=function(){return this._identity},e.exports=n},{"../defaults.js":2,"./cursor.js":5,"./facet.js":6,"./helpers.js":7,"./merge.js":8,"./type.js":9,"./update.js":10,emmett:3}],5:[function(t,e,r){function n(t,e,r){function n(t){var e=a.getIn(t,i.solvedPath,i.tree);return i.recording&&!i.undoing&&i.archive.add(e),i.undoing=!1,i.emit("update",{data:i.get(!1),previousData:e})}var i=this;s.call(this),e=e||[],this._identity="[object Cursor]",this._additionnalPaths=[],this.tree=t,this.path=e,this.hash=r,this.archive=null,this.recording=!1,this.undoing=!1,this.complex=u.ComplexPath(e),this.solvedPath=e,this.complex&&(this.solvedPath=a.solvePath(this.tree.data,e,this.tree)),this.complex&&e.forEach(function(t){u.Object(t)&&"$cursor"in t&&this._additionnalPaths.push(t.$cursor)},this),this.relevant=void 0!==this.get(!1),this.updateHandler=function(t){var e=t.data.log,r=t.data.previousData,o=!1;if(i.complexPath&&(i.solvedPath=a.solvePath(i.tree.data,i.path,i.tree)),!i.path.length)return n(r);i.solvedPath&&(o=a.solveUpdate(e,[i.solvedPath].concat(i._additionnalPaths)));var s=void 0!==i.get(!1);i.relevant?s&&o?n(r):s||(i.emit("irrelevant"),i.relevant=!1):s&&o&&(i.emit("relevant"),n(r),i.relevant=!0)};var o=!1;this._lazyBind=function(){o||(o=!0,i.tree.on("update",i.updateHandler))},this.on=a.before(this._lazyBind,this.on.bind(this)),this.once=a.before(this._lazyBind,this.once.bind(this)),this.complexPath&&this._lazyBind()}function i(t,e,r,n){if(arguments.length>5)throw Error("baobab.Cursor."+t+": too many arguments.");if("unset"===t?(n=!0,2===arguments.length&&(r=[])):arguments.length<4&&(n=r,r=[]),!u.Path(r))throw Error("baobab.Cursor."+t+': invalid path "'+r+'".');if("splice"===t&&!u.Splicer(n)){if(!u.Array(n))throw Error("baobab.Cursor.splice: incorrect value.");n=[n]}if(e&&!e(n))throw Error("baobab.Cursor."+t+": incorrect value.");var i=[].concat(r),o=a.solvePath(this.get(!1),i,this.tree);if(!o)throw Error("baobab.Cursor."+t+": could not solve dynamic path.");var s={};s["$"+t]=n;var h=a.pathObject(o,s);return h}function o(t,e){n.prototype[t]=function(){var r=i.bind(this,t,e).apply(this,arguments);return this.update(r,!0)}}var s=t("emmett"),a=t("./helpers.js"),u=(t("../defaults.js"),t("./type.js"));a.inherits(n,s),n.prototype.isRoot=function(){return!this.path.length},n.prototype.isLeaf=function(){return u.Primitive(this.get(!1))},n.prototype.isBranch=function(){return!this.isLeaf()&&!this.isRoot()},n.prototype.root=function(){return this.tree.root()},n.prototype.select=function(t){if(arguments.length>1&&(t=a.arrayOf(arguments)),!u.Path(t))throw Error("baobab.Cursor.select: invalid path.");return this.tree.select(this.path.concat(t))},n.prototype.up=function(){return this.solvedPath&&this.solvedPath.length?this.tree.select(this.path.slice(0,-1)):null},n.prototype.left=function(){var t=+this.solvedPath[this.solvedPath.length-1];if(isNaN(t))throw Error("baobab.Cursor.left: cannot go left on a non-list type.");return t?this.tree.select(this.solvedPath.slice(0,-1).concat(t-1)):null},n.prototype.leftmost=function(){var t=+this.solvedPath[this.solvedPath.length-1];if(isNaN(t))throw Error("baobab.Cursor.leftmost: cannot go left on a non-list type.");return this.tree.select(this.solvedPath.slice(0,-1).concat(0))},n.prototype.right=function(){var t=+this.solvedPath[this.solvedPath.length-1];if(isNaN(t))throw Error("baobab.Cursor.right: cannot go right on a non-list type.");return t+1===this.up().get(!1).length?null:this.tree.select(this.solvedPath.slice(0,-1).concat(t+1))},n.prototype.rightmost=function(){var t=+this.solvedPath[this.solvedPath.length-1];if(isNaN(t))throw Error("baobab.Cursor.right: cannot go right on a non-list type.");var e=this.up().get(!1);return this.tree.select(this.solvedPath.slice(0,-1).concat(e.length-1))},n.prototype.down=function(){+this.solvedPath[this.solvedPath.length-1];return this.get(!1)instanceof Array?this.tree.select(this.solvedPath.concat(0)):null},n.prototype.map=function(t,e){var r=this.get(!1),n=arguments.length;if(!u.Array(r))throw Error("baobab.Cursor.map: cannot map a non-list type.");return r.map(function(r,i){return t.call(n>1?e:this,this.select(i),i)},this)},n.prototype.get=function(t){var e=!1;t===!1&&(t=[],e=!0),arguments.length>1&&(t=a.arrayOf(arguments));var r=this.solvedPath.concat([].concat(t||0===t?t:[])),n=a.getIn(this.tree.data,r,this.tree);return e||this.tree.emit("get",{path:r,data:n}),n},o("set"),o("apply",u.Function),o("chain",u.Function),o("push"),o("unshift"),o("merge",u.Object),o("splice"),n.prototype.unset=function(t){if(void 0===t&&this.isRoot())throw Error("baobab.Cursor.unset: cannot remove root node.");var e=i.bind(this,"unset",null).apply(this,arguments);return this.update(e,!0)},n.prototype.update=function(t,e){if(!u.Object(t))throw Error("baobab.Cursor.update: invalid specifications.");return this.tree.stack(a.pathObject(this.solvedPath,t),e),this},n.prototype.startRecording=function(t){if(t=t||5,1>t)throw Error("baobab.Cursor.startRecording: invalid maximum number of records.");return this.archive?this:(this._lazyBind(),this.archive=a.archive(t),this.recording=!0,this)},n.prototype.stopRecording=function(){return this.recording=!1,this},n.prototype.undo=function(t){if(t=t||1,!this.recording)throw Error("baobab.Cursor.undo: cursor is not recording.");if(!u.PositiveInteger(t))throw Error("baobab.Cursor.undo: expecting a positive integer.");var e=this.archive.back(t);if(!e)throw Error("boabab.Cursor.undo: cannot find a relevant record ("+t+" back).");return this.undoing=!0,this.set(e)},n.prototype.hasHistory=function(){return!(!this.archive||!this.archive.get().length)},n.prototype.getHistory=function(){return this.archive?this.archive.get():[]},n.prototype.clearHistory=function(){return this.archive=null,this},n.prototype.release=function(){this.tree.off("update",this.updateHandler),this.hash&&delete this.tree._cursors[this.hash],delete this.tree,delete this.path,delete this.solvedPath,delete this.archive,this.kill()},n.prototype.toJSON=function(){return this.get()},n.prototype.toString=function(){return this._identity},e.exports=n},{"../defaults.js":2,"./helpers.js":7,"./type.js":9,emmett:3}],6:[function(t,e,r){function n(t,e,r){function u(e,r,i,s,u){if(e||f){p=!1;var h=r;if(e&&(h=r.apply(this,u)),!s(h))throw Error("baobab.Facet: incorrect "+i+" mapping.");l[i]={},Object.keys(h).forEach(function(e){if("cursors"===i){if(h[e]instanceof o)return void(l.cursors[e]=h[e]);if(a.Path(h[e]))return void(l.cursors[e]=t.select(h[e]))}else{if(h[e]instanceof n)return void(l.facets[e]=h[e]);if("string"==typeof h[e]){if(l.facets[e]=t.facets[h[e]],!l.facets[e])throw Error('baobab.Facet: unkown "'+h[e]+'" facet in facets mapping.');return}}})}}function h(t){return Object.keys(t).map(function(e){return t[e].solvedPath})}function c(t){var e=Object.keys(t).map(function(e){return h(t[e].cursors)});return[].concat.apply([],e)}var l=this,f=!0,p=!1,d=e.get,y=null;i.call(this),this.killed=!1,this.tree=t,this.cursors={},this.facets={};var g=e.cursors,v=e.facets,b="function"==typeof e.cursors,m="function"==typeof e.facets;this.refresh=function(t){if(t=t||[],!a.Array(t))throw Error("baobab.Facet.refresh: first argument should be an array.");g&&u(b,g,"cursors",a.FacetCursors,t),v&&u(m,v,"facets",a.FacetFacets,t)},this.get=function(){if(p)return y;var t,e={};for(t in l.facets)e[t]=l.facets[t].get();for(t in l.cursors)e[t]=l.cursors[t].get();return e="function"==typeof d?d.call(l,e):e,p=!0,y=e},this.updateHandler=function(t){if(!l.killed){var e=h(l.cursors).concat(c(l.facets));s.solveUpdate(t.data.log,e)&&(p=!1,l.emit("update"))}},this.refresh(r),this.tree.on("update",this.updateHandler),f=!1}var i=t("emmett"),o=t("./cursor.js"),s=t("./helpers.js"),a=t("./type.js");s.inherits(n,i),n.prototype.release=function(){this.tree.off("update",this.updateHandler),this.tree=null,this.cursors=null,this.facets=null,this.killed=!0,this.kill()},e.exports=n},{"./cursor.js":5,"./helpers.js":7,"./type.js":9,emmett:3}],7:[function(t,e,r){(function(r){function n(t){return Array.prototype.slice.call(t)}function i(t,e){return function(){t.apply(null,arguments),e.apply(null,arguments)}}function o(t,e,r){var i=n(arguments).slice(3);return t.slice(0,e).concat(i).concat(t.slice(e+r))}function s(t,e){var r,n={};for(r in t)n[r]=t[r];for(r in e)n[r]=e[r];return n}function a(t){var e=t.source,r="";return t.global&&(r+="g"),t.multiline&&(r+="m"),t.ignoreCase&&(r+="i"),t.sticky&&(r+="y"),t.unicode&&(r+="u"),new RegExp(e,r)}function u(t,e){if(!e||"object"!=typeof e||e instanceof Error||"ArrayBuffer"in r&&e instanceof ArrayBuffer)return e;if($.Array(e)){if(t){var n,i,o=[];for(n=0,i=e.length;i>n;n++)o.push(O(e[n]));return o}return e.slice(0)}if($.Date(e))return new Date(e.getTime());if(e instanceof RegExp)return a(e);if($.Object(e)){var s,u={};e.constructor&&e.constructor!==Object&&(u=Object.create(e.constructor.prototype));for(s in e)e.hasOwnProperty(s)&&(u[s]=t?O(e[s]):e[s]);return u}return e}function h(t,e){if("object"==typeof e&&(Object.freeze(e),t))if(Array.isArray(e)){var r,n;for(r=0,n=e.length;n>r;r++)A(e[r])}else{var i,o;for(o in e)i=e[o],i&&e.hasOwnProperty(o)&&"object"==typeof i&&!Object.isFrozen(i)&&A(i)}}function c(t,e){return function(r){return e(t(r))}}function l(t,e){var r,n;for(r=0,n=t.length;n>r;r++)if(e(t[r]))return t[r]}function f(t,e){var r,n;for(r=0,n=t.length;n>r;r++)if(e(t[r]))return r;return-1}function d(t,e){var r,n=!0;if(!t)return!1;for(r in e)if($.Object(e[r]))n=n&&d(t[r],e[r]);else if($.Array(e[r]))n=n&&!!~e[r].indexOf(t[r]);else if(t[r]!==e[r])return!1;return n}function y(t,e){return l(t,function(t){return d(t,e)})}function g(t,e){return f(t,function(t){return d(t,e)})}function v(t,e,r){e=e||[];var n,i,o,s=t;for(i=0,o=e.length;o>i;i++){if(!s)return;if("function"==typeof e[i]){if(!$.Array(s))return;s=l(s,e[i])}else if("object"==typeof e[i])if(r&&"$cursor"in e[i]){if(!$.Path(e[i].$cursor))throw Error("baobab.getIn: $cursor path must be an array.");n=r.get(e[i].$cursor),s=s[n]}else{if(!$.Array(s))return;s=y(s,e[i])}else s=s[e[i]]}return s}function b(t,e,r){var n,i,o,s=[],a=t;for(i=0,o=e.length;o>i;i++){if(!a)return null;if("function"==typeof e[i]){if(!$.Array(a))return;n=f(a,e[i]),s.push(n),a=a[n]}else if("object"==typeof e[i])if(r&&"$cursor"in e[i]){if(!$.Path(e[i].$cursor))throw Error("baobab.getIn: $cursor path must be an array.");p=r.get(e[i].$cursor),s.push(p),a=a[p]}else{if(!$.Array(a))return;n=g(a,e[i]),s.push(n),a=a[n]}else s.push(e[i]),a=a[e[i]]||{}}return s}function m(t,e){var r,n,i,o,s,a,u,h,c;for(r=0,o=e.length;o>r;r++){if(u=e[r],!u.length)return!0;for(n=0,s=t.length;s>n;n++){if(h=t[n],!h.length)return!0;for(i=0,a=h.length;a>i&&(c=h[i],c==u[i]);i++)if(i+1===a||i+1===u.length)return!0}}return!1}function j(t,e){var r,n=t.length,i={},o=i;for(n||(i=e),r=0;n>r;r++)o[t[r]]=r+1===n?e:{},o=o[t[r]];return i}function _(t,e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}function w(t){var e=[];return{add:function(r){e.unshift(r),e.length>t&&(e.length=t)},back:function(t){var r=e[t-1];return r&&(e=e.slice(t)),r},get:function(){return e}}}var $=t("./type.js"),P=u.bind(null,!1),O=u.bind(null,!0),E=Object.freeze?h.bind(null,!1):Function.prototype,A=Object.freeze?h.bind(null,!0):Function.prototype;e.exports={archive:w,arrayOf:n,before:i,freeze:E,deepClone:O,deepFreeze:A,shallowClone:P,shallowMerge:s,compose:c,getIn:v,inherits:_,pathObject:j,solvePath:b,solveUpdate:m,splice:o}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./type.js":9}],8:[function(t,e,r){function n(t,e){var r={};return r[t]=e,r}function i(t,e){var r,u=o.shallowClone(t||{}),h=!1;if(a.forEach(function(t){t in e&&(u=n(t,e[t]),h=!0)}),e.$chain&&(u.$apply=u.$apply?o.compose(u.$apply,e.$chain):e.$chain,u=n("$apply",u.$apply),h=!0),e.$merge&&(u.$merge=o.shallowMerge(u.$merge||{},e.$merge),h=!0),(e.$splice||e.$splice)&&(u.$splice=[].concat(u.$splice||[]).concat(e.$splice||[]),h=!0),(e.$push||u.$push)&&(u.$push=[].concat(u.$push||[]).concat(e.$push||[]),h=!0),(e.$unshift||u.$unshift)&&(u.$unshift=[].concat(e.$unshift||[]).concat(u.$unshift||[]),h=!0),h)return u;for(r in u)"$"===r.charAt(0)&&delete u[r];for(r in e)s.Object(e[r])&&(u[r]=i(u[r],e[r]));return u}var o=t("./helpers.js"),s=t("./type.js"),a=["$unset","$set","$apply"];e.exports=i},{"./helpers.js":7,"./type.js":9}],9:[function(t,e,r){function n(t,e){return e.some(function(e){return i[e](t)})}var i={};i.Array=function(t){return Array.isArray(t)},i.Object=function(t){return!(!t||"object"!=typeof t||Array.isArray(t)||t instanceof Date||t instanceof RegExp)},i.String=function(t){return"string"==typeof t},i.Number=function(t){return"number"==typeof t},i.PositiveInteger=function(t){return"number"==typeof t&&t>0&&t%1===0},i.Function=function(t){return"function"==typeof t},i.Primitive=function(t){return t!==Object(t)},i.Date=function(t){return t instanceof Date},i.NonScalar=function(t){return i.Object(t)||i.Array(t)},i.Splicer=function(t){return i.Array(t)&&t.every(i.Array)},i.Path=function(t,e){return e=e||["String","Number","Function","Object"],i.Array(t)?t.every(function(t){return n(t,e)}):n(t,e)},i.ComplexPath=function(t){return t.some(function(t){return n(t,["Object","Function"])})},i.FacetCursors=function(e){return i.Object(e)?Object.keys(e).every(function(r){var n=e[r];return i.Path(n,["String","Number","Object"])||n instanceof t("./cursor.js")}):!1},i.FacetFacets=function(e){return i.Object(e)?Object.keys(e).every(function(r){var n=e[r];return"string"==typeof n||n instanceof t("./facet.js")}):!1},e.exports=i},{"./cursor.js":5,"./facet.js":6}],10:[function(t,e,r){function n(t,e){var r=new Error("baobab.update: "+e+" at path /"+t.slice(1).join("/"));return r.path=t,r}var i=t("./helpers.js"),o=t("./type.js");e.exports=function(t,e,r){r=r||{};var s={};t={root:i.shallowClone(t)};var a=function(t,e,u,h){u=u||["root"];var c,l,f,p,d,y=u.join("|λ|"),g=u[u.length-1],v=t[g],b=Object.keys(e).some(function(t){return"$"===t.charAt(0)});if(b){s[y]=!0;for(l in e){if("$unset"===l){var m=u[u.length-2];if(!o.Object(h[m]))throw n(u.slice(0,-1),"using command $unset on a non-object");h[m]=i.shallowClone(t),delete h[m][g],r.immutable&&i.freeze(h[m]);break}if("$set"===l)f=e.$set,t[g]=f;else if("$apply"===l||"$chain"===l){if(c=e.$apply||e.$chain,"function"!=typeof c)throw n(u,"using command $apply with a non function");t[g]=c.call(null,v)}else if("$merge"===l){if(f=e.$merge,!o.Object(t[g])||!o.Object(f))throw n(u,"using command $merge with a non object");t[g]=i.shallowMerge(t[g],f)}if("$splice"===l){if(f=e.$splice,!o.Array(t[g]))throw n(u,"using command $push to a non array");for(p=0,d=f.length;d>p;p++)t[g]=i.splice.apply(null,[t[g]].concat(f[p]))}if("$push"===l){if(f=e.$push,!o.Array(t[g]))throw n(u,"using command $push to a non array");t[g]=t[g].concat(f)}if("$unshift"===l){if(f=e.$unshift,!o.Array(t[g]))throw n(u,"using command $unshift to a non array");t[g]=[].concat(f).concat(t[g])}r.immutable&&i.deepFreeze(t)}}else{t[g]=o.Primitive(t[g])?{}:i.shallowClone(t[g]),r.immutable&&i.freeze(t);for(l in e)a(t[g],e[l],u.concat(l),t)}};return a(t,e),{data:t.root,log:Object.keys(s).map(function(t){return t.split("|λ|").slice(1)})}}},{"./helpers.js":7,"./type.js":9}]},{},[1])(1)});;(function() {
  var Fe, IronShirt, mod,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mod = angular.module('angular-iron', []);

  Fe = (function() {
    function Fe(tree1, templateRoot1) {
      this.tree = tree1;
      this.templateRoot = templateRoot1;
      this.dress = bind(this.dress, this);
    }

    Fe.prototype.dress = function(scope, facetName, renderMethod) {
      return angular.extend(this.dress.caller, new IronShirt(this.tree, facetName, scope, renderMethod));
    };

    return Fe;

  })();

  mod.provider('Fe', function() {
    var config, templateRoot;
    config = {
      data: {},
      options: {}
    };
    templateRoot = '';
    this.setTreeConfig = (function(_this) {
      return function(cfg) {
        return config = cfg;
      };
    })(this);
    this.setTemplateRoot = (function(_this) {
      return function(root) {
        return templateRoot = root;
      };
    })(this);
    this.$get = [
      'baobab', function(baobab) {
        var fe, stateTree;
        stateTree = baobab.create(config.data, config.options);
        return fe = new Fe(stateTree, templateRoot);
      }
    ];
    return this;
  });

  IronShirt = (function() {
    function IronShirt(tree, facet, $scope, renderMethod) {
      this.stateChanged = bind(this.stateChanged, this);
      var ironState;
      if (renderMethod) {
        this.renderMethod = renderMethod;
      } else {
        this.renderMethod = (function(_this) {
          return function(state) {
            var key, results, value;
            results = [];
            for (key in state) {
              value = state[key];
              results.push($scope[key] = value);
            }
            return results;
          };
        })(this);
      }
      if (tree.facets[facet]) {
        ironState = tree.facets[facet];
      } else {
        ironState = tree.select(facet);
      }
      this.renderMethod(ironState.get());
      ironState.on('update', this.stateChanged);
      $scope.$on('$destroy', (function(_this) {
        return function() {
          return ironState.off('update', _this.stateChanged);
        };
      })(this));
    }

    IronShirt.prototype.stateChanged = function(event) {
      var state;
      state = event.target.get();
      return this.renderMethod(state);
    };

    return IronShirt;

  })();

  mod.directive('feShirt', [
    'Fe', function(Fe) {
      return {
        restrict: 'AE',
        scope: {
          actions: '='
        },
        link: function(scope, element, attrs) {
          var facetName, render;
          console.log('Link Fe.Shirt', scope, element, attrs);
          facetName = attrs.path || attrs.feShirt;
          if (!facetName) {
            console.error('facet / cursor name must be supplied', scope, element, attrs);
          }
          render = function(state) {
            var key, results, value;
            results = [];
            for (key in state) {
              value = state[key];
              results.push(scope[key] = value);
            }
            return results;
          };
          return Fe.dress(scope, facetName, render);
        },
        templateUrl: function(element, attrs) {
          var templateName;
          console.log('Template Fe.Shirt', element, attrs);
          templateName = attrs.template || attrs.path || attrs.feShirt;
          if (!templateName) {
            console.error('No template or path attribute supplied');
            throw new Error();
          }
          if (templateName.indexOf('html') === -1) {
            templateName += '.html';
          }
          return Fe.templateRoot + templateName;
        }
      };
    }
  ]);

}).call(this);
;(function() {
  var BaobabService, mod,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mod = angular.module('angular-iron');

  BaobabService = (function() {
    function BaobabService($rootScope1) {
      this.$rootScope = $rootScope1;
      this.safeDeepClone = bind(this.safeDeepClone, this);
      this.create = bind(this.create, this);
    }

    BaobabService.prototype.create = function(tree, options) {
      var timeoutFn;
      options = options || {};
      options.clone = true;
      options.cloningFunction = function(obj) {
        return this.safeDeepClone('[circular]', [], obj);
      };
      tree = new Baobab(tree, options);
      timeoutFn = (function(_this) {
        return function() {
          return _this.$rootScope.$apply();
        };
      })(this);
      tree.on('update', function() {
        return setTimeout(timeoutFn, 0);
      });
      return tree;
    };

    BaobabService.prototype.safeDeepClone = function(circularValue, refs, obj) {
      var copy;
      if (!obj || 'object' !== typeof obj || obj instanceof Error || obj instanceof ArrayBuffer || obj instanceof Blob || obj instanceof File) {
        return obj;
      }
      if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }
      if (obj instanceof Array || obj.length) {
        refs.push(obj);
        copy = _.map(obj, (function(_this) {
          return function(item) {
            if (refs.indexOf(item) >= 0) {
              return circularValue;
            } else {
              return _this.safeDeepClone(circularValue, refs, item);
            }
          };
        })(this));
        refs.pop();
        return copy;
      }
      refs.push(obj);
      if (obj.constructor && obj.constructor !== Object) {
        copy = Object.create(obj.constructor.prototype);
      } else {
        copy = {};
      }
      _.each(obj, (function(_this) {
        return function(val, attr) {
          if (obj.hasOwnProperty(attr) && attr !== '$$hashKey') {
            if (refs.indexOf(obj[attr]) >= 0) {
              return copy[attr] = circularValue;
            } else {
              return copy[attr] = _this.safeDeepClone(circularValue, refs, obj[attr]);
            }
          }
        };
      })(this));
      refs.pop();
      return copy;
    };

    return BaobabService;

  })();

  mod.provider('baobab', function() {
    return {
      $get: [
        '$rootScope', function($rootScope) {
          return new BaobabService($rootScope);
        }
      ]
    };
  });

}).call(this);
