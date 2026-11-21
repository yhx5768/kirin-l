package com.kirinl.app.data

object Data {
    val allChips: List<Chip> = chips
    val allFamilies: List<Family> = families.sortedBy { it.order }
    val byId: Map<String, Chip> = chips.associateBy { it.id }
    val familyById: Map<String, Family> = families.associateBy { it.id }
    val sourceById: Map<String, Source> = sources
    val researchById: Map<String, Research> = research

    fun familyOf(chip: Chip): Family? = familyById[chip.family]
    fun baseOf(chip: Chip): Chip = byId[chip.baseId] ?: chip
    fun childrenOf(chip: Chip): List<Chip> = chips.filter { it.parentId == chip.id }
    fun sourcesOf(field: ResearchField): List<Source> = field.sources.mapNotNull { sourceById[it] }

    fun typeLabel(type: String): String = when (type) {
        "phone" -> "手机"
        "tablet" -> "平板"
        "pc" -> "电脑"
        else -> "未知"
    }

    fun maxClock(chip: Chip): Int = chip.cpu?.clusters?.maxOfOrNull { it.mhz } ?: 0
    fun cores(chip: Chip): Int = chip.cpu?.cores ?: 0
    fun threads(chip: Chip): Int? = chip.cpu?.threads
    fun gpuIndex(chip: Chip): Int = chip.gpu?.let { it.cus * (it.mhz ?: 0) } ?: 0

    fun isNoSuper(chip: Chip): Boolean =
        chip.cpu?.clusters?.none { it.role == "超大核" && it.count > 0 } ?: false

    fun isNoModem(chip: Chip): Boolean = chip.features.modem.state == "none"
    fun isCutIsp(chip: Chip): Boolean = chip.features.isp.state == "cut"
    fun isCutNpu(chip: Chip): Boolean = chip.features.npu.state == "cut"
    fun isHalfNpu(chip: Chip): Boolean = chip.features.npu.state == "half"

    fun isGpuCut(chip: Chip): Boolean {
        val b = baseOf(chip)
        return chip.gpu != null && b.gpu != null && chip.id != b.id && chip.gpu.cus < b.gpu.cus
    }

    fun isGpuBoost(chip: Chip): Boolean {
        val b = baseOf(chip)
        return chip.gpu != null && b.gpu != null && chip.id != b.id && chip.gpu.cus > b.gpu.cus
    }

    fun isClockBoost(chip: Chip): Boolean {
        val b = baseOf(chip)
        return maxClock(chip) > 0 && maxClock(b) > 0 && chip.id != b.id && maxClock(chip) > maxClock(b)
    }

    fun clusterText(chip: Chip, role: String): String {
        val groups = chip.cpu?.clusters?.filter { it.role == role && it.count > 0 }.orEmpty()
        if (groups.isEmpty()) return "—"
        return groups.joinToString(" + ") { "${it.count}×${ghz(it.mhz)}" }
    }

    fun ghz(mhz: Int): String {
        if (mhz <= 0) return "—"
        val v = mhz / 1000.0
        return if (v == v.toInt().toDouble()) "${v.toInt()}" else String.format("%.2f", v).trimEnd('0').trimEnd('.')
    }

    fun processShort(chip: Chip): String? {
        val v = resolvedResearch(chip)?.field("process")?.value ?: return null
        return when {
            v.contains("N+3") && v.contains("N+2") -> "N+3 双 die"
            v.contains("N+3") -> "N+3"
            v.contains("N+2") -> "N+2"
            v.contains("5nm") -> "5nm"
            v.contains("7nm") -> "7nm"
            else -> null
        }
    }

    fun confidenceLabel(key: String): String = when (key) {
        "official" -> "官方"
        "teardown" -> "拆解"
        "media" -> "媒体"
        "db" -> "数据库"
        "inferred" -> "推断"
        "conflict" -> "有冲突"
        "unknown" -> "未公开"
        "original" -> "原文"
        else -> key
    }

    fun featureLabel(state: String): String = when (state) {
        "integrated" -> "集成基带"
        "none" -> "无基带"
        "unknown" -> "未标注"
        "full" -> "完整"
        "cut" -> "削减"
        "half" -> "半规格"
        else -> "未标注"
    }

    private val researchKeys = listOf("process", "memory", "cache", "npu", "isp", "modem")

    fun resolvedResearch(chip: Chip): ResolvedResearch? {
        if (chip.unreleased && researchById[chip.id] == null) return null
        val own = researchById[chip.id]
        val baseChip = byId[chip.baseId]?.takeIf { it.id != chip.id }
        val base = baseChip?.let { researchById[it.id] }

        val fields = linkedMapOf<String, ResearchField>()
        var inheritedFrom: Chip? = null
        researchKeys.forEach { key ->
            val ownField = own?.field(key)
            val baseField = base?.field(key)
            when {
                ownField != null -> fields[key] = ownField.copy(inherited = false)
                baseField != null -> {
                    fields[key] = baseField.copy(inherited = true)
                    if (inheritedFrom == null && baseChip != null) inheritedFrom = baseChip
                }
            }
        }

        if (chip.features.modem.state == "none" && fields.containsKey("modem")) {
            fields["modem"] = ResearchField(
                value = "无基带（平板端）",
                detail = "原文标注该型号无基带；基带型号仅在对应手机芯片上参考。",
                sources = emptyList(),
                confidence = "original",
                inherited = false
            )
        }

        val ownBenchmarks = own?.benchmarks.orEmpty()
        val baseBenchmarks = base?.benchmarks.orEmpty()
        val benchmarks = if (ownBenchmarks.isNotEmpty()) ownBenchmarks else baseBenchmarks
        val benchmarkInherited = ownBenchmarks.isEmpty() && baseBenchmarks.isNotEmpty()
        val note = own?.benchmarkNote ?: base?.benchmarkNote

        if (fields.isEmpty() && benchmarks.isEmpty() && note == null) return null
        return ResolvedResearch(fields, benchmarks, benchmarkInherited, note, inheritedFrom)
    }
}

data class ResolvedResearch(
    val fields: Map<String, ResearchField>,
    val benchmarks: List<Benchmark>,
    val benchmarkInherited: Boolean,
    val benchmarkNote: String?,
    val inheritedFrom: Chip?
) {
    fun field(key: String): ResearchField? = fields[key]
}

fun Research.field(key: String): ResearchField? = when (key) {
    "process" -> process
    "memory" -> memory
    "cache" -> cache
    "npu" -> npu
    "isp" -> isp
    "modem" -> modem
    else -> null
}
