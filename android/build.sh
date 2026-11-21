#!/bin/bash
# 麒麟芯片图鉴 · Android APK 构建（无需 Gradle）
# 依赖：Android SDK（build-tools + platform）、JDK 17、zip
set -euo pipefail

cd "$(dirname "$0")"

SDK="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-$HOME/Android/Sdk}}"
BT="$SDK/build-tools/35.0.0"
PLATFORM="$SDK/platforms/android-35/android.jar"
OUT="out"
BUILD="build"
NAME="kirin-l"

if [ ! -x "$BT/aapt2" ]; then
  echo "找不到 build-tools: $BT" >&2
  exit 1
fi
if [ ! -f "$PLATFORM" ]; then
  echo "找不到 android.jar: $PLATFORM" >&2
  exit 1
fi

rm -rf "$BUILD"
mkdir -p "$BUILD/classes" "$BUILD/dex" "$BUILD/gen" "$OUT"

# 1) 同步 Web 资源到 assets/www
rm -rf assets
mkdir -p assets/www
cp ../index.html ../manifest.webmanifest ../sw.js assets/www/
cp -R ../css ../js ../icons assets/www/

# 2) 资源编译与链接
"$BT/aapt2" compile --dir res -o "$BUILD/res.zip"
"$BT/aapt2" link \
  -o "$BUILD/base.apk" \
  -I "$PLATFORM" \
  --manifest AndroidManifest.xml \
  -A assets \
  --auto-add-overlay \
  --min-sdk-version 24 \
  --target-sdk-version 34 \
  --version-code 2 \
  --version-name 1.1.0 \
  "$BUILD/res.zip"

# 3) Java -> dex
javac -encoding UTF-8 -source 8 -target 8 \
  -classpath "$PLATFORM" \
  -d "$BUILD/classes" \
  src/com/kirinl/app/MainActivity.java 2>"$BUILD/javac.log" || {
    cat "$BUILD/javac.log" >&2
    exit 1
  }

"$BT/d8" --lib "$PLATFORM" --min-api 24 \
  --output "$BUILD/dex" \
  "$BUILD/classes/com/kirinl/app/"*.class

# 4) 打包 classes.dex
( cd "$BUILD/dex" && zip -q -u "../base.apk" classes.dex )

# 5) 对齐 + 签名
"$BT/zipalign" -f -p 4 "$BUILD/base.apk" "$BUILD/aligned.apk"

if [ ! -f "debug.keystore" ]; then
  keytool -genkeypair \
    -keystore "debug.keystore" \
    -storepass android -keypass android \
    -alias androiddebugkey \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Kirin-L, OU=Dev, O=Kirin-L, L=CN, ST=CN, C=CN" >/dev/null 2>&1
fi

"$BT/apksigner" sign \
  --ks "debug.keystore" \
  --ks-pass pass:android \
  --key-pass pass:android \
  --out "$OUT/$NAME.apk" \
  "$BUILD/aligned.apk"

"$BT/apksigner" verify --print-certs "$OUT/$NAME.apk" | head -4
echo "APK: $(cd "$OUT" && pwd)/$NAME.apk"
ls -lh "$OUT/$NAME.apk"
