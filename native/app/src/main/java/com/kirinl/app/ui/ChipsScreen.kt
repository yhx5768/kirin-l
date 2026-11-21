package com.kirinl.app.ui

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.kirinl.app.data.Chip
import com.kirinl.app.data.Data

private enum class SortMode(val label: String) {
    GEN("世代顺序"), CLOCK("主频优先"), GPU("GPU 规模"), NAME("名称")
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ChipsScreen(
    modifier: Modifier = Modifier,
    favorites: List<String>,
    compare: List<String>,
    onToggleFavorite: (String) -> Unit,
    onAddCompare: (String) -> Unit,
    onRemoveCompare: (String) -> Unit,
    onOpenChip: (String) -> Unit
) {
    var query by rememberSaveable { mutableStateOf("") }
    var type by rememberSaveable { mutableStateOf("all") }
    var family by rememberSaveable { mutableStateOf("all") }
    var sortName by rememberSaveable { mutableStateOf(SortMode.GEN.name) }
    var onlyBase by rememberSaveable { mutableStateOf(false) }
    var onlyFav by rememberSaveable { mutableStateOf(false) }
    var sortMenu by remember { mutableStateOf(false) }
    val sort = SortMode.valueOf(sortName)

    val familyOrder = remember { Data.allFamilies.mapIndexed { i, f -> f.id to i }.toMap() }
    val list = remember(query, type, family, sortName, onlyBase, onlyFav, favorites, compare) {
        val q = query.trim().lowercase()
        var result = Data.allChips.filter { c ->
            (type == "all" || c.type == type) &&
                (family == "all" || c.family == family) &&
                (!onlyBase || c.base) &&
                (!onlyFav || favorites.contains(c.id)) &&
                (q.isEmpty() || searchText(c).contains(q))
        }
        result = when (sort) {
            SortMode.GEN -> result.sortedWith(
                compareBy<Chip> { familyOrder[it.family] ?: 99 }
                    .thenBy { if (it.base) 0 else 1 }
                    .thenByDescending { Data.maxClock(it) }
            )
            SortMode.CLOCK -> result.sortedByDescending { Data.maxClock(it) }
            SortMode.GPU -> result.sortedByDescending { Data.gpuIndex(it) }
            SortMode.NAME -> result.sortedBy { it.name }
        }
        result
    }

    val deviceCount = remember { Data.allChips.flatMap { it.devices }.toSet().size }

    LazyColumn(
        modifier = modifier.fillMaxWidth(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(
            start = 16.dp, end = 16.dp, top = 4.dp, bottom = 24.dp
        ),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            HeroSummary(deviceCount)
        }
        item {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("搜索芯片、核心代号、机型…") },
                leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                trailingIcon = {
                    if (query.isNotEmpty()) {
                        IconButton(onClick = { query = "" }) {
                            Icon(Icons.Filled.Close, contentDescription = "清空")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp)
            )
        }
        item {
            Row(
                Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("all" to "全部", "phone" to "手机", "tablet" to "平板", "pc" to "电脑")
                    .forEach { (value, label) ->
                        FilterChip(
                            selected = type == value,
                            onClick = { type = value },
                            label = { Text(label) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                                selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        )
                    }
            }
        }
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    FilterChip(
                        selected = family == "all",
                        onClick = { family = "all" },
                        label = { Text("全部世代") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    )
                }
                items(Data.allFamilies, key = { it.id }) { f ->
                    FilterChip(
                        selected = family == f.id,
                        onClick = { family = f.id },
                        label = { Text(f.short) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    )
                }
            }
        }
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AnimatedContent(
                    targetState = list.size,
                    transitionSpec = { fadeIn(tween(160)) togetherWith fadeOut(tween(120)) },
                    modifier = Modifier.weight(1f),
                    label = "result-count"
                ) { count ->
                    Text(
                        "$count / ${Data.allChips.size} 款",
                        style = MaterialTheme.typography.titleMedium
                    )
                }
                FilterChip(
                    selected = onlyBase,
                    onClick = { onlyBase = !onlyBase },
                    label = { Text("仅基准") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
                Spacer(Modifier.width(6.dp))
                FilterChip(
                    selected = onlyFav,
                    onClick = { onlyFav = !onlyFav },
                    label = { Text("收藏") },
                    leadingIcon = {
                        Icon(Icons.Filled.Star, null, Modifier.size(FilterChipDefaults.IconSize))
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )
                Box {
                    TextButton(onClick = { sortMenu = true }) {
                        Icon(Icons.Filled.Sort, null, Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(sort.label)
                    }
                    DropdownMenu(expanded = sortMenu, onDismissRequest = { sortMenu = false }) {
                        SortMode.entries.forEach { mode ->
                            DropdownMenuItem(
                                text = { Text(mode.label) },
                                onClick = { sortName = mode.name; sortMenu = false }
                            )
                        }
                    }
                }
            }
        }
        if (list.isEmpty()) {
            item {
                EmptyState(
                    title = "没有匹配的芯片",
                    description = "试试搜索「9000S」「Mate 70」「T92」，或清除筛选条件。",
                    icon = Icons.Filled.FilterList,
                    action = {
                        TextButton(onClick = {
                            query = ""
                            type = "all"
                            family = "all"
                            onlyBase = false
                            onlyFav = false
                        }) { Text("清除筛选") }
                    }
                )
            }
        } else {
            items(list, key = { it.id }) { chip ->
                ChipListCard(
                    chip = chip,
                    isFavorite = favorites.contains(chip.id),
                    isCompared = compare.contains(chip.id),
                    onClick = { onOpenChip(chip.id) },
                    onToggleFavorite = { onToggleFavorite(chip.id) },
                    onToggleCompare = {
                        if (compare.contains(chip.id)) onRemoveCompare(chip.id) else onAddCompare(chip.id)
                    },
                    modifier = Modifier.animateItem()
                )
            }
        }
    }
}

private fun searchText(chip: Chip): String {
    val family = Data.familyById[chip.family]?.name ?: ""
    val cpuArch = chip.cpu?.clusters?.joinToString(" ") { it.arch } ?: ""
    return buildString {
        append(chip.name).append(' ')
        append(chip.short).append(' ')
        append(family).append(' ')
        append(chip.tagline).append(' ')
        append(chip.aliases.joinToString(" ")).append(' ')
        append(chip.devices.joinToString(" ")).append(' ')
        append(cpuArch).append(' ')
        append(chip.gpu?.name ?: "")
    }.lowercase()
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun HeroSummary(deviceCount: Int) {
    val extra = LocalKirinExtra.current
    val motion = rememberInfiniteTransition(label = "hero")
    val shift by motion.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(9000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "hero-shift"
    )
    Box(
        Modifier
            .fillMaxWidth()
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.55f),
                        MaterialTheme.colorScheme.surface
                    ),
                    start = Offset(0f, shift * 220f),
                    end = Offset(1100f, 700f - shift * 160f)
                ),
                RoundedCornerShape(24.dp)
            )
            .padding(18.dp)
    ) {
        Column {
            Text(
                "从 9000S 到 9050，一把看清麒麟的刀法。",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "CPU 簇、核心代号、GPU 规模、削减项、机型，原文没写的制程 / 缓存 / 内存 / 基带 / NPU 也补上了。",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
                SmallStat("芯片", "${Data.allChips.size}", "款")
                SmallStat("世代", "${Data.allFamilies.size}", "个")
                SmallStat("机型", "$deviceCount", "条")
                SmallStat("补充来源", "${Data.sourceById.size}", "条")
            }
        }
    }
}

@Composable
private fun SmallStat(label: String, value: String, unit: String) {
    Column {
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Row(verticalAlignment = Alignment.Bottom) {
            Text(value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(Modifier.width(2.dp))
            Text(
                unit,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 2.dp)
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ChipListCard(
    chip: Chip,
    isFavorite: Boolean,
    isCompared: Boolean,
    onClick: () -> Unit,
    onToggleFavorite: () -> Unit,
    onToggleCompare: () -> Unit,
    modifier: Modifier = Modifier
) {
    val extra = LocalKirinExtra.current
    val family = Data.familyById[chip.family]
    KirinCard(modifier = modifier, onClick = onClick) {
        Row(verticalAlignment = Alignment.Top) {
            Column(Modifier.weight(1f)) {
                Text(
                    buildString {
                        append(family?.short ?: "")
                        append(" 世代 · ")
                        append(Data.typeLabel(chip.type))
                        Data.processShort(chip)?.let { append(" · ").append(it) }
                    },
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    chip.short,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
            IconButton(onClick = onToggleFavorite) {
                Icon(
                    if (isFavorite) Icons.Filled.Star else Icons.Filled.StarBorder,
                    contentDescription = if (isFavorite) "取消收藏" else "收藏",
                    tint = if (isFavorite) extra.gold else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Text(
            chip.tagline,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
        Spacer(Modifier.height(8.dp))
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(5.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            KirinBadge(
                Data.typeLabel(chip.type),
                MaterialTheme.colorScheme.surfaceContainerHighest,
                MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (chip.base) KirinBadge("基准", extra.goldContainer, extra.gold)
            if (chip.unreleased) KirinBadge("未上市", Color.Transparent, MaterialTheme.colorScheme.outline)
            if (Data.isNoSuper(chip)) KirinBadge("无超大核", extra.cutContainer, extra.cut)
            if (Data.isNoModem(chip)) KirinBadge("无基带", extra.cutContainer, extra.cut)
            if (Data.isCutIsp(chip)) KirinBadge("砍 ISP", extra.cutContainer, extra.cut)
            if (Data.isCutNpu(chip)) KirinBadge("砍 NPU", extra.cutContainer, extra.cut)
            if (Data.isGpuCut(chip)) KirinBadge("砍 GPU", extra.cutContainer, extra.cut)
            if (Data.isGpuBoost(chip)) KirinBadge("加 GPU", extra.boostContainer, extra.boost)
            if (Data.isClockBoost(chip)) KirinBadge("提频", extra.boostContainer, extra.boost)
        }
        Spacer(Modifier.height(10.dp))
        Text(
            "CPU  " + (chip.cpu?.clusters?.filter { it.count > 0 }?.joinToString(" + ") {
                "${it.count}×${Data.ghz(it.mhz)}"
            } ?: "未公布"),
            style = MaterialTheme.typography.bodySmall
        )
        Text(
            "GPU  " + (chip.gpu?.let { "${it.name} · ${it.cus}cu · ${it.mhz ?: "—"}MHz" } ?: "未公布"),
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(10.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                if (chip.devices.isNotEmpty()) "${chip.devices.size} 款机型" else "机型未列",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
            TextButton(onClick = onToggleCompare) {
                Icon(
                    if (isCompared) Icons.Filled.Check else Icons.Filled.Add,
                    null,
                    Modifier.size(16.dp)
                )
                Spacer(Modifier.width(4.dp))
                Text(if (isCompared) "已加入" else "对比")
            }
        }
    }
}
