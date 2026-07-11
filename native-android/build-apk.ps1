$ErrorActionPreference = "Stop"

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

$requiredSigningVariables = @(
    "PLIRM34_ANDROID_KEYSTORE",
    "PLIRM34_ANDROID_KEY_ALIAS",
    "PLIRM34_ANDROID_STORE_PASSWORD",
    "PLIRM34_ANDROID_KEY_PASSWORD"
)
foreach ($variableName in $requiredSigningVariables) {
    if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($variableName))) {
        throw "Android signing belum dikonfigurasi. Environment variable $variableName wajib diisi."
    }
}

$keystore = [System.IO.Path]::GetFullPath($env:PLIRM34_ANDROID_KEYSTORE)
$rootFullPath = [System.IO.Path]::GetFullPath($root)
$rootPrefix = $rootFullPath.TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if ($keystore.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Keystore signing wajib disimpan di luar repository."
}
if (-not (Test-Path -LiteralPath $keystore -PathType Leaf)) {
    throw "Keystore signing tidak ditemukan: $keystore"
}
$keyAlias = $env:PLIRM34_ANDROID_KEY_ALIAS

$build = Join-Path $root "build"
$dist = Join-Path $root "dist"
$compiled = Join-Path $build "compiled"
$classes = Join-Path $build "classes"
$dex = Join-Path $build "dex"
$unsigned = Join-Path $build "PLIRM34-unsigned.apk"
$unaligned = Join-Path $build "PLIRM34-unaligned.apk"
$aligned = Join-Path $build "PLIRM34-aligned.apk"
$signed = Join-Path $dist "PLIRM34-native.apk"
$classesJar = Join-Path $build "classes.jar"

Remove-Item -Recurse -Force $build, $dist -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $compiled, $classes, $dex, $dist | Out-Null

Get-ChildItem -Recurse -File (Join-Path $root "app\src\main\res") | ForEach-Object {
    & $aapt2 compile $_.FullName -o $compiled
}
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed" }

$linkArgs = @(
    "link",
    "-o", $unsigned,
    "-I", $androidJar,
    "--manifest", (Join-Path $root "app\src\main\AndroidManifest.xml"),
    "--java", (Join-Path $build "generated"),
    "--auto-add-overlay",
    "--min-sdk-version", "23",
    "--target-sdk-version", "36"
)
Get-ChildItem -File -Filter *.flat $compiled | ForEach-Object {
    $linkArgs += @("-R", $_.FullName)
}

& $aapt2 @linkArgs
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed" }

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
if ($LASTEXITCODE -ne 0) { throw "jar failed" }

& $d8 --release --min-api 23 --lib $androidJar --output $dex $classesJar
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

Copy-Item $unsigned $unaligned
Compress-Archive -Path (Join-Path $dex "classes.dex") -DestinationPath (Join-Path $build "classes.zip") -Force
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

& $zipalign -f 4 $unaligned $aligned
if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }

& $apksigner sign `
    --ks $keystore `
    --ks-key-alias $keyAlias `
    --ks-pass env:PLIRM34_ANDROID_STORE_PASSWORD `
    --key-pass env:PLIRM34_ANDROID_KEY_PASSWORD `
    --out $signed `
    $aligned
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

& $apksigner verify --verbose --print-certs $signed
if ($LASTEXITCODE -ne 0) { throw "APK verification failed" }

Write-Host "APK built: $signed"
