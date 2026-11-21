/* 麒麟芯片图鉴 · 数据导出
 *
 * 用法：node tools/export_json.js
 * 读取 js/data.js，生成：
 *   data/kirin.json    —— App / 第三方可读的完整数据
 *   data/manifest.json —— 动态更新用的版本与校验信息
 *
 * 该脚本不依赖 npm 包，可在 GitHub Actions 里直接跑。
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
global.window = {};
require(path.join(root, "js/data.js"));

const D = global.window.KIRIN_DATA;
if (!D) throw new Error("js/data.js 没有导出 window.KIRIN_DATA");

if (D.chips.length !== 51) throw new Error("芯片数量异常: " + D.chips.length);
if (D.families.length !== 8) throw new Error("世代数量异常: " + D.families.length);
if (Object.keys(D.sources || {}).length !== 38) {
    throw new Error("来源数量异常: " + Object.keys(D.sources || {}).length);
}

const payload = {
    schemaVersion: 1,
    meta: D.meta,
    families: D.families,
    chips: D.chips,
    sources: D.sources,
    research: D.research
};

const json = JSON.stringify(payload, null, 2) + "\n";
const outPath = path.join(root, "data/kirin.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, json, "utf8");

const hash = crypto.createHash("sha256").update(json, "utf8").digest("hex");
const manifest = {
    schemaVersion: 1,
    dataVersion: D.meta.dataVersion,
    updated: D.meta.researchUpdated || D.meta.updated,
    file: "kirin.json",
    sha256: hash,
    size: Buffer.byteLength(json, "utf8"),
    counts: {
        chips: D.chips.length,
        families: D.families.length,
        sources: Object.keys(D.sources || {}).length
    }
};
fs.writeFileSync(
    path.join(root, "data/manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8"
);

console.log("data/kirin.json  ", manifest.size, "bytes");
console.log("data/manifest.json", hash.slice(0, 16) + "…");
