package com.kirinl.app.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CompareArrows
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.saveable.rememberSaveableStateHolder
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kirinl.app.data.Chip
import com.kirinl.app.data.Data
import com.kirinl.app.data.Family
import kotlinx.coroutines.launch

enum class MainTab(val title: String, val label: String) {
    CHIPS("麒麟图鉴", "芯片"),
    COMPARE("芯片对比", "对比"),
    SERIES("世代与刀法", "世代"),
    ABOUT("关于", "说明")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KirinApp(darkTheme: Boolean, onToggleTheme: () -> Unit) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("kirin", android.content.Context.MODE_PRIVATE) }
    val scope = rememberCoroutineScope()
    val snackbar = remember { SnackbarHostState() }
    val tabStateHolder = rememberSaveableStateHolder()

    var tabName by rememberSaveable { mutableStateOf(MainTab.CHIPS.name) }
    val tab = MainTab.valueOf(tabName)
    var detailId by rememberSaveable { mutableStateOf<String?>(null) }
    var seriesId by rememberSaveable { mutableStateOf<String?>(null) }

    val favorites = remember {        mutableStateListOf<String>().apply {
            addAll(prefs.getStringSet("favorites", emptySet()).orEmpty().filter { Data.byId.containsKey(it) })
        }
    }
    val compare = remember {
        mutableStateListOf<String>().apply {
            addAll(prefs.getStringSet("compare", emptySet()).orEmpty().filter { Data.byId.containsKey(it) }.take(10))
        }
    }

    fun persist() {
        prefs.edit()
            .putStringSet("favorites", favorites.toSet())
            .putStringSet("compare", compare.toSet())
            .apply()
    }

    fun toggleFavorite(id: String) {
        if (favorites.remove(id)) Unit else favorites.add(id)
        persist()
    }

    fun addCompare(id: String) {
        if (compare.contains(id)) return
        if (compare.size >= 10) {
            scope.launch { snackbar.showSnackbar("最多同时对比 10 款芯片") }
            return
        }
        compare.add(id)
        persist()
    }

    fun removeCompare(id: String) {
        compare.remove(id)
        persist()
    }

    BackHandler(enabled = detailId != null || seriesId != null) {
        if (detailId != null) detailId = null else seriesId = null
    }

    val detailChip = detailId?.let { Data.byId[it] }
    val detailFamily = seriesId?.let { Data.familyById[it] }

    Box(Modifier.fillMaxSize()) {
        Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        contentWindowInsets = WindowInsets.safeDrawing,
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        AnimatedContent(
                            targetState = tab.title,
                            transitionSpec = { fadeIn(tween(180)) togetherWith fadeOut(tween(120)) },
                            label = "top-title"
                        ) { title ->
                            Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        }
                        Text(
                            "KIRIN-L · 内置数据库 v5.0",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onToggleTheme) {
                        AnimatedContent(
                            targetState = darkTheme,
                            transitionSpec = { fadeIn(tween(200)) togetherWith fadeOut(tween(120)) },
                            label = "theme-icon"
                        ) { dark ->
                            Icon(
                                if (dark) Icons.Filled.LightMode else Icons.Filled.DarkMode,
                                contentDescription = if (dark) "切换到浅色" else "切换到深色"
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            val itemColors = NavigationBarItemDefaults.colors(
                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                selectedIconColor = MaterialTheme.colorScheme.onPrimaryContainer,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                NavigationBarItem(
                    selected = tab == MainTab.CHIPS,
                    onClick = { tabName = MainTab.CHIPS.name },
                    icon = { Icon(Icons.Filled.Memory, contentDescription = null) },
                    label = { Text(MainTab.CHIPS.label) },
                    colors = itemColors
                )
                NavigationBarItem(
                    selected = tab == MainTab.COMPARE,
                    onClick = { tabName = MainTab.COMPARE.name },
                    icon = {
                        BadgedBox(
                            badge = {
                                if (compare.isNotEmpty()) {
                                    Badge {
                                        AnimatedContent(
                                            targetState = compare.size,
                                            transitionSpec = {
                                                fadeIn(tween(150)) togetherWith fadeOut(tween(100))
                                            },
                                            label = "cmp-badge"
                                        ) { count -> Text(count.toString()) }
                                    }
                                }
                            }
                        ) {
                            Icon(Icons.Filled.CompareArrows, contentDescription = null)
                        }
                    },
                    label = { Text(MainTab.COMPARE.label) },
                    colors = itemColors
                )
                NavigationBarItem(
                    selected = tab == MainTab.SERIES,
                    onClick = { tabName = MainTab.SERIES.name },
                    icon = { Icon(Icons.Filled.Layers, contentDescription = null) },
                    label = { Text(MainTab.SERIES.label) },
                    colors = itemColors
                )
                NavigationBarItem(
                    selected = tab == MainTab.ABOUT,
                    onClick = { tabName = MainTab.ABOUT.name },
                    icon = { Icon(Icons.Filled.Info, contentDescription = null) },
                    label = { Text(MainTab.ABOUT.label) },
                    colors = itemColors
                )
            }
        }
    ) { padding ->
        val modifier = Modifier.padding(padding)
        AnimatedContent(
            targetState = tab,
            modifier = Modifier.fillMaxSize(),
            transitionSpec = {
                val dir = if (targetState.ordinal >= initialState.ordinal) 1 else -1
                (slideInHorizontally(tween(280)) { it / 8 * dir } + fadeIn(tween(220)))
                    .togetherWith(slideOutHorizontally(tween(220)) { -it / 8 * dir } + fadeOut(tween(160)))
            },
            label = "tab-content"
        ) { currentTab ->
            tabStateHolder.SaveableStateProvider(currentTab.name) {
                when (currentTab) {
                    MainTab.CHIPS -> ChipsScreen(
                        modifier = modifier,
                        favorites = favorites,
                        compare = compare,
                        onToggleFavorite = ::toggleFavorite,
                        onAddCompare = ::addCompare,
                        onRemoveCompare = ::removeCompare,
                        onOpenChip = { detailId = it }
                    )

                    MainTab.COMPARE -> CompareScreen(
                        modifier = modifier,
                        compareIds = compare,
                        onAdd = ::addCompare,
                        onRemove = ::removeCompare,
                        onClear = { compare.clear(); persist() },
                        onOpenChip = { detailId = it }
                    )

                    MainTab.SERIES -> SeriesScreen(
                        modifier = modifier,
                        onOpenFamily = { seriesId = it }
                    )

                    MainTab.ABOUT -> AboutScreen(modifier = modifier)
                }
            }
        }
        }

        val overlay: Any? = detailChip ?: detailFamily
        AnimatedContent(
            targetState = overlay,
            modifier = Modifier.fillMaxSize(),
            transitionSpec = {
                (slideInHorizontally(tween(320)) { it / 3 } + fadeIn(tween(220)))
                    .togetherWith(slideOutHorizontally(tween(260)) { it / 3 } + fadeOut(tween(180)))
            },
            label = "detail-overlay"
        ) { target ->
            when (target) {
                is Chip -> ChipDetailScreen(
                    chip = target,
                    isFavorite = favorites.contains(target.id),
                    isCompared = compare.contains(target.id),
                    onBack = { detailId = null },
                    onToggleFavorite = { toggleFavorite(target.id) },
                    onToggleCompare = {
                        if (compare.contains(target.id)) removeCompare(target.id) else addCompare(target.id)
                    },
                    onOpenChip = { detailId = it },
                    onOpenSeries = { seriesId = it; detailId = null }
                )

                is Family -> FamilyDetailScreen(
                    family = target,
                    onBack = { seriesId = null },
                    onOpenChip = { detailId = it }
                )

                else -> Box(Modifier.fillMaxSize())
            }
        }
    }
}
