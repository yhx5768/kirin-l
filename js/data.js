/* ============================================================
 * 麒麟芯片图鉴 · Kirin-L
 * 内置数据（v5.0）
 *
 * 数据来源：酷安《新时代麒麟芯片汇总 5.0》
 * 作者：杜马1124
 * 原文：https://www.coolapk.com/feed/74959496
 * 发布：2026-11-09
 *
 * 原则：CPU/GPU/机型/削减项以原文为准。
 * 原文没有给出的字段（制程、缓存、内存、基带、NPU、跑分等）在文件末尾的
 * research 中联网补充，并标注来源与可信度；仍查不到的字段不做猜测。
 * ============================================================ */

window.KIRIN_DATA = {
  meta: {
    appName: "麒麟芯片图鉴",
    appShort: "Kirin-L",
    version: "1.1.0",
    dataVersion: "5.0",
    updated: "2026-11-09",
    researchUpdated: "2026-11-17",
    source: {
      title: "新时代麒麟芯片汇总 5.0",
      author: "杜马1124",
      platform: "酷安",
      url: "https://www.coolapk.com/feed/74959496",
      date: "2026-11-09",
      note: "相较 4.1 版本增加了芯片对应的机型清单；部分数据来源于 @CyanDawn、@伤心萨摩耶。"
    },
    disclaimer:
      "本应用为个人整理的非官方图鉴。CPU、GPU、机型与削减项以原文为准；原文未给出的字段已联网补充，并逐项标注来源与可信度；仍无可靠来源的字段不做猜测。"
  },

  /* ------------------------------------------------------------
   * 世代
   * ---------------------------------------------------------- */
  families: [
    {
      id: "f9000s",
      name: "麒麟 9000S 系列",
      short: "9000S",
      order: 1,
      baseId: "kirin-9000s",
      tagline: "全新一代麒麟 9 移动平台",
      intro: [
        "9000S 是新一代麒麟 9 系的开端，采用 1 超 + 3 大 + 4 小的 8 核 12 线程设计。「超大核」本质上是大核的加强版，小核是公版 Cortex-A510。综合性能勉强持平麒麟 9000，但 GPU 等部分能力反而不如 9000。",
        "Mate 60 系列因功耗偏高，在屏幕下方搭载了业界最大的散热板。",
        "从这一代开始出现大批量衍生产品：①降频 ②砍核 ③砍 GPU ④砍 ISP ⑤砍 NPU ⑥砍基带作为平板端芯片。GPU 核心数直接决定与基准版的差距：3cu 是 4cu 的 75%，2cu 是 4cu 的 50%。",
        "平板端首次拥有独立命名：9000W / 9000WE / 9000WL / 9000WM。早期 MatePad Pro 13.2 2023 非典藏版仍显示 9000S（2.62GHz + 3cu），后来随 MatePad Pro 2024 上市由系统更新降为 2.49GHz。"
      ],
      highlights: ["8 核 12 线程", "超大核 = 大核加强版", "首次平板端独立命名", "3cu = 75% / 2cu = 50%"],
      naming: [
        "手机三档：9000S / 9000S1 / 9000SL",
        "平板命名：9000W → T90、9000WE → T90A",
        "延续 9000 / 9000E / 9000L 的命名思路"
      ]
    },
    {
      id: "f9010",
      name: "麒麟 9010 系列",
      short: "9010",
      order: 2,
      baseId: "kirin-9010",
      tagline: "完全体的 9000S",
      intro: [
        "9010 被称为「完全体的 9000S」：首次引入泰山超大核，仍为 1+3+4 的 8 核 12 线程。因为超大核更强，9010 能以更低主频换来更强性能，同时抑制发热与功耗。",
        "9010 系列大规模出现同芯片前后改名，并首次使用 A/B/C 后缀：9010E→9010A、9010L→9010B。A/B/C 的顺序代表芯片出现先后，不是性能高低。",
        "平板端开始以 T9X 命名。这是唯一一次出现 T91B > T91 > T91A > T91C 这种反常识的排序。"
      ],
      highlights: ["首次泰山超大核", "8 核 12 线程", "A/B/C = 出现顺序", "T91B > T91 > T91A > T91C"],
      naming: [
        "9010E 后改名为 9010A",
        "9010L 后改名为 9010B",
        "平板端：T91B / T91 / T91A / T91C"
      ]
    },
    {
      id: "fx90",
      name: "麒麟 X90 系列",
      short: "X90",
      order: 3,
      baseId: "kirin-x90",
      tagline: "力大砖飞的 9010",
      intro: [
        "首款电脑端处理器，其实 2023 年就已先出现在问界车机上。基准芯片采用 4+4+2 的 10 核 20 线程：四个「大一点的超大核」、四个「小一点的超大核」，再加两个由 9010/9000S 大核缩水而来的小核，用超级堆料把 CPU 性能拉上来。",
        "GPU 由马良 910 从 750MHz 超到 950MHz，再增加两个计算单元，组成 6cu 马良 916。受老架构限制，性能仅略强于 9020 的 4cu 马良 920，甚至比不上 9030pro 的 6cu 马良 935。",
        "X90 Plus 只把四个超大核提高 0.13GHz，GPU 完全没动；X90A 是阉割版。MatePad Edge 仅顶配液冷版搭载 X90，其余配置为 X90A。"
      ],
      highlights: ["首款 PC 芯片", "4+4+2 / 10 核 20 线程", "6cu 马良 916 @950MHz", "问界车机首发"],
      naming: [
        "X90 为基准",
        "X90 Plus：超大核 +0.13GHz",
        "X90A：砍核 + 4cu + 半 NPU"
      ]
    },
    {
      id: "f9020",
      name: "麒麟 9020 世代",
      short: "9020",
      order: 4,
      baseId: "kirin-9020",
      tagline: "全泰山架构的新麒麟",
      intro: [
        "全泰山架构的新麒麟：引入全新泰山小核，抛弃 A510，整体能耗显著提升；GPU 马良 920 相比 9010/9000S 基准版的马良 910 提升约 25%。",
        "命名从 9000S 的混乱、9010 的半混乱走向清晰：明确 9020 / 9020A / 9020B 三档，不再出现同芯片前后改名。9020 还存在三种版本：蓝色旧版、紫色新封装版、绿色 ISP 强化版。",
        "平板端改为按性能顺序决定 ABCD：T92 首次只砍基带而无其他阉割；T92D 则是第一次砍掉超大核的「传奇产物」。",
        "同代 8 系支线：8020 是 8000 的迭代（降频、砍缓存规格与 GPU CU 上限）；9010S 由 8020 超频而来；8020A 再砍 1 大 1 小；8000S 没有超大核且只有 1cu GPU。T82A 尚未出现，推测保留 NPU，可能用于入门平板。"
      ],
      highlights: ["全泰山架构", "马良 920 +25%", "9020 / A / B 三档清晰", "T92D 砍掉超大核"],
      naming: [
        "9020 → 9020A → 9020B 三档",
        "平板端按性能排：T92 / T92A / T92B / T92C / T92D",
        "8 系支线：8020 / 8020A / 8000S / T82 / T82B",
        "9010S 由 8020 超频而来"
      ]
    },
    {
      id: "f9030",
      name: "麒麟 9030 世代",
      short: "9030",
      order: 5,
      baseId: "kirin-9030pro",
      tagline: "τ 定律平面芯片的最终产品",
      intro: [
        "9030 系列的主要突破在 GPU：新架构 + 扩充至 6cu 的马良 935，对比 4cu 马良 920 提升 80%；CPU 改为 1+4+4 的 9 核 14 线程，多出的一颗大核让性能提升大于常规迭代。",
        "命名调整：pro 首次出现在麒麟芯片名称中。9030pro（1+4+4）更像原先 9020 的迭代，9030（1+3+4）则是原先 9020A 的迭代。",
        "9035 出现在 Mate 90 Pro 上，仅比 9030pro 略提 CPU 频率；Mate 80 Pro Max 风驰版当时用的或许就是它，只是还没有 90x5 的命名。",
        "9030S 名字像 9030pro 的阉割版，但缓存大小有调整，实际是 9010S 的迭代（9030pro 同架构的 8030 尚未出现的超频版），中间跳过了 9020S，容易误会。GPU 被阉为 3cu 935F，但靠新架构与调度基本持平 9020；CPU 基本持平 9030。",
        "XE90 是新出的 PC 芯片，采用 9030pro 的完整设计，可看作 PC 版 9030pro。最大支持 32G 运存，单核与 GPU 超过 X90，多核仍不敌 10 核 20 线程的 X90，但能耗更好，成就了最轻的 MateBook Pro S。"
      ],
      highlights: ["马良 935 +80%", "1+4+4 / 9 核 14 线程", "首次出现 pro", "XE90 = PC 版 9030pro"],
      naming: [
        "9030pro（1+4+4）为满血基准",
        "9030（1+3+4）对应 9020A 的迭代",
        "9035 = 9030pro 提频版",
        "9030S 实为 9010S 迭代，非 9030pro 简单阉割"
      ]
    },
    {
      id: "f9050",
      name: "麒麟 9050 世代",
      short: "9050",
      order: 6,
      baseId: "kirin-9050pro",
      tagline: "τ 定律逻辑折叠的初代产物",
      intro: [
        "τ 定律逻辑折叠的初代产物：9050pro 采用主副双 die 的立体设计，能耗大幅进步。对比 9030pro，同频功耗降低 30%，GPU 再提升 40%。",
        "双 die 也让单颗芯片成本再次提高，叠加内存涨价。9050pro 为 9 核 14 线程，实际续航表现超出作者预期。",
        "9050 是 12G 版本：超大核 3.10→3.00GHz、大核 4→3 颗、GPU 6cu→5cu。"
      ],
      highlights: ["主副双 die", "逻辑折叠", "同频功耗 -30%", "GPU +40%"],
      naming: ["9050pro 为满血基准", "9050 为 12G 版本，CPU/GPU 小幅缩水"]
    },
    {
      id: "f8000",
      name: "麒麟 8000 系列",
      short: "8000",
      order: 7,
      baseId: "kirin-8000",
      tagline: "麒麟 9000 的秽土转生？",
      intro: [
        "熟悉的配方：麒麟 9000 的架构下放——1×3.13GHz A77 + 3×2.54GHz A77 + 4×2.04GHz A55。按惯例，新 8 系用老 9 系架构，优化 + 降频后以能效打中端。",
        "G610 MP4 看起来比 9000 的 G78 MP24 小得多，绝对性能仍是 24cu G78 更强；但 G610 从第二代到第五代的提升缩小了差距。受制程拖累，8000 甚至比不上麒麟 990。",
        "9000 的纯血鸿蒙在黎明前夕被砍掉，麒麟 8000 却吃上了纯血鸿蒙红利，畅享 90 Pro Max 的热度超出想象——算是麒麟 9000 的秽土转生。"
      ],
      highlights: ["9000 架构下放", "A77 + A55", "Mali-G610 MP4", "中端能效路线"],
      naming: ["8000 为基准", "T80 为平板版（仅无基带）", "8000A 再砍 1 超 1 小，GPU 降为 MP3"]
    },
    {
      id: "f9000",
      name: "前代参照：麒麟 9000",
      short: "9000",
      order: 8,
      baseId: "kirin-9000",
      tagline: "理解 9000S 定位的参照系",
      intro: [
        "上一代参照，仅用于理解 9000S 的定位：1×3.13GHz A77 + 3×2.54GHz A77 + 4×2.04GHz A55，GPU Mali-G78 MP24。",
        "原文：9000S 综合性能勉强持平 9000，但 GPU 等部分能力反而不如 9000。"
      ],
      highlights: ["3.13GHz A77", "G78 MP24", "9000S 的参照对象"],
      naming: ["麒麟 9000 / 9000E / 9000L 三代命名思路的来源"]
    }
  ],

  /* ------------------------------------------------------------
   * 芯片
   * type: phone | tablet | pc
   * state: integrated | none | unknown / full | cut | half | unknown
   * ---------------------------------------------------------- */
  chips: [
    /* ========== 9000S 系列 ========== */
    {
      id: "kirin-9000s",
      name: "麒麟 9000S",
      short: "9000S",
      family: "f9000s",
      line: "main",
      type: "phone",
      base: true,
      baseId: "kirin-9000s",
      parentId: null,
      tagline: "8 核 12 线程的开端，性能勉强追平 9000",
      aliases: ["Kirin 9000S", "9000S"],
      cpu: {
        cores: 8,
        threads: 12,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2620, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1530 }
        ],
        note: "1 超 + 3 大 + 4 小的 8 核 12 线程设计；超大核本质是大核加强版，小核为公版 A510。"
      },
      gpu: { name: "Maleoon 910", cus: 4, mhz: 750 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 60 系列", "Mate X5 系列", "Pocket 2 系列", "MatePad Pro 13.2 典藏版"],
      notes: [
        "综合性能勉强持平麒麟 9000，但 GPU 等部分能力反而不如 9000。",
        "Mate 60 系列因功耗高，屏幕下方搭载了业界最大的散热板。",
        "早期 MatePad Pro 13.2 2023 非典藏版曾以 9000S 名义出现（2.62GHz + 3cu），后随系统更新降为 2.49GHz。"
      ],
      extraSpecs: [
        { label: "平板端说明", value: "早期 MatePad Pro 13.2 2023 非典藏版为 2.62GHz + 3cu，后 OTA 降至 2.49GHz" }
      ]
    },
    {
      id: "kirin-9000s1",
      name: "麒麟 9000S1",
      short: "9000S1",
      family: "f9000s",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9000s",
      parentId: "kirin-9000s",
      tagline: "Pura 70 标准版专属，GPU 先砍 1cu",
      aliases: ["Kirin 9000S1"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2487, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1530 }
        ],
        note: "超大核降频至 2.487GHz，其余规格与 9000S 相同。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Pura 70 标准版"],
      notes: ["仅超大核降频、GPU 由 4cu 砍到 3cu，是 4cu 的 75%。"]
    },
    {
      id: "kirin-9000w",
      name: "麒麟 9000W / T90",
      short: "9000W / T90",
      family: "f9000s",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9000s",
      parentId: "kirin-9000s",
      tagline: "平板端首秀：只砍基带，3cu",
      aliases: ["Kirin 9000W", "T90", "9000S 平板"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2487, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1530 }
        ],
        note: "与 9000S1 同规格，砍掉基带用于平板。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "none", note: "砍基带作为平板端芯片" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro 13.2 系列（非典藏版）", "MatePad Pro 11 2024", "旧 MatePad Air 12 2024（12G）"],
      notes: ["命名沿革：9000S（平板）→ 9000W → T90。", "首次给平板端芯片独立命名。"]
    },
    {
      id: "kirin-9000we",
      name: "麒麟 9000WE / T90A",
      short: "9000WE / T90A",
      family: "f9000s",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9000s",
      parentId: "kirin-9000w",
      tagline: "在 9000W 基础上再砍 ISP",
      aliases: ["Kirin 9000WE", "T90A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2487, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1530 }
        ],
        note: "CPU 与 9000W 相同。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "full" }
      },
      variants: [],
      devices: [
        "旧 MatePad Air 12 2024（8G）",
        "旧 MatePad 11.5S 2024 柔光版（12G）",
        "新 MatePad 11.5S 2024 柔光版（8G）"
      ],
      notes: ["命名沿革：9000WE → T90A。"]
    },
    {
      id: "kirin-9000wl",
      name: "麒麟 9000WL",
      short: "9000WL",
      family: "f9000s",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9000s",
      parentId: "kirin-9000we",
      tagline: "再砍 NPU，WiFi 平板三连刀",
      aliases: ["Kirin 9000WL"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2487, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1530 }
        ],
        note: "CPU 与 9000WE 相同。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["旧 MatePad 11.5S 2024 柔光版（8G）"],
      notes: ["无基带 + 砍 ISP + 砍 NPU，是 9000S 系列平板端的三连刀。"]
    },
    {
      id: "kirin-9000sl",
      name: "麒麟 9000SL",
      short: "9000SL",
      family: "f9000s",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9000s",
      parentId: "kirin-9000s",
      tagline: "降频 + 砍核 + 砍 cu，nova 12 Ultra",
      aliases: ["Kirin 9000SL"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2350, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 2, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 3, mhz: 1530 }
        ],
        note: "1 + 2 + 3 共 6 核，比 9000S 少 1 大 1 小。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["nova 12 Ultra"],
      notes: ["手机端三档中的最低档：降频、砍核、砍 GPU。"]
    },
    {
      id: "kirin-9000wm",
      name: "麒麟 9000WM",
      short: "9000WM",
      family: "f9000s",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9000s",
      parentId: "kirin-9000sl",
      tagline: "9000SL 的平板版，2cu 收尾",
      aliases: ["Kirin 9000WM"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3330", count: 1, mhz: 2350, tag: "大核加强版" },
          { role: "大核", arch: "Linxi_3394", count: 2, mhz: 2150 },
          { role: "小核", arch: "Cortex-A510", count: 3, mhz: 1530 }
        ],
        note: "CPU 与 9000SL 相同，GPU 再砍 1cu。"
      },
      gpu: { name: "Maleoon 910", cus: 2, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["旧 MatePad 11.5S 2024 标准版", "旧 MatePad 11.5S 2024 灵动款"],
      notes: ["2cu 仅为 4cu 基准的 50%，是 9000S 系列 GPU 规模最小的一档。"]
    },

    /* ========== 9010 系列 ========== */
    {
      id: "kirin-9010",
      name: "麒麟 9010",
      short: "9010",
      family: "f9010",
      line: "main",
      type: "phone",
      base: true,
      baseId: "kirin-9010",
      parentId: null,
      tagline: "完全体 9000S，首次上泰山超大核",
      aliases: ["Kirin 9010"],
      cpu: {
        cores: 8,
        threads: 12,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2300, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1550 }
        ],
        note: "首次引入泰山超大核，仍为 1+3+4 的 8 核 12 线程；用更低主频换更强性能与更好功耗。"
      },
      gpu: { name: "Maleoon 910", cus: 4, mhz: 750 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Pura 70 Pro / Pro+ / Ultra", "Mate XT", "Mate 70", "MatePad Mini 标准版 / 典藏版"],
      notes: [
        "9010 是完全体的 9000S：超大核换成泰山超大核，主频更低但性能更强、发热更小。",
        "原文把 MatePad Mini 列在手机档机型中，故本条目按原文归类为手机。"
      ]
    },
    {
      id: "kirin-t91b",
      name: "麒麟 T91B",
      short: "T91B",
      family: "f9010",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9010",
      parentId: "kirin-9010",
      tagline: "9010 平板满血版，仅无基带",
      aliases: ["T91B"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2300, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1550 }
        ],
        note: "CPU 与 9010 完全一致。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["新 MatePad 11.5S 2024 柔光版（12G）"],
      notes: ["原文：9010 平板端为 T91B；排序 T91B > T91 > T91A > T91C。"]
    },
    {
      id: "kirin-9010e",
      name: "麒麟 9010E / 9010A",
      short: "9010E / 9010A",
      family: "f9010",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9010",
      parentId: "kirin-9010",
      tagline: "超大核降频，GPU 3cu",
      aliases: ["Kirin 9010E", "Kirin 9010A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2190, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1550 }
        ],
        note: "超大核降频 0.11GHz，GPU 砍 1cu。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Pura 70 北斗卫星消息版", "MatePad Pro 12.2 2024 典藏版", "Pocket 2 优享版"],
      notes: ["命名沿革：9010E → 9010A。", "A/B/C 后缀首次出现，顺序代表芯片出现先后，不是性能高低。"]
    },
    {
      id: "kirin-9010w",
      name: "麒麟 9010W / T91",
      short: "9010W / T91",
      family: "f9010",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9010",
      parentId: "kirin-9010e",
      tagline: "平板端的 9010E，改名 T91",
      aliases: ["Kirin 9010W", "T91"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2190, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1550 }
        ],
        note: "与 9010E 同规格，砍基带。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro 12.2 2024", "新 MatePad Air 12 2024 柔光版（12G）"],
      notes: ["命名沿革：9010W → T91。"]
    },
    {
      id: "kirin-t91a",
      name: "麒麟 T91A",
      short: "T91A",
      family: "f9010",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9010",
      parentId: "kirin-9010w",
      tagline: "小核再降频，并砍 NPU",
      aliases: ["T91A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2190, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 3, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 4, mhz: 1400 }
        ],
        note: "小核由 1.55GHz 降到 1.40GHz。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["新 MatePad Air 12 2024 标准版"],
      notes: ["T91A 是 T91 的小核再降频版，并砍 NPU。"]
    },
    {
      id: "kirin-9010l",
      name: "麒麟 9010L / 9010B",
      short: "9010L / 9010B",
      family: "f9010",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9010",
      parentId: "kirin-9010e",
      tagline: "再砍 1 大 1 小，3cu",
      aliases: ["Kirin 9010L", "Kirin 9010B"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2190, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 2, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 3, mhz: 1400 }
        ],
        note: "1 + 2 + 3 共 6 核，小核同步降频。"
      },
      gpu: { name: "Maleoon 910", cus: 3, mhz: 750 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["nova 12 Ultra 星耀版", "MatePad Mini 悦享版 / 鸿蒙焕新版"],
      notes: ["命名沿革：9010L → 9010B。", "原文将 MatePad Mini 列在手机档机型中。"]
    },
    {
      id: "kirin-t91c",
      name: "麒麟 T91C",
      short: "T91C",
      family: "f9010",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9010",
      parentId: "kirin-9010l",
      tagline: "2cu + 无基带 + 砍 ISP/NPU",
      aliases: ["T91C"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 1, mhz: 2190, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3394", count: 2, mhz: 2180 },
          { role: "小核", arch: "Cortex-A510", count: 3, mhz: 1400 }
        ],
        note: "CPU 与 9010L 相同，GPU 再砍 1cu。"
      },
      gpu: { name: "Maleoon 910", cus: 2, mhz: 750 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["新 MatePad 11.5S 2024 灵动款 / 标准版"],
      notes: ["T91C 是 9010 系列里规格最低的一档：6 核 + 2cu + 无基带 + 砍 ISP/NPU。"]
    },

    /* ========== X90 系列 ========== */
    {
      id: "kirin-x90",
      name: "麒麟 X90",
      short: "X90",
      family: "fx90",
      line: "main",
      type: "pc",
      base: true,
      baseId: "kirin-x90",
      parentId: null,
      tagline: "首款 PC 芯片，4+4+2 十核二十线程",
      aliases: ["Kirin X90"],
      cpu: {
        cores: 10,
        threads: 20,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 4, mhz: 2320, tag: "泰山超大核改进" },
          { role: "大核", arch: "Linxi_3395", count: 4, mhz: 2010, tag: "超大核缩水版" },
          { role: "小核", arch: "Linxi_3394", count: 2, mhz: 2050, tag: "大核缩水版" }
        ],
        note: "4 个大一点的超大核 + 4 个小一点的超大核 + 2 个由 9010/9000S 大核缩水而来的小核。"
      },
      gpu: { name: "Maleoon 916", cus: 6, mhz: 950 },
      features: {
        modem: { state: "unknown", note: "原文未标注基带削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MateBook Pro", "MateBook Fold", "MatePad Edge 液冷版", "MateBook 14 鸿蒙版"],
      notes: [
        "首款电脑端处理器，2023 年已先出现在问界车机上。",
        "GPU 由马良 910 从 750MHz 超到 950MHz，并增加 2 个计算单元，组成 6cu 马良 916。",
        "受老架构限制，GPU 仅略强于 9020 的 4cu 马良 920，甚至比不上 9030pro 的 6cu 马良 935。"
      ],
      extraSpecs: [{ label: "首发", value: "2023 年问界车机，后用于 MateBook / MatePad Edge" }]
    },
    {
      id: "kirin-x90-plus",
      name: "麒麟 X90 Plus",
      short: "X90 Plus",
      family: "fx90",
      line: "main",
      type: "pc",
      base: false,
      baseId: "kirin-x90",
      parentId: "kirin-x90",
      tagline: "四个超大核 +0.13GHz，GPU 原地踏步",
      aliases: ["Kirin X90 Plus"],
      cpu: {
        cores: 10,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 4, mhz: 2450, tag: "泰山超大核改进" },
          { role: "大核", arch: "Linxi_3395", count: 4, mhz: 2010, tag: "超大核缩水版" },
          { role: "小核", arch: "Linxi_3394", count: 2, mhz: 2050, tag: "大核缩水版" }
        ],
        note: "仅在四个超大核上提频 0.13GHz。"
      },
      gpu: { name: "Maleoon 916", cus: 6, mhz: 950 },
      features: {
        modem: { state: "unknown", note: "原文未标注基带削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MateBook Pro（X90 Plus）", "MateBook Fold（X90 Plus）"],
      notes: ["提升幅度可有可无，孱弱的 GPU 部分未做任何改变。"]
    },
    {
      id: "kirin-x90a",
      name: "麒麟 X90A",
      short: "X90A",
      family: "fx90",
      line: "main",
      type: "pc",
      base: false,
      baseId: "kirin-x90",
      parentId: "kirin-x90",
      tagline: "MatePad Edge 非液冷版，半 NPU",
      aliases: ["Kirin X90A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3331", count: 3, mhz: 2070, tag: "泰山超大核改进" },
          { role: "大核", arch: "Linxi_3395", count: 3, mhz: 1850, tag: "超大核缩水版" },
          { role: "小核", arch: "Linxi_3394", count: 2, mhz: 1805, tag: "大核缩水版" }
        ],
        note: "3 + 3 + 2 共 8 核，全面降频。"
      },
      gpu: { name: "Maleoon 916B", cus: 4, mhz: 950 },
      features: {
        modem: { state: "unknown", note: "原文未标注基带削减" },
        isp: { state: "full" },
        npu: { state: "half", note: "半 NPU（原文备注）" }
      },
      variants: [],
      devices: ["MatePad Edge 非液冷版"],
      notes: ["X90 的阉割版：砍核、降频、GPU 4cu，并只保留半 NPU。", "MatePad Edge 仅顶配液冷版搭载 X90，其余为 X90A。"]
    },

    /* ========== 9020 世代 ========== */
    {
      id: "kirin-9020",
      name: "麒麟 9020",
      short: "9020",
      family: "f9020",
      line: "main",
      type: "phone",
      base: true,
      baseId: "kirin-9020",
      parentId: null,
      tagline: "全泰山架构，GPU +25%",
      aliases: ["Kirin 9020"],
      cpu: {
        cores: 8,
        threads: 12,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2500, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1600, tag: "泰山小核" }
        ],
        note: "引入全新泰山小核、抛弃 A510，仍为 1+3+4 的 8 核 12 线程。"
      },
      gpu: { name: "Maleoon 920", cus: 4, mhz: 840 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [
        { name: "蓝色旧版", note: "早期版本" },
        { name: "紫色新封装版", note: "新封装" },
        { name: "绿色 ISP 强化版", note: "ISP 强化" }
      ],
      devices: [
        "Mate 70 Pro / Pro+ / RS",
        "Mate X6 系列",
        "Pura X",
        "Mate XTs",
        "Mate 80",
        "Pura 80 Pro / Pro+ / Ultra",
        "MateTV 系列"
      ],
      notes: [
        "GPU 马良 920 比 9010/9000S 基准版的马良 910 提升约 25%。",
        "9020 存在三种版本：蓝色旧版、紫色新封装版、绿色 ISP 强化版。",
        "命名终于清晰：9020 / 9020A / 9020B 三档，不再出现同芯片前后改名。"
      ],
      extraSpecs: [{ label: "版本", value: "蓝色旧版 / 紫色新封装版 / 绿色 ISP 强化版" }]
    },
    {
      id: "kirin-9025",
      name: "麒麟 9025",
      short: "9025",
      family: "f9020",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020",
      tagline: "9020 提频版，Pura 90 Plus 专供",
      aliases: ["Kirin 9025"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2600, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1600, tag: "泰山小核" }
        ],
        note: "超大核 2.50→2.60GHz，其余与 9020 相同。"
      },
      gpu: { name: "Maleoon 920", cus: 4, mhz: 840 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Pura 90 Plus"],
      notes: [
        "搭载于 Pura 80 Pro 的换皮机 Pura 90 Plus。",
        "只是超大核提频，并未解决 GPU 短板；CPU 提频也追不上 9030S。"
      ]
    },
    {
      id: "kirin-t92",
      name: "麒麟 T92",
      short: "T92",
      family: "f9020",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020",
      tagline: "平板端首次只砍基带",
      aliases: ["T92"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2500, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1600, tag: "泰山小核" }
        ],
        note: "CPU 与 9020 完全一致，仅砍基带。"
      },
      gpu: { name: "Maleoon 920", cus: 4, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro 13.2 2025", "MatePad Pro 12.2 2025 柔光版", "Mate TV2 系列"],
      notes: ["第一次在平板端仅砍基带而无其他阉割。"]
    },
    {
      id: "kirin-9020a",
      name: "麒麟 9020A",
      short: "9020A",
      family: "f9020",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020",
      tagline: "超大核/大核降频，GPU 3cu",
      aliases: ["Kirin 9020A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2400, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2000 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1600, tag: "泰山小核" }
        ],
        note: "超大核 2.40GHz，大核 2.00GHz，各降 0.1/0.15GHz。"
      },
      gpu: { name: "Maleoon 920", cus: 3, mhz: 840 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 70 Pro 优享版", "Mate 70 Air（16G）"],
      notes: ["9030（1+3+4）就是这一档的迭代对象。"]
    },
    {
      id: "kirin-t92a",
      name: "麒麟 T92A",
      short: "T92A",
      family: "f9020",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020a",
      tagline: "T92 的 9020A 版本",
      aliases: ["T92A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2400, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2000 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1600, tag: "泰山小核" }
        ],
        note: "与 9020A 同规格，砍基带。"
      },
      gpu: { name: "Maleoon 920", cus: 3, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro 12.2 2025", "MatePad Air 12 2025 柔光版"],
      notes: ["9020A 的平板版。"]
    },
    {
      id: "kirin-t92b",
      name: "麒麟 T92B",
      short: "T92B",
      family: "f9020",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-t92a",
      tagline: "再砍 ISP 与 NPU",
      aliases: ["T92B"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2400, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2000 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1600, tag: "泰山小核" }
        ],
        note: "CPU 与 T92A 相同。"
      },
      gpu: { name: "Maleoon 920", cus: 3, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad Air 12 2025 标准版", "MatePad 11.5S 2025 标准版 / 柔光版"],
      notes: ["在 T92A 基础上再砍 ISP 与 NPU。"]
    },
    {
      id: "kirin-9020b",
      name: "麒麟 9020B",
      short: "9020B",
      family: "f9020",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020a",
      tagline: "再砍 1 大 1 小",
      aliases: ["Kirin 9020B"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2400, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 2, mhz: 2000 },
          { role: "小核", arch: "Linxi_3363", count: 3, mhz: 1600, tag: "泰山小核" }
        ],
        note: "1 + 2 + 3 共 6 核。"
      },
      gpu: { name: "Maleoon 920", cus: 3, mhz: 840 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 70 Air（12G）"],
      notes: ["9020A 再砍 1 大 1 小，GPU 维持 3cu。"]
    },
    {
      id: "kirin-t92c",
      name: "麒麟 T92C",
      short: "T92C",
      family: "f9020",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020b",
      tagline: "超大核再降频，三连砍",
      aliases: ["T92C"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2300, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 2, mhz: 2000 },
          { role: "小核", arch: "Linxi_3363", count: 3, mhz: 1600, tag: "泰山小核" }
        ],
        note: "超大核再降 0.1GHz。"
      },
      gpu: { name: "Maleoon 920", cus: 3, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad 11.5S 2025 灵动款 / 灵动款鸿蒙焕新版 / 灵动款柔光版"],
      notes: ["9020B 的平板版，无基带 + 砍 ISP/NPU。"]
    },
    {
      id: "kirin-t92d",
      name: "麒麟 T92D",
      short: "T92D",
      family: "f9020",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9020",
      parentId: "kirin-9020",
      tagline: "0 超大核 + 2cu 的传奇产物",
      aliases: ["T92D"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "—", count: 0, mhz: 0, tag: "直接砍掉" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3363", count: 3, mhz: 1600, tag: "泰山小核" }
        ],
        note: "0 个超大核 + 3 大 + 3 小 = 6 核；大核反而回到 2.15GHz。"
      },
      gpu: { name: "Maleoon 920", cus: 2, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad 11.5S 2025 活力款 / 活力款鸿蒙焕新版"],
      notes: ["原文：第一次出现砍掉超大核的「传奇产物」。", "2cu 仅为 4cu 基准的 50%。"]
    },
    {
      id: "kirin-9010s",
      name: "麒麟 9010S",
      short: "9010S",
      family: "f9020",
      line: "mid",
      type: "phone",
      base: false,
      baseId: "kirin-8020",
      parentId: "kirin-8020",
      tagline: "8020 超频版，名义上的 9 系",
      aliases: ["Kirin 9010S"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2500, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2050 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1500, tag: "泰山小核" }
        ],
        note: "由 8020 超频而来，主频全面拉高。"
      },
      gpu: { name: "Maleoon 920C", cus: 2, mhz: 840 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Pura 80", "nova 15 Pro / Ultra", "Pura 90", "nova 16 / Pro / Ultra"],
      notes: ["由 8020 超频而来，并不能算严格意义上的 9 系处理器。", "当年 985 就是 820 超频改进来的，名字容易忽悠人。"]
    },
    {
      id: "kirin-8020",
      name: "麒麟 8020",
      short: "8020",
      family: "f9020",
      line: "mid",
      type: "phone",
      base: true,
      baseId: "kirin-8020",
      parentId: null,
      tagline: "8 系迭代基准，2cu 920C",
      aliases: ["Kirin 8020"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2285, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2050 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1306, tag: "泰山小核" }
        ],
        note: "同架构中端处理器：降低频率，同时砍缓存规格与 GPU 计算单元上限。"
      },
      gpu: { name: "Maleoon 920C", cus: 2, mhz: 840 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: [
        "nova 14 Pro / Ultra",
        "nova 15",
        "nova 16z / SE",
        "畅享 100 Pro Max（512G）",
        "MatePad 11.5 2026 插卡版"
      ],
      notes: ["8000 的迭代产品：同架构、降频、砍缓存与 GPU CU 上限。"]
    },
    {
      id: "kirin-t82",
      name: "麒麟 T82",
      short: "T82",
      family: "f9020",
      line: "mid",
      type: "tablet",
      base: false,
      baseId: "kirin-8020",
      parentId: "kirin-8020",
      tagline: "8020 平板版，仅无基带",
      aliases: ["T82"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2285, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2050 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1306, tag: "泰山小核" }
        ],
        note: "CPU 与 8020 相同，砍基带。"
      },
      gpu: { name: "Maleoon 920C", cus: 2, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad 11.5 2026"],
      notes: ["8020 的平板端，仅砍基带。"]
    },
    {
      id: "kirin-t82b",
      name: "麒麟 T82B",
      short: "T82B",
      family: "f9020",
      line: "mid",
      type: "tablet",
      base: false,
      baseId: "kirin-8020",
      parentId: "kirin-t82",
      tagline: "再砍 ISP/NPU",
      aliases: ["T82B"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2285, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 3, mhz: 2050 },
          { role: "小核", arch: "Linxi_3363", count: 4, mhz: 1306, tag: "泰山小核" }
        ],
        note: "CPU 与 T82 相同。"
      },
      gpu: { name: "Maleoon 920C", cus: 2, mhz: 840 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad 11.5 2025 海外版", "MatePad 11.5 2026 标准版"],
      notes: ["T82 再砍 ISP 与 NPU。"]
    },
    {
      id: "kirin-8020a",
      name: "麒麟 8020A",
      short: "8020A",
      family: "f9020",
      line: "mid",
      type: "phone",
      base: false,
      baseId: "kirin-8020",
      parentId: "kirin-8020",
      tagline: "砍 1 大 1 小，畅享 100 系",
      aliases: ["Kirin 8020A"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3333", count: 1, mhz: 2285, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3398", count: 2, mhz: 2050 },
          { role: "小核", arch: "Linxi_3363", count: 3, mhz: 1306, tag: "泰山小核" }
        ],
        note: "砍掉 1 个大核与 1 个小核，共 6 核。"
      },
      gpu: { name: "Maleoon 920C", cus: 2, mhz: 840 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["畅享 100 Pro / Pro Max（128 / 256G）"],
      notes: ["原文：勉强还属于能用的地步，至少比前代 8000 强出一部分。"]
    },
    {
      id: "kirin-8000s",
      name: "麒麟 8000S",
      short: "8000S",
      family: "f9020",
      line: "mid",
      type: "phone",
      base: false,
      baseId: "kirin-8020",
      parentId: "kirin-8020a",
      tagline: "无超大核 + 1cu，720p 之源？",
      aliases: ["Kirin 8000S"],
      cpu: {
        cores: 5,
        threads: null,
        clusters: [
          { role: "超大核", arch: "—", count: 0, mhz: 0, tag: "没有超大核" },
          { role: "大核", arch: "Linxi_3398", count: 2, mhz: 2050 },
          { role: "小核", arch: "Linxi_3363", count: 3, mhz: 1306, tag: "泰山小核" }
        ],
        note: "没有超大核，仅 2 大 + 3 小 = 5 核，GPU 只剩 1cu。"
      },
      gpu: { name: "Maleoon 920C", cus: 1, mhz: 840 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["畅享 100 / 100m"],
      notes: ["原文吐槽：没有超大核 + 1cu GPU，或许这也是 720p 屏幕出现的原因。"]
    },
    {
      id: "kirin-t82a",
      name: "麒麟 T82A",
      short: "T82A",
      family: "f9020",
      line: "mid",
      type: "tablet",
      base: false,
      baseId: "kirin-8020",
      parentId: "kirin-t82",
      tagline: "尚未出现，推测保留 NPU",
      aliases: ["T82A"],
      unreleased: true,
      cpu: null,
      gpu: null,
      features: {
        modem: { state: "unknown" },
        isp: { state: "unknown" },
        npu: { state: "unknown" }
      },
      variants: [],
      devices: [],
      notes: ["原文：消失的 T82A（与 8020A 并无关联），推测保留了 NPU 部分，或许会搭载于某一款入门平板上。", "截至原文发布（2026-11-09）尚未出现，规格未知。"]
    },

    /* ========== 9030 世代 ========== */
    {
      id: "kirin-9030pro",
      name: "麒麟 9030pro",
      short: "9030pro",
      family: "f9030",
      line: "main",
      type: "phone",
      base: true,
      baseId: "kirin-9030pro",
      parentId: null,
      tagline: "1+4+4 九核，6cu 935",
      aliases: ["Kirin 9030 Pro", "9030 Pro"],
      cpu: {
        cores: 9,
        threads: 14,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2750, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 4, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "1+4+4 的 9 核 14 线程；pro 首次出现在麒麟芯片名称中。"
      },
      gpu: { name: "Maleoon 935", cus: 6, mhz: 933 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: [
        "Mate 80 Pro（16G）",
        "Mate 80 Pro Max",
        "Mate 80 Pro Max 风驰版",
        "Mate 80 RS",
        "Mate X7 系列",
        "Pura X Max"
      ],
      notes: [
        "GPU 新架构 + 6cu 马良 935，对比 4cu 马良 920 提升 80%。",
        "CPU 多出的一颗大核，让性能提升大于常规迭代。",
        "9030（1+3+4）对应的是原 9020A 档的迭代。"
      ],
      extraSpecs: [{ label: "工艺形态", value: "τ 定律平面芯片" }]
    },
    {
      id: "kirin-9035",
      name: "麒麟 9035",
      short: "9035",
      family: "f9030",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030pro",
      tagline: "9030pro 提频，Mate 90 Pro",
      aliases: ["Kirin 9035"],
      cpu: {
        cores: 9,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2850, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 4, mhz: 2350 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "超大核 2.85GHz，大核 2.35GHz，各提 0.1/0.08GHz。"
      },
      gpu: { name: "Maleoon 935", cus: 6, mhz: 933 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 90 Pro"],
      notes: [
        "Mate 80 Pro Max 风驰版当时用的或许就是 9035，只是还没有 90x5 的命名。",
        "华为官网：相较 9030，CPU +11%、GPU +10%、NPU +51%。"
      ]
    },
    {
      id: "kirin-t93pro",
      name: "麒麟 T93pro",
      short: "T93pro",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030pro",
      tagline: "平板满血 6cu，无基带",
      aliases: ["T93 Pro", "T93pro"],
      cpu: {
        cores: 9,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2750, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 4, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "CPU/GPU 与 9030pro 完全一致，仅砍基带。"
      },
      gpu: { name: "Maleoon 935", cus: 6, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro Max"],
      notes: ["9030pro 的平板端满血版。"]
    },
    {
      id: "kirin-xe90",
      name: "麒麟 XE90",
      short: "XE90",
      family: "f9030",
      line: "main",
      type: "pc",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030pro",
      tagline: "PC 版 9030pro，最高 32G 内存",
      aliases: ["Kirin XE90"],
      cpu: {
        cores: 9,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2750, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 4, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "采用 9030pro 的完整设计。"
      },
      gpu: { name: "Maleoon 935", cus: 6, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MateBook Pro S"],
      notes: [
        "可看作 PC 版 9030pro。",
        "最大支持 32G 运存；理论上 9030pro / T93pro 设备或可通过魔改变成 32G。",
        "单核与 GPU 超过 X90，多核仍比不过 10 核 20 线程的 X90，但能耗更好，成就了最轻的 MateBook Pro S。"
      ],
      extraSpecs: [{ label: "内存", value: "最大支持 32GB" }]
    },
    {
      id: "kirin-9030",
      name: "麒麟 9030",
      short: "9030",
      family: "f9030",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030pro",
      tagline: "1+3+4，5cu 935A",
      aliases: ["Kirin 9030"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "比 9030pro 少 1 颗大核，超大核降频至 2.695GHz。"
      },
      gpu: { name: "Maleoon 935A", cus: 5, mhz: 933 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 80 Pro（12G）", "Mate 90"],
      notes: [
        "按原文定位，9030 是原 9020A（残次品）档的迭代。",
        "华为官网：相较 9020，CPU +13%、GPU +54%、NPU +13%。"
      ]
    },
    {
      id: "kirin-t93",
      name: "麒麟 T93",
      short: "T93",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030",
      tagline: "9030 平板版，仅无基带",
      aliases: ["T93"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "CPU 与 9030 相同。"
      },
      gpu: { name: "Maleoon 935A", cus: 5, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro Max 悦享款", "MatePad Pro 12 2026"],
      notes: ["9030 的平板版，仅砍基带。"]
    },
    {
      id: "kirin-t93a",
      name: "麒麟 T93A",
      short: "T93A",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-t93",
      tagline: "再砍 ISP，性能不变",
      aliases: ["T93A"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "CPU/GPU 与 T93 相同。"
      },
      gpu: { name: "Maleoon 935A", cus: 5, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减，性能一致但拍照下降" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad Pro 12 2026 悦享款"],
      notes: ["性能一致但拍照下降——反正平板一般没有拍照需求。"]
    },
    {
      id: "kirin-t93b",
      name: "麒麟 T93B",
      short: "T93B",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-t93a",
      tagline: "5cu→4cu，再砍 NPU",
      aliases: ["T93B"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "CPU 与 T93A 相同。"
      },
      gpu: { name: "Maleoon 935B", cus: 4, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad Air 12（第三代）柔光版 / 标准版"],
      notes: ["在 T93A 基础上把 5cu 降为 4cu，并对 NPU 砍了一刀。"]
    },
    {
      id: "kirin-t93c",
      name: "麒麟 T93C",
      short: "T93C",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-t93b",
      tagline: "0 超大核，ISP/NPU 存疑",
      aliases: ["T93C"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "—", count: 0, mhz: 0, tag: "没有超大核" },
          { role: "大核", arch: "Linxi_3399", count: 4, mhz: 2270 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1720, tag: "泰山小核" }
        ],
        note: "无超大核，4 大 + 4 小 = 8 核，是否进一步阉割 ISP/NPU 尚不清楚。"
      },
      gpu: { name: "Maleoon 935B", cus: 4, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "unknown", note: "是否过分阉割尚不清楚" },
        npu: { state: "unknown", note: "是否过分阉割尚不清楚" }
      },
      variants: [],
      devices: ["MatePad Air 12（第三代）悦享版"],
      notes: ["原文：T92D 的迭代产物，但尚不清楚是否对 ISP 和 NPU 过分阉割。"]
    },
    {
      id: "kirin-9030s",
      name: "麒麟 9030S",
      short: "9030S",
      family: "f9030",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030pro",
      tagline: "缓存调整的 9010S 迭代，3cu 935F",
      aliases: ["Kirin 9030S"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山 V123" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1620, tag: "泰山小核" }
        ],
        note: "1+3+4 共 8 核，主频低于 9030；核心备注为「泰山 V123」。"
      },
      gpu: { name: "Maleoon 935F", cus: 3, mhz: 933 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Pura 90 Pro / Pro Max", "Pura X View"],
      notes: [
        "名字像 9030pro 的阉割版，但缓存大小有调整，实际是 9010S 的迭代（9030pro 同架构的 8030 尚未出现的超频版）。",
        "中间跳过了 9020S 的命名，容易让人误会。",
        "GPU 阉为 3cu 935F，但靠新架构与系统调度基本持平 9020；CPU 基本持平 9030。"
      ],
      extraSpecs: [{ label: "核心", value: "泰山 V123" }]
    },
    {
      id: "kirin-t93s",
      name: "麒麟 T93S",
      short: "T93S",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-9030s",
      tagline: "9030S 平板版，三连砍",
      aliases: ["T93S"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山 V123" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1620, tag: "泰山小核" }
        ],
        note: "CPU 与 9030S 相同。"
      },
      gpu: { name: "Maleoon 935F", cus: 3, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad Air Z 柔光版"],
      notes: ["9030S 的平板端：无基带 + 砍 ISP + 砍 NPU。"]
    },
    {
      id: "kirin-t93sd",
      name: "麒麟 T93SD",
      short: "T93SD",
      family: "f9030",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-9030pro",
      parentId: "kirin-t93s",
      tagline: "再砍 1cu，2cu 收尾",
      aliases: ["T93SD"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3334", count: 1, mhz: 2695, tag: "泰山 V123" },
          { role: "大核", arch: "Linxi_3399", count: 3, mhz: 2150 },
          { role: "小核", arch: "Linxi_3364", count: 4, mhz: 1620, tag: "泰山小核" }
        ],
        note: "CPU 与 T93S 相同，GPU 再砍 1cu。"
      },
      gpu: { name: "Maleoon 935F", cus: 2, mhz: 933 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "cut", note: "ISP 削减" },
        npu: { state: "cut", note: "NPU 削减" }
      },
      variants: [],
      devices: ["MatePad Air Z 标准版 / 悦享款"],
      notes: ["T93S 再砍 1cu，是 9030 世代 GPU 规模最小的一档。"]
    },

    /* ========== 9050 世代 ========== */
    {
      id: "kirin-9050pro",
      name: "麒麟 9050pro",
      short: "9050pro",
      family: "f9050",
      line: "main",
      type: "phone",
      base: true,
      baseId: "kirin-9050pro",
      parentId: null,
      tagline: "双 die 逻辑折叠，GPU +40%",
      aliases: ["Kirin 9050 Pro", "9050 Pro"],
      cpu: {
        cores: 9,
        threads: 16,
        clusters: [
          { role: "超大核", arch: "Linxi_3335", count: 1, mhz: 3100, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3400", count: 2, mhz: 2700 },
          { role: "大核", arch: "Linxi_3400", count: 4, mhz: 2200 },
          { role: "小核", arch: "Linxi_3365", count: 2, mhz: 1750, tag: "泰山小核" }
        ],
        note: "1 + 2 + 4 + 2 的 9 核 16 线程（华为官网口径；酷安原文写 14 线程，二者冲突，本应用采用官方口径），大核分 2.70GHz 与 2.20GHz 两组。"
      },
      gpu: { name: "Maleoon 955", cus: 6, mhz: 1056 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 90 Pro Max（16G）", "Mate 90 Pro Max 典藏版", "Mate 90 RS", "Mate XT2"],
      notes: [
        "主副双 die 的立体设计，能耗大幅进步。",
        "对比 9030pro：同频功耗降低 30%，GPU 提升 40%。",
        "华为官网：CPU 多核 +23%、GPU +40%、NPU +140%，支持 30B MoE 端侧大模型；官网写 9 核 16 线程，原文写 14 线程。",
        "单颗芯片成本更高，叠加内存涨价。"
      ],
      extraSpecs: [{ label: "封装形态", value: "主副双 die · 逻辑折叠" }]
    },
    {
      id: "kirin-9050",
      name: "麒麟 9050",
      short: "9050",
      family: "f9050",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-9050pro",
      parentId: "kirin-9050pro",
      tagline: "9050pro 的 12G 版，5cu",
      aliases: ["Kirin 9050"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Linxi_3335", count: 1, mhz: 3000, tag: "泰山超大核" },
          { role: "大核", arch: "Linxi_3400", count: 2, mhz: 2700 },
          { role: "大核", arch: "Linxi_3400", count: 3, mhz: 2200 },
          { role: "小核", arch: "Linxi_3365", count: 2, mhz: 1750, tag: "泰山小核" }
        ],
        note: "超大核 3.00GHz，大核 4→3 颗，共 8 核。"
      },
      gpu: { name: "Maleoon 955A", cus: 5, mhz: 1056 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["Mate 90 Pro Max（12G）"],
      notes: ["9050pro 的 12G 内存版本，CPU 与 GPU 小幅缩水。"]
    },

    /* ========== 8000 系列 ========== */
    {
      id: "kirin-8000",
      name: "麒麟 8000",
      short: "8000",
      family: "f8000",
      line: "main",
      type: "phone",
      base: true,
      baseId: "kirin-8000",
      parentId: null,
      tagline: "9000 架构下放，A77+A55",
      aliases: ["Kirin 8000"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Cortex-A77", count: 1, mhz: 2400, tag: "A77" },
          { role: "大核", arch: "Cortex-A77", count: 3, mhz: 2190, tag: "A77" },
          { role: "小核", arch: "Cortex-A55", count: 4, mhz: 1840, tag: "A55" }
        ],
        note: "麒麟 9000 的架构下放：1×2.40 + 3×2.19 A77 + 4×1.84 A55。"
      },
      gpu: { name: "Mali-G610 MP4", cus: 4, mhz: 864 },
      features: {
        modem: { state: "integrated", note: "原文未标注削减" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: [
        "nova 12 / Pro",
        "nova Flip",
        "nova S",
        "畅享 90 Plus / 90 Pro Max",
        "nova 13 系列",
        "nova 14",
        "nova 活力版",
        "畅享 70X 尊享版"
      ],
      notes: [
        "新 8 系是老 9 系架构下放：优化 + 降频后以能效打中端。",
        "G610 MP4 规模远小于 9000 的 G78 MP24；绝对性能仍是 24cu G78 更强，但代际提升缩小了差距。",
        "受制程拖累，8000 甚至比不上麒麟 990。",
        "吃到纯血鸿蒙红利，畅享 90 Pro Max 热度超预期。"
      ],
      extraSpecs: [{ label: "架构来源", value: "麒麟 9000 下放（A77 + A55）" }]
    },
    {
      id: "kirin-t80",
      name: "麒麟 T80",
      short: "T80",
      family: "f8000",
      line: "main",
      type: "tablet",
      base: false,
      baseId: "kirin-8000",
      parentId: "kirin-8000",
      tagline: "8000 平板版，无基带",
      aliases: ["T80"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Cortex-A77", count: 1, mhz: 2400, tag: "A77" },
          { role: "大核", arch: "Cortex-A77", count: 3, mhz: 2190, tag: "A77" },
          { role: "小核", arch: "Cortex-A55", count: 4, mhz: 1840, tag: "A55" }
        ],
        note: "CPU/GPU 与 8000 相同，仅砍基带。"
      },
      gpu: { name: "Mali-G610 MP4", cus: 4, mhz: 864 },
      features: {
        modem: { state: "none", note: "无基带" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["MatePad 11.5 2024"],
      notes: ["8000 的平板端，仅砍基带。"]
    },
    {
      id: "kirin-8000a",
      name: "麒麟 8000A",
      short: "8000A",
      family: "f8000",
      line: "main",
      type: "phone",
      base: false,
      baseId: "kirin-8000",
      parentId: "kirin-8000",
      tagline: "砍 1 超 1 小，G610 MP3",
      aliases: ["Kirin 8000A"],
      cpu: {
        cores: 6,
        threads: null,
        clusters: [
          { role: "超大核", arch: "—", count: 0, mhz: 0, tag: "没有超大核" },
          { role: "大核", arch: "Cortex-A77", count: 3, mhz: 2190, tag: "A77" },
          { role: "小核", arch: "Cortex-A55", count: 3, mhz: 1840, tag: "A55" }
        ],
        note: "没有超大核，3 大 + 3 小 = 6 核。"
      },
      gpu: { name: "Mali-G610 MP3", cus: 3, mhz: 864 },
      features: {
        modem: { state: "integrated" },
        isp: { state: "full" },
        npu: { state: "full" }
      },
      variants: [],
      devices: ["畅享 70X", "畅享 90"],
      notes: ["砍掉 1 超大核与 1 小核，GPU 由 MP4 降为 MP3。"]
    },

    /* ========== 前代参照 ========== */
    {
      id: "kirin-9000",
      name: "麒麟 9000",
      short: "9000",
      family: "f9000",
      line: "ref",
      type: "phone",
      base: true,
      reference: true,
      baseId: "kirin-9000",
      parentId: null,
      tagline: "上一代参照，G78 MP24",
      aliases: ["Kirin 9000"],
      cpu: {
        cores: 8,
        threads: null,
        clusters: [
          { role: "超大核", arch: "Cortex-A77", count: 1, mhz: 3130, tag: "A77" },
          { role: "大核", arch: "Cortex-A77", count: 3, mhz: 2540, tag: "A77" },
          { role: "小核", arch: "Cortex-A55", count: 4, mhz: 2040, tag: "A55" }
        ],
        note: "1×3.13GHz A77 + 3×2.54GHz A77 + 4×2.04GHz A55。"
      },
      gpu: { name: "Mali-G78 MP24", cus: 24, mhz: null },
      features: {
        modem: { state: "unknown", note: "原文未标注" },
        isp: { state: "unknown" },
        npu: { state: "unknown" }
      },
      variants: [],
      devices: [],
      notes: [
        "原文中仅作为 9000S 的对比参照出现，未给出 GPU 频率与完整规格。",
        "9000S 综合性能勉强持平 9000，但 GPU 等部分能力反而不如 9000。"
      ],
      extraSpecs: [{ label: "说明", value: "原文仅作对比提及，非本次图鉴的完整收录对象" }]
    }
  ]
};

/* ============================================================
 * 联网补充资料（2026-11 核对）
 *
 * 原则：
 * - 原文之外的公开信息，按来源与可信度标注，不覆盖原文口径；
 * - 冲突时并列或注明，不取单一说法冒充定论；
 * - 没有可靠来源的字段留空，界面显示「未查到可靠资料」。
 *
 * confidence:
 *   official  华为/海思官方
 *   teardown  拆解/逆向分析（TechInsights、SemiAnalysis 等）
 *   media     媒体/评测（极客湾、快科技、真义科技等）
 *   db        规格数据库/百科（Nanoreview、PhoneBench、百度百科等）
 *   inferred  由同代资料推断，未单独验证
 *   conflict  公开来源互相冲突
 *   unknown   官方未公开
 * ============================================================ */

window.KIRIN_DATA.sources = {
  "ti-9000s": {
    label: "TechInsights",
    title: "SMIC N+2 7nm – Huawei Mate 60 Pro",
    url: "https://techinsights.com/products/cut-2309-801",
    kind: "teardown"
  },
  "ti-9020": {
    label: "TechInsights",
    title: "Huawei Mate 70 Pro+: Kirin 9020 is SMIC 7nm (N+2)",
    url: "https://www.techinsights.com/blog/huawei-mate-70-pro-exploring-hisilicon-kirin-9020-processor",
    kind: "teardown"
  },
  "ti-9030": {
    label: "TechInsights",
    title: "SMIC N+3 Confirmed: Kirin 9030 Analysis",
    url: "https://techinsights.com/blog/smic-n3-confirmed-kirin-9030-analysis-reveals-how-close-smic-5nm",
    kind: "teardown"
  },
  "ti-x90": {
    label: "TechInsights",
    title: "MateBook Fold uses Kirin X90 built on SMIC 7nm (N+2)",
    url: "https://techinsights.com/blog/huawei-matebook-fold-uses-kirin-x90-built-smics-7nm-n2-node",
    kind: "teardown"
  },
  "wccf-9050": {
    label: "WCCFTech",
    title: "Kirin 9050 Pro die shots: N+3 logic die + N+2 SRAM die",
    url: "https://wccftech.com/die-shots-for-huaweis-latest-kirin-9050-pro-chip-show-a-much-smaller-footprint-encompassing-a-logic-die-on-smics-n3-process-bonded-to-an-sram-die-on-the-n2-process",
    kind: "teardown"
  },
  "huawei-mate90": {
    label: "华为官网",
    title: "HUAWEI Mate 90 系列卖点（9030 / 9035 / 9050 官方口径）",
    url: "https://consumer.huawei.com/cn/support/content/zh-cn16119534/",
    kind: "official"
  },
  "ithome-9050npu": {
    label: "IT之家",
    title: "麒麟 9050 系列新一代达芬奇 NPU：+140%、30B MoE",
    url: "https://m.ithome.com/html/1025331.htm",
    kind: "official"
  },
  "zhenyi-9020": {
    label: "真义科技",
    title: "麒麟 9020 较 9010 升级解析：缓存、GPU 与跑分",
    url: "https://www.163.com/dy/article/JN5FGDKM0556135B.html",
    kind: "media"
  },
  "mydrivers-9030cache": {
    label: "快科技",
    title: "麒麟 9030 / 9030 Pro 区别：L3 12MB、SLC 12MB",
    url: "https://news.mydrivers.com/1/1134/1134094.htm",
    kind: "media"
  },
  "geekerwan-9000s": {
    label: "极客湾",
    title: "麒麟 9000S 测评汇总：L3 4MB",
    url: "https://www.bilibili.com/opus/837165408933904400",
    kind: "media"
  },
  "geekerwan-9000cache": {
    label: "极客湾",
    title: "麒麟 9000：L3 4MB、SLC 8MB",
    url: "https://www.bilibili.com/opus/771443153825693700",
    kind: "media"
  },
  "eet-9000s": {
    label: "电子工程专辑",
    title: "麒麟 9000S 首测：LPDDR5X、UFS 4.0、巴龙 5000",
    url: "https://eet-china.com/mp/a276221.html",
    kind: "media"
  },
  "hmc-9000s": {
    label: "HMC Tech",
    title: "Kirin 9000S 规格（LPDDR5X / 67.2GB/s）",
    url: "https://hmc-tech.com/cpus/hisilicon-kirin-9000s-vs-qualcomm-snapdragon-888",
    kind: "db"
  },
  "baidu-9000s": {
    label: "百度百科",
    title: "麒麟 9000S（跑分、内存、基带）",
    url: "https://baike.baidu.com/item/%E9%BA%92%E9%BA%9F9000S/63385751",
    kind: "db"
  },
  "baidu-9010": {
    label: "百度百科",
    title: "麒麟 9010（LPDDR5X 4200MHz、巴龙 5G）",
    url: "https://baike.baidu.com/item/%E9%BA%92%E9%BA%9F9010/64762223",
    kind: "db"
  },
  "baidu-9020": {
    label: "百度百科",
    title: "麒麟 9020（架构与发布信息）",
    url: "https://baike.baidu.com/item/%E9%BA%92%E9%BA%9F9020/65193848",
    kind: "db"
  },
  "baidu-9050": {
    label: "百度百科",
    title: "麒麟 9050 Pro（缓存：L3 8+8MB、SLC 12MB）",
    url: "https://baike.baidu.com/item/%E9%BA%92%E9%BA%9F9050%20Pro/68851101",
    kind: "db"
  },
  "phonebench-9020": {
    label: "PhoneBench",
    title: "Kirin 9020：LPDDR5X 4266MHz、68.2GB/s",
    url: "https://phonebench.net/chipsets/hisilicon-kirin-9020",
    kind: "db"
  },
  "nanoreview-9030": {
    label: "Nanoreview",
    title: "Kirin 9030 Pro：LPDDR5X-4800、76.8GB/s",
    url: "https://nanoreview.net/en/soc/hisilicon-kirin-9030",
    kind: "db"
  },
  "nanoreview-9050": {
    label: "Nanoreview",
    title: "Kirin 9050 Pro 规格（内存口径与其它源冲突）",
    url: "https://nanoreview.net/en/soc/hisilicon-kirin-9050-pro",
    kind: "db"
  },
  "topcpu-9050": {
    label: "TopCPU",
    title: "Kirin 9050 Pro 对比页（内存口径冲突）",
    url: "https://topcpu.net/en/soc-c/apple-a19-vs-hisilicon-kirin-9050-pro",
    kind: "db"
  },
  "notebookcheck-9050": {
    label: "Notebookcheck",
    title: "Kirin 9050 Pro：2MB L2、8MB L3、SLC 12MB",
    url: "https://notebookcheck.net/HiSilicon-Kirin-9050-Pro-Processor-Benchmarks-and-Specs.1417169.0.html",
    kind: "db"
  },
  "mydrivers-9030score": {
    label: "快科技",
    title: "麒麟 9030 Pro GB6 单核 1742 / 多核 5238（卓易通）",
    url: "https://news.mydrivers.com/1/1089/1089851.htm",
    kind: "media"
  },
  "163-9050score": {
    label: "网易",
    title: "麒麟 9050 Pro GB6 单核 2084 / 多核约 10400",
    url: "https://www.163.com/dy/article/L685R0T00556LMBK.html",
    kind: "media"
  },
  "qq-9010score": {
    label: "腾讯新闻",
    title: "麒麟 9010 GB6 单核 1447 / 多核 4765",
    url: "https://news.qq.com/rain/a/20240420A000LE00",
    kind: "media"
  },
  "notebookcheck-9010": {
    label: "Notebookcheck",
    title: "Kirin 9010 3DMark Wild Life Extreme 1531",
    url: "https://notebookcheck.net/Kirin-9010-Huawei-Pura70-Ultra-s-chipset-fails-to-beat-mid-range-SoCs-in-benchmark-tests.829853.0.html",
    kind: "media"
  },
  "x-9020score": {
    label: "X / TechInfo",
    title: "Kirin 9020 GB6 单核 1591 / 多核约 5100",
    url: "https://x.com/TECHINFOSOCIALS/status/1861622743676133652",
    kind: "media"
  },
  "nanoreview-8000": {
    label: "Nanoreview",
    title: "Kirin 8000 GB6 936 / 2600（Nova 13 Pro）",
    url: "https://nanoreview.net/en/soc/benchmark-entry?id=34212&type=phone_geekbench_cpu",
    kind: "db"
  },
  "icpdf-9020modem": {
    label: "ICPDF / EEWorld",
    title: "麒麟 9020 集成巴龙 6000，首款 3GPP R18 5G-A SoC",
    url: "https://www.icpdf.com/news/3804.html",
    kind: "media"
  },
  "hisilicon-balong": {
    label: "海思官网",
    title: "巴龙 5000：Sub-6 4.6Gbps 下行 / 2.5Gbps 上行",
    url: "https://www.hisilicon.com/cn/products/balong/balong-5000",
    kind: "official"
  },
  "hisilicon-9000": {
    label: "海思官网",
    title: "麒麟 9000：5nm、达芬奇 2.0 NPU",
    url: "https://www.hisilicon.com/cn/products/kirin/kirin-flagship-chips/kirin-9000",
    kind: "official"
  },
  "zhihu-8020": {
    label: "知乎",
    title: "麒麟 8020 拆解：L3 8MB、小核 L2 1MB",
    url: "https://zhuanlan.zhihu.com/p/1908236239682924824",
    kind: "media"
  },
  "zhihu-x90": {
    label: "知乎",
    title: "鸿蒙 PC 深度评测：X90 16MB L3、每核 1MB L2",
    url: "https://zhuanlan.zhihu.com/p/1919706986481690123",
    kind: "media"
  },
  "eet-x90npu": {
    label: "电子工程专辑",
    title: "麒麟 X90：双达芬奇 NPU、40TOPS",
    url: "https://eet-china.com/mp/a472702.html",
    kind: "media"
  },
  "sohu-x90": {
    label: "搜狐",
    title: "麒麟 X90 曝光：10 核 20 线程、100GB/s 带宽",
    url: "https://www.sohu.com/a/893776619_121118995",
    kind: "media"
  },
  "smartphone-ua-8000": {
    label: "Smartphone.ua",
    title: "Kirin 8000：7nm（SMIC N+2）、达芬奇 NPU",
    url: "https://smartphone.ua/en/chips/hisilicon-kirin-8000",
    kind: "db"
  },
  "deviceinfo-8000": {
    label: "Device Info",
    title: "Kirin 8000：LPDDR4X 2133MHz",
    url: "https://deviceinfo.app/soc/hisilicon/kirin-8000",
    kind: "db"
  },
  "nanoreview-8020": {
    label: "Nanoreview",
    title: "Kirin 8020：7nm、8 核规格",
    url: "https://nanoreview.net/en/soc/hisilicon-kirin-8020",
    kind: "db"
  }
};

window.KIRIN_DATA.research = {
  "kirin-9000s": {
    process: {
      value: "SMIC N+2（7nm 级）",
      detail: "TechInsights 拆解 Mate 60 Pro 确认；9010 / 9020 沿用同一节点。",
      sources: ["ti-9000s"],
      confidence: "teardown"
    },
    memory: {
      value: "LPDDR5 / LPDDR5X（来源冲突）",
      detail: "百度百科写 LPDDR5-2750、44GB/s；电子工程专辑与 HMC 写 LPDDR5X、约 67.2GB/s。存储普遍标 UFS 4.0。",
      sources: ["baidu-9000s", "eet-9000s", "hmc-9000s"],
      confidence: "conflict"
    },
    cache: {
      value: "L3 4MB · SLC 4MB",
      detail: "极客湾口径；L2 各源冲突（512KB / 1MB），暂不采信。",
      sources: ["geekerwan-9000s", "baidu-9000s"],
      confidence: "media"
    },
    npu: {
      value: "达芬奇架构；TOPS 未公布",
      detail: "华为未公布移动端 NPU 算力；原文只标注完整 / 削减。",
      sources: ["baidu-9000s"],
      confidence: "db"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号；原文只标注是否削减。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "巴龙 5000（集成）",
      detail: "Sub-6GHz 下行 4.6Gbps / 上行 2.5Gbps；Mate 60 系列集成 5G。",
      sources: ["hisilicon-balong", "eet-9000s"],
      confidence: "media"
    },
    benchmarks: [
      { name: "Geekbench 6 单核", value: "1324", device: "Mate 60 Pro", sources: ["baidu-9000s"] },
      { name: "Geekbench 6 多核", value: "4116", device: "Mate 60 Pro", sources: ["baidu-9000s"] },
      { name: "安兔兔 V10", value: "950935", device: "Mate 60 Pro", sources: ["baidu-9000s"] },
      { name: "3DMark Wild Life", value: "4940", device: "Mate 60 Pro", sources: ["baidu-9000s"] }
    ],
    benchmarkNote: "跑分随系统版本、散热与测试环境波动，仅作量级参考。"
  },

  "kirin-9010": {
    process: {
      value: "SMIC N+2（7nm 级）",
      detail: "TechInsights 在 9020 报告中确认：9020 沿用 9010 的 SMIC N+2 节点。",
      sources: ["ti-9020"],
      confidence: "teardown"
    },
    memory: {
      value: "LPDDR5X 4200MHz",
      detail: "百度百科口径，最高 16GB；Wi-Fi 7 / 蓝牙 5.3。",
      sources: ["baidu-9010"],
      confidence: "db"
    },
    cache: {
      value: "L3 8MB · 超大核 L2 1MB",
      detail: "相对 9000S：L3 翻倍至 8MB，超大核 L2 翻倍至 1MB。",
      sources: ["zhenyi-9020"],
      confidence: "media"
    },
    npu: {
      value: "达芬奇架构；TOPS 未公布",
      detail: "华为未公布移动端 NPU 算力。",
      sources: ["baidu-9010"],
      confidence: "db"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号；原文只标注是否削减。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "巴龙 5000（集成）",
      detail: "媒体与规格库口径；Sub-6 4.6Gbps / 2.5Gbps。",
      sources: ["baidu-9010", "hisilicon-balong"],
      confidence: "db"
    },
    benchmarks: [
      { name: "Geekbench 6 单核", value: "1447", device: "Pura 70 Ultra", sources: ["qq-9010score"] },
      { name: "Geekbench 6 多核", value: "4765", device: "Pura 70 Ultra", sources: ["qq-9010score"] },
      { name: "3DMark Wild Life Extreme", value: "1531", device: "Pura 70 Ultra", sources: ["notebookcheck-9010"] }
    ],
    benchmarkNote: "Pura 70 系列不同机型调度不同，分数会有浮动。"
  },

  "kirin-9020": {
    process: {
      value: "SMIC N+2（7nm 级）",
      detail: "TechInsights 拆解 Mate 70 Pro+：9020 为 9010 的增强版，工艺未变；面积 136.6mm²，比 9010 大 15%。",
      sources: ["ti-9020"],
      confidence: "teardown"
    },
    memory: {
      value: "LPDDR5X 4266MHz",
      detail: "4×16-bit，约 68.2GB/s，最高 16GB；UFS 4.0（规格库口径）。",
      sources: ["phonebench-9020"],
      confidence: "db"
    },
    cache: {
      value: "L3 10MB · SLC 8MB",
      detail: "小核共享 L2 1MB（另有来源称 2MB，存在冲突）；超大核 L2 约 1MB。",
      sources: ["zhenyi-9020"],
      confidence: "media"
    },
    npu: {
      value: "达芬奇架构；TOPS 未公布",
      detail: "Mate 70 系列官方口径为整机性能 +40%（对比 Mate 60 Pro+），未单列 NPU 算力。",
      sources: ["baidu-9020", "zhenyi-9020"],
      confidence: "db"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号；原文标注 ISP 强化版等版本差异。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "巴龙 6000（集成）",
      detail: "媒体称首款支持 3GPP R18 的 5G-A 移动 SoC；具体速率未公布。",
      sources: ["icpdf-9020modem"],
      confidence: "media"
    },
    benchmarks: [
      { name: "Geekbench 6 单核", value: "约 1591", device: "Mate 70 Pro+", sources: ["x-9020score"] },
      { name: "Geekbench 6 多核", value: "约 5100", device: "Mate 70 Pro+", sources: ["x-9020score"] }
    ],
    benchmarkNote: "GB6 分数来自爆料/媒体实测，不同版本差异较大。"
  },

  "kirin-9030pro": {
    process: {
      value: "SMIC N+3（7nm 级演进）",
      detail: "TechInsights 拆解 Mate 80 Pro Max 确认；SemiAnalysis 亦给出 N+3 结论，晶体管密度接近台积电 N6。",
      sources: ["ti-9030"],
      confidence: "teardown"
    },
    memory: {
      value: "LPDDR5X-4800",
      detail: "4×16-bit，约 76.8GB/s（规格库口径）；Mate 80 Pro+ 有 20GB 定制内存版本。",
      sources: ["nanoreview-9030"],
      confidence: "db"
    },
    cache: {
      value: "L3 12MB · SLC 12MB · 超大核 L2 2MB",
      detail: "相对 9020：L3 10→12MB，SLC 8→12MB，超大核 L2 1→2MB。",
      sources: ["mydrivers-9030cache"],
      confidence: "media"
    },
    npu: {
      value: "达芬奇架构（Transformer 引擎硬化）",
      detail: "官方：9030 对比 9020，NPU +13%、首字响应 +59%；TOPS 未公布。9035 对比 9030，NPU +51%。",
      sources: ["huawei-mate90"],
      confidence: "official"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号；官方只公布影像能力（2 亿 RAW 域实时处理、3DGS 等）。",
      sources: ["huawei-mate90"],
      confidence: "unknown"
    },
    modem: {
      value: "集成巴龙 5G（型号未公布）",
      detail: "官方称支持 5G-A 与卫星寻呼；未公布基带型号与速率。",
      sources: ["huawei-mate90"],
      confidence: "official"
    },
    benchmarks: [
      { name: "Geekbench 6 单核", value: "1742（卓易通，约 10% 损耗）", device: "Mate 80 Pro", sources: ["mydrivers-9030score"] },
      { name: "Geekbench 6 多核", value: "5238（卓易通，约 10% 损耗）", device: "Mate 80 Pro", sources: ["mydrivers-9030score"] },
      { name: "Geekbench 6 单核（媒体修正）", value: "约 1900–2000", device: "Mate 80 Pro", sources: ["mydrivers-9030score"] },
      { name: "Geekbench 6 多核（媒体修正）", value: "约 5760–6200", device: "Mate 80 Pro", sources: ["mydrivers-9030score"] }
    ],
    benchmarkNote: "鸿蒙无原生 Geekbench，需经卓易通，官方/媒体普遍估计有约 10% 性能损耗。"
  },

  "kirin-9050pro": {
    process: {
      value: "主 Die：SMIC N+3 · SRAM Die：SMIC N+2",
      detail: "双 die 混合键合 / 逻辑折叠；TechInsights 与 WCCFTech 拆解口径。晶体管密度 238 MTr/mm²，官方称 +53.5%。",
      sources: ["wccf-9050", "huawei-mate90"],
      confidence: "teardown"
    },
    memory: {
      value: "未确认（LPDDR5X / LPDDR6 说法冲突）",
      detail: "数据库给出 LPDDR5X-8533 或 LPDDR6-10667 等互相矛盾的口径；华为未公布，暂不采信单一说法。",
      sources: ["nanoreview-9050", "topcpu-9050"],
      confidence: "conflict"
    },
    cache: {
      value: "L3 8MB + 8MB · SLC 12MB · L2 2MB",
      detail: "超大核与 2 颗性能核共享 8MB L3，4 颗能效核另享 8MB L3；双 die 各带缓存。",
      sources: ["baidu-9050", "notebookcheck-9050"],
      confidence: "db"
    },
    npu: {
      value: "新一代达芬奇架构；NPU +140%",
      detail: "官方：NPU 性能 +140%、功耗 -66%；支持 30B MoE 端侧大模型、Transformer 引擎。TOPS 未公布。",
      sources: ["huawei-mate90", "ithome-9050npu"],
      confidence: "official"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号；官方只公布 2 亿 RAW 域实时处理、3DGS 等影像能力。",
      sources: ["huawei-mate90"],
      confidence: "unknown"
    },
    modem: {
      value: "集成巴龙基带（型号未公布）",
      detail: "官方：天地一体融合通信架构，支持卫星寻呼；未公布型号与速率。",
      sources: ["huawei-mate90"],
      confidence: "official"
    },
    benchmarks: [
      { name: "Geekbench 6 单核", value: "2084", device: "Mate 90 Pro Max", sources: ["163-9050score"] },
      { name: "Geekbench 6 多核", value: "约 10400", device: "Mate 90 Pro Max", sources: ["163-9050score"] }
    ],
    benchmarkNote: "华为公布单核 2084（前代 1854，+12%）；多核 10400 为媒体实测，不同散热条件差异明显。"
  },

  "kirin-9030s": {
    process: {
      value: "SMIC N+3（按同代推断，未单独拆解）",
      detail: "9030S 属 9030 世代，但公开资料未单独给出拆解结论。",
      sources: ["ti-9030"],
      confidence: "inferred"
    },
    cache: {
      value: "缓存规格有调整（容量未公开）",
      detail: "原文：9030S 对缓存大小有所调整，是 9010S 的迭代；未给具体容量。",
      sources: [],
      confidence: "conflict"
    }
  },

  "kirin-x90": {
    process: {
      value: "SMIC N+2（7nm 级）",
      detail: "TechInsights 拆解 MateBook Fold 确认，驳回了「5nm」传闻。",
      sources: ["ti-x90"],
      confidence: "teardown"
    },
    memory: {
      value: "类型未公开；带宽约 100GB/s",
      detail: "媒体口径；华为未公布 X90 的内存类型与位宽。",
      sources: ["sohu-x90"],
      confidence: "media"
    },
    cache: {
      value: "L3 16MB · 每核 L2 1MB",
      detail: "鸿蒙 PC 评测口径；10 核共享 16MB L3。",
      sources: ["zhihu-x90"],
      confidence: "media"
    },
    npu: {
      value: "双达芬奇 NPU · 40 TOPS",
      detail: "媒体报道的本地 AI 算力；华为官网规格页未列 TOPS。",
      sources: ["eet-x90npu"],
      confidence: "media"
    },
    isp: {
      value: "未公开型号",
      detail: "PC 平台，华为未公布 ISP 规格。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "未确认（PC 平台）",
      detail: "原文未标注；公开资料未确认 X90 是否集成蜂窝基带。",
      sources: [],
      confidence: "unknown"
    },
    benchmarks: [],
    benchmarkNote: "无可靠原生跑分：Geekbench 无鸿蒙原生版，极客湾称网传 X90 分数不可信。"
  },

  "kirin-8000": {
    process: {
      value: "SMIC 7nm（N+2，数据库口径）",
      detail: "多个规格库标 7nm / SMIC N+2；TechInsights 曾分析 Kirin 8000，但公开摘要未给节点结论。",
      sources: ["smartphone-ua-8000"],
      confidence: "db"
    },
    memory: {
      value: "LPDDR4X 2133MHz",
      detail: "规格库口径；终端最高容量以机型为准。",
      sources: ["deviceinfo-8000"],
      confidence: "db"
    },
    npu: {
      value: "达芬奇架构；TOPS 未公布",
      detail: "规格库标注 Da Vinci NPU。",
      sources: ["smartphone-ua-8000"],
      confidence: "db"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "集成 5G 巴龙基带（型号未公布）",
      detail: "nova 12 系列支持 5G；具体基带型号未公开。",
      sources: ["smartphone-ua-8000"],
      confidence: "db"
    },
    benchmarks: [
      { name: "Geekbench 6 单核", value: "936", device: "nova 13 Pro", sources: ["nanoreview-8000"] },
      { name: "Geekbench 6 多核", value: "2600", device: "nova 13 Pro", sources: ["nanoreview-8000"] }
    ],
    benchmarkNote: "不同机型/系统版本差异较大，另有来源给出更高分数。"
  },

  "kirin-8020": {
    process: {
      value: "SMIC 7nm（N+2，数据库口径）",
      detail: "规格库标 7nm；未见公开拆解报告。",
      sources: ["nanoreview-8020"],
      confidence: "db"
    },
    cache: {
      value: "L3 8MB · 小核共享 L2 1MB",
      detail: "拆解评测口径：共享 L3 由 6MB 增至 8MB；小核 L2 较 9020 缩减。",
      sources: ["zhihu-8020"],
      confidence: "media"
    },
    npu: {
      value: "达芬奇架构；TOPS 未公布",
      detail: "规格库标注 Da Vinci NPU。",
      sources: ["nanoreview-8020"],
      confidence: "db"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "集成 5G 巴龙基带（型号未公布）",
      detail: "5G 规格由机型支持情况确认；基带型号未公开。",
      sources: ["nanoreview-8020"],
      confidence: "db"
    },
    benchmarks: [],
    benchmarkNote: "未收录可靠统一跑分；不同机型差异较大。"
  },

  "kirin-9000": {
    process: {
      value: "TSMC 5nm",
      detail: "麒麟 9000 为台积电 5nm，153 亿晶体管。",
      sources: ["hisilicon-9000"],
      confidence: "official"
    },
    memory: {
      value: "LPDDR5-2750 · UFS 3.1",
      detail: "最高 16GB，约 44GB/s（公开资料口径）。",
      sources: ["hisilicon-9000"],
      confidence: "official"
    },
    cache: {
      value: "L3 4MB · SLC 8MB",
      detail: "极客湾拆解口径；L2 为 512KB / 256KB / 128KB 分档。",
      sources: ["geekerwan-9000cache"],
      confidence: "media"
    },
    npu: {
      value: "达芬奇 2.0 · 双大核 + 微核",
      detail: "华为未公布 TOPS；NPU 与 ISP、DSP 面积接近 CPU。",
      sources: ["hisilicon-9000"],
      confidence: "official"
    },
    isp: {
      value: "未公开型号",
      detail: "华为未公布 ISP 型号。",
      sources: [],
      confidence: "unknown"
    },
    modem: {
      value: "巴龙 5000（集成）",
      detail: "全球首款集成 5G 基带的旗舰 SoC 之一；Sub-6 4.6Gbps / 2.5Gbps。",
      sources: ["hisilicon-balong"],
      confidence: "official"
    },
    benchmarks: [],
    benchmarkNote: "作为参照芯片，未单独收录跑分。"
  }
};
