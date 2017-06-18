<style>
  @keyframes vote-loading {
    from {
      border: 1px solid #eee;
      box-shadow: 0 0 0 rgba(21, 87, 153, 0.0);
    }

    to {
      border: 1px solid #aaa;
      box-shadow: 0 0 8px rgba(21, 87, 153, 0.6);
    }
  }

  .votenow {
    display: block;
    margin: 8px auto 0 auto;
    text-align: center;
    width: 96px;
    height: 96px;
    border: 1px solid #aaa;
    border-radius: 0.3rem;
    transition: border 1s;
    background: #eee;
    color: #333;
    font-size: 24px;
  }

  .votenow.votenow-loading,
  .votenow.votenow-computing,
  .votenow.votenow-voting {
    animation-name: vote-loading;
    animation-direction: alternate;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
  }

  .votenow.votenow-ready:not(:disabled):hover:after {
    font-weight: bold;
    content: ' +1';
  }

  .votenow.votenow-voting {
    border: 1px solid #333;
  }

  .votenow.votenow-voted {
    border: 1px solid #333;
  }
</style>

# vote.now

Public API for fancy Vote Counting fancy widgets.

## Example

<button class=votenow>?</button>
<script src="https://cdn.rawgit.com/indutny/vote.now/v1.0.2/dist/snippet.js" async></script>

## Deployment

```sh
npm i -g now
now secrets add vote-db "redis://host/?password=<pass>"
now -e DB=@vote-db
```

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
