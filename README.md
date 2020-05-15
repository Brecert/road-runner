# Road Runner Router

A router for when latency is Wile E. Coyote :) Inspired by
[julienschmidt/httprouter](https://github.com/julienschmidt/httprouter)
and partly derived from  
[steambap/koa-tree-router](https://www.npmjs.com/package/koa-tree-router).

Ported to deno by @brecert.

## Why is it fast?

* Params are detected and provided as objects, but no regex or value casting, strings only
* Case sensitive (use .toLowerCase() when inserting/retrieving if you want case-insensitivity)
* Limited validation (assuming you are going to pass in valid paths and HTTP methods)
* No URL parsing, most environments provide some type of req.path functionality

## Getting Started

The following snippet is the basic setup of the router, remember, it is
up to you to tie into your favorite HTTP library and execute the handler
code and return a response (if any):

```ts
import { RoadRunner } from "https://raw.githubusercontent.com/Brecert/road_runner/master/router.ts";

const router = RoadRunner();

router.addRoute('GET', '/path', () => {});

const result = router.lookupRoute('GET', '/path');
// => returns { value: () => {}, params: {} }

result.value();

router.addRoute('GET', '/path/:nested', () => {});

const result2 = router.findRoute('GET', '/path/foobar');
// => returns { value: () => {}, params: { nested: 'foobar' } }

result2.value();
```

## Supported Path Syntax

* /foo
* /:foo
* /*
* /foo/:bar
* /foo/\*
* /foo/:bar/baz
* /foo/\*/baz
* /foo/:bar/baz/:bum
* /foo/\*/baz/\*
* /foo/:bar/baz/\*
* /foo/*/baz/:bum

## Unsupported Path  Syntax

* /foo/:bar-:baz
* /foo/bar:baz
* /foo/bar-*