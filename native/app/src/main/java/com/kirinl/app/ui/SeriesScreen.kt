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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Layers
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.kirinl.app.data.Chip
import com.kirinl.app.data.Data
import com.kirinl.app.data.Family

@Composable
fun SeriesScreen(modifier: Modifier = Modifier, onOpenFamily: (String) -> Unit) {
    LazyColumn(
        modifier = modifier.fillMaxWidth(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                "按原文世代划分，基准、衍生、削减项与命名沿革放在一起看。",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp, bottom = 2.dp)
            )
        }
        items(Data.allFamilies, key = { it.id }) { family ->
            FamilyCard(family, onOpenFamily = { onOpenFamily(family.id) })
        }
        item {
            SectionCard("原文总结的衍生规则", icon = Icons.Filled.Layers) {
                listOf(
                    "① 降频：超大核 / 大核 / 小核分档降频",
                    "② 砍核：减少大核或小核数量",
                    "③ 砍 GPU：3cu = 75%，2cu = 50%",
                    "④ 砍 ISP：选择外挂 / 不外挂独立 ISP",
                    "⑤ 砍 NPU：与 ISP 同理，按档位削减",
                    "⑥ 砍基带：屏蔽损坏部分，做成平板端芯片"
                ).forEach {
                    Text("·  $it", style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(vertical = 3.dp))
                }
            }
        }
    }
}

@Composable
private fun FamilyCard(family: Family, onOpenFamily: () -> Unit) {
    val extra = LocalKirinExtra.current
    val list = Data.allChips.filter { it.family == family.id }
    val base = Data.byId[family.baseId]
    KirinCard(onClick = onOpenFamily) {
        Row(verticalAlignment = Alignment.Top) {
            Column(Modifier.weight(1f)) {
                Text(
                    "GENERATION ${family.order.toString().padStart(2, '0')}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                Text(family.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text(
                    family.tagline,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            KirinBadge("${list.size} 款", MaterialTheme.colorScheme.surfaceContainerHighest, MaterialTheme.colorScheme.onSurfaceVariant)
        }
        if (base != null) {
            Spacer(Modifier.height(10.dp))
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = extra.goldContainer,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "基准 ${base.short} · ${base.gpu?.cus ?: "—"}cu ${base.gpu?.name ?: ""} · ${Data.ghz(Data.maxClock(base))} GHz",
                    style = MaterialTheme.typography.labelSmall,
                    color = extra.gold,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                )
            }
        }
        Spacer(Modifier.height(10.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(5.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            list.take(7).forEach { chip ->
                KirinBadge(
                    chip.short,
                    if (chip.base) extra.goldContainer else MaterialTheme.colorScheme.surfaceContainerHighest,
                    if (chip.base) extra.gold else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            if (list.size > 7) {
                KirinBadge("+${list.size - 7}", MaterialTheme.colorScheme.surfaceContainerHighest, MaterialTheme.colorScheme.outline)
            }
        }
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "查看刀法矩阵",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.weight(1f)
            )
            Icon(Icons.Filled.KeyboardArrowRight, null, Modifier.size(18.dp), tint = MaterialTheme.colorScheme.primary)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun FamilyDetailScreen(family: Family, onBack: () -> Unit, onOpenChip: (String) -> Unit) {
    val extra = LocalKirinExtra.current
    val list = Data.allChips.filter { it.family == family.id }
        .sortedWith(compareBy<Chip> { if (it.base) 0 else 1 }.thenByDescending { Data.maxClock(it) })
    val base = Data.byId[family.baseId]

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Text(family.short, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Filled.ArrowBack, "返回") }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxWidth().padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                KirinCard {
                    Text(
                        "GENERATION ${family.order.toString().padStart(2, '0')} · ${list.size} 款芯片",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(family.name, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    Text(
                        family.tagline,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(10.dp))
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(5.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        family.highlights.forEach { h ->
                            KirinBadge(h, MaterialTheme.colorScheme.surfaceContainerHighest, MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                    if (base != null) {
                        Spacer(Modifier.height(10.dp))
                        Row {
                            StatCell("基准芯片", base.short, "", Modifier.weight(1f))
                            StatCell("最高主频", Data.ghz(Data.maxClock(base)), "GHz", Modifier.weight(1f))
                            StatCell("GPU", base.gpu?.let { "${it.cus}cu" } ?: "—", "", Modifier.weight(1f))
                        }
                    }
                }
            }
            item {
                SectionCard("世代解读", icon = Icons.Filled.Layers) {
                    family.intro.forEach {
                        Text(it, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(vertical = 4.dp))
                    }
                }
            }
            item {
                SectionCard("刀法矩阵", icon = Icons.Filled.Layers, subtitle = "按规格标色") {
                    list.forEach { chip ->
                        val relation = relationToBase(chip)
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp)
                                .clickableRow { onOpenChip(chip.id) },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        chip.short,
                                        style = MaterialTheme.typography.bodyLarge,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Spacer(Modifier.width(6.dp))
                                    KirinBadge(
                                        Data.typeLabel(chip.type),
                                        MaterialTheme.colorScheme.surfaceContainerHighest,
                                        MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                Text(
                                    "${Data.clusterText(chip, "超大核")} · ${Data.clusterText(chip, "大核")} · ${Data.clusterText(chip, "小核")}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    "GPU ${chip.gpu?.let { "${it.cus}cu ${it.name}" } ?: "—"} · ${chip.gpu?.mhz ?: "—"}MHz",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                if (chip.base) {
                                    KirinBadge("基准", extra.goldContainer, extra.gold)
                                } else {
                                    DeltaBadge(
                                        when (relation) {
                                            "cut" -> "削减"
                                            "boost" -> "加强"
                                            else -> "混合"
                                        },
                                        relation
                                    )
                                }
                                if (Data.isNoModem(chip)) {
                                    Spacer(Modifier.height(3.dp))
                                    KirinBadge("无基带", extra.cutContainer, extra.cut)
                                }
                            }
                        }
                        androidx.compose.material3.HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                    }
                }
            }
            item {
                SectionCard("衍生树", icon = Icons.Filled.Layers) {
                    list.forEach { chip ->
                        val depth = depthOf(chip)
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(start = (depth * 14).dp, top = 6.dp, bottom = 6.dp)
                                .clickableRow { onOpenChip(chip.id) },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(3.dp),
                                color = if (chip.base) extra.gold else MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(7.dp)
                            ) {}
                            Spacer(Modifier.width(8.dp))
                            Text(chip.short, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Spacer(Modifier.width(6.dp))
                            Text(
                                "${Data.typeLabel(chip.type)} · ${chip.gpu?.cus ?: "—"}cu · ${Data.ghz(Data.maxClock(chip))}GHz",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
            if (family.naming.isNotEmpty()) {
                item {
                    SectionCard("命名沿革", icon = Icons.Filled.Layers) {
                        family.naming.forEach {
                            Text("·  $it", style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(vertical = 4.dp))
                        }
                    }
                }
            }
        }
    }
}

private fun relationToBase(chip: Chip): String {
    val base = Data.baseOf(chip)
    if (chip.id == base.id) return "base"
    val cuts = mutableListOf<String>()
    val boosts = mutableListOf<String>()
    if (Data.maxClock(chip) in 1 until Data.maxClock(base)) cuts.add("clock")
    if (Data.maxClock(chip) > Data.maxClock(base)) boosts.add("clock")
    if (Data.cores(chip) < Data.cores(base)) cuts.add("cores")
    if (Data.cores(chip) > Data.cores(base)) boosts.add("cores")
    if (chip.gpu != null && base.gpu != null) {
        if (chip.gpu.cus < base.gpu.cus) cuts.add("gpu")
        if (chip.gpu.cus > base.gpu.cus) boosts.add("gpu")
    }
    if (Data.isNoModem(chip) || Data.isCutIsp(chip) || Data.isCutNpu(chip)) cuts.add("feature")
    return when {
        cuts.isNotEmpty() && boosts.isEmpty() -> "cut"
        boosts.isNotEmpty() && cuts.isEmpty() -> "boost"
        cuts.isNotEmpty() && boosts.isNotEmpty() -> "half"
        else -> "flat"
    }
}

private fun depthOf(chip: Chip): Int {
    var depth = 0
    var current = chip
    while (current.parentId != null) {
        val parent = Data.byId[current.parentId] ?: break
        depth++
        current = parent
        if (depth > 10) break
    }
    return depth
}

@Composable
private fun Modifier.clickableRow(onClick: () -> Unit): Modifier =
    this.clickable(
        interactionSource = androidx.compose.foundation.interaction.MutableInteractionSource(),
        indication = null,
        onClick = onClick
    )
