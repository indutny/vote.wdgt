!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function r(t){var e=this;if(!(this instanceof r))return new r(t);var n="string"==typeof t?document.getElementById(t):t;n.classList.add("votewdgt"),this.elem=n,this._lastState=null,i.call(this,n.dataset.voteId),this.elem.onclick=function(t){t.preventDefault(),e.vote()},this.elem.disabled=!0}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(2);if(n(5)(r,i),t.exports=r,r.Base=i,r.prototype.onStateChange=function(t,e){var n=this.elem;this._lastState&&"ready"!==this._lastState&&n.classList.remove("votewdgt-"+this._lastState),n.classList.add("votewdgt-"+t),this._lastState=t,"ready"===t?(this.elem.textContent=e.votes,this.elem.disabled=e.voted):"computing"===t||"voted"===t?(this.elem.textContent=e.votes,this.elem.disabled=!0):"error"===t&&"object"===("undefined"==typeof console?"undefined":o(console))&&console.error&&console.error(e)},window.VoteWidget=r,"undefined"!=typeof document){var s=document.querySelectorAll(".votewdgt");Array.prototype.slice.call(s).forEach(function(t){return new r(t)})}},function(t,e,n){"use strict";function r(t){var e=this,n={uri:"https://"+document.location.host+document.location.pathname+document.location.search,id:t||null,worker:null,voted:!1,votes:-1,ready:!1,params:null,callback:null};this._state=n,n.worker=new Worker(window.URL.createObjectURL(s)),n.worker.onmessage=function(t){var n=t.data,r=n.type,o=n.payload;"id"===r?e._onID(o):"nonce"===r&&e._onNonce(o)},this._init()}var o=n(3),i=n(4),s=new Blob([i],{type:"text/javascript"});t.exports=r,r.prototype.vote=function(t){t=t||function(){};var e=this._state;if(e.voted)return t(Error("Already voted"));e.voted=!0,e.callback=t,e.ready&&(this.onStateChange("computing",{votes:e.votes+1}),e.worker.postMessage({type:"nonce",payload:e.params}))},r.prototype.onStateChange=function(){},r.prototype._init=function(){var t=this,e=this._state;if(this.onStateChange("init"),!e.id)return void e.worker.postMessage({type:"id",payload:e.uri});this.onStateChange("loading",e.id),"undefined"!=typeof localStorage&&localStorage.getItem("votewdgt/v1/"+e.id)&&(e.voted=!0),o("/vote/"+encodeURIComponent(e.id),function(n,r){return n?t.onStateChange("error",n):r.error?t.onStateChange("error",r.error):(e.params={complexity:r.complexity,prefix:r.prefix},e.votes=r.votes,e.ready=!0,t.onStateChange("ready",{complexity:r.complexity,prefix:r.prefix,voted:e.voted,votes:r.votes}),void(e.callback&&t.vote(e.callback)))})},r.prototype._onID=function(t){this._state.id=t,this._init()},r.prototype._onNonce=function(t){var e=this,n=this._state;this.onStateChange("voting"),o("/vote/"+encodeURIComponent(n.id),{nonce:t},function(t,r){return t?(e.onStateChange("error",t),n.callback(t)):("undefined"!=typeof localStorage&&localStorage.setItem("votewdgt/v1/"+n.id,!0),r.error?(e.onStateChange("error",r.error),n.callback(r.error)):(e.onStateChange("voted",r),void n.callback(null,r)))})}},function(t,e,n){"use strict";function r(t,e,n){var r=new XMLHttpRequest;"function"!=typeof e?(r.open("PUT",o+t,!0),e=JSON.stringify(e),r.setRequestHeader("content-type","application/json")):(r.open("GET",o+t,!0),n=e,e=!1),r.onreadystatechange=function(){if(r.readyState===XMLHttpRequest.DONE){var t=void 0;try{t=JSON.parse(r.responseText)}catch(t){return n(t)}var e=r.status<200||r.status>=400?Error("Bad HTTP status: "+r.status):null;n(e,t)}},e?r.send(e):r.send()}var o="https://vote.wdgt.io/api/v1";t.exports=r},function(t,e){t.exports='"use strict";!function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var e={};n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=3)}([function(t,n,e){function r(t,n){if(!t)throw Error(n||"Assertion failed")}t.exports=r,r.equal=function(t,n,e){if(t!=n)throw Error(e||"Assertion failed: "+t+" != "+n)}},function(t,n,e){function r(t,n){if(Array.isArray(t))return t.slice();if(!t)return[];var e=[];if("string"==typeof t)if(n){if("hex"===n)for(t=t.replace(/[^a-z0-9]+/gi,""),t.length%2!=0&&(t="0"+t),r=0;r<t.length;r+=2)e.push(parseInt(t[r]+t[r+1],16))}else for(var r=0;r<t.length;r++){var i=t.charCodeAt(r),o=i>>8,h=255&i;o?e.push(o,h):e.push(h)}else for(r=0;r<t.length;r++)e[r]=0|t[r];return e}function i(t){return(t>>>24|t>>>8&65280|t<<8&16711680|(255&t)<<24)>>>0}function o(t,n){for(var e="",r=0;r<t.length;r++){var o=t[r];"little"===n&&(o=i(o)),e+=h(o.toString(16))}return e}function h(t){return 7===t.length?"0"+t:6===t.length?"00"+t:5===t.length?"000"+t:4===t.length?"0000"+t:3===t.length?"00000"+t:2===t.length?"000000"+t:1===t.length?"0000000"+t:t}function s(t,n,e,r){var i=e-n;p(i%4==0);for(var o=Array(i/4),h=0,s=n;h<o.length;h++,s+=4){var u;u="big"===r?t[s]<<24|t[s+1]<<16|t[s+2]<<8|t[s+3]:t[s+3]<<24|t[s+2]<<16|t[s+1]<<8|t[s],o[h]=u>>>0}return o}function u(t,n){for(var e=Array(4*t.length),r=0,i=0;r<t.length;r++,i+=4){var o=t[r];"big"===n?(e[i]=o>>>24,e[i+1]=o>>>16&255,e[i+2]=o>>>8&255,e[i+3]=255&o):(e[i+3]=o>>>24,e[i+2]=o>>>16&255,e[i+1]=o>>>8&255,e[i]=255&o)}return e}function a(t,n){return t>>>n|t<<32-n}function c(t,n){return t+n>>>0}function f(t,n,e,r){return t+n+e+r>>>0}function l(t,n,e,r,i){return t+n+e+r+i>>>0}var p=e(0),g=e(4);n.inherits=g,n.toArray=r,n.toHex32=o,n.join32=s,n.split32=u,n.rotr32=a,n.sum32=c,n.sum32_4=f,n.sum32_5=l},function(t,n,e){function r(){if(!(this instanceof r))return new r;y.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=_,this.W=Array(64)}var i=e(1),o=e(5),h=e(6),s=e(0),u=i.sum32,a=i.sum32_4,c=i.sum32_5,f=h.ch32,l=h.maj32,p=h.s0_256,g=h.s1_256,d=h.g0_256,v=h.g1_256,y=o.BlockHash,_=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];i.inherits(r,y),t.exports=r,r.blockSize=512,r.outSize=256,r.hmacStrength=192,r.padLength=64,r.prototype._update=function(t,n){for(var e=this.W,r=0;r<16;r++)e[r]=t[n+r];for(;r<e.length;r++)e[r]=a(v(e[r-2]),e[r-7],d(e[r-15]),e[r-16]);var i=this.h[0],o=this.h[1],h=this.h[2],y=this.h[3],_=this.h[4],m=this.h[5],x=this.h[6],b=this.h[7];for(s(this.k.length===e.length),r=0;r<e.length;r++){var k=c(b,g(_),f(_,m,x),this.k[r],e[r]),A=u(p(i),l(i,o,h));b=x,x=m,m=_,_=u(y,k),y=h,h=o,o=i,i=u(k,A)}this.h[0]=u(this.h[0],i),this.h[1]=u(this.h[1],o),this.h[2]=u(this.h[2],h),this.h[3]=u(this.h[3],y),this.h[4]=u(this.h[4],_),this.h[5]=u(this.h[5],m),this.h[6]=u(this.h[6],x),this.h[7]=u(this.h[7],b)},r.prototype._digest=function(t){return"hex"===t?i.toHex32(this.h,"big"):i.split32(this.h,"big")}},function(t,n,e){function r(t){return 97<=t&&t<=102?t-97+10:65<=t&&t<=70?t-65+10:48<=t&&t<=57?t-48:0}function i(t){for(var n=[],e=0;e<t.length;e+=2){var i=t.charCodeAt(e),o=t.charCodeAt(e+1);n.push(r(i)<<4|r(o))}return n}function o(t){return t<10?String.fromCharCode(48+t):String.fromCharCode(97+t-10)}function h(t){for(var n="",e=0;e<t.length;e++){var r=t[e],i=r>>4&15,h=15&r;n+=o(i)+o(h)}return n}var s=e(2),u=e(7),a=new u;onmessage=function(t){var n=t.data,e=n.type,r=n.payload;if("id"===e)postMessage({type:"id",payload:s().update(r).digest("hex")});else if("nonce"===e){var o=a.solve(r.complexity,i(r.prefix));postMessage({type:"nonce",payload:h(o)})}}},function(t,n,e){"function"==typeof Object.create?t.exports=function(t,n){t.super_=n,t.prototype=Object.create(n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(t,n){t.super_=n;var e=function(){};e.prototype=n.prototype,t.prototype=new e,t.prototype.constructor=t}},function(t,n,e){function r(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian="big",this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}var i=e(1),o=e(0);n.BlockHash=r,r.prototype.update=function(t,n){if(t=i.toArray(t,n),this.pending?this.pending=this.pending.concat(t):this.pending=t,this.pendingTotal+=t.length,this.pending.length>=this._delta8){t=this.pending;var e=t.length%this._delta8;this.pending=t.slice(t.length-e,t.length),0===this.pending.length&&(this.pending=null),t=i.join32(t,0,t.length-e,this.endian);for(var r=0;r<t.length;r+=this._delta32)this._update(t,r,r+this._delta32)}return this},r.prototype.digest=function(t){return this.update(this._pad()),o(null===this.pending),this._digest(t)},r.prototype._pad=function(){var t=this.pendingTotal,n=this._delta8,e=n-(t+this.padLength)%n,r=Array(e+this.padLength);r[0]=128;for(var i=1;i<e;i++)r[i]=0;if(t<<=3,"big"===this.endian){for(var o=8;o<this.padLength;o++)r[i++]=0;r[i++]=0,r[i++]=0,r[i++]=0,r[i++]=0,r[i++]=t>>>24&255,r[i++]=t>>>16&255,r[i++]=t>>>8&255,r[i++]=255&t}else for(r[i++]=255&t,r[i++]=t>>>8&255,r[i++]=t>>>16&255,r[i++]=t>>>24&255,r[i++]=0,r[i++]=0,r[i++]=0,r[i++]=0,o=8;o<this.padLength;o++)r[i++]=0;return r}},function(t,n,e){function r(t,n,e){return t&n^~t&e}function i(t,n,e){return t&n^t&e^n&e}function o(t){return c(t,2)^c(t,13)^c(t,22)}function h(t){return c(t,6)^c(t,11)^c(t,25)}function s(t){return c(t,7)^c(t,18)^t>>>3}function u(t){return c(t,17)^c(t,19)^t>>>10}var a=e(1),c=a.rotr32;n.ch32=r,n.maj32=i,n.s0_256=o,n.s1_256=h,n.g0_256=s,n.g1_256=u},function(t,n,e){function r(){}var i=e(8);t.exports=r,r.prototype._genNonce=function(t){for(var n=Date.now(),e=i.writeTimestamp(t,n,0),r=e+4*((t.length-e)/4|0);e<r;e+=4)i.writeUInt32(t,4294967296*Math.random()>>>0,e);for(;e<t.length;e++)t[e]=256*Math.random()>>>0},r.prototype.solve=function(t,n){for(var e=i.allocBuffer(16);;){this._genNonce(e);var r=i.hash(e,n);if(i.checkComplexity(r,t))return e}}},function(t,n,e){function r(t,n,e){return t[e]=n>>>24&255,t[e+1]=n>>>16&255,t[e+2]=n>>>8&255,t[e+3]=255&n,e+4}var i=e(2);n.allocBuffer=function(t){for(var n=Array(t),e=0;e<n.length;e++)n[e]=0;return n},n.writeUInt32=r,n.writeTimestamp=function(t,n,e){var i=n/4294967296>>>0,o=(4294967295&n)>>>0;return e=r(t,i,e),r(t,o,e)},n.hash=function(t,n){var e=i();return n&&e.update(n),e.update(t),e.digest()},n.checkComplexity=e(9).checkComplexity},function(t,n,e){var r=e(0);n.checkComplexity=function(t,n){r(n<8*t.length,"Complexity is too high");var e=0,i=void 0;for(i=0;i<=n-8;i+=8,e++)if(0!==t[e])return!1;var o=255<<8+i-n;return 0==(t[e]&o)}}]);'},function(t,e,n){"use strict";"function"==typeof Object.create?t.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(t,e){t.super_=e;var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}}]);