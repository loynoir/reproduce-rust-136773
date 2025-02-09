# reproduce-rust-136773

Found different panic not have identical memory behavior under wasm32 release.

See `./actual.json`

## expected

When release

- `core::panic!()`
- `core::todo!()`
- `core::unimplemented!()`
- `core::unreachable!()`
- `core::arch::wasm32::unreachable()`

Each, and most combo of two, have identical memory behavior.

```json
"core_arch_wasm32_unreachable": {
  "initial_byte_length": 65536,
  "nonzero_count": 0,
  "nonzero_text": ""
},
"core_panic": {
  "initial_byte_length": 65536,
  "nonzero_count": 0,
  "nonzero_text": ""
},
```

```json
"core_todo": {
  "initial_byte_length": 65536,
  "nonzero_count": 0,
  "nonzero_text": ""
},
```

```json
"core_unimplemented": {
  "initial_byte_length": 65536,
  "nonzero_count": 0,
  "nonzero_text": ""
},
```

```json
"core_unreachable": {
  "initial_byte_length": 65536,
  "nonzero_count": 0,
  "nonzero_text": ""
},
```

## unexpected

Except, below three, not identical.

```json
"core_todo_and_core_unimplemented": {
  "initial_byte_length": 131072,
  "nonzero_count": 34,
  "nonzero_text": "not yet implementednot implemented"
},
"core_todo_and_core_unreachable": {
  "initial_byte_length": 131072,
  "nonzero_count": 59,
  "nonzero_text": "not yet implementedinternal error: entered unreachable code"
},
```

```json
"core_unimplemented_and_core_unreachable": {
  "initial_byte_length": 131072,
  "nonzero_count": 55,
  "nonzero_text": "not implementedinternal error: entered unreachable code"
},
```
