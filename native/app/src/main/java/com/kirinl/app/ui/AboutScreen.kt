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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kirinl.app.data.Data

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AboutScreen(modifier: Modifier = Modifier) {
    val uri = LocalUriHandler.current
    val total = Data.allChips.size
    val deviceCount = Data.allChips.flatMap { it.devices }.toSet().size
    val sources = Data.sourceById.values.toList()
    val processCount = Data.allChips.count { Data.resolvedResearch(it)?.field("process") != null }
    val cacheCount = Data.allChips.count { Data.resolvedResearch(it)?.field("cache") != null }
    val memoryCount = Data.allChips.count { Data.resolvedResearch(it)?.field("memory") != null }
    val npuCount = Data.allChips.count { Data.resolvedResearch(it)?.field("npu") != null }
    val modemCount = Data.allChips.count { Data.resolvedResearch(it)?.field("modem") != null }
    val cpuCount = Data.allChips.count { it.cpu != null }
    val archCount = Data.allChips.count { c -> c.cpu?.clusters?.any { it.arch.isNotBlank() && it.arch != "—" } == true }
    val gpuCount = Data.allChips.count { it.gpu != null }
    val deviceChipCount = Data.allChips.count { it.devices.isNotEmpty() }
    val benchPlatforms = Data.allChips.count {
        val r = Data.resolvedResearch(it)
        r != null && r.benchmarks.isNotEmpty() && !r.benchmarkInherited
    }

    LazyColumn(
        modifier = modifier.fillMaxWidth(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            KirinCard {
                Text("关于与数据口径", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(4.dp))
                Text(
                    "CPU 刀法、GPU 规模、削减项与机型以原文为准；原文没写的制程、缓存、内存、基带、NPU 与跑分，则去公开资料里逐项核对，并标出来源和可信度。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        item {
            KirinCard {
                Text(
                    "数据来源 · 酷安",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "《新时代麒麟芯片汇总 5.0》",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "作者 杜马1124 · 发布于 2026-11-09",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    "原文表格里的每一行对应一个独立条目；同一芯片的先后命名合并展示并保留别名。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    "查看原文 →",
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable { uri.openUri("https://www.coolapk.com/feed/74959496") }
                )
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                AboutStat("芯片", "$total", "款", Modifier.weight(1f))
                AboutStat("世代", "${Data.allFamilies.size}", "个", Modifier.weight(1f))
                AboutStat("机型", "$deviceCount", "条", Modifier.weight(1f))
            }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                AboutStat("补充字段", "6", "类", Modifier.weight(1f))
                AboutStat("公开来源", "${sources.size}", "条", Modifier.weight(1f))
                AboutStat("跑分平台", "$benchPlatforms", "个", Modifier.weight(1f))
            }
        }
        item {
            SectionCard("字段覆盖", icon = Icons.Filled.Check, subtitle = "原文 + 补充资料") {
                Text("原文可核对", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                CoverageRow("CPU 簇构成", cpuCount, total)
                CoverageRow("核心代号", archCount, total)
                CoverageRow("GPU 型号 / CU", gpuCount, total)
                CoverageRow("搭载机型", deviceChipCount, total)
                Spacer(Modifier.height(10.dp))
                Text("联网补充", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                CoverageRow("制程工艺", processCount, total)
                CoverageRow("缓存规格", cacheCount, total)
                CoverageRow("内存规格", memoryCount, total)
                CoverageRow("NPU 架构", npuCount, total)
                CoverageRow("基带型号", modemCount, total)
                Spacer(Modifier.height(6.dp))
                Text(
                    "跑分：$benchPlatforms 个基准平台有实测或媒体数据；衍生型号沿用同系列基准，详情页标「同系列基准」。",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }
        item {
            SectionCard("补充资料：查到了什么", icon = Icons.Filled.Info, subtitle = "2026-11 联网核对") {
                listOf(
                    "制程" to "9000S / 9010 / 9020 均为 SMIC N+2（7nm 级）；9030 为 N+3；9050Pro 是 N+3 逻辑 die + N+2 SRAM die；X90 为 N+2；8000 / 8020 为 7nm。",
                    "缓存" to "9000S L3 4MB → 9010 8MB → 9020 10MB → 9030 12MB；9050Pro 8+8MB L3、SLC 12MB；X90 16MB。",
                    "NPU" to "9030 对比 9020 +13%，9035 对比 9030 +51%，9050 +140%、功耗 -66%、支持 30B MoE；X90 媒体口径 40 TOPS。",
                    "基带" to "9000S / 9010 巴龙 5000；9020 巴龙 6000（3GPP R18）；9030 / 9050 集成巴龙，但型号未公布。",
                    "内存" to "9010 LPDDR5X-4200；9020 LPDDR5X-4266 / 68.2GB/s；9030Pro LPDDR5X-4800 / 76.8GB/s；9000 LPDDR5-2750。",
                    "跑分" to "GB6：9000S 1324/4116；9010 1447/4765；9020 约 1591/5100；9030Pro 1742/5238；9050Pro 2084/约 10400；8000 936/2600。"
                ).forEach { (title, body) ->
                    Row(Modifier.padding(vertical = 4.dp)) {
                        Text(title, style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold, modifier = Modifier.width(48.dp))
                        Text(body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
        item {
            SectionCard("仍存在冲突 / 缺口", icon = Icons.Filled.Info) {
                listOf(
                    "9000S 内存：LPDDR5-2750 / 44GB/s vs LPDDR5X / 约 67.2GB/s，并列标注。",
                    "9050Pro 内存：LPDDR5X 与 LPDDR6 说法冲突，华为未公布。",
                    "9020 小核 L2：1MB vs 2MB 两种拆解口径，界面写「1–2MB，来源冲突」。",
                    "9050Pro 线程：原文 9 核 14 线程 vs 华为官网 9 核 16 线程，采用官方并注明。",
                    "X90 频率：原文 2.32GHz vs 部分报道 4.2GHz，保留原文，不采信 4.2GHz。",
                    "X90 跑分：无鸿蒙原生 Geekbench，极客湾称网传分数不可信，故不收录。",
                    "8000 系缓存、多数 ISP 型号与 NPU TOPS、9030S 缓存容量：未查到可靠来源。",
                    "低产量衍生型号通常无独立拆解，补充资料沿用同系列基准并标「同系列基准」。"
                ).forEach {
                    Text("·  $it", style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(vertical = 3.dp))
                }
            }
        }
        item {
            SectionCard("可信度图例", icon = Icons.Filled.Info) {
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("official", "teardown", "media", "db", "inferred", "conflict", "original").forEach {
                        ConfidenceBadge(it)
                    }
                }
                Spacer(Modifier.height(6.dp))
                Text(
                    "官方 > 拆解 > 媒体 > 数据库 > 同代推断；冲突并列，不把单一说法写成定论。",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }
        item {
            SectionCard("全部公开来源（${sources.size}）", icon = Icons.Filled.Layers) {
                sources.forEach { source ->
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable { uri.openUri(source.url) }
                            .padding(vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        ConfidenceBadge(source.kind)
                        Spacer(Modifier.width(8.dp))
                        Column(Modifier.weight(1f)) {
                            Text(source.label, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(
                                source.title,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
        item {
            SectionCard("关于这个应用", icon = Icons.Filled.Info) {
                Text(
                    "Kirin-L 参考 SoC-L 的「数据库 + 收藏 + 多芯片对比」结构，但补齐了麒麟特有的超大核 / 大核 / 小核拆分、核心代号、GPU 规模、平板无基带、ISP / NPU 削减、命名沿革与衍生关系。",
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(Modifier.height(6.dp))
                Text(
                    "原生 Android · Kotlin + Jetpack Compose + Material 3；数据全部内置，无需联网；收藏与对比列表保存在本机。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(6.dp))
                Text(
                    "非官方图鉴，与华为 / 酷安无关联；数据版权归原作者。",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }
    }
}

@Composable
private fun AboutStat(label: String, value: String, unit: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceContainer
    ) {
        Column(Modifier.padding(10.dp)) {
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
}

@Composable
private fun CoverageRow(label: String, count: Int, total: Int) {
    val fraction = if (total > 0) count.toFloat() / total else 0f
    Column(Modifier.padding(vertical = 4.dp)) {
        Row {
            Text(label, style = MaterialTheme.typography.bodySmall, modifier = Modifier.weight(1f))
            Text(
                "$count / $total",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Spacer(Modifier.height(3.dp))
        LinearProgressIndicator(
            progress = { fraction },
            modifier = Modifier
                .fillMaxWidth()
                .height(5.dp),
            color = LocalKirinExtra.current.cut,
            trackColor = MaterialTheme.colorScheme.surfaceContainerHighest
        )
    }
}
