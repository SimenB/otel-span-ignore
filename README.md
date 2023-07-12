# Active span issue

```sh-session
$ yarn
$ node server.js
```

Wait until it says it's ready, then in another terminal:

```sh-session
$ curl http://0.0.0.0:8081
Hello World! {
  "traceId": "292c9d49283b21b98c0fcd1a11b50f6b",
  "spanId": "715cc7d97c94ec38",
  "traceFlags": 1
}
id: 292c9d49283b21b98c0fcd1a11b50f6b
```

Running that multiple times gives different traceIds, and it matches `request.id` set by `genReqId`.

However, if the URL we access is ignored by `ignoreIncomingRequestHook`, then the id set for the request is from the span created during boot of the app, while `traceID` is set to all zeros.

```sh-session
$  curl http://0.0.0.0:8081/ignore
Hello World! {
  "traceId": "00000000000000000000000000000000",
  "spanId": "0000000000000000",
  "traceFlags": 0
}
id: cd6fc4f165a68fa57d7021ab34475259
```
