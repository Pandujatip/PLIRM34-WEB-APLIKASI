package id.plirm34.portable_inspection_tool

import android.content.Intent
import android.net.Uri
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val channelName = "id.plirm34/auth"
    private var methodChannel: MethodChannel? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        methodChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, channelName)
        methodChannel?.setMethodCallHandler { call, result ->
            if (call.method == "getInitialToken") {
                val token = extractTokenFromIntent(intent)
                result.success(token)
            } else {
                result.notImplemented()
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val token = extractTokenFromIntent(intent)
        if (token != null) {
            methodChannel?.invokeMethod("onTokenReceived", token)
        }
    }

    private fun extractTokenFromIntent(intent: Intent?): String? {
        val data: Uri? = intent?.data
        if (data != null && data.scheme == "plirm34" && data.host == "auth") {
            return data.getQueryParameter("token")
        }
        return null
    }
}
