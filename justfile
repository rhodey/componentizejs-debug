helpers:
  npm --prefix helpers install
  npm --prefix helpers run build

plug:
  wac plug \
    target/wasm32-wasip2/release/lock_host_wasm_rust.wasm \
    --plug helpers/dist/bundle.wasm \
    -o target/wasm32-wasip2/release/total.wasm

build:
  just helpers
  rustup target add wasm32-wasip2
  cargo build --release
  just plug

run:
  wasmtime serve -Scli -Shttp target/wasm32-wasip2/release/total.wasm
