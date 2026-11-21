package com.kirinl.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.kirinl.app.ui.KirinApp
import com.kirinl.app.ui.KirinTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { Root() }
    }
}

@Composable
private fun Root() {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("kirin", android.content.Context.MODE_PRIVATE) }
    val systemDark = isSystemInDarkTheme()
    var mode by remember { mutableStateOf(prefs.getString("theme", "system") ?: "system") }
    val dark = when (mode) {
        "dark" -> true
        "light" -> false
        else -> systemDark
    }

    KirinTheme(darkTheme = dark) {
        KirinApp(
            darkTheme = dark,
            onToggleTheme = {
                mode = if (dark) "light" else "dark"
                prefs.edit().putString("theme", mode).apply()
            }
        )
    }
}
