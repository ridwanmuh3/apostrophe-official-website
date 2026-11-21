import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app/assets/data/release.ts", import.meta.url), "utf8");
const path = source.match(/audio:\s*"(\/audios\/[^\"]+)"/)?.[1];
assert.ok(path, "release.audio harus menunjuk file di /audios/");

const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
assert.equal(bytes.subarray(0, 3).toString(), "ID3", "audio harus berformat MP3, bukan video MPEG");
assert.ok(bytes.length > 1_000_000, "file audio tidak boleh kosong atau terpotong");
