# Lock.host-wasm-rust (!!debug)
ComponentizeJS is failing when:

1. exports a synchronous function.
2. the synchronous function starts deferred work (fetch).

Two branches have been prepared:

1. [less-code-await](https://github.com/rhodey/lock.host-wasm-rust/tree/less-code-await) await is used and tests pass.
2. [less-code-poll](https://github.com/rhodey/lock.host-wasm-rust/tree/less-code-poll) a polling mechanism is used and tests hang.

## Run
```
just build
just run
```

## Or ...
```
npm --prefix helpers install
npm --prefix helpers run build
cargo build --release
wac plug \
  target/wasm32-wasip2/release/lock_host_wasm_rust.wasm \
  --plug helpers/dist/bundle.wasm \
  -o target/wasm32-wasip2/release/total.wasm
wasmtime serve -Scli -Shttp target/wasm32-wasip2/release/total.wasm
```

## Test
The first and second tests pass on both branches.

The 3rd and 4th tests only complete on `less-code-await`.
```
curl -v 'http://localhost:8080/wait'
>> 200

curl -v 'http://localhost:8080/echo-headers'
>> 200

curl -v 'http://localhost:8080/api/chat-completion?apiKey=just-leave-this-here&message=telljoke'
>> {"error":"HTTP 401"} (proves fetch is working)

curl -v 'http://localhost:8080/api/chat-completion?apiKey=real-api-key&message=telljoke'
>> { real: "json" } (valid api key not necessarily needed to debug this)
```

## Notes
On other branches I have made attempts to use wasi io input-stream as a return type and these branches build but they get nasty stack traces when you hit the HTTP api which is trying to read from them. I have seen this deferred fetch issue show up with older versions of dependencies also but I have updated componentize-js, wit-bindgen, wit-bindgen-rt, and wstd all to latest versions to debug this.

## License
mike@rhodey.org

MIT
