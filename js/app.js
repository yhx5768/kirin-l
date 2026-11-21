/* ============================================================
 * 麒麟芯片图鉴 · Kirin-L
 * 应用逻辑（无依赖、可离线运行）
 * ============================================================ */
(function () {
  "use strict";

  const DATA = window.KIRIN_DATA;
  const chips = DATA.chips.slice();
  const families = DATA.families.slice().sort((a, b) => a.order - b.order);
  const byId = new Map(chips.map((c) => [c.id, c]));
  const famById = new Map(families.map((f) => [f.id, f]));
  const famOrder = new Map(families.map((f, i) => [f.id, i]));
  const LINE_WEIGHT = { main: 0, mid: 1, ref: 2 };

  const RESEARCH = DATA.research || {};
  const SOURCES = DATA.sources || {};
  const CONF_LABEL = {
    official: "官方",
    teardown: "拆解",
    media: "媒体",
    db: "数据库",
    inferred: "推断",
    conflict: "有冲突",
    unknown: "未公开",
    original: "原文"
  };

  const STORE = {
    fav: "kirin.favs",
    compare: "kirin.compare",
    theme: "kirin.theme"
  };
  const MAX_COMPARE = 10;

  /* ---------------- helpers ---------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ESC_MAP[ch]);

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function fmtGh(mhz) {
    if (mhz == null) return "—";
    const v = (mhz / 1000).toFixed(2).replace(/\.?0+$/, "");
    return v + " GHz";
  }
  function fmtMhz(mhz) {
    return mhz == null ? "—" : mhz + " MHz";
  }
  function pctText(cur, base) {
    if (cur == null || base == null || base === 0) return null;
    const p = ((cur - base) / base) * 100;
    const rounded = Math.round(p);
    if (rounded === 0) return "持平";
    return (rounded > 0 ? "+" : "") + rounded + "%";
  }
  function toneByPct(p) {
    if (p == null) return "flat";
    if (p > 0) return "boost";
    if (p < 0) return "cut";
    return "flat";
  }

  /* ---------------- 联网补充资料 ---------------- */

  function resolveResearch(chip) {
    if (chip.unreleased && !RESEARCH[chip.id]) return null;
    const own = RESEARCH[chip.id] || {};
    const base = chip.baseChip ? RESEARCH[chip.baseChip.id] : null;
    const keys = ["process", "memory", "cache", "npu", "isp", "modem"];
    const fields = {};
    let inheritedFrom = null;
    let inheritedFromId = null;

    keys.forEach((k) => {
      if (own[k]) {
        fields[k] = Object.assign({}, own[k], { inherited: false });
      } else if (base && base[k]) {
        fields[k] = Object.assign({}, base[k], { inherited: true });
        if (!inheritedFrom && chip.baseChip.id !== chip.id) {
          inheritedFrom = chip.baseChip;
          inheritedFromId = chip.baseChip.id;
        }
      }
    });

    const benchmarks = own.benchmarks || (base && base.benchmarks) || [];
    const benchmarkInherited = !own.benchmarks && !!(base && base.benchmarks && base.benchmarks.length);
    const benchmarkNote = own.benchmarkNote || (base && base.benchmarkNote) || null;

    if (fields.modem && chip.features && chip.features.modem && chip.features.modem.state === "none") {
      fields.modem = {
        value: "无基带（平板端）",
        detail: "原文标注该型号无基带；基带型号仅在对应手机芯片上参考。",
        sources: [],
        confidence: "original",
        inherited: false
      };
    }

    if (!Object.keys(fields).length && !benchmarks.length && !benchmarkNote) return null;
    return {
      fields,
      benchmarks,
      benchmarkInherited,
      benchmarkNote,
      inheritedFrom: inheritedFrom ? inheritedFrom.short : null,
      inheritedFromId
    };
  }

  function researchField(chip, key) {
    return chip.research && chip.research.fields ? chip.research.fields[key] : null;
  }

  function sourceById(id) {
    return SOURCES[id] || null;
  }

  function confidenceBadge(conf) {
    if (!conf) return "";
    return '<span class="conf conf-' + conf + '">' + esc(CONF_LABEL[conf] || conf) + "</span>";
  }

  function sourceLinks(ids) {
    if (!ids || !ids.length) return "";
    return ids
      .map((id) => {
        const s = sourceById(id);
        if (!s) return "";
        return (
          '<a class="src-link" href="' +
          esc(s.url) +
          '" target="_blank" rel="noopener" title="' +
          esc(s.title) +
          '">' +
          esc(s.label) +
          "</a>"
        );
      })
      .filter(Boolean)
      .join("");
  }

  function processShort(chip) {
    const f = researchField(chip, "process");
    const v = f ? f.value : "";
    if (!v) return "";
    if (v.indexOf("N+3") >= 0 && v.indexOf("N+2") >= 0) return "N+3 双 die";
    if (v.indexOf("N+3") >= 0) return "N+3";
    if (v.indexOf("N+2") >= 0) return "N+2";
    if (v.indexOf("5nm") >= 0) return "5nm";
    if (v.indexOf("7nm") >= 0) return "7nm";
    return "";
  }

  function benchmarkValue(chip, prefix) {
    const r = chip.research;
    if (!r || !r.benchmarks) return null;
    const hit = r.benchmarks.find((b) => b.name.indexOf(prefix) === 0);
    return hit ? hit.value : null;
  }

  function researchRow(chip, key, label) {
    const f = researchField(chip, key);
    if (!f) {
      return '<tr><th>' + esc(label) + '</th><td class="missing">未查到可靠公开资料</td></tr>';
    }
    return (
      "<tr><th>" +
      esc(label) +
      "</th><td>" +
      esc(f.value) +
      " " +
      confidenceBadge(f.confidence) +
      "</td></tr>"
    );
  }

  const TYPE_LABEL = { phone: "手机", tablet: "平板", pc: "电脑" };
  const FEATURE_LABEL = {
    integrated: "集成基带",
    none: "无基带",
    unknown: "未标注",
    full: "完整",
    cut: "削减",
    half: "半规格"
  };
  const FEATURE_SHORT = {
    integrated: "集成",
    none: "无",
    unknown: "?",
    full: "完整",
    cut: "砍",
    half: "半"
  };
  function featureTone(state) {
    if (state === "none" || state === "cut") return "cut";
    if (state === "half") return "half";
    if (state === "unknown") return "unknown";
    return "ok";
  }

  /* ---------------- normalize ---------------- */

  chips.forEach((c) => {
    c.familyRef = famById.get(c.family);
    c.baseChip = byId.get(c.baseId) || c;
    c.isBase = !!c.base;
    c.typeLabel = TYPE_LABEL[c.type] || "未知";
    c.lineWeight = LINE_WEIGHT[c.line] == null ? 5 : LINE_WEIGHT[c.line];

    if (c.cpu) {
      const counts = {};
      c.cpu.clusters.forEach((cl) => {
        cl.occ = counts[cl.role] || 0;
        counts[cl.role] = cl.occ + 1;
      });
      c.cpu.cores = c.cpu.cores == null ? c.cpu.clusters.reduce((s, x) => s + x.count, 0) : c.cpu.cores;
      c.maxClock = Math.max(0, ...c.cpu.clusters.map((x) => x.mhz || 0)) || null;
    } else {
      c.maxClock = null;
    }
    c.gpuIndex = c.gpu && c.gpu.mhz ? c.gpu.cus * c.gpu.mhz : null;

    c.flags = {
      noSuper: !!(c.cpu && !c.cpu.clusters.some((x) => x.role === "超大核" && x.count > 0)),
      noModem: !!(c.features && c.features.modem && c.features.modem.state === "none"),
      cutIsp: !!(c.features && c.features.isp && c.features.isp.state === "cut"),
      cutNpu: !!(c.features && c.features.npu && c.features.npu.state === "cut"),
      halfNpu: !!(c.features && c.features.npu && c.features.npu.state === "half"),
      unreleased: !!c.unreleased,
      reference: !!c.reference
    };

    c.search = [
      c.name,
      c.short,
      (c.aliases || []).join(" "),
      c.familyRef ? c.familyRef.name : "",
      c.typeLabel,
      c.tagline,
      (c.devices || []).join(" "),
      c.cpu ? c.cpu.clusters.map((x) => x.arch).join(" ") : "",
      c.gpu ? c.gpu.name : ""
    ]
      .join(" ")
      .toLowerCase();
  });

  chips.forEach((c) => {
    c.research = resolveResearch(c);
  });

  chips.forEach((c) => {
    c.children = [];
  });
  chips.forEach((c) => {
    if (c.parentId && byId.has(c.parentId)) byId.get(c.parentId).children.push(c);
  });
  chips.forEach((c) => {
    c.children.sort((a, b) => (b.maxClock || 0) - (a.maxClock || 0));
  });

  function sortChips(list) {
    return list.slice().sort((a, b) => {
      const fa = famOrder.get(a.family);
      const fb = famOrder.get(b.family);
      if (fa !== fb) return fa - fb;
      if (!!a.isBase !== !!b.isBase) return a.isBase ? -1 : 1;
      if (a.lineWeight !== b.lineWeight) return a.lineWeight - b.lineWeight;
      if ((b.maxClock || 0) !== (a.maxClock || 0)) return (b.maxClock || 0) - (a.maxClock || 0);
      return a.name.localeCompare(b.name, "zh-Hans-CN");
    });
  }

  const orderedChips = sortChips(chips);
  const orderedIndex = new Map(orderedChips.map((c, i) => [c.id, i]));

  /* ---------------- state ---------------- */

  const state = {
    query: "",
    type: "all",
    family: "all",
    sort: "gen",
    onlyBase: false,
    favOnly: false,
    compare: readStore(STORE.compare, [])
      .filter((id) => byId.has(id))
      .slice(0, MAX_COMPARE),
    favs: readStore(STORE.fav, []).filter((id) => byId.has(id)),
    diffOnly: false,
    modal: null,
    modalQuery: ""
  };

  /* ---------------- icons ---------------- */

  const ICONS = {
    chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>',
    balance:
      '<path d="M12 4v16M6 20h12M4 8h16"/><path d="M4 8l-2.5 5a2.5 2.5 0 0 0 5 0L4 8Z"/><path d="M20 8l-2.5 5a2.5 2.5 0 0 0 5 0L20 8Z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    gpu: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="M14 9h4M14 12h4M14 15h4"/>',
    radio: '<path d="M4.9 8.9a7 7 0 0 0 0 6.2M7.8 10.2a4 4 0 0 0 0 3.6M19.1 8.9a7 7 0 0 1 0 6.2M16.2 10.2a4 4 0 0 1 0 3.6"/><circle cx="12" cy="12" r="1.6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="2.4"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    tablet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M10.5 18h3"/>',
    pc: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    sort: '<path d="M7 4v16M3.5 7.5 7 4l3.5 3.5M17 20V4M13.5 16.5 17 20l3.5-3.5"/>',
    swipe: '<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
    sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 15.5 20 18l2.5 1-2.5 1-1 2.5-1-2.5L15.5 19l2.5-1 1-2.5Z"/>'
  };

  function icon(name, cls) {
    return (
      '<svg class="icon ' +
      (cls || "") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }

  /* ---------------- badges & flags ---------------- */

  function badgesHTML(chip, opts) {
    const o = opts || {};
    const list = [];
    list.push({ text: chip.typeLabel, cls: "badge-type", icon: chip.type === "tablet" ? "tablet" : chip.type === "pc" ? "pc" : "phone" });
    if (chip.isBase) list.push({ text: chip.reference ? "参照" : "基准", cls: "badge-base" });
    if (chip.flags.unreleased) list.push({ text: "未上市", cls: "badge-unknown" });
    if (chip.flags.noSuper) list.push({ text: "无超大核", cls: "badge-cut" });
    if (chip.flags.noModem) list.push({ text: "无基带", cls: "badge-cut" });
    if (chip.flags.cutIsp) list.push({ text: "砍 ISP", cls: "badge-cut" });
    if (chip.flags.cutNpu) list.push({ text: "砍 NPU", cls: "badge-cut" });
    if (chip.flags.halfNpu) list.push({ text: "半 NPU", cls: "badge-half" });

    if (!chip.isBase && chip.baseChip && chip.baseChip !== chip) {
      const b = chip.baseChip;
      if (chip.gpu && b.gpu && chip.gpu.cus < b.gpu.cus) {
        list.push({ text: "砍 GPU", cls: "badge-cut" });
      } else if (chip.gpu && b.gpu && chip.gpu.cus > b.gpu.cus) {
        list.push({ text: "加 GPU", cls: "badge-boost" });
      }
      if (chip.maxClock && b.maxClock && chip.maxClock > b.maxClock) {
        list.push({ text: "提频", cls: "badge-boost" });
      }
    }
    if (o.max && list.length > o.max) {
      const extra = list.length - o.max;
      return list.slice(0, o.max).map(badgeNode).join("") + '<span class="badge badge-more">+' + extra + "</span>";
    }
    return list.map(badgeNode).join("");
  }

  function badgeNode(b) {
    return (
      '<span class="badge ' +
      b.cls +
      '">' +
      (b.icon ? icon(b.icon, "badge-icon") : "") +
      esc(b.text) +
      "</span>"
    );
  }

  function familyName(chip) {
    return chip.familyRef ? chip.familyRef.name : "";
  }

  /* ---------------- cluster helpers ---------------- */

  function clusterGroups(chip, role) {
    if (!chip.cpu) return [];
    return chip.cpu.clusters.filter((x) => x.role === role);
  }
  function clusterText(chip, role) {
    const groups = clusterGroups(chip, role).filter((x) => x.count > 0);
    if (!groups.length) return "—";
    return groups.map((x) => x.count + "×" + (x.mhz / 1000).toFixed(2).replace(/\.?0+$/, "")).join(" + ");
  }
  function clusterArch(chip, role) {
    const groups = clusterGroups(chip, role).filter((x) => x.mhz > 0 || x.count > 0);
    if (!groups.length) return "";
    const archs = groups.map((x) => x.arch).filter((a) => a && a !== "—");
    return Array.from(new Set(archs)).join(" / ");
  }
  function cpuLine(chip) {
    if (!chip.cpu) return "规格未公布";
    return chip.cpu.clusters
      .filter((x) => x.count > 0)
      .map((x) => x.count + "×" + (x.mhz / 1000).toFixed(2).replace(/\.?0+$/, ""))
      .join(" + ");
  }

  function findCluster(chip, role, occ) {
    if (!chip.cpu) return null;
    return chip.cpu.clusters.find((x) => x.role === role && x.occ === occ) || null;
  }

  function clusterDelta(chip, base, cl) {
    const b = base && base.cpu ? findCluster(base, cl.role, cl.occ) : null;
    if (!b) return null;
    const countDelta = cl.count - b.count;
    const clockPct = pctText(cl.mhz || null, b.mhz || null);
    if (countDelta === 0 && clockPct === "持平") return { text: "持平", tone: "flat" };
    const parts = [];
    if (countDelta !== 0) parts.push((countDelta > 0 ? "+" : "") + countDelta + " 核");
    if (clockPct && clockPct !== "持平") parts.push(clockPct);
    return { text: parts.join(" · ") || "持平", tone: countDelta < 0 || (cl.mhz && b.mhz && cl.mhz < b.mhz) ? "cut" : "boost" };
  }

  /* ---------------- delta summary ---------------- */

  function deltaSummary(chip) {
    if (!chip.baseChip || chip.isBase) return [];
    const b = chip.baseChip;
    const out = [];

    if (!chip.cpu && !chip.gpu) {
      return [{ text: "原文未公布", tone: "flat", label: "状态" }];
    }

    if (chip.maxClock && b.maxClock) {
      const p = ((chip.maxClock - b.maxClock) / b.maxClock) * 100;
      if (Math.abs(p) >= 0.5) {
        out.push({ text: (p > 0 ? "+" : "") + p.toFixed(0) + "%", tone: toneByPct(p), label: "最高主频" });
      }
    }
    if (chip.cpu && b.cpu && chip.cpu.cores !== b.cpu.cores) {
      const d = chip.cpu.cores - b.cpu.cores;
      out.push({ text: (d > 0 ? "+" : "") + d, tone: d > 0 ? "boost" : "cut", label: "核心数" });
    }
    if (chip.gpu && b.gpu) {
      if (chip.gpu.cus !== b.gpu.cus) {
        const p = ((chip.gpu.cus - b.gpu.cus) / b.gpu.cus) * 100;
        out.push({
          text: chip.gpu.cus + "cu (" + (p > 0 ? "+" : "") + Math.round(p) + "%)",
          tone: p > 0 ? "boost" : "cut",
          label: "GPU"
        });
      }
      if (chip.gpu.mhz && b.gpu.mhz && chip.gpu.mhz !== b.gpu.mhz) {
        const p = ((chip.gpu.mhz - b.gpu.mhz) / b.gpu.mhz) * 100;
        out.push({ text: (p > 0 ? "+" : "") + Math.round(p) + "%", tone: toneByPct(p), label: "GPU 频率" });
      }
    }
    const f = chip.features || {};
    if (f.modem && f.modem.state === "none") out.push({ text: "无", tone: "cut", label: "基带" });
    if (f.isp && f.isp.state === "cut") out.push({ text: "削减", tone: "cut", label: "ISP" });
    if (f.npu && f.npu.state === "cut") out.push({ text: "削减", tone: "cut", label: "NPU" });
    if (f.npu && f.npu.state === "half") out.push({ text: "半规格", tone: "half", label: "NPU" });
    if (chip.flags.noSuper) out.push({ text: "无", tone: "cut", label: "超大核" });

    if (!out.length) out.push({ text: "规格与本世代基准一致", tone: "flat", label: "持平" });
    return out;
  }

  /* ---------------- shared fragments ---------------- */

  function heroDieSVG() {
    return (
      '<svg class="die" viewBox="0 0 220 220" fill="none" aria-hidden="true">' +
      '<defs><linearGradient id="dieGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="currentColor" stop-opacity=".9"/>' +
      '<stop offset="1" stop-color="currentColor" stop-opacity=".25"/>' +
      "</linearGradient></defs>" +
      '<rect x="30" y="30" width="160" height="160" rx="30" stroke="url(#dieGrad)" stroke-width="1.4" opacity=".55"/>' +
      '<rect x="48" y="48" width="124" height="124" rx="22" stroke="url(#dieGrad)" stroke-width="1.2" opacity=".8"/>' +
      '<rect x="66" y="66" width="88" height="88" rx="16" stroke="currentColor" stroke-width="1" opacity=".35"/>' +
      '<rect x="84" y="84" width="52" height="52" rx="10" fill="url(#dieGrad)" opacity=".14"/>' +
      '<rect x="84" y="84" width="52" height="52" rx="10" stroke="currentColor" stroke-width="1.2" opacity=".65"/>' +
      '<text x="110" y="116" text-anchor="middle" fill="currentColor" font-size="15" font-weight="700" letter-spacing="2" opacity=".9">KIRIN</text>' +
      '<path d="M30 78h-14M30 110h-14M30 142h-14M190 78h14M190 110h14M190 142h14M78 30v-14M110 30v-14M142 30v-14M78 190v14M110 190v14M142 190v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".45"/>' +
      "</svg>"
    );
  }

  function statBlock(label, value, unit) {
    return (
      '<div class="stat"><span class="stat-label">' +
      esc(label) +
      '</span><span class="stat-value">' +
      esc(value) +
      (unit ? '<small>' + esc(unit) + "</small>" : "") +
      "</span></div>"
    );
  }

  function gpuStat(chip) {
    if (!chip.gpu) return "—";
    return chip.gpu.cus + "cu";
  }

  /* ---------------- chip card ---------------- */

  function chipCard(chip) {
    const inCompare = state.compare.includes(chip.id);
    const isFav = state.favs.includes(chip.id);
    const devCount = (chip.devices || []).length;
    return (
      '<article class="chip-card' +
      (chip.isBase ? " is-base-card" : "") +
      (chip.flags.unreleased ? " is-unreleased" : "") +
      '" data-action="open" data-id="' +
      chip.id +
      '" role="link" tabindex="0" aria-label="' +
      esc(chip.name) +
      '">' +
      '<div class="card-top">' +
      '<div class="card-title">' +
      '<span class="card-kicker">' +
      esc(chip.familyRef ? chip.familyRef.short : "") +
      " 世代 · " +
      esc(chip.typeLabel) +
      (processShort(chip) ? " · " + esc(processShort(chip)) : "") +
      "</span>" +
      '<h3 class="card-name">' +
      esc(chip.short) +
      "</h3>" +
      "</div>" +
      '<button class="icon-btn star' +
      (isFav ? " is-on" : "") +
      '" data-action="fav" data-id="' +
      chip.id +
      '" aria-label="' +
      (isFav ? "取消收藏" : "收藏") +
      '" aria-pressed="' +
      isFav +
      '">' +
      icon("star", isFav ? "fill" : "") +
      "</button>" +
      "</div>" +
      '<p class="card-tagline">' +
      esc(chip.tagline) +
      "</p>" +
      '<div class="badges">' +
      badgesHTML(chip, { max: 3 }) +
      "</div>" +
      '<div class="card-specs">' +
      '<div class="spec-line"><span>CPU</span><b>' +
      esc(cpuLine(chip)) +
      "</b></div>" +
      '<div class="spec-line"><span>GPU</span><b>' +
      esc(chip.gpu ? chip.gpu.name + " · " + chip.gpu.cus + "cu · " + fmtMhz(chip.gpu.mhz) : "未公布") +
      "</b></div>" +
      "</div>" +
      '<div class="card-foot">' +
      '<span class="dev-count">' +
      (devCount ? icon(chip.type === "tablet" ? "tablet" : chip.type === "pc" ? "pc" : "phone", "tiny") + devCount + " 款机型" : chip.flags.unreleased ? "尚未出现" : "机型未列") +
      "</span>" +
      '<button class="mini-btn' +
      (inCompare ? " is-on" : "") +
      '" data-action="cmp" data-id="' +
      chip.id +
      '" aria-pressed="' +
      inCompare +
      '">' +
      icon(inCompare ? "check" : "plus", "tiny") +
      (inCompare ? "已加入" : "对比") +
      "</button>" +
      "</div>" +
      "</article>"
    );
  }

  /* ---------------- chips view ---------------- */

  function filteredChips() {
    const q = state.query.trim().toLowerCase();
    let list = orderedChips.filter((c) => {
      if (state.type !== "all" && c.type !== state.type) return false;
      if (state.family !== "all" && c.family !== state.family) return false;
      if (state.onlyBase && !c.isBase) return false;
      if (state.favOnly && !state.favs.includes(c.id)) return false;
      if (q && !c.search.includes(q)) return false;
      return true;
    });

    if (state.sort === "clock") list = list.slice().sort((a, b) => (b.maxClock || 0) - (a.maxClock || 0));
    else if (state.sort === "gpu") list = list.slice().sort((a, b) => (b.gpuIndex || 0) - (a.gpuIndex || 0));
    else if (state.sort === "name") list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
    return list;
  }

  function resultBarHTML(list) {
    const hasFilter =
      state.query || state.type !== "all" || state.family !== "all" || state.onlyBase || state.favOnly;
    return (
      '<div class="resultbar" id="resultbar">' +
      "<div><b>" +
      list.length +
      "</b><span> / " +
      chips.length +
      " 款芯片</span></div>" +
      (hasFilter
        ? '<button class="text-btn" data-action="reset">清除筛选 ' + icon("close", "tiny") + "</button>"
        : '<span class="result-hint">' + icon("balance", "tiny") + " 最多可同时对比 10 款</span>") +
      "</div>"
    );
  }

  function resultsHTML() {
    const list = filteredChips();
    if (!list.length) {
      return (
        resultBarHTML(list) +
        '<div class="empty">' +
        icon("search", "empty-icon") +
        "<h3>没有找到匹配的芯片</h3><p>试试搜索「9000S」「Mate 70」「T92」或切换筛选条件。</p>" +
        '<button class="btn" data-action="reset">清除筛选</button>' +
        "</div>"
      );
    }
    return resultBarHTML(list) + '<div class="chip-grid">' + list.map(chipCard).join("") + "</div>";
  }

  function chipsView() {
    const derivativeCount = chips.filter((c) => !c.isBase && !c.reference).length;
    const deviceSet = new Set();
    chips.forEach((c) => (c.devices || []).forEach((d) => deviceSet.add(d)));

    return (
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<p class="eyebrow">' +
      icon("chip", "tiny") +
      " KIRIN-L · 内置数据库 v" +
      esc(DATA.meta.dataVersion) +
      "</p>" +
      "<h1>麒麟芯片图鉴</h1>" +
      '<p class="lede">从 9000S 到 9050，把每一颗麒麟的 <b>CPU 刀法</b>、<b>GPU 规模</b>、<b>基带 / ISP / NPU 削减</b> 和搭载机型拆开看；原文没写的制程、缓存、内存、基带、NPU 与跑分，也去公开资料里补齐并标注来源。</p>' +
      '<div class="hero-stats">' +
      statBlock("芯片", chips.length, "款") +
      statBlock("世代", families.length, "个") +
      statBlock("衍生型号", derivativeCount, "款") +
      statBlock("机型条目", deviceSet.size, "条") +
      "</div>" +
      "</div>" +
      '<div class="hero-art">' +
      heroDieSVG() +
      "</div>" +
      "</section>" +

      '<section class="toolbar">' +
      '<div class="searchbox">' +
      icon("search") +
      '<input id="q" type="search" placeholder="搜索芯片、核心代号、机型…" autocomplete="off" value="' +
      esc(state.query) +
      '">' +
      '<button class="search-clear' +
      (state.query ? "" : " is-hidden") +
      '" data-action="clearq" aria-label="清空搜索">' +
      icon("close", "tiny") +
      "</button>" +
      "</div>" +
      '<div class="segmented" role="group" aria-label="设备类型">' +
      ["all", "phone", "tablet", "pc"]
        .map(
          (t) =>
            '<button class="' +
            (state.type === t ? "on" : "") +
            '" data-action="type" data-type="' +
            t +
            '">' +
            (t === "all" ? "全部" : TYPE_LABEL[t]) +
            "</button>"
        )
        .join("") +
      "</div>" +
      "</section>" +

      '<section class="filterbar">' +
      '<div class="family-filters">' +
      '<button class="pill' +
      (state.family === "all" ? " on" : "") +
      '" data-action="family" data-family="all">全部世代</button>' +
      families
        .map(
          (f) =>
            '<button class="pill' +
            (state.family === f.id ? " on" : "") +
            '" data-action="family" data-family="' +
            f.id +
            '">' +
            esc(f.short) +
            "</button>"
        )
        .join("") +
      "</div>" +
      '<div class="filter-tools">' +
      '<button class="tool-btn' +
      (state.onlyBase ? " on" : "") +
      '" data-action="onlybase" aria-pressed="' +
      state.onlyBase +
      '">' +
      icon("spark", "tiny") +
      "仅基准</button>" +
      '<button class="tool-btn' +
      (state.favOnly ? " on" : "") +
      '" data-action="favonly" aria-pressed="' +
      state.favOnly +
      '">' +
      icon("star", "tiny") +
      "收藏</button>" +
      '<label class="sortbox">' +
      icon("sort", "tiny") +
      '<select id="sort" aria-label="排序">' +
      '<option value="gen"' +
      (state.sort === "gen" ? " selected" : "") +
      ">世代顺序</option>" +
      '<option value="clock"' +
      (state.sort === "clock" ? " selected" : "") +
      ">主频优先</option>" +
      '<option value="gpu"' +
      (state.sort === "gpu" ? " selected" : "") +
      ">GPU 规模</option>" +
      '<option value="name"' +
      (state.sort === "name" ? " selected" : "") +
      ">名称</option>" +
      "</select></label>" +
      "</div>" +
      "</section>" +

      '<section id="results">' +
      resultsHTML() +
      "</section>"
    );
  }

  /* ---------------- detail view ---------------- */

  function featureCard(label, feature, iconName) {
    const st = feature ? feature.state : "unknown";
    return (
      '<div class="feature-card tone-' +
      featureTone(st) +
      '">' +
      '<div class="feature-head">' +
      icon(iconName, "tiny") +
      "<span>" +
      esc(label) +
      "</span></div>" +
      '<div class="feature-value">' +
      esc(FEATURE_LABEL[st] || "未标注") +
      "</div>" +
      (feature && feature.note ? '<p class="feature-note">' + esc(feature.note) + "</p>" : "") +
      "</div>"
    );
  }

  const RESEARCH_META = [
    ["process", "制程工艺", "chip"],
    ["memory", "内存规格", "layers"],
    ["cache", "缓存规格", "sort"],
    ["npu", "NPU", "spark"],
    ["isp", "ISP", "sparkles"],
    ["modem", "基带", "radio"]
  ];

  function researchPanelHTML(chip) {
    const r = chip.research;
    if (!r) {
      return (
        '<section class="panel research-panel"><div class="panel-head"><h2>' +
        icon("info", "tiny") +
        " 补充资料</h2>" +
        '<span class="panel-meta">联网核对</span></div>' +
        '<p class="panel-note">该型号尚未出现或规格未公布，暂未查到可靠的公开补充资料。</p></section>'
      );
    }

    const cards = RESEARCH_META.map(([key, label, iconName]) => {
      const f = r.fields[key];
      if (!f) return "";
      return (
        '<div class="research-card">' +
        '<div class="research-head"><span class="research-label">' +
        icon(iconName, "tiny") +
        esc(label) +
        "</span>" +
        confidenceBadge(f.confidence) +
        "</div>" +
        '<div class="research-value">' +
        esc(f.value) +
        "</div>" +
        (f.detail ? '<p class="research-detail">' + esc(f.detail) + "</p>" : "") +
        '<div class="research-foot">' +
        (f.inherited ? '<span class="research-inherit">同系列基准</span>' : "") +
        '<span class="research-src">' +
        (sourceLinks(f.sources) || '<span class="src-none">无公开链接</span>') +
        "</span>" +
        "</div>" +
        "</div>"
      );
    }).join("");

    const bench =
      r.benchmarks && r.benchmarks.length
        ? '<div class="bench-block"><div class="bench-head"><h3>跑分参考</h3>' +
          (r.benchmarkInherited && r.inheritedFrom
            ? '<span>同系列基准平台（' + esc(r.inheritedFrom) + "）</span>"
            : '<span>实测 / 媒体数据</span>') +
          "</div><div class=\"bench-list\">" +
          r.benchmarks
            .map(
              (b) =>
                '<div class="bench-row"><span class="bench-name">' +
                esc(b.name) +
                '</span><b class="bench-value">' +
                esc(b.value) +
                '</b><span class="bench-device">' +
                esc(b.device || "") +
                '</span><span class="bench-src">' +
                (sourceLinks(b.sources) || "") +
                "</span></div>"
            )
            .join("") +
          "</div>" +
          (r.benchmarkNote ? '<p class="panel-note">' + esc(r.benchmarkNote) + "</p>" : "") +
          "</div>"
        : r.benchmarkNote
        ? '<p class="panel-note bench-only-note">' + icon("info", "tiny") + " " + esc(r.benchmarkNote) + "</p>"
        : "";

    return (
      '<section class="panel research-panel"><div class="panel-head"><h2>' +
      icon("info", "tiny") +
      " 补充资料</h2><span class=\"panel-meta\">原文之外 · 联网核对</span></div>" +
      '<p class="research-intro">以下为原文没有给出、但能在公开资料中查到的信息。每项都标了来源与可信度；不同来源冲突时并列说明，不取单一说法冒充定论。基带 / ISP / NPU 是否被砍，仍以「功能模块」卡片为准。</p>' +
      (r.inheritedFrom
        ? '<p class="research-inherit-note">' +
          icon("layers", "tiny") +
          " 该型号未单独公布全部数据，部分字段沿用同系列基准 <a href=\"#/chip/" +
          esc(r.inheritedFromId) +
          '">' +
          esc(r.inheritedFrom) +
          "</a> 的公开资料。</p>"
        : "") +
      '<div class="research-grid">' +
      cards +
      "</div>" +
      bench +
      "</section>"
    );
  }

  function chipDetailView(chip) {    const rel = chip.baseChip && chip.baseChip !== chip ? chip.baseChip : null;
    const dsum = deltaSummary(chip);
    const idx = orderedIndex.get(chip.id) || 0;
    const prev = orderedChips[idx - 1];
    const next = orderedChips[idx + 1];
    const inCompare = state.compare.includes(chip.id);
    const isFav = state.favs.includes(chip.id);

    const cpuRows = chip.cpu
      ? chip.cpu.clusters
          .map((cl, i) => {
            const d = rel ? clusterDelta(chip, rel, cl) : null;
            return (
              "<tr>" +
              '<td><span class="role role-' +
              (cl.role === "超大核" ? "super" : cl.role === "大核" ? "big" : "small") +
              '">' +
              esc(cl.role) +
              "</span>" +
              (cl.tag ? '<span class="cluster-tag">' + esc(cl.tag) + "</span>" : "") +
              "</td>" +
              "<td>" +
              (cl.count > 0 ? cl.count + " 核" : '<span class="muted">—</span>') +
              "</td>" +
              "<td>" +
              (cl.mhz > 0 ? esc(fmtGh(cl.mhz)) : '<span class="muted">—</span>') +
              "</td>" +
              '<td class="arch">' +
              esc(cl.arch || "—") +
              "</td>" +
              "<td>" +
              (d
                ? '<span class="delta tone-' + d.tone + '">' + esc(d.text) + "</span>"
                : '<span class="muted">' + (rel ? "—" : "基准") + "</span>") +
              "</td>" +
              "</tr>"
            );
          })
          .join("")
      : '<tr><td colspan="5" class="muted">原文未公布 CPU 规格。</td></tr>';

    const gpuDelta =
      rel && rel.gpu && chip.gpu
        ? '<span class="delta tone-' +
          (chip.gpu.cus < rel.gpu.cus ? "cut" : chip.gpu.cus > rel.gpu.cus ? "boost" : "flat") +
          '">' +
          (chip.gpu.cus === rel.gpu.cus
            ? "CU 持平"
            : "CU " +
              rel.gpu.cus +
              " → " +
              chip.gpu.cus +
              "（" +
              (((chip.gpu.cus - rel.gpu.cus) / rel.gpu.cus) * 100 > 0 ? "+" : "") +
              Math.round(((chip.gpu.cus - rel.gpu.cus) / rel.gpu.cus) * 100) +
              "%）") +
          "</span>"
        : "";

    const related = [];
    if (rel) related.push(rel);
    (chip.children || []).forEach((c) => related.push(c));
    if (chip.parentId && byId.has(chip.parentId) && (!rel || byId.get(chip.parentId).id !== rel.id)) {
      related.push(byId.get(chip.parentId));
    }
    const seen = new Set();
    const relatedUnique = related.filter((c) => c && c.id !== chip.id && !seen.has(c.id) && seen.add(c.id));

    return (
      '<div class="crumbs"><a href="#/chips">芯片</a>' +
      icon("chevron", "tiny") +
      '<a href="#/series/' +
      chip.family +
      '">' +
      esc(chip.familyRef ? chip.familyRef.name : "") +
      "</a>" +
      icon("chevron", "tiny") +
      "<span>" +
      esc(chip.short) +
      "</span></div>" +

      '<section class="detail-hero">' +
      '<div class="detail-head">' +
      '<p class="eyebrow">' +
      esc(chip.familyRef ? chip.familyRef.name : "") +
      " · " +
      esc(chip.typeLabel) +
      (processShort(chip) ? " · " + esc(processShort(chip)) : "") +
      (chip.reference ? " · 参照芯片" : chip.isBase ? " · 基准芯片" : " · 衍生型号") +
      "</p>" +
      "<h1>麒麟 " +
      esc(chip.short) +
      "</h1>" +
      '<p class="lede">' +
      esc(chip.tagline) +
      "</p>" +
      '<div class="badges">' +
      badgesHTML(chip) +
      "</div>" +
      '<div class="actions">' +
      '<button class="btn' +
      (isFav ? " is-on" : "") +
      '" data-action="fav" data-id="' +
      chip.id +
      '">' +
      icon("star", "tiny" + (isFav ? " fill" : "")) +
      (isFav ? "已收藏" : "收藏") +
      "</button>" +
      '<button class="btn primary' +
      (inCompare ? " is-on" : "") +
      '" data-action="cmp" data-id="' +
      chip.id +
      '">' +
      icon(inCompare ? "check" : "balance", "tiny") +
      (inCompare ? "已加入对比" : "加入对比") +
      "</button>" +
      '<button class="btn ghost" data-action="share" data-id="' +
      chip.id +
      '">' +
      icon("copy", "tiny") +
      "复制链接</button>" +
      "</div>" +
      "</div>" +
      '<div class="detail-stats">' +
      statBlock("最高主频", chip.maxClock ? (chip.maxClock / 1000).toFixed(2).replace(/\.?0+$/, "") : "—", chip.maxClock ? "GHz" : "") +
      statBlock("核心 / 线程", (chip.cpu ? chip.cpu.cores : "—") + " / " + (chip.cpu && chip.cpu.threads ? chip.cpu.threads : "—"), "") +
      statBlock("GPU", gpuStat(chip), chip.gpu && chip.gpu.mhz ? fmtMhz(chip.gpu.mhz) : "") +
      statBlock("GPU 规格指数", chip.gpuIndex ? chip.gpuIndex : "—", chip.gpuIndex ? "CU×MHz" : "") +
      "</div>" +
      "</section>" +

      '<div class="detail-grid">' +
      '<div class="detail-main">' +

      (!chip.isBase && rel
        ? '<section class="panel compare-banner">' +
          '<div class="panel-head"><h2>' +
          icon("balance", "tiny") +
          " 相对基准：" +
          esc(rel.short) +
          "</h2><a class=\"text-btn\" href=\"#/chip/" +
          rel.id +
          '">查看基准 ' +
          icon("arrow", "tiny") +
          "</a></div>" +
          '<div class="delta-chips">' +
          dsum
            .map(
              (d) =>
                '<span class="delta-chip tone-' + d.tone + '"><b>' + esc(d.label) + "</b>" + esc(d.text) + "</span>"
            )
            .join("") +
          "</div>" +
          '<p class="panel-note">沿用原文配色：<span class="tone-cut-text">绿色 = 削减项</span>，<span class="tone-boost-text">红色 = 加强项</span>。</p>' +
          "</section>"
        : "") +

      '<section class="panel">' +
      '<div class="panel-head"><h2>' +
      icon("cpu", "tiny") +
      " CPU 构成</h2>" +
      (chip.cpu
        ? '<span class="panel-meta">' +
          chip.cpu.cores +
          " 核" +
          (chip.cpu.threads ? " / " + chip.cpu.threads + " 线程" : "") +
          "</span>"
        : "") +
      "</div>" +
      (chip.cpu
        ? '<div class="table-wrap"><table class="spec-table"><thead><tr><th>簇</th><th>核心</th><th>频率</th><th>核心代号</th><th>相对基准</th></tr></thead><tbody>' +
          cpuRows +
          "</tbody></table></div>" +
          (chip.cpu.note ? '<p class="panel-note">' + esc(chip.cpu.note) + "</p>" : "")
        : '<p class="panel-note">原文只提到该型号“尚未出现”，没有给出 CPU 规格。</p>') +
      "</section>" +

      '<section class="panel">' +
      '<div class="panel-head"><h2>' +
      icon("gpu", "tiny") +
      " GPU</h2>" +
      (chip.gpu && rel ? "" : '<span class="panel-meta">原文数据</span>') +
      "</div>" +
      (chip.gpu
        ? '<div class="gpu-block">' +
          '<div class="gpu-name"><b>' +
          esc(chip.gpu.name) +
          "</b><span>" +
          (chip.gpu.cus ? chip.gpu.cus + " CU" : "CU 未标注") +
          " · " +
          esc(fmtMhz(chip.gpu.mhz)) +
          "</span></div>" +
          '<div class="gpu-bars">' +
          '<div class="gpu-bar-row"><span>计算单元</span><div class="bar-track"><span class="bar-fill" style="width:' +
          Math.min(100, (chip.gpu.cus / 8) * 100) +
          '%"></span></div><b>' +
          chip.gpu.cus +
          "cu</b></div>" +
          (chip.gpu.mhz
            ? '<div class="gpu-bar-row"><span>频率</span><div class="bar-track"><span class="bar-fill alt" style="width:' +
              Math.min(100, (chip.gpu.mhz / 1200) * 100) +
              '%"></span></div><b>' +
              chip.gpu.mhz +
              "MHz</b></div>"
            : "") +
          "</div>" +
          gpuDelta +
          (rel && rel.gpu
            ? '<p class="panel-note">本世代基准 ' +
              esc(rel.short) +
              "：" +
              esc(rel.gpu.name) +
              " · " +
              rel.gpu.cus +
              "cu · " +
              esc(fmtMhz(rel.gpu.mhz)) +
              "。规格指数 " +
              (chip.gpuIndex || "—") +
              " = CU × 频率，仅供规模参考，不代表实测性能。</p>"
            : '<p class="panel-note">GPU 规格指数 = CU × 频率，仅供规模参考，不代表实测性能。</p>') +
          "</div>"
        : '<p class="panel-note">原文未公布该型号的 GPU 规格。</p>') +
      "</section>" +

      '<section class="panel">' +
      '<div class="panel-head"><h2>' +
      icon("radio", "tiny") +
      " 功能模块</h2><span class=\"panel-meta\">基带 / ISP / NPU</span></div>" +
      '<div class="feature-grid">' +
      featureCard("基带", chip.features && chip.features.modem, "radio") +
      featureCard("ISP", chip.features && chip.features.isp, "sparkles") +
      featureCard("NPU", chip.features && chip.features.npu, "spark") +
      "</div>" +
      '<p class="panel-note">原文只标注“削减 / 无 / 半”等状态，没有给出 ISP 与 NPU 的具体型号或算力。</p>' +
      "</section>" +

      researchPanelHTML(chip) +

      (chip.variants && chip.variants.length
        ? '<section class="panel"><div class="panel-head"><h2>' +
          icon("layers", "tiny") +
          " 版本与封装</h2></div><div class=\"variant-list\">" +
          chip.variants
            .map(
              (v) =>
                '<div class="variant"><b>' + esc(v.name) + "</b><span>" + esc(v.note) + "</span></div>"
            )
            .join("") +
          "</div></section>"
        : "") +

      '<section class="panel">' +
      '<div class="panel-head"><h2>' +
      icon("info", "tiny") +
      " 原文要点</h2><a class=\"text-btn\" href=\"" +
      esc(DATA.meta.source.url) +
      '" target="_blank" rel="noopener">来源 ' +
      icon("arrow", "tiny") +
      "</a></div>" +
      '<ul class="note-list">' +
      (chip.notes || []).map((n) => "<li>" + esc(n) + "</li>").join("") +
      "</ul>" +
      "</section>" +

      '<section class="panel">' +
      '<div class="panel-head"><h2>' +
      icon("layers", "tiny") +
      " 完整字段</h2><span class=\"panel-meta\">原文 + 联网补充</span></div>" +
      '<div class="table-wrap"><table class="field-table"><tbody>' +
      '<tr><th>厂商</th><td>华为海思 HiSilicon</td></tr>' +
      '<tr><th>世代</th><td>' +
      esc(chip.familyRef ? chip.familyRef.name : "") +
      "</td></tr>" +
      '<tr><th>设备类型</th><td>' +
      esc(chip.typeLabel) +
      "</td></tr>" +
      '<tr><th>定位</th><td>' +
      (chip.reference ? "参照芯片" : chip.isBase ? "基准芯片" : chip.unreleased ? "尚未出现" : "衍生型号") +
      (chip.parentId && byId.has(chip.parentId) ? "（派生自 " + esc(byId.get(chip.parentId).short) + "）" : "") +
      "</td></tr>" +
      '<tr><th>CPU 簇</th><td>' +
      esc(chip.cpu ? chip.cpu.clusters.map((x) => x.role + " " + (x.count || 0) + "×" + (x.mhz ? (x.mhz / 1000).toFixed(2).replace(/\.?0+$/, "") + "GHz" : "—")).join(" · ") : "—") +
      "</td></tr>" +
      '<tr><th>核心代号</th><td>' +
      esc(
        chip.cpu
          ? Array.from(
              new Set(
                chip.cpu.clusters
                  .map((x) => x.arch)
                  .filter((a) => a && a !== "—")
              )
            ).join(" / ")
          : "—"
      ) +
      "</td></tr>" +
      '<tr><th>GPU</th><td>' +
      esc(chip.gpu ? chip.gpu.name + " · " + chip.gpu.cus + "cu · " + fmtMhz(chip.gpu.mhz) : "—") +
      "</td></tr>" +
      '<tr><th>基带</th><td>' +
      esc(FEATURE_LABEL[(chip.features && chip.features.modem && chip.features.modem.state) || "unknown"]) +
      "</td></tr>" +
      '<tr><th>ISP</th><td>' +
      esc(FEATURE_LABEL[(chip.features && chip.features.isp && chip.features.isp.state) || "unknown"]) +
      "</td></tr>" +
      '<tr><th>NPU</th><td>' +
      esc(FEATURE_LABEL[(chip.features && chip.features.npu && chip.features.npu.state) || "unknown"]) +
      "</td></tr>" +
      researchRow(chip, "process", "制程工艺") +
      researchRow(chip, "memory", "内存规格") +
      researchRow(chip, "cache", "缓存规格") +
      researchRow(chip, "npu", "NPU 架构") +
      researchRow(chip, "isp", "ISP 型号") +
      researchRow(chip, "modem", "基带型号") +
      (chip.extraSpecs || []).map((s) => "<tr><th>" + esc(s.label) + "</th><td>" + esc(s.value) + "</td></tr>").join("") +
      "</tbody></table></div>" +
      '<p class="panel-note">原文没有给出的字段已联网核对；仍无可靠来源的标为「未查到」，不做猜测。补充资料的可信度与链接见上方「补充资料」。</p>' +
      "</section>" +

      "</div>" +

      '<aside class="detail-aside">' +
      '<section class="panel">' +
      '<div class="panel-head"><h2>' +
      icon("phone", "tiny") +
      " 搭载机型</h2><span class=\"panel-meta\">" +
      (chip.devices || []).length +
      " 条</span></div>" +
      ((chip.devices || []).length
        ? '<ul class="device-list">' +
          chip.devices.map((d) => "<li>" + icon("chevron", "tiny") + esc(d) + "</li>").join("") +
          "</ul>"
        : '<p class="panel-note">' +
          (chip.flags.unreleased ? "该芯片尚未出现，原文未给出机型。" : "原文未列出机型。") +
          "</p>") +
      "</section>" +

      (relatedUnique.length
        ? '<section class="panel"><div class="panel-head"><h2>' +
          icon("layers", "tiny") +
          " 相关芯片</h2></div><div class=\"related-list\">" +
          relatedUnique
            .map(
              (c) =>
                '<a class="related" href="#/chip/' +
                c.id +
                '"><span><b>' +
                esc(c.short) +
                "</b><small>" +
                esc(c.typeLabel) +
                " · " +
                esc(c.gpu ? c.gpu.cus + "cu" : "—") +
                "</small></span>" +
                icon("chevron", "tiny") +
                "</a>"
            )
            .join("") +
          "</div></section>"
        : "") +

      '<section class="panel source-panel">' +
      '<p class="source-title">' +
      icon("info", "tiny") +
      " 数据来源</p>" +
      "<p>《" +
      esc(DATA.meta.source.title) +
      "》 · " +
      esc(DATA.meta.source.author) +
      "</p>" +
      '<a class="text-btn" href="' +
      esc(DATA.meta.source.url) +
      '" target="_blank" rel="noopener">在酷安查看原文 ' +
      icon("arrow", "tiny") +
      "</a>" +
      "</section>" +
      "</aside>" +
      "</div>" +

      '<nav class="pager">' +
      (prev
        ? '<a class="pager-item" href="#/chip/' + prev.id + '">' + icon("back", "tiny") + "<span><small>上一款</small><b>" + esc(prev.short) + "</b></span></a>"
        : "<span></span>") +
      (next
        ? '<a class="pager-item next" href="#/chip/' + next.id + '"><span><small>下一款</small><b>' + esc(next.short) + "</b></span>" + icon("chevron", "tiny") + "</a>"
        : "<span></span>") +
      "</nav>"
    );
  }

  /* ---------------- compare view ---------------- */

  const CMP_GROUPS = [
    {
      group: "基本",
      rows: [
        { label: "世代", get: (c) => (c.familyRef ? c.familyRef.short : "—") },
        { label: "定位", get: (c) => (c.unreleased ? "未上市" : c.reference ? "参照" : c.isBase ? "基准" : "衍生") },
        { label: "设备类型", get: (c) => c.typeLabel },
        { label: "最高主频", get: (c) => (c.maxClock ? fmtGh(c.maxClock) : "—"), num: (c) => c.maxClock },
        { label: "核心 / 线程", get: (c) => (c.cpu ? c.cpu.cores + " / " + (c.cpu.threads || "—") : "—") },
        { label: "核心代号", get: (c) => (c.cpu ? Array.from(new Set(c.cpu.clusters.map((x) => x.arch).filter((a) => a && a !== "—"))).join(" / ") : "—") }
      ]
    },
    {
      group: "CPU",
      rows: [
        { label: "超大核", get: (c) => clusterText(c, "超大核") },
        { label: "大核", get: (c) => clusterText(c, "大核") },
        { label: "小核", get: (c) => clusterText(c, "小核") }
      ]
    },
    {
      group: "GPU",
      rows: [
        { label: "型号", get: (c) => (c.gpu ? c.gpu.name : "—") },
        { label: "计算单元", get: (c) => (c.gpu ? c.gpu.cus + " cu" : "—"), num: (c) => (c.gpu ? c.gpu.cus : null) },
        { label: "GPU 频率", get: (c) => (c.gpu ? fmtMhz(c.gpu.mhz) : "—"), num: (c) => (c.gpu ? c.gpu.mhz : null) },
        { label: "规格指数", get: (c) => (c.gpuIndex ? c.gpuIndex + " CU×MHz" : "—"), num: (c) => c.gpuIndex }
      ]
    },
    {
      group: "功能模块",
      rows: [
        { label: "基带", get: (c) => FEATURE_LABEL[(c.features && c.features.modem && c.features.modem.state) || "unknown"], feature: (c) => c.features && c.features.modem, key: "modem" },
        { label: "ISP", get: (c) => FEATURE_LABEL[(c.features && c.features.isp && c.features.isp.state) || "unknown"], feature: (c) => c.features && c.features.isp, key: "isp" },
        { label: "NPU", get: (c) => FEATURE_LABEL[(c.features && c.features.npu && c.features.npu.state) || "unknown"], feature: (c) => c.features && c.features.npu, key: "npu" }
      ]
    },
    {
      group: "补充规格",
      rows: [
        { label: "制程", get: (c) => { const f = researchField(c, "process"); return f ? f.value : "—"; } },
        { label: "缓存", get: (c) => { const f = researchField(c, "cache"); return f ? f.value : "—"; } },
        { label: "内存", get: (c) => { const f = researchField(c, "memory"); return f ? f.value : "—"; } },
        { label: "NPU", get: (c) => { const f = researchField(c, "npu"); return f ? f.value : "—"; } },
        { label: "基带型号", get: (c) => { const f = researchField(c, "modem"); return f ? f.value : "—"; } },
        { label: "GB6 单核", get: (c) => benchmarkValue(c, "Geekbench 6 单核") || "—" },
        { label: "GB6 多核", get: (c) => benchmarkValue(c, "Geekbench 6 多核") || "—" }
      ]
    },
    {
      group: "其他",
      rows: [
        { label: "版本 / 封装", get: (c) => (c.variants && c.variants.length ? c.variants.map((v) => v.name).join(" / ") : (c.extraSpecs && c.extraSpecs.length ? c.extraSpecs.map((s) => s.value).join("；") : "—")) },
        { label: "代表机型", get: (c) => (c.devices && c.devices.length ? c.devices.join("、") : "—"), truncate: true }
      ]
    }
  ];

  function compareChips() {
    return state.compare.map((id) => byId.get(id)).filter(Boolean);
  }

  function cmpTableHTML(list) {
    if (!list.length) return "";
    let rowsHTML = "";
    CMP_GROUPS.forEach((g) => {
      const rows = [];
      g.rows.forEach((row) => {
        const values = list.map((c) => row.get(c));
        if (state.diffOnly && values.every((v) => v === values[0])) return;
        let bestVal = null;
        if (row.num) {
          const nums = list.map((c) => row.num(c)).filter((n) => n != null && n > 0);
          if (nums.length) bestVal = Math.max.apply(null, nums);
        }
        rows.push(
          '<tr><th scope="row">' +
            esc(row.label) +
            "</th>" +
            list
              .map((c, i) => {
                const raw = row.get(c);
                const num = row.num ? row.num(c) : null;
                const isBest = bestVal != null && num === bestVal && list.length > 1;
                const feat = row.feature ? row.feature(c) : null;
                const cls = [];
                if (isBest) cls.push("is-best");
                if (feat) cls.push("tone-" + featureTone(feat.state));
                if (row.truncate && raw && raw.length > 34) {
                  return (
                    '<td class="' +
                    cls.join(" ") +
                    '" title="' +
                    esc(raw) +
                    '">' +
                    esc(raw.slice(0, 34)) +
                    "…</td>"
                  );
                }
                return (
                  '<td class="' +
                  cls.join(" ") +
                  '">' +
                  esc(raw) +
                  (isBest ? '<span class="best-dot">最高</span>' : "") +
                  "</td>"
                );
              })
              .join("") +
            "</tr>"
        );
      });
      if (rows.length) {
        rowsHTML +=
          '<tr class="group-row"><th colspan="' + (list.length + 1) + '">' + esc(g.group) + "</th></tr>" + rows.join("");
      }
    });

    return (
      '<div class="cmp-scroll"><table class="cmp-table" style="min-width:' +
      (100 + list.length * 190) +
      'px"><thead><tr><th scope="col" class="corner">规格</th>' +
      list
        .map(
          (c) =>
            '<th scope="col" class="chip-head"><a href="#/chip/' +
            c.id +
            '"><span class="cmp-name">' +
            esc(c.short) +
            '</span><small>' +
            esc(c.familyRef ? c.familyRef.short : "") +
            " · " +
            esc(c.typeLabel) +
            "</small></a>" +
            '<button class="icon-btn remove" data-action="uncmp" data-id="' +
            c.id +
            '" aria-label="移出对比">' +
            icon("close", "tiny") +
            "</button></th>"
        )
        .join("") +
      "</tr></thead><tbody>" +
      rowsHTML +
      "</tbody></table></div>"
    );
  }

  function chartRows(list, getter, fmt, allowZero) {
    return list
      .filter((c) => getter(c) != null && (allowZero || getter(c) > 0))
      .map((c) => ({ label: c.short, value: getter(c), text: fmt(c), base: c.isBase }))
      .sort((a, b) => b.value - a.value);
  }

  function chartHTML(title, rows) {
    if (!rows.length) return "";
    const max = Math.max.apply(null, rows.map((r) => r.value).concat([1]));
    return (
      '<div class="chart-block"><div class="chart-head"><h4>' +
      esc(title) +
      '</h4><span>按数值降序</span></div>' +
      rows
        .map(
          (r) =>
            '<div class="chart-row' +
            (r.base ? " is-base" : "") +
            '"><span class="chart-name">' +
            esc(r.label) +
            '</span><div class="chart-track"><span class="chart-fill" style="width:' +
            Math.max(2, (r.value / max) * 100) +
            '%"></span></div><span class="chart-val">' +
            esc(r.text) +
            "</span></div>"
        )
        .join("") +
      "</div>"
    );
  }

  function compareView() {
    const list = compareChips();
    if (!list.length) {
      return (
        '<section class="page-head"><p class="eyebrow">' +
        icon("balance", "tiny") +
        " COMPARE</p><h1>芯片对比</h1><p class=\"lede\">最多同时对比 10 款麒麟芯片，按世代、CPU 簇、GPU 规模、基带 / ISP / NPU 逐项并排。</p></section>" +
        '<div class="empty big"><div class="empty-art">' +
        icon("balance", "empty-icon") +
        '</div><h3>对比列表还是空的</h3><p>去芯片列表挑几颗，点「对比」加入即可。</p><a class="btn primary" href="#/chips">' +
        icon("chip", "tiny") +
        " 去挑芯片</a></div>"
      );
    }

    const charts =
      chartHTML("最高主频 (GHz)", chartRows(list, (c) => c.maxClock, (c) => (c.maxClock / 1000).toFixed(2))) +
      chartHTML("GPU 计算单元 (cu)", chartRows(list, (c) => (c.gpu ? c.gpu.cus : null), (c) => c.gpu.cus + " cu")) +
      chartHTML("GPU 规格指数 (CU×MHz)", chartRows(list, (c) => c.gpuIndex, (c) => c.gpuIndex + "")) +
      chartHTML("物理核心数", chartRows(list, (c) => (c.cpu ? c.cpu.cores : null), (c) => c.cpu.cores + " 核"));

    return (
      '<section class="page-head"><p class="eyebrow">' +
      icon("balance", "tiny") +
      " COMPARE</p><h1>芯片对比</h1>" +
      '<div class="page-actions"><span class="counter">' +
      list.length +
      " / " +
      MAX_COMPARE +
      " 款</span>" +
      '<button class="btn" data-action="add">' +
      icon("plus", "tiny") +
      " 添加芯片</button>" +
      '<button class="btn ghost" data-action="sharecmp">' +
      icon("copy", "tiny") +
      " 分享</button>" +
      '<button class="btn ghost danger" data-action="clearcmp">' +
      icon("trash", "tiny") +
      " 清空</button></div></section>" +
      '<div class="cmp-toolbar"><label class="switch"><input type="checkbox" id="diffonly"' +
      (state.diffOnly ? " checked" : "") +
      "><span>仅显示差异项</span></label>" +
      '<span class="cmp-hint">' +
      icon("star", "tiny") +
      " 数值最高项会标记为「最高」；相同项可一键隐藏。</span></div>" +
      (list.length > 2
        ? '<div class="cmp-swipe">' + icon("swipe", "tiny") + " 左右滑动查看全部 " + list.length + " 款</div>"
        : "") +
      cmpTableHTML(list) +
      '<section class="panel charts-panel"><div class="panel-head"><h2>' +
      icon("gpu", "tiny") +
      " 规格条形图</h2><span class=\"panel-meta\">原始规格，不是跑分</span></div>" +
      '<div class="charts">' +
      charts +
      "</div>" +
      '<p class="panel-note">GPU 规格指数 = 计算单元 × 频率，只能粗看规模；不同 GPU 架构、制程与调度差异很大，原文明确提到 X90 的 6cu 马良 916 实际仅略强于 4cu 马良 920，因此不要把它当成性能排名。</p>' +
      "</section>"
    );
  }

  /* ---------------- series view ---------------- */

  function familyChips(familyId) {
    return orderedChips.filter((c) => c.family === familyId);
  }

  function seriesView() {
    return (
      '<section class="page-head"><p class="eyebrow">' +
      icon("layers", "tiny") +
      ' GENERATIONS</p><h1>世代与刀法</h1><p class="lede">按原文的世代划分，把基准芯片、衍生型号、削减项与命名沿革放在一张图里。绿色 = 削减，红色 = 加强，黄色 = 基准（沿用原文配色）。</p></section>' +
      '<div class="legend legend-page"><span class="sw base"></span>基准芯片<span class="sw cut"></span>削减项<span class="sw boost"></span>加强项</div>' +
      '<div class="family-grid">' +
      families
        .map((f) => {
          const list = familyChips(f.id);
          const base = byId.get(f.baseId);
          return (
            '<a class="family-card" href="#/series/' +
            f.id +
            '">' +
            '<div class="family-top"><span class="family-ord">' +
            String(f.order).padStart(2, "0") +
            '</span><span class="family-count">' +
            list.length +
            " 款</span></div>" +
            "<h3>" +
            esc(f.name) +
            "</h3>" +
            '<p class="family-tagline">' +
            esc(f.tagline) +
            "</p>" +
            (base
              ? '<div class="family-base">' +
                icon("chip", "tiny") +
                "基准 " +
                esc(base.short) +
                " · " +
                esc(base.gpu ? base.gpu.cus + "cu " + base.gpu.name : "") +
                " · " +
                esc(base.maxClock ? fmtGh(base.maxClock) : "") +
                "</div>"
              : "") +
            '<div class="family-preview">' +
            list
              .slice(0, 6)
              .map((c) => '<span class="mini-chip' + (c.isBase ? " base" : "") + '">' + esc(c.short) + "</span>")
              .join("") +
            (list.length > 6 ? '<span class="mini-chip more">+' + (list.length - 6) + "</span>" : "") +
            "</div>" +
            '<span class="family-link">查看刀法矩阵 ' +
            icon("arrow", "tiny") +
            "</span>" +
            "</a>"
          );
        })
        .join("") +
      "</div>" +
      '<section class="panel rules-panel"><div class="panel-head"><h2>' +
      icon("spark", "tiny") +
      " 原文总结的衍生规则</h2></div>" +
      '<div class="rules">' +
      [
        ["①", "降频", "超大核 / 大核 / 小核分档降频"],
        ["②", "砍核", "减少大核或小核数量"],
        ["③", "砍 GPU", "按 CU 规模切：3cu = 75%，2cu = 50%"],
        ["④", "砍 ISP", "选择外挂 / 不外挂独立 ISP"],
        ["⑤", "砍 NPU", "与 ISP 同理，按档位削减"],
        ["⑥", "砍基带", "屏蔽损坏部分，做成平板端芯片"]
      ]
        .map(
          (r) =>
            '<div class="rule"><span class="rule-no">' +
            r[0] +
            "</span><div><b>" +
            esc(r[1]) +
            "</b><p>" +
            esc(r[2]) +
            "</p></div></div>"
        )
        .join("") +
      "</div>" +
      '<p class="panel-note">原文：同一代 GPU 的核心数直接关乎与基准版的性能差距；部分平板芯片还会把 NPU、ISP 有问题的部分一并限制 —— 反正平板不讲究拍照。</p>' +
      "</section>"
    );
  }

  function matrixCellTone(chip, base, kind, value) {
    if (!base || chip.id === base.id) return "is-base";
    if (kind === "cluster") {
      const b = base.cpu && base.cpu.clusters.find((x) => x.role === value.role && x.occ === value.occ);
      if (!b) return "neutral";
      if (value.count === 0 && b.count > 0) return "cut";
      if (value.count < b.count) return "cut";
      if (value.count > b.count) return "boost";
      if (value.mhz && b.mhz && value.mhz < b.mhz) return "cut";
      if (value.mhz && b.mhz && value.mhz > b.mhz) return "boost";
      return "neutral";
    }
    if (kind === "gpu") {
      if (!base.gpu) return "neutral";
      if (value.cus < base.gpu.cus) return "cut";
      if (value.cus > base.gpu.cus) return "boost";
      if (value.mhz && base.gpu.mhz && value.mhz < base.gpu.mhz) return "cut";
      if (value.mhz && base.gpu.mhz && value.mhz > base.gpu.mhz) return "boost";
      return "neutral";
    }
    if (kind === "feature") {
      const baseState = base.features && base.features[value.key] ? base.features[value.key].state : "unknown";
      if (value.state === "none" || value.state === "cut") return "cut";
      if (value.state === "half") return "half";
      if (value.state === "unknown") return "unknown";
      if (baseState === "cut" && value.state === "full") return "boost";
      return "neutral";
    }
    return "neutral";
  }

  function matrixRow(chip, base) {
    const cpu = chip.cpu;
    const cells = [];
    ["超大核", "大核", "小核"].forEach((role) => {
      if (!cpu) {
        cells.push('<td class="neutral">—</td>');
        return;
      }
      const groups = clusterGroups(chip, role);
      const main = groups[0];
      if (!main || groups.every((g) => g.count === 0)) {
        cells.push('<td class="cut" title="' + esc(role + "：没有") + '">—</td>');
        return;
      }
      const tone = groups.some((g) => g.count > 0)
        ? matrixCellTone(chip, base, "cluster", groups.find((g) => g.count > 0))
        : "neutral";
      const text = groups
        .filter((g) => g.count > 0)
        .map((g) => g.count + "×" + (g.mhz / 1000).toFixed(2).replace(/\.?0+$/, ""))
        .join(" + ");
      cells.push(
        '<td class="' +
          tone +
          '" title="' +
          esc(role + " " + text + " · " + (main.arch || "")) +
          '">' +
          esc(text) +
          "</td>"
      );
    });

    if (chip.gpu) {
      cells.push(
        '<td class="' +
          matrixCellTone(chip, base, "gpu", chip.gpu) +
          '" title="' +
          esc(chip.gpu.name + " · " + chip.gpu.cus + "cu · " + fmtMhz(chip.gpu.mhz)) +
          '">' +
          chip.gpu.cus +
          "cu<br><small>" +
          esc(chip.gpu.name.replace("Maleoon ", "M")) +
          "</small></td>"
      );
    } else {
      cells.push('<td class="neutral">—</td>');
    }

    [["modem", "基带"], ["isp", "ISP"], ["npu", "NPU"]].forEach(([key, label]) => {
      const f = chip.features && chip.features[key];
      const st = f ? f.state : "unknown";
      cells.push(
        '<td class="' +
          matrixCellTone(chip, base, "feature", { key, state: st }) +
          '" title="' +
          esc(label + "：" + (FEATURE_LABEL[st] || "未标注") + (f && f.note ? " · " + f.note : "")) +
          '">' +
          esc(FEATURE_SHORT[st] || "?") +
          "</td>"
      );
    });

    return (
      '<tr class="' +
      (chip.isBase ? "matrix-base" : "") +
      '"><th scope="row"><a href="#/chip/' +
      chip.id +
      '">' +
      esc(chip.short) +
      "</a><small>" +
      esc(chip.typeLabel) +
      "</small></th>" +
      cells.join("") +
      "</tr>"
    );
  }

  function matrixHTML(family, baseId, title, subtitle) {
    const base = byId.get(baseId);
    if (!base) return "";
    const list = orderedChips.filter((c) => c.family === family.id && c.baseId === baseId);
    if (list.length < 2) return "";
    const head =
      '<div class="matrix-head"><div><h3>' +
      esc(title) +
      "</h3>" +
      (subtitle ? "<p>" + esc(subtitle) + "</p>" : "") +
      '</div><div class="legend"><span class="sw base"></span>基准<span class="sw cut"></span>削减<span class="sw boost"></span>加强</div></div>';
    return (
      head +
      '<div class="matrix-wrap"><table class="matrix"><thead><tr><th>芯片</th><th>超大核</th><th>大核</th><th>小核</th><th>GPU</th><th>基带</th><th>ISP</th><th>NPU</th></tr></thead><tbody>' +
      list.map((c) => matrixRow(c, base)).join("") +
      "</tbody></table></div>" +
      '<p class="panel-note">表格只列原文给出的项目；空格 / — 表示该型号没有这一项或原文未给出。悬停可看完整型号与备注。</p>'
    );
  }

  function treeTone(chip, parent) {
    if (!parent) return "base";
    if (chip.id === parent.id) return "neutral";
    const cuts = [];
    const boosts = [];
    if (chip.maxClock && parent.maxClock) {
      if (chip.maxClock < parent.maxClock) cuts.push("clock");
      if (chip.maxClock > parent.maxClock) boosts.push("clock");
    }
    if (chip.cpu && parent.cpu) {
      if (chip.cpu.cores < parent.cpu.cores) cuts.push("cores");
      if (chip.cpu.cores > parent.cpu.cores) boosts.push("cores");
    }
    if (chip.gpu && parent.gpu) {
      if (chip.gpu.cus < parent.gpu.cus) cuts.push("gpu");
      if (chip.gpu.cus > parent.gpu.cus) boosts.push("gpu");
    }
    if (chip.features) {
      ["modem", "isp", "npu"].forEach((k) => {
        const s = chip.features[k] && chip.features[k].state;
        if (s === "none" || s === "cut") cuts.push(k);
      });
    }
    if (cuts.length && !boosts.length) return "cut";
    if (boosts.length && !cuts.length) return "boost";
    if (cuts.length && boosts.length) return "mixed";
    return "neutral";
  }

  function treeNode(chip, parent, depth) {
    const children = chip.children || [];
    const tone = treeTone(chip, parent);
    return (
      '<div class="tree-node tone-' +
      tone +
      '" style="--depth:' +
      depth +
      '">' +
      '<a class="tree-link" href="#/chip/' +
      chip.id +
      '">' +
      '<span class="tree-dot"></span>' +
      '<span class="tree-name">' +
      esc(chip.short) +
      "</span>" +
      '<span class="tree-badge">' +
      esc(chip.typeLabel) +
      "</span>" +
      '<span class="tree-meta">' +
      esc(chip.gpu ? chip.gpu.cus + "cu" : "—") +
      " · " +
      esc(chip.maxClock ? fmtGh(chip.maxClock) : "—") +
      "</span>" +
      "</a>" +
      (children.length
        ? '<div class="tree-children">' +
          children.map((c) => treeNode(c, chip, depth + 1)).join("") +
          "</div>"
        : "") +
      "</div>"
    );
  }

  function familyDetailView(family) {
    const list = familyChips(family.id);
    const mainBase = byId.get(family.baseId);
    const midBase = list.find((c) => c.isBase && c.id !== family.baseId);
    const naming = family.naming || [];

    return (
      '<div class="crumbs"><a href="#/chips">芯片</a>' +
      icon("chevron", "tiny") +
      '<a href="#/series">世代</a>' +
      icon("chevron", "tiny") +
      "<span>" +
      esc(family.short) +
      "</span></div>" +
      '<section class="detail-hero family-hero">' +
      '<div class="detail-head"><p class="eyebrow">GENERATION ' +
      String(family.order).padStart(2, "0") +
      " · " +
      list.length +
      " 款芯片</p><h1>" +
      esc(family.name) +
      '</h1><p class="lede">' +
      esc(family.tagline) +
      "</p>" +
      '<div class="badges">' +
      (family.highlights || []).map((h) => '<span class="badge badge-ghost">' + esc(h) + "</span>").join("") +
      "</div></div>" +
      '<div class="detail-stats">' +
      (mainBase
        ? statBlock("基准芯片", mainBase.short, "") +
          statBlock("最高主频", (mainBase.maxClock / 1000).toFixed(2), "GHz") +
          statBlock("GPU", mainBase.gpu ? mainBase.gpu.cus + "cu" : "—", mainBase.gpu ? mainBase.gpu.name : "") +
          statBlock("衍生型号", list.filter((c) => !c.isBase).length, "款")
        : "") +
      "</div></section>" +

      '<section class="panel intro-panel"><div class="panel-head"><h2>' +
      icon("info", "tiny") +
      " 世代解读</h2></div><div class=\"prose\">" +
      (family.intro || []).map((p) => "<p>" + esc(p) + "</p>").join("") +
      "</div></section>" +

      '<section class="panel"><div class="panel-head"><h2>' +
      icon("layers", "tiny") +
      " 刀法矩阵</h2><span class=\"panel-meta\">悬停看备注</span></div>" +
      matrixHTML(family, family.baseId, mainBase ? mainBase.short + " 主支线" : "主支线", "同一基准下的全部衍生型号，按规格差距标色") +
      (midBase
        ? matrixHTML(family, midBase.id, midBase.short + " 支线", "8 系中端支线，独立作为本组基准")
        : "") +
      "</section>" +

      '<section class="panel"><div class="panel-head"><h2>' +
      icon("chip", "tiny") +
      " 衍生树</h2></div><div class=\"tree\">" +
      (mainBase ? treeNode(mainBase, null, 0) : "") +
      (midBase ? '<div class="tree-sep">8 系支线</div>' + treeNode(midBase, null, 0) : "") +
      "</div></section>" +

      (naming.length
        ? '<section class="panel"><div class="panel-head"><h2>' +
          icon("sort", "tiny") +
          " 命名沿革</h2></div><ul class=\"note-list naming\">" +
          naming.map((n) => "<li>" + esc(n) + "</li>").join("") +
          "</ul></section>"
        : "") +

      '<section class="panel source-panel"><p class="source-title">' +
      icon("info", "tiny") +
      " 数据来源</p><p>《" +
      esc(DATA.meta.source.title) +
      "》 · " +
      esc(DATA.meta.source.author) +
      "</p><a class=\"text-btn\" href=\"" +
      esc(DATA.meta.source.url) +
      '" target="_blank" rel="noopener">在酷安查看原文 ' +
      icon("arrow", "tiny") +
      "</a></section>"
    );
  }

  /* ---------------- about view ---------------- */

  function sourceListHTML() {
    return Object.keys(SOURCES)
      .map((id) => {
        const s = SOURCES[id];
        return (
          '<a class="source-item" href="' +
          esc(s.url) +
          '" target="_blank" rel="noopener"><span class="conf conf-' +
          s.kind +
          '">' +
          esc(CONF_LABEL[s.kind] || s.kind) +
          "</span><b>" +
          esc(s.label) +
          "</b><span>" +
          esc(s.title) +
          "</span></a>"
        );
      })
      .join("");
  }

  function coverageRow(label, count, total, note) {
    const pct = Math.round((count / total) * 100);
    return (
      '<div class="cov-row"><div class="cov-label"><span>' +
      esc(label) +
      "</span><b>" +
      count +
      " / " +
      total +
      '</b></div><div class="cov-track"><span style="width:' +
      pct +
      '%"></span></div>' +
      (note ? '<p class="cov-note">' + esc(note) + "</p>" : "") +
      "</div>"
    );
  }

  function aboutView() {
    const total = chips.length;
    const withCpu = chips.filter((c) => c.cpu).length;
    const withArch = chips.filter((c) => c.cpu && c.cpu.clusters.some((x) => x.arch && x.arch !== "—")).length;
    const withGpu = chips.filter((c) => c.gpu).length;
    const withGpuClock = chips.filter((c) => c.gpu && c.gpu.mhz).length;
    const withDevices = chips.filter((c) => (c.devices || []).length).length;
    const withModem = chips.filter((c) => c.features && c.features.modem && c.features.modem.state !== "unknown").length;
    const withIsp = chips.filter((c) => c.features && c.features.isp && c.features.isp.state !== "unknown").length;
    const withNpu = chips.filter((c) => c.features && c.features.npu && c.features.npu.state !== "unknown").length;

    const withProcess = chips.filter((c) => researchField(c, "process")).length;
    const withMemory = chips.filter((c) => researchField(c, "memory")).length;
    const withCache = chips.filter((c) => researchField(c, "cache")).length;
    const withNpuResearch = chips.filter((c) => researchField(c, "npu")).length;
    const withModemModel = chips.filter((c) => researchField(c, "modem")).length;
    const benchPlatforms = chips.filter(
      (c) => c.research && c.research.benchmarks && c.research.benchmarks.length && !c.research.benchmarkInherited
    ).length;
    const sourceCount = Object.keys(SOURCES).length;

    return (
      '<section class="page-head"><p class="eyebrow">' +
      icon("info", "tiny") +
      ' ABOUT</p><h1>关于与数据口径</h1><p class="lede">CPU 刀法、GPU 规模、削减项与机型以原文为准；原文没写的制程、缓存、内存、基带、NPU 与跑分，则去公开资料里逐项核对，并标出来源和可信度。</p></section>' +

      '<section class="panel source-hero"><div class="source-badge">' +
      icon("sparkles", "source-icon") +
      '</div><div><p class="eyebrow">数据来源 · 酷安</p><h2>《' +
      esc(DATA.meta.source.title) +
      "》</h2><p class=\"source-by\">作者 " +
      esc(DATA.meta.source.author) +
      " · 发布于 " +
      esc(DATA.meta.source.date) +
      "</p><p class=\"panel-note\">" +
      esc(DATA.meta.source.note) +
      '</p><a class="btn primary" href="' +
      esc(DATA.meta.source.url) +
      '" target="_blank" rel="noopener">查看原文 ' +
      icon("arrow", "tiny") +
      "</a></div></section>" +

      '<div class="about-grid"><section class="panel"><div class="panel-head"><h2>' +
      icon("layers", "tiny") +
      " 收录范围</h2></div><div class=\"about-stats\">" +
      statBlock("芯片", total, "款") +
      statBlock("世代", families.length, "个") +
      statBlock("机型条目", new Set(chips.flatMap((c) => c.devices || [])).size, "条") +
      statBlock("补充字段", "6", "类") +
      statBlock("公开来源", sourceCount, "条") +
      statBlock("数据版本", DATA.meta.dataVersion, "") +
      "</div><p class=\"panel-note\">覆盖原文 9000S / 9010 / X90 / 9020 / 9030 / 9050 / 8000 七个章节，外加正文中作为参照的麒麟 9000。原文表格里的每一行都对应一个独立条目，合称同芯片的型号（如 9010E / 9010A）会合并展示并保留别名。</p></section>" +

      '<section class="panel"><div class="panel-head"><h2>' +
      icon("check", "tiny") +
      " 字段覆盖</h2><span class=\"panel-meta\">原文 + 补充资料</span></div><div class=\"coverage\">" +
      coverageRow("CPU 簇构成", withCpu, total) +
      coverageRow("核心代号", withArch, total) +
      coverageRow("GPU 型号 / CU", withGpu, total) +
      coverageRow("GPU 频率", withGpuClock, total, "麒麟 9000 仅作参照、T82A 尚未出现，原文均未给 GPU 频率") +
      coverageRow("基带状态", withModem, total) +
      coverageRow("ISP 状态", withIsp, total) +
      coverageRow("NPU 状态", withNpu, total) +
      coverageRow("搭载机型", withDevices, total, "T82A 尚未出现，原文未给机型") +
      '</div><p class="cov-subhead">联网补充</p><div class="coverage">' +
      coverageRow("制程工艺", withProcess, total, "TechInsights / 规格库；9030S 为同代推断") +
      coverageRow("缓存规格", withCache, total, "极客湾 / 真义科技 / 快科技等；8000 系未查到") +
      coverageRow("内存规格", withMemory, total, "规格库与媒体口径；9000S / 9050Pro 存在冲突") +
      coverageRow("NPU 架构", withNpuResearch, total, "多数只有架构与相对提升，没有 TOPS") +
      coverageRow("基带型号", withModemModel, total, "9000S/9010 巴龙 5000、9020 巴龙 6000；部分未公布") +
      "</div><p class=\"cov-foot\">跑分：<b>" +
      benchPlatforms +
      "</b> 个基准平台有实测或媒体数据；衍生型号沿用同系列基准，详情页标「同系列基准」。</p>" +
      "</section></div>" +

      '<section class="panel"><div class="panel-head"><h2>' +
      icon("check", "tiny") +
      " 补充资料：查到了什么</h2><span class=\"panel-meta\">2026-11 联网核对</span></div>" +
      '<div class="findings">' +
      [
        ["制程", "9000S / 9010 / 9020 均为 SMIC N+2（7nm 级）；9030 为 SMIC N+3；9050Pro 是 N+3 逻辑 die + N+2 SRAM die 的双 die 折叠；X90 为 SMIC N+2；8000 / 8020 为 7nm（数据库口径）。"],
        ["缓存", "9000S L3 4MB → 9010 8MB → 9020 10MB → 9030 12MB；9050Pro 为 8MB + 8MB L3、SLC 12MB；X90 16MB L3；8020 8MB L3。SLC 也从 4MB / 8MB 一路涨到 12MB。"],
        ["NPU", "官方只给相对提升：9030 对比 9020 +13%，9035 对比 9030 +51%，9050 对比前代 +140% 且功耗 -66%，支持 30B MoE 端侧模型；X90 媒体口径为双达芬奇 40 TOPS。多数型号没有官方 TOPS。"],
        ["基带", "9000S / 9010 为集成巴龙 5000；9020 为巴龙 6000，媒体称首款支持 3GPP R18 的 5G-A SoC；9030 / 9050 集成巴龙基带，但型号与速率未公布。"],
        ["内存", "9010：LPDDR5X-4200；9020：LPDDR5X-4266、4×16-bit、约 68.2GB/s；9030Pro：LPDDR5X-4800、约 76.8GB/s；9000：LPDDR5-2750。9000S 与 9050Pro 的内存类型存在来源冲突。"],
        ["跑分", "Geekbench 6：9000S 1324 / 4116；9010 1447 / 4765；9020 约 1591 / 5100；9030Pro 1742 / 5238（卓易通，约 10% 损耗）；9050Pro 2084 / 约 10400；8000 936 / 2600（Nova 13 Pro）。"]
      ]
        .map(
          (g) =>
            '<div class="finding"><b>' + esc(g[0]) + '</b><p>' + esc(g[1]) + "</p></div>"
        )
        .join("") +
      "</div>" +
      '<h3 class="subhead">仍存在冲突 / 缺口</h3>' +
      '<ul class="note-list gap-notes">' +
      [
        "9000S 内存：百度百科写 LPDDR5-2750 / 44GB/s，电子工程专辑与 HMC 写 LPDDR5X / 约 67.2GB/s，并列标注。",
        "9050Pro 内存：LPDDR5X 与 LPDDR6 两种说法并存，频率与带宽也对不上；华为未公布，暂不采信单一说法。",
        "9020 小核 L2：拆解评测有 1MB 与 2MB 两种口径；本应用只写「1–2MB，来源冲突」。",
        "9050Pro 线程：酷安原文写 9 核 14 线程，华为官网写 9 核 16 线程；本应用采用官方口径，并在详情里注明冲突。",
        "X90 频率：原文表格为 2.32GHz，部分 2026 年报道写「最高 4.2GHz」，差异过大；本应用保留原文表格，不对 4.2GHz 下结论。",
        "X90 跑分：Geekbench 无鸿蒙原生版，极客湾明确称网传 X90 分数不可信，因此不收录。",
        "8000 系的缓存容量、多数型号的 ISP 型号与 NPU TOPS，均未查到可靠公开数据。",
        "9030S 的缓存容量未公开、制程未单独拆解，界面标为「推断 / 有冲突」。",
        "T92B / T93C 等低产量衍生型号通常没有独立拆解，补充资料沿用同系列基准，界面标「同系列基准」。"
      ]
        .map((t) => "<li>" + esc(t) + "</li>")
        .join("") +
      "</ul>" +
      '<h3 class="subhead">可信度图例</h3>' +
      '<div class="conf-legend">' +
      ["official", "teardown", "media", "db", "inferred", "conflict", "original"]
        .map((k) => confidenceBadge(k) + '<span class="conf-desc">' + esc(CONF_LABEL[k]) + "</span>")
        .join("") +
      "</div>" +
      '<details class="source-details"><summary>全部公开来源（' +
      sourceCount +
      "）</summary><div class=\"source-list\">" +
      sourceListHTML() +
      "</div></details>" +
      '<p class="panel-note">原文没有的字段，先用官方与拆解资料，其次媒体评测，再次规格数据库；没有链接的结论不写。仍查不到的字段保持「未查到可靠资料」，不做猜测。</p>' +
      "</section>" +

      '<section class="panel"><div class="panel-head"><h2>' +
      icon("gpu", "tiny") +
      " 计算口径</h2></div><div class=\"prose\">" +
      "<p><b>GPU 规格指数</b> = 计算单元数 × 频率（CU×MHz）。它只描述规模，不代表实际性能。原文明确举例：X90 的 6cu 马良 916 只略强于 9020 的 4cu 马良 920，甚至比不上 9030pro 的 6cu 马良 935；9030S 的 3cu 935F 也能靠新架构与调度基本持平 9020。因此跨架构比较时请以原文结论为准。</p>" +
      "<p><b>「最高主频」</b>取该芯片所有 CPU 簇中的最大值。T92D 这类砍掉超大核的型号，最高主频来自大核。</p>" +
      "<p><b>颜色约定</b>沿用原文表格：黄色 = 基准芯片，绿色 = 削减项，红色 = 加强项。绿色在这里不代表「更好」，只代表「被砍」。</p>" +
      "<p><b>补充资料</b>按可信度排序引用：官方 > 拆解/逆向 > 媒体评测 > 规格数据库 > 同代推断。互相冲突时并列说明，不把某一家说法写成定论。</p>" +
      "<p><b>跑分</b>来自不同机型、系统版本与散热条件，只能看量级，不能当排名。鸿蒙没有原生 Geekbench 时需经卓易通，普遍有约 10% 性能损耗。</p>" +
      "</div></section>" +

      '<section class="panel"><div class="panel-head"><h2>' +
      icon("chip", "tiny") +
      " 关于这个应用</h2></div><div class=\"prose\">" +
      "<p>Kirin-L 参考 SoC-L 的「数据库 + 收藏 + 多芯片对比」结构，但针对麒麟芯片补齐了 SoC-L 容易缺失的字段：超大核 / 大核 / 小核的拆分与核心代号、GPU 计算单元与频率、平板端无基带、ISP / NPU 削减、同芯片前后改名、衍生关系与搭载机型。</p>" +
      "<p>数据分两层：原文层（CPU / GPU / 机型 / 削减项）与联网补充层（制程 / 缓存 / 内存 / 基带 / NPU / 跑分）。补充层逐项标来源与可信度，衍生型号没有独立资料时沿用同系列基准，并在界面标注。</p>" +
      "<p>纯静态 PWA：无后端、无网络请求，数据内置，离线可用，可添加到主屏幕。当前版本 " +
      esc(DATA.meta.version) +
      "，数据版本 " +
      esc(DATA.meta.dataVersion) +
      "。</p>" +
      "<p class=\"disclaimer\">" +
      esc(DATA.meta.disclaimer) +
      "</p></div></section>" +

      '<p class="footnote">Built for Kirin fans · 数据版权归原作者 · 本应用与华为 / 酷安无关联</p>'
    );
  }

  /* ---------------- modal ---------------- */

  function modalListHTML() {
    const q = state.modalQuery.trim().toLowerCase();
    const list = orderedChips.filter((c) => !q || c.search.includes(q));
    if (!list.length) return '<p class="modal-empty">没有匹配的芯片</p>';
    return list
      .map((c) => {
        const on = state.compare.includes(c.id);
        const full = !on && state.compare.length >= MAX_COMPARE;
        return (
          '<button class="modal-row' +
          (on ? " on" : "") +
          '" data-action="togglecmp" data-id="' +
          c.id +
          '"' +
          (full ? " disabled" : "") +
          ">" +
          '<span class="modal-chip"><b>' +
          esc(c.short) +
          "</b><small>" +
          esc(c.familyRef ? c.familyRef.short : "") +
          " · " +
          esc(c.typeLabel) +
          " · " +
          esc(c.gpu ? c.gpu.cus + "cu " + c.gpu.name : "规格未公布") +
          "</small></span>" +
          '<span class="modal-check">' +
          icon(on ? "check" : "plus", "tiny") +
          "</span></button>"
        );
      })
      .join("");
  }

  function modalHTML() {
    if (!state.modal) return "";
    return (
      '<div class="modal-backdrop" data-action="closemodal"></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-label="添加芯片到对比">' +
      '<div class="modal-head"><div><h2>添加芯片</h2><p id="modalcount">已选 ' +
      state.compare.length +
      " / " +
      MAX_COMPARE +
      '</p></div><button class="icon-btn" data-action="closemodal" aria-label="关闭">' +
      icon("close") +
      "</button></div>" +
      '<div class="searchbox modal-search">' +
      icon("search") +
      '<input id="modalq" type="search" placeholder="搜索芯片或机型…" value="' +
      esc(state.modalQuery) +
      '" autocomplete="off">' +
      "</div>" +
      '<div class="modal-list">' +
      modalListHTML() +
      "</div>" +
      '<div class="modal-foot"><span class="panel-note">最多 10 款；再次点击可移出。</span><button class="btn primary" data-action="closemodal">完成</button></div>' +
      "</div>"
    );
  }

  function refreshModal() {
    const list = $(".modal-list");
    if (list) list.innerHTML = modalListHTML();
    const count = $("#modalcount");
    if (count) count.textContent = "已选 " + state.compare.length + " / " + MAX_COMPARE;
  }

  /* ---------------- toast ---------------- */

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
  }

  /* ---------------- theme ---------------- */

  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORE.theme, theme);
    } catch (e) {}
    $$("[data-theme-toggle]").forEach((b) => {
      b.innerHTML = icon(theme === "dark" ? "sun" : "moon");
      b.setAttribute("aria-label", theme === "dark" ? "切换到浅色" : "切换到深色");
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0d1014" : "#f6f7f9");
  }

  /* ---------------- compare state ---------------- */

  function persistCompare() {
    writeStore(STORE.compare, state.compare);
    $$("[data-cmp-count]").forEach((el) => {
      el.textContent = String(state.compare.length);
      el.classList.toggle("zero", state.compare.length === 0);
    });
  }

  function addCompare(id, opts) {
    const o = opts || {};
    if (state.compare.includes(id)) {
      if (o.toggle) removeCompare(id);
      return;
    }
    if (state.compare.length >= MAX_COMPARE) {
      toast("最多同时对比 " + MAX_COMPARE + " 款芯片");
      return;
    }
    state.compare.push(id);
    persistCompare();
    if (o.navigate) location.hash = "#/compare";
    else toast("已加入对比（" + state.compare.length + " / " + MAX_COMPARE + "）");
  }

  function removeCompare(id) {
    state.compare = state.compare.filter((x) => x !== id);
    persistCompare();
  }

  function syncCompareHash() {
    if (!location.hash.startsWith("#/compare")) return;
    const ids = state.compare.join(",");
    const next = "#/compare" + (ids ? "?ids=" + encodeURIComponent(ids) : "");
    history.replaceState(null, "", next);
  }

  /* ---------------- render ---------------- */

  function parseRoute() {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const qIndex = raw.indexOf("?");
    const path = qIndex >= 0 ? raw.slice(0, qIndex) : raw;
    const query = qIndex >= 0 ? raw.slice(qIndex + 1) : "";
    return {
      segs: path.split("/").filter(Boolean),
      params: new URLSearchParams(query)
    };
  }

  function setActiveNav(route) {
    let key = route.segs[0] || "chips";
    if (key === "chip") key = "chips";
    $$("[data-nav]").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.nav === key);
    });
  }

  function render() {
    const route = parseRoute();
    const view = $("#view");
    if (!view) return;

    let html = "";
    let title = DATA.meta.appName;
    const seg = route.segs[0] || "chips";

    if (seg === "chips" || !route.segs.length) {
      html = chipsView();
      title = DATA.meta.appName;
    } else if (seg === "chip") {
      const chip = byId.get(route.segs[1]);
      if (chip) {
        html = chipDetailView(chip);
        title = chip.name + " · " + DATA.meta.appName;
      } else {
        html = '<div class="empty"><h2>找不到这款芯片</h2><a class="btn" href="#/chips">返回列表</a></div>';
      }
    } else if (seg === "compare") {
      const idsParam = route.params.get("ids");
      if (idsParam) {
        const ids = Array.from(new Set(idsParam.split(",").filter((id) => byId.has(id)))).slice(0, MAX_COMPARE);
        if (ids.join(",") !== state.compare.join(",")) {
          state.compare = ids;
          persistCompare();
        }
      }
      html = compareView();
      title = "芯片对比 · " + DATA.meta.appName;
    } else if (seg === "series") {
      if (route.segs[1] && famById.has(route.segs[1])) {
        const fam = famById.get(route.segs[1]);
        html = familyDetailView(fam);
        title = fam.name + " · " + DATA.meta.appName;
      } else {
        html = seriesView();
        title = "世代与刀法 · " + DATA.meta.appName;
      }
    } else if (seg === "about") {
      html = aboutView();
      title = "关于 · " + DATA.meta.appName;
    } else {
      html = chipsView();
    }

    view.innerHTML = html;
    document.title = title;
    setActiveNav(route);
    $("#modal").innerHTML = modalHTML();

    const diff = $("#diffonly");
    if (diff) {
      diff.addEventListener("change", (e) => {
        state.diffOnly = e.target.checked;
        render();
      });
    }
  }

  /* ---------------- events ---------------- */

  function refreshResults() {
    const el = $("#results");
    if (el) el.innerHTML = resultsHTML();
    else render();
  }

  function resetFilters() {
    state.query = "";
    state.type = "all";
    state.family = "all";
    state.onlyBase = false;
    state.favOnly = false;
    const q = $("#q");
    if (q) q.value = "";
    render();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
  }

  function openModal() {
    state.modal = true;
    state.modalQuery = "";
    $("#modal").innerHTML = modalHTML();
    const input = $("#modalq");
    if (input) input.focus();
  }
  function closeModal() {
    state.modal = null;
    state.modalQuery = "";
    $("#modal").innerHTML = "";
    if (location.hash.startsWith("#/compare")) render();
  }

  document.addEventListener("click", (e) => {
    const themeBtn = e.target.closest("[data-theme-toggle]");
    if (themeBtn) {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
      return;
    }

    const el = e.target.closest("[data-action]");
    if (!el) {
      if (state.modal && !e.target.closest(".modal-card")) closeModal();
      return;
    }
    const action = el.dataset.action;

    switch (action) {
      case "open": {
        const id = el.dataset.id;
        if (id) location.hash = "#/chip/" + id;
        break;
      }
      case "fav": {
        const id = el.dataset.id;
        if (!id) break;
        const has = state.favs.includes(id);
        state.favs = has ? state.favs.filter((x) => x !== id) : state.favs.concat(id);
        writeStore(STORE.fav, state.favs);
        toast(has ? "已取消收藏" : "已收藏");
        if (location.hash.indexOf("#/chip/") === 0) render();
        else refreshResults();
        break;
      }
      case "cmp": {
        const id = el.dataset.id;
        if (!id) break;
        if (state.compare.includes(id)) {
          removeCompare(id);
          toast("已移出对比");
        } else {
          addCompare(id);
        }
        if (location.hash.startsWith("#/compare")) {
          syncCompareHash();
          render();
        } else if (location.hash.indexOf("#/chip/") === 0) {
          render();
        } else {
          refreshResults();
        }
        break;
      }
      case "uncmp": {
        removeCompare(el.dataset.id);
        syncCompareHash();
        render();
        break;
      }
      case "clearcmp":
        state.compare = [];
        persistCompare();
        syncCompareHash();
        render();
        break;
      case "togglecmp": {
        const id = el.dataset.id;
        if (!id) break;
        if (state.compare.includes(id)) {
          removeCompare(id);
        } else {
          addCompare(id);
        }
        refreshModal();
        break;
      }
      case "add":
        openModal();
        break;
      case "closemodal":
        closeModal();
        break;
      case "reset":
        resetFilters();
        break;
      case "clearq":
        state.query = "";
        render();
        break;
      case "type":
        state.type = el.dataset.type;
        render();
        break;
      case "family":
        state.family = el.dataset.family;
        render();
        break;
      case "onlybase":
        state.onlyBase = !state.onlyBase;
        render();
        break;
      case "favonly":
        state.favOnly = !state.favOnly;
        render();
        break;
      case "share": {
        const id = el.dataset.id || "";
        copyText(location.origin + location.pathname + (id ? "#/chip/" + id : "")).then(() =>
          toast("链接已复制")
        );
        break;
      }
      case "sharecmp": {
        const ids = state.compare.join(",");
        const url = location.origin + location.pathname + "#/compare" + (ids ? "?ids=" + ids : "");
        copyText(url).then(() => toast("对比链接已复制"));
        break;
      }
      default:
        break;
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "q") {
      state.query = e.target.value;
      const clear = $(".search-clear");
      if (clear) clear.classList.toggle("is-hidden", !state.query);
      refreshResults();
    } else if (e.target.id === "modalq") {
      state.modalQuery = e.target.value;
      const list = $(".modal-list");
      if (list) list.innerHTML = modalListHTML();
    } else if (e.target.id === "sort") {
      state.sort = e.target.value;
      refreshResults();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.modal) closeModal();
    if ((e.key === "Enter" || e.key === " ") && e.target.matches('[data-action="open"][role="link"]')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      if (id) location.hash = "#/chip/" + id;
    }
  });

  /* ---------------- boot ---------------- */

  function boot() {
    applyTheme(currentTheme());
    $$("[data-icon]").forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
    persistCompare();

    const initial = parseRoute();
    if (initial.segs[0] === "compare" && initial.params.get("ids")) {
      const ids = Array.from(
        new Set(
          initial.params
            .get("ids")
            .split(",")
            .filter((id) => byId.has(id))
        )
      ).slice(0, MAX_COMPARE);
      if (ids.length) state.compare = ids;
      persistCompare();
    }

    window.addEventListener("hashchange", () => {
      render();
      window.scrollTo(0, 0);
    });

    render();

    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  boot();
})();
