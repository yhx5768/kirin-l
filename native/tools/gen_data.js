/* Generate Kotlin data from the web app's js/data.js */
const fs = require("fs");
const path = require("path");

global.window = {};
require(path.join(__dirname, "../../js/data.js"));
const D = global.window.KIRIN_DATA;

const q = (s) => JSON.stringify(String(s));
const n = (v) => (v == null ? "null" : String(v));
const list = (arr, fn) => (arr && arr.length ? "listOf(" + arr.map(fn).join(", ") + ")" : "emptyList()");

function feature(f) {
  if (!f) return 'Feature("unknown")';
  return `Feature(${q(f.state || "unknown")}, ${f.note ? q(f.note) : "null"})`;
}

function chip(c) {
  const cpu = c.cpu
    ? `Cpu(${n(c.cpu.cores)}, ${n(c.cpu.threads)}, listOf(${c.cpu.clusters
        .map(
          (x) =>
            `Cluster(${q(x.role)}, ${q(x.arch)}, ${n(x.count)}, ${n(x.mhz)}, ${
              x.tag ? q(x.tag) : "null"
            })`
        )
        .join(", ")}), ${c.cpu.note ? q(c.cpu.note) : "null"})`
    : "null";
  const gpu = c.gpu
    ? `Gpu(${q(c.gpu.name)}, ${n(c.gpu.cus)}, ${n(c.gpu.mhz)})`
    : "null";
  const features = c.features
    ? `Features(${feature(c.features.modem)}, ${feature(c.features.isp)}, ${feature(c.features.npu)})`
    : 'Features(Feature("unknown"), Feature("unknown"), Feature("unknown"))';
  return `Chip(
        id = ${q(c.id)},
        name = ${q(c.name)},
        short = ${q(c.short)},
        family = ${q(c.family)},
        type = ${q(c.type)},
        base = ${!!c.base},
        baseId = ${q(c.baseId)},
        parentId = ${c.parentId ? q(c.parentId) : "null"},
        tagline = ${q(c.tagline || "")},
        aliases = ${list(c.aliases, q)},
        cpu = ${cpu},
        gpu = ${gpu},
        features = ${features},
        variants = ${list(c.variants, (v) => `Variant(${q(v.name)}, ${q(v.note || "")})`)},
        devices = ${list(c.devices, q)},
        notes = ${list(c.notes, q)},
        extraSpecs = ${list(c.extraSpecs, (s) => `ExtraSpec(${q(s.label)}, ${q(s.value)})`)},
        unreleased = ${!!c.unreleased},
        reference = ${!!c.reference}
    )`;
}

function family(f) {
  return `Family(
        id = ${q(f.id)},
        name = ${q(f.name)},
        short = ${q(f.short)},
        order = ${n(f.order)},
        baseId = ${q(f.baseId)},
        tagline = ${q(f.tagline)},
        intro = ${list(f.intro, q)},
        highlights = ${list(f.highlights, q)},
        naming = ${list(f.naming, q)}
    )`;
}

function researchField(f) {
  if (!f) return "null";
  return `ResearchField(
            value = ${q(f.value)},
            detail = ${q(f.detail || "")},
            sources = ${list(f.sources, q)},
            confidence = ${q(f.confidence || "unknown")}
        )`;
}

function research(r) {
  return `Research(
        process = ${researchField(r.process)},
        memory = ${researchField(r.memory)},
        cache = ${researchField(r.cache)},
        npu = ${researchField(r.npu)},
        isp = ${researchField(r.isp)},
        modem = ${researchField(r.modem)},
        benchmarks = ${list(
          r.benchmarks,
          (b) =>
            `Benchmark(${q(b.name)}, ${q(b.value)}, ${q(b.device || "")}, ${list(b.sources, q)})`
        )},
        benchmarkNote = ${r.benchmarkNote ? q(r.benchmarkNote) : "null"}
    )`;
}

function source(s) {
  return `Source(${q(s.label)}, ${q(s.title)}, ${q(s.url)}, ${q(s.kind)})`;
}

const out = `package com.kirinl.app.data

// ============================================================
// 麒麟芯片图鉴 · 内置数据
// 原文：酷安《新时代麒麟芯片汇总 5.0》 作者 杜马1124
// 补充资料：2026-11 联网核对，来源与可信度见 research / sources
// 本文件由 native/tools/gen_data.js 生成，请勿手改
// ============================================================

data class Family(
    val id: String,
    val name: String,
    val short: String,
    val order: Int,
    val baseId: String,
    val tagline: String,
    val intro: List<String>,
    val highlights: List<String>,
    val naming: List<String>
)

data class Cluster(
    val role: String,
    val arch: String,
    val count: Int,
    val mhz: Int,
    val tag: String? = null
)

data class Cpu(
    val cores: Int,
    val threads: Int?,
    val clusters: List<Cluster>,
    val note: String? = null
)

data class Gpu(
    val name: String,
    val cus: Int,
    val mhz: Int?
)

data class Feature(
    val state: String,
    val note: String? = null
)

data class Features(
    val modem: Feature,
    val isp: Feature,
    val npu: Feature
)

data class Variant(val name: String, val note: String)
data class ExtraSpec(val label: String, val value: String)

data class Chip(
    val id: String,
    val name: String,
    val short: String,
    val family: String,
    val type: String,
    val base: Boolean,
    val baseId: String,
    val parentId: String?,
    val tagline: String,
    val aliases: List<String>,
    val cpu: Cpu?,
    val gpu: Gpu?,
    val features: Features,
    val variants: List<Variant>,
    val devices: List<String>,
    val notes: List<String>,
    val extraSpecs: List<ExtraSpec>,
    val unreleased: Boolean,
    val reference: Boolean
)

data class ResearchField(
    val value: String,
    val detail: String,
    val sources: List<String>,
    val confidence: String,
    val inherited: Boolean = false
)

data class Benchmark(
    val name: String,
    val value: String,
    val device: String,
    val sources: List<String>
)

data class Research(
    val process: ResearchField? = null,
    val memory: ResearchField? = null,
    val cache: ResearchField? = null,
    val npu: ResearchField? = null,
    val isp: ResearchField? = null,
    val modem: ResearchField? = null,
    val benchmarks: List<Benchmark> = emptyList(),
    val benchmarkNote: String? = null
)

data class Source(
    val label: String,
    val title: String,
    val url: String,
    val kind: String
)

val families: List<Family> = listOf(
    ${D.families.map(family).join(",\n    ")}
)

val chips: List<Chip> = listOf(
    ${D.chips.map(chip).join(",\n    ")}
)

val sources: Map<String, Source> = mapOf(
    ${Object.entries(D.sources || {})
      .map(([id, s]) => `${q(id)} to ${source(s)}`)
      .join(",\n    ")}
)

val research: Map<String, Research> = mapOf(
    ${Object.entries(D.research || {})
      .map(([id, r]) => `${q(id)} to ${research(r)}`)
      .join(",\n    ")}
)
`;

const target = path.join(__dirname, "../app/src/main/java/com/kirinl/app/data/KirinData.kt");
fs.writeFileSync(target, out, "utf8");
console.log("wrote", target, out.length, "chars");
