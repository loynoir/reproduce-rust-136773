import { deepStrictEqual } from "node:assert";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const panics = [
  "core::panic!()",
  "core::todo!()",
  "core::unimplemented!()",
  "core::unreachable!()",
  "core::arch::wasm32::unreachable()",
];

const combos = [];
for (let i = 0; i < panics.length; i++) {
  combos.push([i]);
}
for (let i = 0; i < panics.length - 1; i++) {
  for (let j = i + 1; j < panics.length; j++) {
    combos.push([i, j]);
  }
}
deepStrictEqual(panics.length, 5);
deepStrictEqual(combos.length, 5 + 5 * 4 / 2);

const indexjsp = "./src/generated_index.mjs";
let indexjsc = "";

for (const idxs of combos) {
  const data = idxs.map((idx) => {
    const code = panics[idx];
    const name = code.replaceAll(/[^a-zA-Z0-9]+/g, "_").replaceAll(/_$/g, "");

    const rs = `#[unsafe(no_mangle)]
pub extern "C" fn ${name}() -> ! {
    ${code}
}
`;

    return { code, name, rs };
  });

  const name2 = "generated_" + data.map((x) => x.name).join("_and_");

  {
    const rsp = `./src/bin/${name2}.rs`;
    const rsc = `#![no_std]
#![no_main]

#[panic_handler]
pub fn unreachable_panic_handler(_info: &core::panic::PanicInfo) -> ! {
    core::arch::wasm32::unreachable()
}

${data.map((x) => x.rs).join("\n")}`;

    await mkdir(dirname(rsp), { recursive: true });
    await writeFile(rsp, rsc, "utf8");
  }

  {
    indexjsc +=
      `export * as ${name2} from "../target/wasm32-unknown-unknown/release/${name2}.wasm";\n`;
  }
}

await mkdir(dirname(indexjsp), { recursive: true });
await writeFile(indexjsp, indexjsc, "utf8");
