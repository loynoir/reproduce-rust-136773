import { writeFile } from "node:fs/promises";
import * as all from "../src/generated_index.mjs";

function analyze(mod) {
  const initial_byte_length = mod.memory.buffer.byteLength;
  const nonzero_buf = Buffer.from(mod.memory.buffer).filter((x) => x !== 0);
  const nonzero_count = nonzero_buf.length;
  const nonzero_text = nonzero_buf.toString();
  return { initial_byte_length, nonzero_count, nonzero_text };
}

const actual = Object.fromEntries(
  Object.entries(all).map((
    [name, mod],
  ) => [name.replaceAll("generated_", ""), analyze(mod)]),
);

await writeFile("./actual.json", JSON.stringify(actual, null, 2) + "\n");
