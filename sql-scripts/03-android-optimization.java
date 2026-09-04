// PLIRM34 Android Optimization - Phase 1
// SSL Certificate Pinning + Async HTTP Client
// File: PlirmApiClient.java (Replacement)

package id.plirm34.nativeapp;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;
import org.json.JSONException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.CertificatePinner;
import okhttp3.ConnectionPool;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

final class PlirmApiClient {
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private static final int CONNECT_TIMEOUT_MS = 12;
    private static final int READ_TIMEOUT_MS = 20;
    
    private final String baseUrl;
    private String sessionCookie = "";
    private final OkHttpClient httpClient;

    PlirmApiClient(String baseUrl) {
        String normalized = String.valueOf(baseUrl == null ? "" : baseUrl).trim();
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        this.baseUrl = normalized.length() > 0 ? normalized : "https://plirm34tuban.id";
        
        // Initialize OkHttpClient with certificate pinning and connection pooling
        this.httpClient = createHttpClient();
    }
    
    /**
     * Configure OkHttpClient with SSL pinning, connection pool, and timeouts
     */
    private OkHttpClient createHttpClient() {
        try {
            // SSL Certificate Pinning Configuration
            CertificatePinner certificatePinner = new CertificatePinner.Builder()
                // Production: plirm34tuban.id
                .add("plirm34tuban.id", 
                    "sha256/+MIGfqnomPLZvwXhQluSpzwQoJGWU/wFh7eqXnLLCA=",  // Leaf cert
                    "sha256/jQJTbIh0grw30o4+IY9NAgMwandNYZ5NMIc5CqQU40M=", // Intermediate
                    "sha256/C5+lpZ7tcVwFYdtolUDfqS03NMsD7FsNoNZtIe2Jaes="   // Root
                )
                .build();
            
            // Connection pooling for better performance
            ConnectionPool connectionPool = new ConnectionPool(
                5,  // maxIdleConnections
                5,  // keepAliveDuration
                TimeUnit.MINUTES
            );
            
            return new OkHttpClient.Builder()
                .certificatePinner(certificatePinner)
                .connectionPool(connectionPool)
                .connectTimeout(CONNECT_TIMEOUT_MS, TimeUnit.SECONDS)
                .readTimeout(READ_TIMEOUT_MS, TimeUnit.SECONDS)
                .callTimeout(30, TimeUnit.SECONDS)
                .addInterceptor(new LoggingInterceptor())  // Request/response logging
                .retryOnConnectionFailure(true)
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to setup HTTP client", e);
        }
    }

    String getBaseUrl() {
        return baseUrl;
    }

    // ASYNC METHODS (Non-blocking)
    
    void loginAsync(String username, String password, ApiCallback callback) {
        JSONObject payload = new JSONObject();
        try {
            payload.put("username", username);
            payload.put("password", password);
        } catch (JSONException error) {
            callback.onError("Payload login tidak valid: " + error.getMessage());
            return;
        }
        requestAsync("POST", "/api/auth/login", payload, callback);
    }

    void signupAsync(String username, String password, ApiCallback callback) {
        JSONObject payload = new JSONObject();
        try {
            payload.put("username", username);
            payload.put("password", password);
        } catch (JSONException error) {
            callback.onError("Payload signup tidak valid: " + error.getMessage());
            return;
        }
        requestAsync("POST", "/api/auth/signup", payload, callback);
    }

    void bootstrapAsync(ApiCallback callback) {
        requestAsync("GET", "/api/bootstrap?scope=meta", null, callback);
    }

    void serviceSummaryAsync(ApiCallback callback) {
        requestAsync("GET", "/api/reports/service-summary", null, callback);
    }

    void carbonBrushStockAsync(ApiCallback callback) {
        requestAsync("GET", "/api/carbon-brush-stock", null, callback);
    }

    void mastersAsync(ApiCallback callback) {
        requestAsync("GET", "/api/masters", null, callback);
    }

    void usersAsync(ApiCallback callback) {
        requestAsync("GET", "/api/users", null, callback);
    }

    void updateUserRoleAsync(String username, String role, ApiCallback callback) {
        JSONObject payload = new JSONObject();
        try {
            payload.put("role", role);
        } catch (JSONException error) {
            callback.onError("Payload role tidak valid: " + error.getMessage());
            return;
        }
        requestAsync("PUT", "/api/users/" + urlEncode(username) + "/role", payload, callback);
    }

    void fetchItemsAsync(String resourceKey, ApiCallback callback) {
        fetchItemsAsync(resourceKey, "", callback);
    }

    void fetchItemsAsync(String resourceKey, String query, ApiCallback callback) {
        String normalizedResource = String.valueOf(resourceKey == null ? "" : resourceKey).trim();
        if (normalizedResource.length() == 0) {
            callback.onError("Resource item tidak valid");
            return;
        }
        String path = "/api/items/" + urlEncode(normalizedResource);
        String normalizedQuery = String.valueOf(query == null ? "" : query).trim();
        if (normalizedQuery.length() > 0) {
            path += "?" + normalizedQuery;
        }
        requestAsync("GET", path, null, callback);
    }

    void saveItemAsync(String resourceKey, JSONObject item, boolean editing, ApiCallback callback) {
        String normalizedResource = String.valueOf(resourceKey == null ? "" : resourceKey).trim();
        if (normalizedResource.length() == 0) {
            callback.onError("Resource item tidak valid");
            return;
        }
        String method = editing ? "PUT" : "POST";
        String path = "/api/items/" + normalizedResource;
        if (editing) {
            String itemId = item == null ? "" : item.optString("id", "");
            if (itemId.length() == 0) {
                callback.onError("ID item wajib ada untuk update");
                return;
            }
            path += "/" + urlEncode(itemId);
        }
        JSONObject payload = new JSONObject();
        try {
            payload.put("item", item == null ? new JSONObject() : item);
        } catch (JSONException error) {
            callback.onError("Payload item tidak valid: " + error.getMessage());
            return;
        }
        requestAsync(method, path, payload, callback);
    }

    // Private async request implementation
    private void requestAsync(String method, String path, JSONObject payload, ApiCallback callback) {
        try {
            Request.Builder requestBuilder = new Request.Builder()
                .url(baseUrl + path)
                .header("Accept", "application/json")
                .header("User-Agent", "PLIRM34-Native-Android");
            
            if (sessionCookie.length() > 0) {
                requestBuilder.header("Cookie", sessionCookie);
            }
            
            if (payload != null) {
                RequestBody body = RequestBody.create(
                    payload.toString().getBytes(StandardCharsets.UTF_8),
                    JSON
                );
                requestBuilder.method(method, body);
            } else {
                requestBuilder.method(method, null);
            }
            
            Request request = requestBuilder.build();
            
            httpClient.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    String errorMsg = e.getMessage();
                    if (errorMsg == null) {
                        errorMsg = "Network error occurred";
                    }
                    // Deliver error callback on main thread
                    new Handler(Looper.getMainLooper()).post(
                        () -> callback.onError(errorMsg)
                    );
                }
                
                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    try {
                        captureSessionCookie(response.headers());
                        String body = response.body() != null ? response.body().string() : "";
                        JSONObject json = body.length() > 0 ? new JSONObject(body) : new JSONObject();
                        
                        if (response.code() < 200 || response.code() >= 300) {
                            String message = json.optString("error", "HTTP " + response.code());
                            new Handler(Looper.getMainLooper()).post(
                                () -> callback.onError(message)
                            );
                        } else {
                            // Deliver success callback on main thread
                            new Handler(Looper.getMainLooper()).post(
                                () -> callback.onSuccess(json)
                            );
                        }
                    } catch (JSONException e) {
                        new Handler(Looper.getMainLooper()).post(
                            () -> callback.onError("Invalid JSON response: " + e.getMessage())
                        );
                    } finally {
                        response.close();
                    }
                }
            });
        } catch (Exception e) {
            callback.onError("Request setup failed: " + e.getMessage());
        }
    }

    private void captureSessionCookie(okhttp3.Headers headers) {
        String setCookie = headers.get("Set-Cookie");
        if (setCookie != null && setCookie.startsWith("plirm34_session=")) {
            int separator = setCookie.indexOf(';');
            sessionCookie = separator >= 0 ? setCookie.substring(0, separator) : setCookie;
        }
    }

    private String urlEncode(String value) throws IOException {
        try {
            return java.net.URLEncoder.encode(value, "UTF-8").replace("+", "%20");
        } catch (Exception error) {
            throw new IOException("Gagal encode URL", error);
        }
    }

    /**
     * Callback interface for async API requests
     */
    public interface ApiCallback {
        void onSuccess(JSONObject response);
        void onError(String errorMessage);
    }

    /**
     * Simple logging interceptor for debugging
     */
    static class LoggingInterceptor implements okhttp3.Interceptor {
        @Override
        public okhttp3.Response intercept(Chain chain) throws IOException {
            Request request = chain.request();
            long startTime = System.currentTimeMillis();
            okhttp3.Response response = chain.proceed(request);
            long duration = System.currentTimeMillis() - startTime;
            
            android.util.Log.d("PlirmAPI", String.format(
                "%s %s - %d ms",
                request.method(),
                request.url(),
                duration
            ));
            return response;
        }
    }
}
