package com.kirinl.app.ui

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat

private val LightScheme = lightColorScheme(
    primary = Color(0xFFC8102E),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFDAD9),
    onPrimaryContainer = Color(0xFF410008),
    secondary = Color(0xFF775652),
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFDAD6),
    onSecondaryContainer = Color(0xFF2C1512),
    tertiary = Color(0xFF7A5900),
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFFFDF9E),
    onTertiaryContainer = Color(0xFF261900),
    background = Color(0xFFF6F7F9),
    onBackground = Color(0xFF12161C),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF12161C),
    surfaceVariant = Color(0xFFEEF1F5),
    onSurfaceVariant = Color(0xFF44474C),
    surfaceContainer = Color(0xFFF0F2F5),
    surfaceContainerHigh = Color(0xFFE8EBF0),
    surfaceContainerHighest = Color(0xFFE1E5EB),
    outline = Color(0xFF74777C),
    outlineVariant = Color(0xFFDDE2EA),
    error = Color(0xFFBA1A1A)
)

private val DarkScheme = darkColorScheme(
    primary = Color(0xFFFF5A6A),
    onPrimary = Color(0xFF5F0010),
    primaryContainer = Color(0xFF8E1026),
    onPrimaryContainer = Color(0xFFFFDAD9),
    secondary = Color(0xFFE7BDB8),
    onSecondary = Color(0xFF442925),
    secondaryContainer = Color(0xFF5D3F3B),
    onSecondaryContainer = Color(0xFFFFDAD6),
    tertiary = Color(0xFFE3B25C),
    onTertiary = Color(0xFF402D00),
    tertiaryContainer = Color(0xFF5C4200),
    onTertiaryContainer = Color(0xFFFFDF9E),
    background = Color(0xFF0B0E13),
    onBackground = Color(0xFFE9EEF5),
    surface = Color(0xFF131820),
    onSurface = Color(0xFFE9EEF5),
    surfaceVariant = Color(0xFF1C232D),
    onSurfaceVariant = Color(0xFFC2CCD9),
    surfaceContainer = Color(0xFF171D26),
    surfaceContainerHigh = Color(0xFF1D2530),
    surfaceContainerHighest = Color(0xFF232C38),
    outline = Color(0xFF8B98A9),
    outlineVariant = Color(0xFF2A3441),
    error = Color(0xFFFF6F68)
)

@Immutable
data class KirinExtraColors(
    val cut: Color,
    val cutContainer: Color,
    val boost: Color,
    val boostContainer: Color,
    val gold: Color,
    val goldContainer: Color,
    val info: Color,
    val infoContainer: Color,
    val violet: Color,
    val violetContainer: Color,
    val teal: Color,
    val tealContainer: Color
)

private val LightExtra = KirinExtraColors(
    cut = Color(0xFF1B8163),
    cutContainer = Color(0xFFD7F3E8),
    boost = Color(0xFFC93F3A),
    boostContainer = Color(0xFFFFDAD7),
    gold = Color(0xFF8A6400),
    goldContainer = Color(0xFFFFF0CE),
    info = Color(0xFF2563EB),
    infoContainer = Color(0xFFDCE7FF),
    violet = Color(0xFF6D28D9),
    violetContainer = Color(0xFFEADDFF),
    teal = Color(0xFF0F766E),
    tealContainer = Color(0xFFD5F2EE)
)

private val DarkExtra = KirinExtraColors(
    cut = Color(0xFF48C39A),
    cutContainer = Color(0xFF143D30),
    boost = Color(0xFFFF6F68),
    boostContainer = Color(0xFF44201E),
    gold = Color(0xFFE3B25C),
    goldContainer = Color(0xFF3A2B0C),
    info = Color(0xFF9DBBFF),
    infoContainer = Color(0xFF1B2B4D),
    violet = Color(0xFFC4B5FD),
    violetContainer = Color(0xFF2B2145),
    teal = Color(0xFF5EEAD4),
    tealContainer = Color(0xFF0E3532)
)

val LocalKirinExtra = staticCompositionLocalOf { LightExtra }

private val KirinTypography = Typography(
    displaySmall = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 36.sp,
        lineHeight = 42.sp,
        letterSpacing = (-0.6).sp
    ),
    headlineMedium = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        letterSpacing = (-0.4).sp
    ),
    headlineSmall = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    titleLarge = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    ),
    titleMedium = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp
    ),
    bodyLarge = TextStyle(fontSize = 15.sp, lineHeight = 23.sp),
    bodyMedium = TextStyle(fontSize = 13.sp, lineHeight = 20.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.Medium, fontSize = 13.sp)
)

@Composable
fun KirinTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkScheme else LightScheme
    val extra = if (darkTheme) DarkExtra else LightExtra

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window ?: return@SideEffect
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = !darkTheme
                isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    androidx.compose.runtime.CompositionLocalProvider(LocalKirinExtra provides extra) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = KirinTypography,
            content = content
        )
    }
}
