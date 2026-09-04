$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$sdk = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } elseif ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$buildTools = Get-ChildItem -Directory (Join-Path $sdk "build-tools") | Sort-Object Name -Descending | Select-Object -First 1
$platform = Get-ChildItem -Directory (Join-Path $sdk "platforms") | Sort-Object Name -Descending | Select-Object -First 1

if (-not $buildTools) { throw "Android build-tools not found in $sdk" }
if (-not $platform) { throw "Android platforms not found in $sdk" }

$aapt2 = Join-Path $buildTools.FullName "aapt2.exe"
$d8 = Join-Path $buildTools.FullName "d8.bat"
$zipalign = Join-Path $buildTools.FullName "zipalign.exe"
$apksigner = Join-Path $buildTools.FullName "apksigner.bat"
$androidJar = Join-Path $platform.FullName "android.jar"
$adb = Join-Path $sdk "platform-tools\adb.exe"

$debugKeystore = Join-Path $env:USERPROFILE ".android\debug.keystore"

$build = Join-Path $root "build"
$dist = Join-Path $root "dist"
$compiled = Join-Path $build "compiled"
$classes = Join-Path $build "classes"
$dex = Join-Path $build "dex"
$unsigned = Join-Path $build "app-unsigned.apk"
$unaligned = Join-Path $build "app-unaligned.apk"
$aligned = Join-Path $build "app-aligned.apk"
$signed = Join-Path $dist "app-debug.apk"
$classesJar = Join-Path $build "classes.jar"

Remove-Item -Recurse -Force $build, $dist -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $compiled, $classes, $dex, $dist | Out-Null

Write-Host "1/6 Compiling resources..."
Get-ChildItem -Recurse -File (Join-Path $root "app\src\main\res") | ForEach-Object {
    & $aapt2 compile $_.FullName -o $compiled
}
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed" }

Write-Host "2/6 Linking APK..."
$linkArgs = @(
    "link",
    "-o", $unsigned,
    "-I", $androidJar,
    "--manifest", (Join-Path $root "app\src\main\AndroidManifest.xml"),
    "--java", (Join-Path $build "generated"),
    "--auto-add-overlay",
    "--min-sdk-version", "23",
    "--target-sdk-version", "35",
    "--version-code", "4",
    "--version-name", "4.0.0"
)
Get-ChildItem -File -Filter *.flat $compiled | ForEach-Object {
    $linkArgs += @("-R", $_.FullName)
}
& $aapt2 @linkArgs
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed" }

Write-Host "3/6 Compiling Java..."
$javaFiles = @(
    Get-ChildItem -Recurse -Filter *.java (Join-Path $root "app\src\main\java")
    Get-ChildItem -Recurse -Filter *.java (Join-Path $build "generated")
) | ForEach-Object { $_.FullName }

& javac -encoding UTF-8 -source 8 -target 8 -bootclasspath $androidJar -d $classes $javaFiles
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

Push-Location $classes
try {
    & jar cf $classesJar .
}
finally {
    Pop-Location
}

Write-Host "4/6 Dexing with D8..."
& $d8 --release --min-api 23 --lib $androidJar --output $dex $classesJar
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

Copy-Item $unsigned $unaligned
Add-Type -AssemblyName System.IO.Compression.FileSystem
$apkZip = [System.IO.Compression.ZipFile]::Open($unaligned, [System.IO.Compression.ZipArchiveMode]::Update)
try {
    $existing = $apkZip.GetEntry("classes.dex")
    if ($existing) { $existing.Delete() }
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($apkZip, (Join-Path $dex "classes.dex"), "classes.dex", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}
finally {
    $apkZip.Dispose()
}

Write-Host "5/6 Zipalign and Sign..."
& $zipalign -f 4 $unaligned $aligned
if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }

$signArgs = @(
    "sign",
    "--ks", $debugKeystore,
    "--ks-key-alias", "androiddebugkey",
    "--ks-pass", "pass:android",
    "--key-pass", "pass:android",
    "--out", $signed,
    $aligned
)
& $apksigner @signArgs
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

Write-Host "APK Built Successfully: $signed"
