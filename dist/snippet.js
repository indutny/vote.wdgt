!function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};e.m=t,e.c=r,e.i=function(t){return t},e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=3)}([function(t,e,r){"use strict";!function(t){function e(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function r(t){return"string"!=typeof t&&(t=String(t)),t}function n(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return m.iterable&&(e[Symbol.iterator]=function(){return e}),e}function i(t){this.map={},t instanceof i?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function o(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function s(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function h(t){var e=new FileReader,r=s(e);return e.readAsArrayBuffer(t),r}function a(t){var e=new FileReader,r=s(e);return e.readAsText(t),r}function u(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}function c(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function f(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(m.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(m.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(m.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(m.arrayBuffer&&m.blob&&b(t))this._bodyArrayBuffer=c(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!m.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!_(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=c(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):m.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},m.blob&&(this.blob=function(){var t=o(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?o(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(h)}),this.text=function(){var t=o(this);if(t)return t;if(this._bodyBlob)return a(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(u(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},m.formData&&(this.formData=function(){return this.text().then(d)}),this.json=function(){return this.text().then(JSON.parse)},this}function l(t){var e=t.toUpperCase();return w.indexOf(e)>-1?e:t}function p(t,e){e=e||{};var r=e.body;if(t instanceof p){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new i(t.headers)),this.method=t.method,this.mode=t.mode,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new i(e.headers)),this.method=l(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function d(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),i=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(i))}}),e}function y(t){var e=new i;return t.split(/\r?\n/).forEach(function(t){var r=t.split(":"),n=r.shift().trim();if(n){var i=r.join(":").trim();e.append(n,i)}}),e}function v(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new i(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var m={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(m.arrayBuffer)var g=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],b=function(t){return t&&DataView.prototype.isPrototypeOf(t)},_=ArrayBuffer.isView||function(t){return t&&g.indexOf(Object.prototype.toString.call(t))>-1};i.prototype.append=function(t,n){t=e(t),n=r(n);var i=this.map[t];this.map[t]=i?i+","+n:n},i.prototype.delete=function(t){delete this.map[e(t)]},i.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},i.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},i.prototype.set=function(t,n){this.map[e(t)]=r(n)},i.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},i.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),n(t)},i.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),n(t)},i.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),n(t)},m.iterable&&(i.prototype[Symbol.iterator]=i.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];p.prototype.clone=function(){return new p(this,{body:this._bodyInit})},f.call(p.prototype),f.call(v.prototype),v.prototype.clone=function(){return new v(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new i(this.headers),url:this.url})},v.error=function(){var t=new v(null,{status:0,statusText:""});return t.type="error",t};var L=[301,302,303,307,308];v.redirect=function(t,e){if(-1===L.indexOf(e))throw new RangeError("Invalid status code");return new v(null,{status:e,headers:{location:t}})},t.Headers=i,t.Request=p,t.Response=v,t.fetch=function(t,e){return new Promise(function(r,n){var i=new p(t,e),o=new XMLHttpRequest;o.onload=function(){var t={status:o.status,statusText:o.statusText,headers:y(o.getAllResponseHeaders()||"")};t.url="responseURL"in o?o.responseURL:t.headers.get("X-Request-URL");var e="response"in o?o.response:o.responseText;r(new v(e,t))},o.onerror=function(){n(new TypeError("Network request failed"))},o.ontimeout=function(){n(new TypeError("Network request failed"))},o.open(i.method,i.url,!0),"include"===i.credentials&&(o.withCredentials=!0),"responseType"in o&&m.blob&&(o.responseType="blob"),i.headers.forEach(function(t,e){o.setRequestHeader(e,t)}),o.send(void 0===i._bodyInit?null:i._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!=typeof self?self:void 0)},function(t,e,r){"use strict";function n(t){var e=this;if(!(this instanceof n))return new n(t);var r={elem:"string"==typeof t?document.getElementById(t):t,uri:"https://"+document.location.host+document.location.pathname+document.location.search,id:null,worker:null,voted:!1,ready:!1,params:null};this._state=r,r.id=r.elem.dataset.voteId;var o=new Blob([i],{type:"text/javascript"});r.worker=new Worker(window.URL.createObjectURL(o)),r.worker.onmessage=function(t){var r=t.data,n=r.type,i=r.payload;"id"===n?e._onID(i):"nonce"===n&&e._onNonce(i)},this._init(),r.elem.onclick=function(t){t.preventDefault(),e._vote()}}var i=r(2),o="https://vote.now.sh/api/v1";if(t.exports=n,n.prototype._init=function(){var t=this._state;if(!t.id)return void t.worker.postMessage({type:"id",payload:t.uri});t.elem.classList.add("votenow"),t.elem.disabled=!0,t.elem.classList.add("votenow-loading");var e=function(){t.elem.classList.remove("votenow-loading"),t.elem.classList.add("votenow-ready"),t.voted||(t.elem.disabled=!1),t.ready=!0};fetch(o+"/vote/"+encodeURIComponent(t.id)).then(function(t){return t.json()}).then(function(r){t.params={complexity:r.complexity,prefix:r.prefix},t.elem.textContent=r.votes,e()}),"undefined"!=typeof localStorage&&localStorage.getItem("votenow/v1/"+t.id)&&(t.voted=!0,t.elem.disabled=!0,t.elem.classList.add("votenow-voted"))},n.prototype._vote=function(){var t=this._state;!t.voted&&t.ready&&(t.voted=!0,t.elem.disabled=!0,t.elem.classList.add("votenow-computing"),t.elem.textContent=1+(t.elem.textContent>>>0),t.worker.postMessage({type:"nonce",payload:t.params}))},n.prototype._onID=function(t){this._state.id=t,this._init()},n.prototype._onNonce=function(t){var e=this._state;e.elem.classList.remove("votenow-computing"),e.elem.classList.add("votenow-voting");var r=o+"/vote/"+encodeURIComponent(e.id);fetch(r,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({nonce:t})}).then(function(t){return t.json()}).then(function(t){e.elem.classList.remove("votenow-voting"),e.elem.classList.add("votenow-voted"),"undefined"!=typeof localStorage&&localStorage.setItem("votenow/v1/"+e.id,!0),t.error?e.elem.classList.add("votenow-error"):e.elem.textContent=t.votes})},"undefined"!=typeof window&&(window.VoteNow=n),"undefined"!=typeof document){var s=document.querySelectorAll(".votenow");Array.prototype.slice.call(s).forEach(function(t){return new n(t)})}},function(t,e){t.exports='"use strict";!function(t){function n(r){if(i[r])return i[r].exports;var h=i[r]={i:r,l:!1,exports:{}};return t[r].call(h.exports,h,h.exports,n),h.l=!0,h.exports}var i={};n.m=t,n.c=i,n.i=function(t){return t},n.d=function(t,i,r){n.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:r})},n.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(i,"a",i),i},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=10)}([function(t,n,i){var r=n;r.utils=i(7),r.common=i(3),r.sha=i(6),r.ripemd=i(5),r.hmac=i(4),r.sha1=r.sha.sha1,r.sha256=r.sha.sha256,r.sha224=r.sha.sha224,r.sha384=r.sha.sha384,r.sha512=r.sha.sha512,r.ripemd160=r.ripemd.ripemd160},function(t,n,i){function r(t,n){if(!t)throw new Error(n||"Assertion failed")}t.exports=r,r.equal=function(t,n,i){if(t!=n)throw new Error(i||"Assertion failed: "+t+" != "+n)}},function(t,n,i){function r(t){}var h=(i(1),i(9)),e=h.HAS_BUFFER;t.exports=r,r.prototype._genNonce=function(t){var n=Date.now(),i=n/4294967296>>>0,r=(4294967295&n)>>>0;e?(t.writeUInt32BE(i,0),t.writeUInt32BE(r,4)):(t[0]=i>>>24&255,t[1]=i>>>16&255,t[2]=i>>>8&255,t[3]=255&i,t[4]=r>>>24&255,t[5]=r>>>16&255,t[6]=r>>>8&255,t[7]=255&r);var h=8,o=h+4*((t.length-h)/4|0);if(e)for(;h<o;h+=4)t.writeUInt32LE(4294967296*Math.random()>>>0,h,!0);for(;h<t.length;h++)t[h]=256*Math.random()>>>0},r.prototype.solve=function(t,n){for(var i=h.allocBuffer(16);;){this._genNonce(i);var r=h.hash(i,n);if(h.checkComplexity(r,t))return i}}},function(t,n,i){function r(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian="big",this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}var h=i(0),e=h.utils,o=e.assert;n.BlockHash=r,r.prototype.update=function(t,n){if(t=e.toArray(t,n),this.pending?this.pending=this.pending.concat(t):this.pending=t,this.pendingTotal+=t.length,this.pending.length>=this._delta8){t=this.pending;var i=t.length%this._delta8;this.pending=t.slice(t.length-i,t.length),0===this.pending.length&&(this.pending=null),t=e.join32(t,0,t.length-i,this.endian);for(var r=0;r<t.length;r+=this._delta32)this._update(t,r,r+this._delta32)}return this},r.prototype.digest=function(t){return this.update(this._pad()),o(null===this.pending),this._digest(t)},r.prototype._pad=function(){var t=this.pendingTotal,n=this._delta8,i=n-(t+this.padLength)%n,r=new Array(i+this.padLength);r[0]=128;for(var h=1;h<i;h++)r[h]=0;if(t<<=3,"big"===this.endian){for(var e=8;e<this.padLength;e++)r[h++]=0;r[h++]=0,r[h++]=0,r[h++]=0,r[h++]=0,r[h++]=t>>>24&255,r[h++]=t>>>16&255,r[h++]=t>>>8&255,r[h++]=255&t}else{r[h++]=255&t,r[h++]=t>>>8&255,r[h++]=t>>>16&255,r[h++]=t>>>24&255,r[h++]=0,r[h++]=0,r[h++]=0,r[h++]=0;for(var e=8;e<this.padLength;e++)r[h++]=0}return r}},function(t,n,i){function r(t,n,i){if(!(this instanceof r))return new r(t,n,i);this.Hash=t,this.blockSize=t.blockSize/8,this.outSize=t.outSize/8,this.inner=null,this.outer=null,this._init(e.toArray(n,i))}var h=i(0),e=h.utils,o=e.assert;t.exports=r,r.prototype._init=function(t){t.length>this.blockSize&&(t=(new this.Hash).update(t).digest()),o(t.length<=this.blockSize);for(var n=t.length;n<this.blockSize;n++)t.push(0);for(var n=0;n<t.length;n++)t[n]^=54;this.inner=(new this.Hash).update(t);for(var n=0;n<t.length;n++)t[n]^=106;this.outer=(new this.Hash).update(t)},r.prototype.update=function(t,n){return this.inner.update(t,n),this},r.prototype.digest=function(t){return this.outer.update(this.inner.digest()),this.outer.digest(t)}},function(t,n,i){function r(){if(!(this instanceof r))return new r;p.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.endian="little"}function h(t,n,i,r){return t<=15?n^i^r:t<=31?n&i|~n&r:t<=47?(n|~i)^r:t<=63?n&r|i&~r:n^(i|~r)}function e(t){return t<=15?0:t<=31?1518500249:t<=47?1859775393:t<=63?2400959708:2840853838}function o(t){return t<=15?1352829926:t<=31?1548603684:t<=47?1836072691:t<=63?2053994217:0}var s=i(0),u=s.utils,a=u.rotl32,c=u.sum32,f=u.sum32_3,l=u.sum32_4,p=s.common.BlockHash;u.inherits(r,p),n.ripemd160=r,r.blockSize=512,r.outSize=160,r.hmacStrength=192,r.padLength=64,r.prototype._update=function(t,n){for(var i=this.h[0],r=this.h[1],s=this.h[2],u=this.h[3],p=this.h[4],m=i,y=r,S=s,b=u,w=p,x=0;x<80;x++){var k=c(a(l(i,h(x,r,s,u),t[g[x]+n],e(x)),v[x]),p);i=p,p=u,u=a(s,10),s=r,r=k,k=c(a(l(m,h(79-x,y,S,b),t[d[x]+n],o(x)),_[x]),w),m=w,w=b,b=a(S,10),S=y,y=k}k=f(this.h[1],s,b),this.h[1]=f(this.h[2],u,w),this.h[2]=f(this.h[3],p,m),this.h[3]=f(this.h[4],i,y),this.h[4]=f(this.h[0],r,S),this.h[0]=k},r.prototype._digest=function(t){return"hex"===t?u.toHex32(this.h,"little"):u.split32(this.h,"little")};var g=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],d=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],v=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],_=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]},function(t,n,i){function r(){if(!(this instanceof r))return new r;J.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=K,this.W=new Array(64)}function h(){if(!(this instanceof h))return new h;r.call(this),this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]}function e(){if(!(this instanceof e))return new e;J.call(this),this.h=[1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209],this.k=Q,this.W=new Array(160)}function o(){if(!(this instanceof o))return new o;e.call(this),this.h=[3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]}function s(){if(!(this instanceof s))return new s;J.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.W=new Array(80)}function u(t,n,i){return t&n^~t&i}function a(t,n,i){return t&n^t&i^n&i}function c(t,n,i){return t^n^i}function f(t){return E(t,2)^E(t,13)^E(t,22)}function l(t){return E(t,6)^E(t,11)^E(t,25)}function p(t){return E(t,7)^E(t,18)^t>>>3}function g(t){return E(t,17)^E(t,19)^t>>>10}function d(t,n,i,r){return 0===t?u(n,i,r):1===t||3===t?c(n,i,r):2===t?a(n,i,r):void 0}function v(t,n,i,r,h,e){var o=t&i^~t&h;return o<0&&(o+=4294967296),o}function _(t,n,i,r,h,e){var o=n&r^~n&e;return o<0&&(o+=4294967296),o}function m(t,n,i,r,h,e){var o=t&i^t&h^i&h;return o<0&&(o+=4294967296),o}function y(t,n,i,r,h,e){var o=n&r^n&e^r&e;return o<0&&(o+=4294967296),o}function S(t,n){var i=M(t,n,28),r=M(n,t,2),h=M(n,t,7),e=i^r^h;return e<0&&(e+=4294967296),e}function b(t,n){var i=O(t,n,28),r=O(n,t,2),h=O(n,t,7),e=i^r^h;return e<0&&(e+=4294967296),e}function w(t,n){var i=M(t,n,14),r=M(t,n,18),h=M(n,t,9),e=i^r^h;return e<0&&(e+=4294967296),e}function x(t,n){var i=O(t,n,14),r=O(t,n,18),h=O(n,t,9),e=i^r^h;return e<0&&(e+=4294967296),e}function k(t,n){var i=M(t,n,1),r=M(t,n,8),h=T(t,n,7),e=i^r^h;return e<0&&(e+=4294967296),e}function z(t,n){var i=O(t,n,1),r=O(t,n,8),h=I(t,n,7),e=i^r^h;return e<0&&(e+=4294967296),e}function A(t,n){var i=M(t,n,19),r=M(n,t,29),h=T(t,n,6),e=i^r^h;return e<0&&(e+=4294967296),e}function H(t,n){var i=O(t,n,19),r=O(n,t,29),h=I(t,n,6),e=i^r^h;return e<0&&(e+=4294967296),e}var B=i(0),L=B.utils,C=L.assert,E=L.rotr32,U=L.rotl32,W=L.sum32,j=L.sum32_4,F=L.sum32_5,M=L.rotr64_hi,O=L.rotr64_lo,T=L.shr64_hi,I=L.shr64_lo,P=L.sum64,R=L.sum64_hi,N=L.sum64_lo,Y=L.sum64_4_hi,q=L.sum64_4_lo,D=L.sum64_5_hi,G=L.sum64_5_lo,J=B.common.BlockHash,K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],Q=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],V=[1518500249,1859775393,2400959708,3395469782];L.inherits(r,J),n.sha256=r,r.blockSize=512,r.outSize=256,r.hmacStrength=192,r.padLength=64,r.prototype._update=function(t,n){for(var i=this.W,r=0;r<16;r++)i[r]=t[n+r];for(;r<i.length;r++)i[r]=j(g(i[r-2]),i[r-7],p(i[r-15]),i[r-16]);var h=this.h[0],e=this.h[1],o=this.h[2],s=this.h[3],c=this.h[4],d=this.h[5],v=this.h[6],_=this.h[7];C(this.k.length===i.length);for(var r=0;r<i.length;r++){var m=F(_,l(c),u(c,d,v),this.k[r],i[r]),y=W(f(h),a(h,e,o));_=v,v=d,d=c,c=W(s,m),s=o,o=e,e=h,h=W(m,y)}this.h[0]=W(this.h[0],h),this.h[1]=W(this.h[1],e),this.h[2]=W(this.h[2],o),this.h[3]=W(this.h[3],s),this.h[4]=W(this.h[4],c),this.h[5]=W(this.h[5],d),this.h[6]=W(this.h[6],v),this.h[7]=W(this.h[7],_)},r.prototype._digest=function(t){return"hex"===t?L.toHex32(this.h,"big"):L.split32(this.h,"big")},L.inherits(h,r),n.sha224=h,h.blockSize=512,h.outSize=224,h.hmacStrength=192,h.padLength=64,h.prototype._digest=function(t){return"hex"===t?L.toHex32(this.h.slice(0,7),"big"):L.split32(this.h.slice(0,7),"big")},L.inherits(e,J),n.sha512=e,e.blockSize=1024,e.outSize=512,e.hmacStrength=192,e.padLength=128,e.prototype._prepareBlock=function(t,n){for(var i=this.W,r=0;r<32;r++)i[r]=t[n+r];for(;r<i.length;r+=2){var h=A(i[r-4],i[r-3]),e=H(i[r-4],i[r-3]),o=i[r-14],s=i[r-13],u=k(i[r-30],i[r-29]),a=z(i[r-30],i[r-29]),c=i[r-32],f=i[r-31];i[r]=Y(h,e,o,s,u,a,c,f),i[r+1]=q(h,e,o,s,u,a,c,f)}},e.prototype._update=function(t,n){this._prepareBlock(t,n);var i=this.W,r=this.h[0],h=this.h[1],e=this.h[2],o=this.h[3],s=this.h[4],u=this.h[5],a=this.h[6],c=this.h[7],f=this.h[8],l=this.h[9],p=this.h[10],g=this.h[11],d=this.h[12],k=this.h[13],z=this.h[14],A=this.h[15];C(this.k.length===i.length);for(var H=0;H<i.length;H+=2){var B=z,L=A,E=w(f,l),U=x(f,l),W=v(f,l,p,g,d,k),j=_(f,l,p,g,d,k),F=this.k[H],M=this.k[H+1],O=i[H],T=i[H+1],I=D(B,L,E,U,W,j,F,M,O,T),Y=G(B,L,E,U,W,j,F,M,O,T),B=S(r,h),L=b(r,h),E=m(r,h,e,o,s,u),U=y(r,h,e,o,s,u),q=R(B,L,E,U),J=N(B,L,E,U);z=d,A=k,d=p,k=g,p=f,g=l,f=R(a,c,I,Y),l=N(c,c,I,Y),a=s,c=u,s=e,u=o,e=r,o=h,r=R(I,Y,q,J),h=N(I,Y,q,J)}P(this.h,0,r,h),P(this.h,2,e,o),P(this.h,4,s,u),P(this.h,6,a,c),P(this.h,8,f,l),P(this.h,10,p,g),P(this.h,12,d,k),P(this.h,14,z,A)},e.prototype._digest=function(t){return"hex"===t?L.toHex32(this.h,"big"):L.split32(this.h,"big")},L.inherits(o,e),n.sha384=o,o.blockSize=1024,o.outSize=384,o.hmacStrength=192,o.padLength=128,o.prototype._digest=function(t){return"hex"===t?L.toHex32(this.h.slice(0,12),"big"):L.split32(this.h.slice(0,12),"big")},L.inherits(s,J),n.sha1=s,s.blockSize=512,s.outSize=160,s.hmacStrength=80,s.padLength=64,s.prototype._update=function(t,n){for(var i=this.W,r=0;r<16;r++)i[r]=t[n+r];for(;r<i.length;r++)i[r]=U(i[r-3]^i[r-8]^i[r-14]^i[r-16],1);for(var h=this.h[0],e=this.h[1],o=this.h[2],s=this.h[3],u=this.h[4],r=0;r<i.length;r++){var a=~~(r/20),c=F(U(h,5),d(a,e,o,s),u,i[r],V[a]);u=s,s=o,o=U(e,30),e=h,h=c}this.h[0]=W(this.h[0],h),this.h[1]=W(this.h[1],e),this.h[2]=W(this.h[2],o),this.h[3]=W(this.h[3],s),this.h[4]=W(this.h[4],u)},s.prototype._digest=function(t){return"hex"===t?L.toHex32(this.h,"big"):L.split32(this.h,"big")}},function(t,n,i){function r(t,n){if(Array.isArray(t))return t.slice();if(!t)return[];var i=[];if("string"==typeof t)if(n){if("hex"===n){t=t.replace(/[^a-z0-9]+/gi,""),t.length%2!=0&&(t="0"+t);for(var r=0;r<t.length;r+=2)i.push(parseInt(t[r]+t[r+1],16))}}else for(var r=0;r<t.length;r++){var h=t.charCodeAt(r),e=h>>8,o=255&h;e?i.push(e,o):i.push(o)}else for(var r=0;r<t.length;r++)i[r]=0|t[r];return i}function h(t){for(var n="",i=0;i<t.length;i++)n+=s(t[i].toString(16));return n}function e(t){return(t>>>24|t>>>8&65280|t<<8&16711680|(255&t)<<24)>>>0}function o(t,n){for(var i="",r=0;r<t.length;r++){var h=t[r];"little"===n&&(h=e(h)),i+=u(h.toString(16))}return i}function s(t){return 1===t.length?"0"+t:t}function u(t){return 7===t.length?"0"+t:6===t.length?"00"+t:5===t.length?"000"+t:4===t.length?"0000"+t:3===t.length?"00000"+t:2===t.length?"000000"+t:1===t.length?"0000000"+t:t}function a(t,n,i,r){var h=i-n;_(h%4==0);for(var e=new Array(h/4),o=0,s=n;o<e.length;o++,s+=4){var u;u="big"===r?t[s]<<24|t[s+1]<<16|t[s+2]<<8|t[s+3]:t[s+3]<<24|t[s+2]<<16|t[s+1]<<8|t[s],e[o]=u>>>0}return e}function c(t,n){for(var i=new Array(4*t.length),r=0,h=0;r<t.length;r++,h+=4){var e=t[r];"big"===n?(i[h]=e>>>24,i[h+1]=e>>>16&255,i[h+2]=e>>>8&255,i[h+3]=255&e):(i[h+3]=e>>>24,i[h+2]=e>>>16&255,i[h+1]=e>>>8&255,i[h]=255&e)}return i}function f(t,n){return t>>>n|t<<32-n}function l(t,n){return t<<n|t>>>32-n}function p(t,n){return t+n>>>0}function g(t,n,i){return t+n+i>>>0}function d(t,n,i,r){return t+n+i+r>>>0}function v(t,n,i,r,h){return t+n+i+r+h>>>0}function _(t,n){if(!t)throw new Error(n||"Assertion failed")}function m(t,n,i,r){var h=t[n],e=t[n+1],o=r+e>>>0,s=(o<r?1:0)+i+h;t[n]=s>>>0,t[n+1]=o}function y(t,n,i,r){return(n+r>>>0<n?1:0)+t+i>>>0}function S(t,n,i,r){return n+r>>>0}function b(t,n,i,r,h,e,o,s){var u=0,a=n;return a=a+r>>>0,u+=a<n?1:0,a=a+e>>>0,u+=a<e?1:0,a=a+s>>>0,u+=a<s?1:0,t+i+h+o+u>>>0}function w(t,n,i,r,h,e,o,s){return n+r+e+s>>>0}function x(t,n,i,r,h,e,o,s,u,a){var c=0,f=n;return f=f+r>>>0,c+=f<n?1:0,f=f+e>>>0,c+=f<e?1:0,f=f+s>>>0,c+=f<s?1:0,f=f+a>>>0,c+=f<a?1:0,t+i+h+o+u+c>>>0}function k(t,n,i,r,h,e,o,s,u,a){return n+r+e+s+a>>>0}function z(t,n,i){return(n<<32-i|t>>>i)>>>0}function A(t,n,i){return(t<<32-i|n>>>i)>>>0}function H(t,n,i){return t>>>i}function B(t,n,i){return(t<<32-i|n>>>i)>>>0}var L=n,C=i(8);L.toArray=r,L.toHex=h,L.htonl=e,L.toHex32=o,L.zero2=s,L.zero8=u,L.join32=a,L.split32=c,L.rotr32=f,L.rotl32=l,L.sum32=p,L.sum32_3=g,L.sum32_4=d,L.sum32_5=v,L.assert=_,L.inherits=C,n.sum64=m,n.sum64_hi=y,n.sum64_lo=S,n.sum64_4_hi=b,n.sum64_4_lo=w,n.sum64_5_hi=x,n.sum64_5_lo=k,n.rotr64_hi=z,n.rotr64_lo=A,n.shr64_hi=H,n.shr64_lo=B},function(t,n,i){"function"==typeof Object.create?t.exports=function(t,n){t.super_=n,t.prototype=Object.create(n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(t,n){t.super_=n;var i=function(){};i.prototype=n.prototype,t.prototype=new i,t.prototype.constructor=t}},function(t,n,i){var r=i(1),h=void 0,e=void 0;try{h=i(12)}catch(t){}try{e=i(11).Buffer}catch(t){}var o=!(!h||!h.createHash),s=!!e,u=void 0;o||(u=i(0)),n.HAS_CRYPTO=o,n.HAS_BUFFER=s,n.EMPTY_BUFFER=s?e.alloc(0):new Uint8Array(0),n.allocBuffer=s?function(t){return e.alloc(t)}:function(t){for(var n=new Array(t),i=0;i<n.length;i++)n[i]=0;return n},n.checkComplexity=function(t,n){r(n<8*t.length,"Complexity is too high");var i=0,h=void 0;for(h=0;h<=n-8;h+=8,i++)if(0!==t[i])return!1;var e=255<<8+h-n;return 0==(t[i]&e)},n.hash=o?function(t,n){var i=h.createHash("sha256");return n&&i.update(n),i.update(t),i.digest()}:function(t,n){var i=u.sha256();return n&&i.update(n),i.update(t),i.digest()}},function(t,n,i){function r(t){return 97<=t&&t<=102?t-97+10:65<=t&&t<=70?t-65+10:48<=t&&t<=57?t-48:0}function h(t){for(var n=[],i=0;i<t.length;i+=2){var h=t.charCodeAt(i),e=t.charCodeAt(i+1);n.push(r(h)<<4|r(e))}return n}function e(t){return t<10?String.fromCharCode(48+t):String.fromCharCode(97+t-10)}function o(t){for(var n="",i=0;i<t.length;i++){var r=t[i],h=r>>4&15,o=15&r;n+=e(h)+e(o)}return n}var s=i(0),u=i(2),a=new u;onmessage=function(t){var n=t.data,i=n.type,r=n.payload;if("id"===i)postMessage({type:"id",payload:s.sha256().update(r).digest("hex")});else if("nonce"===i){var e=a.solve(r.complexity,h(r.prefix));postMessage({type:"nonce",payload:o(e)})}}},function(t,n){},function(t,n){}]);'},function(t,e,r){r(0),t.exports=r(1)}]);