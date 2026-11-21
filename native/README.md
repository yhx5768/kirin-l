# Kirin-L Native

原生 Android 客户端：Kotlin + Jetpack Compose + Material 3。

## 构建

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
./gradlew assembleRelease
# 产物 app/build/outputs/apk/release/app-release.apk
```

- compileSdk 36 / targetSdk 35 / minSdk 26
- Kotlin 2.1.20 / AGP 8.9.1 / Compose BOM 2025.04.01
- release 使用仓库内 `android/debug.keystore` 签名（相对 app 模块为 `../../android/debug.keystore`），与旧 WebView 版同签名，versionCode 3。
- 依赖使用 `~/Android/Sdk`，如不同请改 `local.properties`。

## 结构

```
app/src/main/java/com/kirinl/app/
├── MainActivity.kt        # edge-to-edge + 主题
├── data/
│   ├── KirinData.kt       # 自动生成：51 款芯片 / 8 世代 / 38 来源 / research
│   └── DataExt.kt         # 查询、派生、研究资料继承
└── ui/
    ├── Theme.kt           # Material 3 配色 / 字体 / 状态栏
    ├── Components.kt      # 卡片、徽章、研究卡、条形图
    ├── KirinApp.kt        # 底部导航 + 全屏详情覆盖（保留列表状态）
    ├── ChipsScreen.kt     # 芯片库 / 搜索 / 筛选
    ├── DetailScreen.kt    # 详情 / CPU / GPU / 补充资料 / 完整字段
    ├── CompareScreen.kt   # 对比表 / 差异开关 / 添加面板 / 图表
    ├── SeriesScreen.kt    # 世代 / 刀法矩阵 / 衍生树
    └── AboutScreen.kt     # 来源 / 覆盖 / 冲突 / 可信度
```

## 数据生成

数据源为仓库根目录 `js/data.js`（与 Web 原型共用）。修改后：

```bash
node tools/gen_data.js
```

脚本会读取 `../js/data.js`，生成 `app/.../data/KirinData.kt`。

## 设计说明

- 详情与世代详情以**全屏覆盖层**叠在主界面之上，主列表保持组合，返回时搜索、筛选、滚动位置不丢。
- 动效：Tab 切换 `AnimatedContent` 滑动淡入，详情/世代覆盖层侧滑进入，列表项 `animateItem` 重排，结果数与徽章数字淡入，GPU/对比条形图 `animateFloatAsState` 增长，主题图标淡入切换。
- 对比页使用 `stickyHeader`：上滑时顶部控制区滚走，「规格」表头冻结，列名始终可见。
- 对比表使用共享 `ScrollState` 的固定标签列 + 横向滚动值列；列边缘加了渐隐遮罩，避免半截文字。
- 已选芯片用可移除的 `InputChip` 展示，表格内部不再放删除按钮。
- 配色沿用原文语义：绿 = 削减、红 = 加强、金 = 基准；同时适配 Material 3 深浅色。
- 补充资料按可信度着色：官方蓝、拆解紫、媒体青、数据库灰、推断/冲突金、原文红。

## 已知边界

- 动态下发未做，数据全部内置。
- 8000 系缓存、多数 ISP 型号与 NPU TOPS、9030S 缓存容量等仍无可靠公开数据。
- 低产量衍生型号沿用同系列基准数据，界面已标「同系列基准」。
