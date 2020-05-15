import { assertEquals } from "https://deno.land/std@v0.50.0/testing/asserts.ts";
import { RoadRunner } from "../router.ts";
const { test } = Deno;

const generate = () => ({
  foo: Math.random() * 10000000000,
});

test("Should find root path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/", value);

  assertEquals(router.findRoute("GET", "/"), {
    params: {},
    value,
  });
});

test("Should not find root path if bucket is mismatch", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/", value);

  assertEquals(router.findRoute("POST", "/"), null);
});

test("Should not find root path if file is passed", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/", value);

  assertEquals(router.findRoute("GET", "/foo"), null);
});

test("Should not find root path if folder is passed", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/", value);

  assertEquals(router.findRoute("GET", "/foo/"), null);
});

test("Should find nested path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/bar", value);

  assertEquals(router.findRoute("GET", "/foo/bar"), {
    params: {},
    value,
  });
});

test("Should not find nested path if partial match", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/bar", value);

  assertEquals(router.findRoute("GET", "/foo/ba"), null);
});

test("Should not find nested path if extra slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/bar", value);

  assertEquals(router.findRoute("GET", "/foo/bar/"), null);
});

test("Should not find nested path if lookup is for nested folder", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/bar", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should find root path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/:param1", value);

  assertEquals(router.findRoute("GET", "/foo"), {
    params: { param1: "foo" },
    value,
  });
});

test("Should not find root path if wildcard is missing", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/:param1", value);

  assertEquals(router.findRoute("GET", "/"), null);
});

test("Should find correct subpath", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/bah", generate());
  router.addRoute("GET", "/foo/:param1/baz", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), {
    params: { param1: "bar" },
    value,
  });
});

test("Should not find missing subpath", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/bah", value);
  router.addRoute("GET", "/foo/:param1/baz", generate());

  assertEquals(router.findRoute("GET", "/foo/bar/bum"), null);
});

test("Should enforce trailing slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/", value);

  assertEquals(router.findRoute("GET", "/foo/baz"), null);

  assertEquals(router.findRoute("GET", "/foo/baz/"), {
    params: { param1: "baz" },
    value,
  });
});

test("Should find nested path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/baz"), {
    params: { param1: "baz" },
    value,
  });
});

test("Should not find nested path if param is missing value", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/"), null);
});

test("Should not find nested path if lookup is a folder below", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1", value);

  assertEquals(router.findRoute("GET", "/foo"), null);
});

test("Should not find nested path if lookup has extra slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/bar/"), null);
});

test("Should not find nested path if lookup is for nested folder", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should find multiple param path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/baz/:param2", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum"), {
    params: { param1: "bar", param2: "bum" },
    value,
  });
});

test("Should not find multiple param path if last wildcard is missing value", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/baz/:param2", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should not find multiple param path if lookup is a folder below", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/baz/:param2", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should not find multiple param path if lookup has extra slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/baz/:param2", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum/"), null);
});

test("Should not find multiple param path if lookup is for nested folder", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/:param1/baz/:param2", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum/bah"), null);
});

test("Should find root path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/*", value);

  assertEquals(router.findRoute("GET", "/bar"), {
    params: {},
    value,
  });
});

test("Should not find root path if wildcard is missing", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/*", value);

  assertEquals(router.findRoute("GET", "/"), null);
});

test("Should find nested path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*", value);

  assertEquals(router.findRoute("GET", "/foo/baz"), {
    params: {},
    value,
  });
});

test("Should not find nested path if wildcard is missing value", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*", value);

  assertEquals(router.findRoute("GET", "/foo/"), null);
});

test("Should not find nested path if lookup is a folder below", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*", value);

  assertEquals(router.findRoute("GET", "/foo"), null);
});

test("Should not find nested path if lookup has extra slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/"), null);
});

test("Should not find nested path if lookup is for nested folder", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should find multiple wildcard path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/baz/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum"), {
    params: {},
    value,
  });
});

test("Should not find multiple wildcard path if last wildcard is missing value", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/baz/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should not find multiple wildcard path if lookup is a folder below", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/baz/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), null);
});

test("Should not find multiple wildcard path if lookup has extra slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/baz/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum/"), null);
});

test("Should not find multiple wildcard path if lookup is for nested folder", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/baz/*", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum/bah"), null);
});

test("Should find path", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz"), {
    params: { param1: "baz" },
    value,
  });
});

test("Should not find path if wildcard is missing value", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/:param1", value);

  assertEquals(router.findRoute("GET", "/foo//baz"), null);
});

test("Should not find path if param is missing value", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/bar/"), null);
});

test("Should not find path if lookup is a folder below", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/bum"), null);
});

test("Should not find nested path if lookup has extra slash", () => {
  const router = new RoadRunner();

  const value = generate();
  router.addRoute("GET", "/foo/*/:param1", value);

  assertEquals(router.findRoute("GET", "/foo/bar/baz/"), null);
});

test("kitchen sink", () => {
  const routes = [
    { path: "/", test: "/" },
    { path: "/foo/:param1", params: { param1: "value" }, test: "/foo/value" },
  ];

  const router = new RoadRunner();

  for (const { path } of routes) {
    router.addRoute("GET", path, path);
  }

  for (const { params = {}, path, test } of routes) {
    const result = router.findRoute("GET", test);

    assertEquals(result, {
      value: path,
      params,
    });
  }
});
