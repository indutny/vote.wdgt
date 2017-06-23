# vote.wdgt

Free Proof-of-Work API for fancy Vote Counting widgets.

## Demonstration

Click the button below:

<button class="votewdgt">?</button>

## Embedding

```html
<button class="votewdgt">?</button>
<script src="https://vote.wdgt.io/cdn/snippet-v2.js" async></script>
```

## Use-cases

vote.wdgt widgets are completely free of use (_see [Availability][2] below_).
When embedded on the website they will show vote count for the current page.
Widgets can be inserted into:

* gh-pages
* Blog posts
* Picture Galleries
* ...in any other case where no backend server is available, but vote counters
  are needed!

## Styles

No styling is provided by default. However the widget has rich set of classes,
each describing particular state of it:

* `.votewdgt` - always present
* `.votewdgt-init` - dummy state, assigned initially
* `.votewdgt-loading` - initial vote count is being loaded
* `.votewdgt-ready` - vote count has been loaded
* `.votewdgt-computing` - Proof-of-Work is being computed
* `.votewdgt-voting` - Proof-of-Work computed, sending data to API endpoint
* `.votewdgt-voted` - Vote casted, or voted before
* `.votewdgt-error` - Some unexpected server error

A collection of user-supplied styles is available [on this wiki page][3].

## Proof-of-Work

The backend API for these widgets uses [proof-of-work][1] JavaScript module for
generating/verifying nonces to prevent vote spamming. When user casts the
vote - a nonce will be brute-forced, until particular SHA256 hash will match
requested server's complexity.

## Availability

Since this project is absolutely free to use author can provide only limited
availability guarantees. If widgets stop working - please file an
[issue here][0].

## LICENSE

This software is licensed under the MIT License.

Copyright Fedor Indutny, 2017.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: https://github.com/indutny/vote.wdgt/issues
[1]: https://github.com/indutny/proof-of-work#technique
[2]: https://indutny.github.io/vote.wdgt/#availability
[3]: https://github.com/indutny/vote.wdgt/wiki/User-Styles
