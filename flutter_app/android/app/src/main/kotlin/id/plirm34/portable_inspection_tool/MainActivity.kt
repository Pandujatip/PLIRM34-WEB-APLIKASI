package id.plirm34.portable_inspection_tool

import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.io.FileOutputStream

class MainActivity : FlutterActivity() {
    private val channelName = "id.plirm34/auth"
    private var methodChannel: MethodChannel? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        methodChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, channelName)
        methodChannel?.setMethodCallHandler { call, result ->
            when (call.method) {
                "getInitialToken" -> {
                    val token = extractTokenFromIntent(intent)
                    result.success(token)
                }
                "getInitialAuth" -> {
                    val authData = extractAuthDataFromIntent(intent)
                    result.success(authData)
                }
                "shareText" -> {
                    val title = call.argument<String>("title") ?: "Bagikan"
                    val text = call.argument<String>("text") ?: ""
                    shareGenericText(title, text)
                    result.success(true)
                }
                "shareWhatsApp" -> {
                    val text = call.argument<String>("text") ?: ""
                    val imageBytes = call.argument<ByteArray>("imageBytes")
                    if (imageBytes != null && imageBytes.isNotEmpty()) {
                        shareToWhatsAppWithImage(text, imageBytes)
                    } else {
                        shareToWhatsApp(text)
                    }
                    result.success(true)
                }
                else -> result.notImplemented()
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val authData = extractAuthDataFromIntent(intent)
        if (authData != null) {
            methodChannel?.invokeMethod("onAuthReceived", authData)
            methodChannel?.invokeMethod("onTokenReceived", authData["token"])
        } else {
            val token = extractTokenFromIntent(intent)
            if (token != null) {
                methodChannel?.invokeMethod("onTokenReceived", token)
            }
        }
    }

    private fun extractTokenFromIntent(intent: Intent?): String? {
        val data: Uri? = intent?.data
        if (data != null && data.scheme == "plirm34" && data.host == "auth") {
            return data.getQueryParameter("token")
        }
        return null
    }

    private fun extractAuthDataFromIntent(intent: Intent?): Map<String, String>? {
        val data: Uri? = intent?.data
        if (data != null && data.scheme == "plirm34" && data.host == "auth") {
            val token = data.getQueryParameter("token")
            if (!token.isNullOrEmpty()) {
                val role = data.getQueryParameter("role") ?: "team"
                val username = data.getQueryParameter("username") ?: "google_user"
                return mapOf(
                    "token" to token,
                    "role" to role,
                    "username" to username
                )
            }
        }
        return null
    }

    private fun shareGenericText(title: String, text: String) {
        val sendIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, text)
            type = "text/plain"
        }
        val shareIntent = Intent.createChooser(sendIntent, title)
        startActivity(shareIntent)
    }

    private fun shareToWhatsApp(text: String) {
        for (pkg in listOf("com.whatsapp", "com.whatsapp.w4b")) {
            val waIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, text)
                type = "text/plain"
                setPackage(pkg)
            }
            try {
                startActivity(waIntent)
                return
            } catch (_: Exception) {}
        }
        try {
            val uri = Uri.parse("https://wa.me/?text=" + Uri.encode(text))
            val browserIntent = Intent(Intent.ACTION_VIEW, uri)
            startActivity(browserIntent)
        } catch (_: Exception) {}
    }

    private fun shareToWhatsAppWithImage(text: String, imageBytes: ByteArray) {
        try {
            val cacheDir = File(applicationContext.cacheDir, "shared_images")
            if (!cacheDir.exists()) {
                cacheDir.mkdirs()
            }
            val imageFile = File(cacheDir, "carbon_brush_stat.png")
            FileOutputStream(imageFile).use { fos ->
                fos.write(imageBytes)
                fos.flush()
            }
            val uri = FileProvider.getUriForFile(
                applicationContext,
                "${applicationContext.packageName}.fileprovider",
                imageFile
            )

            for (pkg in listOf("com.whatsapp", "com.whatsapp.w4b")) {
                val waIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_STREAM, uri)
                    putExtra(Intent.EXTRA_TEXT, text)
                    type = "image/png"
                    setPackage(pkg)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }
                grantUriPermission(pkg, uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
                try {
                    startActivity(waIntent)
                    return
                } catch (_: Exception) {}
            }

            // Fallback chooser if WhatsApp direct package fails
            val chooser = Intent.createChooser(Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_TEXT, text)
                type = "image/png"
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }, "Kirim Gambar WhatsApp")
            startActivity(chooser)
        } catch (_: Exception) {
            shareToWhatsApp(text)
        }
    }
}
