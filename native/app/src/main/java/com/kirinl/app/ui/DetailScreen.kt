package com.kirinl.app.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material.icons.filled.Radio
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kirinl.app.data.Chip
import com.kirinl.app.data.Cluster
import com.kirinl.app.data.Data
import com.kirinl.app.data.Feature
import com.kirinl.app.data.ResearchField

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ChipDetailScreen(
    chip: Chip,
    isFavorite: Boolean,
    isCompared: Boolean,
    onBack: () -> Unit,
    onToggleFavorite: () -> Unit,
    onToggleCompare: () -> Unit,
    onOpenChip: (String) -> Unit,
    onOpenSeries: (String) -> Unit
) {
    val extra = LocalKirinExtra.current
    val family = Data.familyOf(chip)
    val base = Data.baseOf(chip)
    val research = Data.resolvedResearch(chip)

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Text(chip.short, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "返回")
                    }
                },
                actions = {
                    IconButton(onClick = onToggleFavorite) {
                        Icon(
                            if (isFavorite) Icons.Filled.Star else Icons.Filled.StarBorder,
                            contentDescription = "收藏",
                            tint = if (isFavorite) extra.gold else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onToggleCompare) {
                        Icon(
                            if (isCompared) Icons.Filled.Check else Icons.Filled.Add,
                            contentDescription = "加入对比",
                            tint = if (isCompared) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                DetailHero(chip, family?.name ?: "", onOpenSeries = { onOpenSeries(chip.family) })
            }
            if (chip.id != base.id) {
                item { RelativeToBase(chip, base, onOpenChip) }
            }
            item { CpuSection(chip, base) }
            item { GpuSection(chip, base) }
            item { FeaturesSection(chip) }
            if (chip.variants.isNotEmpty()) {
                item {
                    SectionCard("版本与封装", icon = Icons.Filled.Layers) {
                        chip.variants.forEach { v ->
                            Row(Modifier.padding(vertical = 5.dp)) {
                                Text(v.name, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                                Spacer(Modifier.width(8.dp))
                                Text(
                                    v.note,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
            item {
                ResearchSection(chip, research)
            }
            item {
                SectionCard("搭载机型", icon = Icons.Filled.Layers, subtitle = "${chip.devices.size} 条") {
                    if (chip.devices.isEmpty()) {
                        Text(
                            if (chip.unreleased) "该芯片尚未出现，原文未给机型。" else "原文未列出机型。",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    } else {
                        chip.devices.forEach { device ->
                            Text(
                                "·  $device",
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.padding(vertical = 4.dp)
                            )
                        }
                    }
                }
            }
            item {
                RelatedSection(chip, onOpenChip = onOpenChip)
            }
            item {
                SectionCard("原文要点", icon = Icons.Filled.Info) {
                    chip.notes.forEach { note ->
                        Text(
                            "·  $note",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                    }
                }
            }
            item {
                FullFieldsSection(chip, research)
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun DetailHero(chip: Chip, familyName: String, onOpenSeries: () -> Unit) {
    val extra = LocalKirinExtra.current
    val family = Data.familyOf(chip)
    KirinCard {
        Row(
            Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Top
        ) {
            Column(Modifier.weight(1f)) {
                Text(
                    buildString {
                        append(familyName)
                        append(" · ")
                        append(Data.typeLabel(chip.type))
                        Data.processShort(chip)?.let { append(" · ").append(it) }
                        append(
                            when {
                                chip.reference -> " · 参照芯片"
                                chip.base -> " · 基准芯片"
                                else -> " · 衍生型号"
                            }
                        )
                    },
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    "麒麟 ${chip.short}",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
            }
            Surface(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(10.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.padding(top = 4.dp)
            ) {
                Text(
                    family?.short ?: "",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                        .clickableNoRipple(onOpenSeries)
                )
            }
        }
        Spacer(Modifier.height(6.dp))
        Text(
            chip.tagline,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(10.dp))
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(5.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            KirinBadge(Data.typeLabel(chip.type), MaterialTheme.colorScheme.surfaceContainerHighest, MaterialTheme.colorScheme.onSurfaceVariant)
            if (chip.base) KirinBadge(if (chip.reference) "参照" else "基准", extra.goldContainer, extra.gold)
            if (chip.unreleased) KirinBadge("未上市", MaterialTheme.colorScheme.surfaceContainerHighest, MaterialTheme.colorScheme.outline)
            if (Data.isNoSuper(chip)) KirinBadge("无超大核", extra.cutContainer, extra.cut)
            if (Data.isNoModem(chip)) KirinBadge("无基带", extra.cutContainer, extra.cut)
            if (Data.isCutIsp(chip)) KirinBadge("砍 ISP", extra.cutContainer, extra.cut)
            if (Data.isCutNpu(chip)) KirinBadge("砍 NPU", extra.cutContainer, extra.cut)
            if (Data.isHalfNpu(chip)) KirinBadge("半 NPU", extra.goldContainer, extra.gold)
            if (Data.isGpuCut(chip)) KirinBadge("砍 GPU", extra.cutContainer, extra.cut)
            if (Data.isClockBoost(chip)) KirinBadge("提频", extra.boostContainer, extra.boost)
        }
        Spacer(Modifier.height(12.dp))
        Row {
            StatCell("最高主频", if (Data.maxClock(chip) > 0) Data.ghz(Data.maxClock(chip)) else "—", "GHz", Modifier.weight(1f))
            StatCell(
                "核心 / 线程",
                "${Data.cores(chip)}",
                "/ ${Data.threads(chip) ?: "—"}",
                Modifier.weight(1f)
            )
        }
        Row {
            StatCell(
                "GPU",
                chip.gpu?.let { "${it.cus}cu" } ?: "—",
                chip.gpu?.mhz?.let { "${it}MHz" } ?: "",
                Modifier.weight(1f)
            )
            StatCell(
                "GPU 规格指数",
                if (Data.gpuIndex(chip) > 0) "${Data.gpuIndex(chip)}" else "—",
                "CU×MHz",
                Modifier.weight(1f)
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun RelativeToBase(chip: Chip, base: Chip, onOpenChip: (String) -> Unit) {
    val extra = LocalKirinExtra.current
    val deltas = buildList {
        if (Data.maxClock(chip) > 0 && Data.maxClock(base) > 0) {
            val p = ((Data.maxClock(chip) - Data.maxClock(base)) * 100.0 / Data.maxClock(base)).toInt()
            if (p != 0) add("最高主频 ${signed(p)}%" to tone(p))
        }
        if (Data.cores(chip) != Data.cores(base)) {
            val d = Data.cores(chip) - Data.cores(base)
            add("核心数 ${signed(d)}" to if (d < 0) "cut" else "boost")
        }
        if (chip.gpu != null && base.gpu != null && chip.gpu.cus != base.gpu.cus) {
            val p = ((chip.gpu.cus - base.gpu.cus) * 100.0 / base.gpu.cus).toInt()
            add("GPU ${chip.gpu.cus}cu (${signed(p)}%)" to if (p < 0) "cut" else "boost")
        }
        if (Data.isNoModem(chip)) add("无基带" to "cut")
        if (Data.isCutIsp(chip)) add("ISP 削减" to "cut")
        if (Data.isCutNpu(chip)) add("NPU 削减" to "cut")
        if (Data.isNoSuper(chip)) add("无超大核" to "cut")
        if (isEmpty()) add("规格与基准一致" to "flat")
    }
    KirinCard {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("相对基准", style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
            Text(
                base.short,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickableNoRipple { onOpenChip(base.id) }
            )
            Icon(Icons.Filled.KeyboardArrowRight, null, Modifier.size(16.dp), tint = MaterialTheme.colorScheme.primary)
        }
        Spacer(Modifier.height(8.dp))
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            deltas.forEach { (text, tone) -> DeltaBadge(text, tone) }
        }
        Spacer(Modifier.height(8.dp))
        Text(
            "沿用原文配色：绿色 = 削减，红色 = 加强。",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.outline
        )
    }
}

private fun signed(v: Int): String = if (v > 0) "+$v" else "$v"
private fun tone(v: Int): String = if (v > 0) "boost" else if (v < 0) "cut" else "flat"

@Composable
private fun CpuSection(chip: Chip, base: Chip) {
    SectionCard(
        "CPU 构成",
        icon = Icons.Filled.Memory,
        subtitle = chip.cpu?.let { "${it.cores} 核" + (it.threads?.let { t -> " / $t 线程" } ?: "") }
    ) {
        if (chip.cpu == null) {
            Text("原文未公布 CPU 规格。", style = MaterialTheme.typography.bodySmall)
            return@SectionCard
        }
        chip.cpu.clusters.forEach { cluster ->
            val delta = clusterDelta(chip, base, cluster)
            Row(Modifier.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                KirinBadge(
                    cluster.role,
                    if (cluster.role == "超大核") MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceContainerHighest,
                    if (cluster.role == "超大核") MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    if (cluster.count > 0) "${cluster.count} 核" else "—",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.width(46.dp)
                )
                Text(
                    if (cluster.mhz > 0) "${Data.ghz(cluster.mhz)} GHz" else "—",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.width(76.dp)
                )
                Text(
                    cluster.arch,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f)
                )
                if (delta != null) DeltaBadge(delta.first, delta.second)
            }
            androidx.compose.material3.HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
        }
        if (!chip.cpu.note.isNullOrBlank()) {
            Spacer(Modifier.height(6.dp))
            Text(
                chip.cpu.note,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

private fun clusterDelta(chip: Chip, base: Chip, cluster: Cluster): Pair<String, String>? {
    if (chip.id == base.id) return null
    val b = base.cpu?.clusters?.firstOrNull { it.role == cluster.role } ?: return null
    val countDelta = cluster.count - b.count
    val clockText = if (cluster.mhz > 0 && b.mhz > 0) {
        val p = ((cluster.mhz - b.mhz) * 100.0 / b.mhz).toInt()
        if (p != 0) signed(p) + "%" else null
    } else null
    if (countDelta == 0 && clockText == null) return "持平" to "flat"
    val parts = buildList {
        if (countDelta != 0) add("${signed(countDelta)} 核")
        if (clockText != null) add(clockText)
    }
    return parts.joinToString(" · ") to if (countDelta < 0 || (cluster.mhz in 1 until b.mhz)) "cut" else "boost"
}

@Composable
private fun GpuSection(chip: Chip, base: Chip) {
    val extra = LocalKirinExtra.current
    SectionCard("GPU", icon = Icons.Filled.Speed, subtitle = "原文数据") {
        if (chip.gpu == null) {
            Text("原文未公布 GPU 规格。", style = MaterialTheme.typography.bodySmall)
            return@SectionCard
        }
        Text(
            chip.gpu.name,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )
        Text(
            "${chip.gpu.cus} CU · ${chip.gpu.mhz?.let { "${it}MHz" } ?: "频率未公布"}",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(10.dp))
        BarRow("计算单元", chip.gpu.cus / 8f, "${chip.gpu.cus}cu", MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(6.dp))
        if (chip.gpu.mhz != null) {
            BarRow("频率", chip.gpu.mhz / 1200f, "${chip.gpu.mhz}MHz", extra.gold)
        }
        Spacer(Modifier.height(8.dp))
        if (chip.id != base.id && base.gpu != null && chip.gpu.cus != base.gpu.cus) {
            val p = ((chip.gpu.cus - base.gpu.cus) * 100.0 / base.gpu.cus).toInt()
            DeltaBadge("CU ${base.gpu.cus} → ${chip.gpu.cus}（${signed(p)}%）", if (p < 0) "cut" else "boost")
        }
        Spacer(Modifier.height(8.dp))
        Text(
            "GPU 规格指数 ${Data.gpuIndex(chip)} = CU × 频率，只描述规模，不代表实测性能。",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.outline
        )
    }
}

@Composable
private fun FeaturesSection(chip: Chip) {
    SectionCard("功能模块", icon = Icons.Filled.Radio, subtitle = "基带 / ISP / NPU") {
        FeatureTile("基带", Icons.Filled.Radio, chip.features.modem)
        Spacer(Modifier.height(8.dp))
        FeatureTile("ISP", Icons.Filled.PhotoCamera, chip.features.isp)
        Spacer(Modifier.height(8.dp))
        FeatureTile("NPU", Icons.Filled.AutoAwesome, chip.features.npu)
        Spacer(Modifier.height(8.dp))
        Text(
            "原文只标注“削减 / 无 / 半”等状态；型号与架构见下方补充资料。",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.outline
        )
    }
}

@Composable
private fun FeatureTile(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, feature: Feature) {
    val extra = LocalKirinExtra.current
    val (container, content) = when (feature.state) {
        "cut", "none" -> extra.cutContainer to extra.cut
        "half" -> extra.goldContainer to extra.gold
        "unknown" -> MaterialTheme.colorScheme.surfaceContainerHighest to MaterialTheme.colorScheme.outline
        else -> MaterialTheme.colorScheme.surfaceContainerHighest to MaterialTheme.colorScheme.onSurfaceVariant
    }
    Surface(
        shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp),
        color = container,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, Modifier.size(18.dp), tint = content)
            Spacer(Modifier.width(8.dp))
            Column(Modifier.weight(1f)) {
                Text(label, style = MaterialTheme.typography.labelSmall, color = content)
                if (!feature.note.isNullOrBlank()) {
                    Text(
                        feature.note,
                        style = MaterialTheme.typography.labelSmall,
                        color = content.copy(alpha = 0.8f)
                    )
                }
            }
            Text(
                Data.featureLabel(feature.state),
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = content
            )
        }
    }
}

@Composable
private fun ResearchSection(chip: Chip, research: com.kirinl.app.data.ResolvedResearch?) {
    val extra = LocalKirinExtra.current
    val icons = listOf(
        "process" to (Icons.Filled.Memory to "制程工艺"),
        "memory" to (Icons.Filled.Layers to "内存规格"),
        "cache" to (Icons.Filled.Layers to "缓存规格"),
        "npu" to (Icons.Filled.AutoAwesome to "NPU"),
        "isp" to (Icons.Filled.PhotoCamera to "ISP"),
        "modem" to (Icons.Filled.Radio to "基带")
    )
    SectionCard("补充资料", icon = Icons.Filled.Info, subtitle = "原文之外 · 联网核对") {
        Text(
            "以下为原文没有给出、但能在公开资料中查到的信息。每项都标了来源与可信度；冲突时并列说明。基带 / ISP / NPU 是否被砍，仍以「功能模块」为准。",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        if (research == null) {
            Spacer(Modifier.height(10.dp))
            Text("该型号尚未出现或规格未公布，暂未查到可靠的公开补充资料。", style = MaterialTheme.typography.bodySmall)
            return@SectionCard
        }
        research.inheritedFrom?.let { base ->
            Spacer(Modifier.height(10.dp))
            Surface(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(10.dp),
                color = extra.goldContainer
            ) {
                Text(
                    "该型号未单独公布全部数据，部分字段沿用同系列基准 ${base.short} 的公开资料。",
                    style = MaterialTheme.typography.labelSmall,
                    color = extra.gold,
                    modifier = Modifier.padding(10.dp)
                )
            }
        }
        Spacer(Modifier.height(6.dp))
        icons.forEach { (key, pair) ->
            val field = research.field(key) ?: return@forEach
            Spacer(Modifier.height(6.dp))
            ResearchCard(pair.second, pair.first, field)
        }
        if (research.benchmarks.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            androidx.compose.material3.HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("跑分参考", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                Text(
                    if (research.benchmarkInherited && research.inheritedFrom != null)
                        "同系列基准平台（${research.inheritedFrom.short}）"
                    else "实测 / 媒体数据",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
            research.benchmarks.forEach { b ->
                Spacer(Modifier.height(6.dp))
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
                    Column(Modifier.weight(1f)) {
                        Text(b.name, style = MaterialTheme.typography.bodyMedium)
                        if (b.device.isNotBlank()) {
                            Text(
                                b.device,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                        SourceLinks(b.sources.mapNotNull { Data.sourceById[it] })
                    }
                    Text(
                        b.value,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
                androidx.compose.material3.HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            }
            research.benchmarkNote?.let {
                Spacer(Modifier.height(6.dp))
                Text(it, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            }
        } else {
            research.benchmarkNote?.let {
                Spacer(Modifier.height(10.dp))
                Text(it, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            }
        }
    }
}

@Composable
private fun RelatedSection(chip: Chip, onOpenChip: (String) -> Unit) {
    val related = buildList {
        val base = Data.baseOf(chip)
        if (base.id != chip.id) add(base)
        Data.childrenOf(chip).forEach { add(it) }
        chip.parentId?.let { pid -> Data.byId[pid]?.let { if (none { p -> p.id == it.id }) add(it) } }
    }.distinctBy { it.id }
    if (related.isEmpty()) return
    SectionCard("相关芯片", icon = Icons.Filled.Layers) {
        related.forEach { c ->
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 7.dp)
                    .clickableNoRipple { onOpenChip(c.id) },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(Modifier.weight(1f)) {
                    Text(c.short, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
                    Text(
                        "${Data.typeLabel(c.type)} · ${c.gpu?.cus ?: "—"}cu",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Icon(Icons.Filled.KeyboardArrowRight, null, Modifier.size(18.dp), tint = MaterialTheme.colorScheme.outline)
            }
        }
    }
}

@Composable
private fun FullFieldsSection(chip: Chip, research: com.kirinl.app.data.ResolvedResearch?) {
    val family = Data.familyOf(chip)
    val base = Data.baseOf(chip)
    SectionCard("完整字段", icon = Icons.Filled.Info, subtitle = "原文 + 联网补充") {
        FieldRow("厂商", "华为海思 HiSilicon")
        FieldRow("世代", family?.name ?: "—")
        FieldRow("设备类型", Data.typeLabel(chip.type))
        FieldRow(
            "定位",
            when {
                chip.reference -> "参照芯片"
                chip.base -> "基准芯片"
                chip.unreleased -> "尚未出现"
                else -> "衍生型号（派生自 ${base.short}）"
            }
        )
        FieldRow(
            "CPU 簇",
            chip.cpu?.clusters?.filter { it.count > 0 }?.joinToString(" · ") {
                "${it.role} ${it.count}×${Data.ghz(it.mhz)}GHz"
            } ?: "—"
        )
        FieldRow(
            "核心代号",
            chip.cpu?.clusters?.map { it.arch }?.filter { it != "—" }?.distinct()?.joinToString(" / ") ?: "—"
        )
        FieldRow("GPU", chip.gpu?.let { "${it.name} · ${it.cus}cu · ${it.mhz ?: "—"}MHz" } ?: "—")
        FieldRow("基带状态", Data.featureLabel(chip.features.modem.state))
        FieldRow("ISP 状态", Data.featureLabel(chip.features.isp.state))
        FieldRow("NPU 状态", Data.featureLabel(chip.features.npu.state))
        fieldRowFor("制程工艺", research, "process")
        fieldRowFor("内存规格", research, "memory")
        fieldRowFor("缓存规格", research, "cache")
        fieldRowFor("NPU 架构", research, "npu")
        fieldRowFor("ISP 型号", research, "isp")
        fieldRowFor("基带型号", research, "modem")
        chip.extraSpecs.forEach { FieldRow(it.label, it.value) }
    }
}

@Composable
private fun fieldRowFor(label: String, research: com.kirinl.app.data.ResolvedResearch?, key: String) {
    val field = research?.field(key)
    Row(
        Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(92.dp)
        )
        Text(
            field?.value ?: "未查到可靠公开资料",
            style = MaterialTheme.typography.bodyMedium,
            color = if (field == null) MaterialTheme.colorScheme.outline else MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.weight(1f)
        )
        if (field != null) {
            Spacer(Modifier.width(6.dp))
            ConfidenceBadge(field.confidence)
        }
    }
}

@Composable
private fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier =
    this.clickable(
        interactionSource = androidx.compose.foundation.interaction.MutableInteractionSource(),
        indication = null,
        onClick = onClick
    )
