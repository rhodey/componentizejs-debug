# ComponentizeJS-debug
ComponentizeJS is failing when:

1. exports a synchronous function.
2. the synchronous function starts deferred work (fetch).

Two branches have been prepared:

1. [main](https://github.com/rhodey/componentizejs-debug/tree/main) await is used and tests pass.
2. [poll](https://github.com/rhodey/componentizejs-debug/tree/poll) a polling mechanism is used and tests hang.

Look at [helpers/index.js](helpers/index.js) in both branches then [src/lib.rs](src/lib.rs) also.

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
The 1st and 2nd tests pass on both branches.

The 3rd and 4th tests only complete on `main`.
```
curl -v 'http://localhost:8080/wait'
>> 200

curl -v 'http://localhost:8080/echo-headers'
>> 200

curl -v 'http://localhost:8080/api/chat-completion?apiKey=just-leave-this-here&message=telljoke'
>> {"error":"HTTP 401"} (proves fetch is working)

curl -v 'http://localhost:8080/api/chat-completion?apiKey=real-api-key&message=telljoke'
>> { real: "json" } (valid api key not needed to debug this)
```

## STDOUT main
```
Serving HTTP on http://0.0.0.0:8080/
stdout [0] :: !! fetch https://api.openai.com/v1/chat/completions
stdout [0] :: !! fetch !! reply https://api.openai.com/v1/chat/completions
```

## STDOUT poll
```
Serving HTTP on http://0.0.0.0:8080/
stdout [1] :: !! begin 0n
stdout [1] :: !! fetch https://api.openai.com/v1/chat/completions
stdout [1] :: !! poll 0n Promise { <pending> }
stdout [1] :: !! delay
stdout [1] :: !! poll 0n Promise { <pending> }
stdout [1] :: !! delay
(repeatedly)
```

## Notes
I have made attempts to use wasi io input-stream as a return type and these build but they get nasty stack traces when you hit the HTTP api which is trying to read from them. I have seen the deferred fetch issue show up with older versions of dependencies also but I have updated `componentize-js`, `wit-bindgen`, `wit-bindgen-rt`, and `wstd` all to latest versions to debug this.

I understand with this example repo the fetch could all be done in Rust and with no JS exported but my real use case involves more things needed, including deferred fetch from JS exports working.

## License
mike@rhodey.org

MIT
