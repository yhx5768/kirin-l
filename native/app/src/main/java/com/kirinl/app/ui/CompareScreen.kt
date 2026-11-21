package com.kirinl.app.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
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
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.InputChip
import androidx.compose.material3.InputChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.layout.RowScope
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.kirinl.app.data.Chip
import com.kirinl.app.data.Data

private data class CompareRow(
    val label: String,
    val value: (Chip) -> String,
    val numeric: ((Chip) -> Int?)? = null
)

private val compareRows = listOf(
    CompareRow("世代", { Data.familyById[it.family]?.short ?: "—" }),
    CompareRow("定位", { if (it.reference) "参照" else if (it.base) "基准" else if (it.unreleased) "未上市" else "衍生" }),
    CompareRow("类型", { Data.typeLabel(it.type) }),
    CompareRow("最高主频", { if (Data.maxClock(it) > 0) Data.ghz(Data.maxClock(it)) + " GHz" else "—" }, { Data.maxClock(it) }),
    CompareRow("核心/线程", { "${Data.cores(it)} / ${Data.threads(it) ?: "—"}" }),
    CompareRow("超大核", { Data.clusterText(it, "超大核") }),
    CompareRow("大核", { Data.clusterText(it, "大核") }),
    CompareRow("小核", { Data.clusterText(it, "小核") }),
    CompareRow("GPU", { it.gpu?.name ?: "—" }),
    CompareRow("GPU CU", { it.gpu?.let { g -> "${g.cus} cu" } ?: "—" }, { it.gpu?.cus }),
    CompareRow("GPU 频率", { it.gpu?.mhz?.let { m -> "${m} MHz" } ?: "—" }, { it.gpu?.mhz }),
    CompareRow("GPU 指数", { Data.gpuIndex(it).takeIf { v -> v > 0 }?.toString() ?: "—" }, { Data.gpuIndex(it).takeIf { v -> v > 0 } }),
    CompareRow("基带", { Data.featureLabel(it.features.modem.state) }),
    CompareRow("ISP", { Data.featureLabel(it.features.isp.state) }),
    CompareRow("NPU", { Data.featureLabel(it.features.npu.state) }),
    CompareRow("制程", { Data.resolvedResearch(it)?.field("process")?.value ?: "—" }),
    CompareRow("缓存", { Data.resolvedResearch(it)?.field("cache")?.value ?: "—" }),
    CompareRow("内存", { Data.resolvedResearch(it)?.field("memory")?.value ?: "—" }),
    CompareRow("NPU 架构", { Data.resolvedResearch(it)?.field("npu")?.value ?: "—" }),
    CompareRow("基带型号", { Data.resolvedResearch(it)?.field("modem")?.value ?: "—" }),
    CompareRow("GB6 单核", { Data.resolvedResearch(it)?.benchmarks?.firstOrNull { b -> b.name.startsWith("Geekbench 6 单核") }?.value ?: "—" }),
    CompareRow("GB6 多核", { Data.resolvedResearch(it)?.benchmarks?.firstOrNull { b -> b.name.startsWith("Geekbench 6 多核") }?.value ?: "—" })
)

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun CompareScreen(
    modifier: Modifier = Modifier,
    compareIds: List<String>,
    onAdd: (String) -> Unit,
    onRemove: (String) -> Unit,
    onClear: () -> Unit,
    onOpenChip: (String) -> Unit
) {
    val chips = compareIds.mapNotNull { Data.byId[it] }.sortedBy { Data.allChips.indexOf(it) }
    var diffOnly by rememberSaveable { mutableStateOf(false) }
    var showAdd by remember { mutableStateOf(false) }
    var showClear by remember { mutableStateOf(false) }
    val scroll = rememberScrollState()

    if (chips.isEmpty()) {
        Column(modifier.fillMaxWidth()) {
            CompareTopRow(0, showAdd = false, onAdd = { showAdd = true })
            EmptyState(
                title = "对比列表还是空的",
                description = "去芯片列表挑几颗，点「对比」加入；最多同时对比 10 款。",
                icon = Icons.Filled.Add,
                action = { Button(onClick = { showAdd = true }) { Text("添加芯片") } }
            )
        }
    } else {
        val visibleRows = compareRows.filter { row ->
            if (!diffOnly) true else chips.map(row.value).distinct().size > 1
        }

        LazyColumn(
            modifier = modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            item(key = "compare-controls") {
                Column {
                    CompareTopRow(chips.size, showAdd = true, onAdd = { showAdd = true })
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "仅显示差异项",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.weight(1f)
                        )
                        Switch(checked = diffOnly, onCheckedChange = { diffOnly = it })
                        Spacer(Modifier.width(4.dp))
                        TextButton(onClick = { showClear = true }) {
                            Text("清空", color = MaterialTheme.colorScheme.error)
                        }
                    }
                    if (chips.size > 2) {
                        Text(
                            "← 左右滑动查看全部 ${chips.size} 款 →",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.outline,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)
                        )
                    }
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(chips, key = { it.id }) { chip ->
                            InputChip(
                                selected = true,
                                onClick = { onRemove(chip.id) },
                                label = { Text(chip.short) },
                                trailingIcon = {
                                    Icon(Icons.Filled.Close, contentDescription = "移出对比", Modifier.size(14.dp))
                                },
                                colors = InputChipDefaults.inputChipColors(
                                    selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                                    selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer,
                                    selectedTrailingIconColor = MaterialTheme.colorScheme.onPrimaryContainer
                                ),
                                modifier = Modifier.animateItem()
                            )
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                }
            }

            stickyHeader(key = "compare-spec-header") {
                CompareHeader(chips, scroll)
            }

            items(visibleRows, key = { it.label }) { row ->
                CompareRowView(row, chips, scroll, Modifier.animateItem())
            }

            item(key = "compare-charts") {
                Spacer(Modifier.height(16.dp))
                CompareCharts(chips, Modifier.padding(horizontal = 16.dp))
            }
        }
    }

    if (showAdd) {
        AddCompareSheet(
            compareIds = compareIds,
            onAdd = onAdd,
            onRemove = onRemove,
            onDismiss = { showAdd = false }
        )
    }

    if (showClear) {
        AlertDialog(
            onDismissRequest = { showClear = false },
            title = { Text("清空对比？") },
            text = { Text("将移出当前 ${chips.size} 款芯片。") },
            confirmButton = {
                TextButton(onClick = { onClear(); showClear = false }) { Text("清空") }
            },
            dismissButton = {
                TextButton(onClick = { showClear = false }) { Text("取消") }
            }
        )
    }
}

@Composable
private fun CompareTopRow(count: Int, showAdd: Boolean, onAdd: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            "$count / 10 款",
            style = MaterialTheme.typography.titleMedium,
            modifier = Modifier.weight(1f)
        )
        if (showAdd) {
            FilledTonalButton(
                onClick = onAdd,
                colors = androidx.compose.material3.ButtonDefaults.filledTonalButtonColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            ) {
                Icon(Icons.Filled.Add, null, Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("添加芯片")
            }
        }
    }
}

@Composable
private fun RowScope.CellScroller(
    scroll: androidx.compose.foundation.ScrollState,
    content: @Composable RowScope.() -> Unit
) {
    Box(Modifier.weight(1f)) {
        Row(
            Modifier
                .fillMaxWidth()
                .clipToBounds()
                .horizontalScroll(scroll),
            content = content
        )
        val bg = MaterialTheme.colorScheme.background
        if (scroll.value > 0) {
            Box(
                Modifier
                    .matchParentSize()
                    .background(
                        Brush.horizontalGradient(
                            listOf(bg, Color.Transparent),
                            startX = 0f,
                            endX = 60f
                        )
                    )
            )
        }
        if (scroll.value < scroll.maxValue) {
            Box(
                Modifier
                    .matchParentSize()
                    .background(
                        Brush.horizontalGradient(
                            0.90f to Color.Transparent,
                            1f to bg
                        )
                    )
            )
        }
    }
}

@Composable
private fun CompareHeader(chips: List<Chip>, scroll: androidx.compose.foundation.ScrollState) {
    Column(
        Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.Top
        ) {
            Text(
                "规格",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.width(92.dp)
            )
            CellScroller(scroll) {
                chips.forEach { chip ->
                    Column(
                        Modifier
                            .width(154.dp)
                            .padding(end = 10.dp)
                    ) {
                        Text(
                            chip.short,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            "${Data.familyById[chip.family]?.short ?: ""} · ${Data.typeLabel(chip.type)}",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
        androidx.compose.material3.HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
    }
}

@Composable
private fun CompareRowView(
    row: CompareRow,
    chips: List<Chip>,
    scroll: androidx.compose.foundation.ScrollState,
    modifier: Modifier = Modifier
) {
    val best = row.numeric?.let { get ->
        chips.mapNotNull(get).maxOrNull()
    }
    androidx.compose.material3.HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
    Row(
        modifier
            .fillMaxWidth()
            .heightIn(min = 46.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            row.label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier
                .width(92.dp)
                .padding(top = 2.dp)
        )
        CellScroller(scroll) {
            chips.forEach { chip ->
                val text = row.value(chip)
                val isBest = best != null && row.numeric?.invoke(chip) == best && chips.size > 1
                Box(Modifier.width(154.dp).padding(end = 10.dp)) {
                    Text(
                        text,
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = if (isBest) FontWeight.SemiBold else FontWeight.Normal,
                        color = if (isBest) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
private fun CompareCharts(chips: List<Chip>, modifier: Modifier = Modifier) {
    val extra = LocalKirinExtra.current
    KirinCard(modifier = modifier.fillMaxWidth()) {
        Text("规格条形图", style = MaterialTheme.typography.titleMedium)
        Text(
            "原始规格，不是跑分",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.outline
        )
        Spacer(Modifier.height(10.dp))
        ChartBlock("最高主频 (GHz)", chips.sortedByDescending { Data.maxClock(it) }) {
            (Data.maxClock(it) / 1000f) to Data.ghz(Data.maxClock(it))
        }
        Spacer(Modifier.height(12.dp))
        ChartBlock("GPU 指数 (CU×MHz)", chips.sortedByDescending { Data.gpuIndex(it) }) {
            (Data.gpuIndex(it) / 7000f) to Data.gpuIndex(it).toString()
        }
    }
}

@Composable
private fun ChartBlock(
    title: String,
    chips: List<Chip>,
    provider: (Chip) -> Pair<Float, String>
) {
    val extra = LocalKirinExtra.current
    Text(title, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    Spacer(Modifier.height(6.dp))
    val max = chips.maxOfOrNull { provider(it).first } ?: 1f
    chips.forEach { chip ->
        val (value, label) = provider(chip)
        BarRow(
            chip.short,
            if (max > 0) value / max else 0f,
            label,
            if (chip.base) extra.gold else MaterialTheme.colorScheme.primary
        )
        Spacer(Modifier.height(4.dp))
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AddCompareSheet(
    compareIds: List<String>,
    onAdd: (String) -> Unit,
    onRemove: (String) -> Unit,
    onDismiss: () -> Unit
) {
    var query by rememberSaveable { mutableStateOf("") }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val list = Data.allChips.filter {
        query.isBlank() || (it.name + it.short + it.tagline + it.devices.joinToString(" ")).lowercase()
            .contains(query.trim().lowercase())
    }
    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheetState) {
        Column(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
        ) {
            Text("添加芯片", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(
                "已选 ${compareIds.size} / 10",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("搜索芯片或机型…") },
                leadingIcon = { Icon(Icons.Filled.Search, null) },
                singleLine = true,
                shape = RoundedCornerShape(14.dp)
            )
            Spacer(Modifier.height(8.dp))
        }
        LazyColumn(contentPadding = PaddingValues(bottom = 24.dp)) {
            items(list, key = { it.id }) { chip ->
                val selected = compareIds.contains(chip.id)
                val full = !selected && compareIds.size >= 10
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp)
                        .clickable(enabled = !full) {
                            if (selected) onRemove(chip.id) else onAdd(chip.id)
                        }
                        .padding(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(chip.short, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
                        Text(
                            "${Data.familyById[chip.family]?.short ?: ""} · ${Data.typeLabel(chip.type)} · ${chip.gpu?.let { "${it.cus}cu ${it.name}" } ?: "规格未公布"}",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Icon(
                        if (selected) Icons.Filled.Check else Icons.Filled.Add,
                        contentDescription = null,
                        tint = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                    )
                }
            }
            item {
                Button(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) { Text("完成") }
            }
        }
    }
}
