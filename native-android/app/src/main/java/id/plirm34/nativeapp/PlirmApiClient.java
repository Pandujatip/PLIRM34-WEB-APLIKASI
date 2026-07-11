package id.plirm34.nativeapp;

import org.json.JSONObject;
import org.json.JSONException;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

final class PlirmApiClient {
    private static final int CONNECT_TIMEOUT_MS = 12000;
    private static final int READ_TIMEOUT_MS = 20000;

    private final String baseUrl;
    private String sessionCookie = "";

    PlirmApiClient(String baseUrl) {
        String normalized = String.valueOf(baseUrl == null ? "" : baseUrl).trim();
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        this.baseUrl = normalized.length() > 0 ? normalized : "https://plirm34tuban.id";
    }

    String getBaseUrl() {
        return baseUrl;
    }

    JSONObject login(String username, String password) throws IOException {
        JSONObject payload = new JSONObject();
        try {
            payload.put("username", username);
            payload.put("password", password);
        } catch (JSONException error) {
            throw new IOException("Payload login tidak valid", error);
        }
        return request("POST", "/api/auth/login", payload);
    }

    JSONObject signup(String username, String password) throws IOException {
        JSONObject payload = new JSONObject();
        try {
            payload.put("username", username);
            payload.put("password", password);
        } catch (JSONException error) {
            throw new IOException("Payload signup tidak valid", error);
        }
        return request("POST", "/api/auth/signup", payload);
    }

    JSONObject bootstrap() throws IOException {
        return request("GET", "/api/bootstrap?scope=meta", null);
    }

    JSONObject serviceSummary() throws IOException {
        return request("GET", "/api/reports/service-summary", null);
    }

    JSONObject carbonBrushStock() throws IOException {
        return request("GET", "/api/carbon-brush-stock", null);
    }

    JSONObject masters() throws IOException {
        return request("GET", "/api/masters", null);
    }

    JSONObject users() throws IOException {
        return request("GET", "/api/users", null);
    }

    JSONObject updateUserRole(String username, String role) throws IOException {
        JSONObject payload = new JSONObject();
        try {
            payload.put("role", role);
        } catch (JSONException error) {
            throw new IOException("Payload role tidak valid", error);
        }
        return request("PUT", "/api/users/" + urlEncode(username) + "/role", payload);
    }

    JSONObject deleteUser(String username) throws IOException {
        return request("DELETE", "/api/users/" + urlEncode(username), null);
    }

    JSONObject whatsappBot() throws IOException {
        return request("GET", "/api/admin/whatsapp-bot", null);
    }

    JSONObject saveWhatsappBot(JSONObject payload) throws IOException {
        return request("POST", "/api/admin/whatsapp-bot", payload == null ? new JSONObject() : payload);
    }

    JSONObject resetWhatsappBotToken() throws IOException {
        return request("POST", "/api/admin/whatsapp-bot/reset-token", new JSONObject());
    }

    JSONObject adminMaster(String resourceName) throws IOException {
        return request("GET", "/api/admin/masters/" + urlEncode(resourceName), null);
    }

    JSONObject saveAdminMasterRecord(String resourceName, JSONObject item) throws IOException {
        JSONObject payload = new JSONObject();
        try {
            payload.put("item", item == null ? new JSONObject() : item);
        } catch (JSONException error) {
            throw new IOException("Payload master tidak valid", error);
        }
        return request("POST", "/api/admin/masters/" + urlEncode(resourceName), payload);
    }

    JSONObject deleteAdminMasterRecord(String resourceName, String identifier) throws IOException {
        return request("DELETE", "/api/admin/masters/" + urlEncode(resourceName) + "/" + urlEncode(identifier), null);
    }

    JSONObject saveCarbonBrushStockMovement(String stockKey, String movementType, int quantity, String note) throws IOException {
        JSONObject payload = new JSONObject();
        try {
            payload.put("stockKey", stockKey);
            payload.put("movementType", movementType);
            payload.put("quantity", quantity);
            payload.put("note", note == null ? "" : note);
        } catch (JSONException error) {
            throw new IOException("Payload stock tidak valid", error);
        }
        return request("POST", "/api/carbon-brush-stock/movement", payload);
    }

    JSONObject saveItem(String resourceKey, JSONObject item, boolean editing) throws IOException {
        String normalizedResource = String.valueOf(resourceKey == null ? "" : resourceKey).trim();
        if (normalizedResource.length() == 0) {
            throw new IOException("Resource item tidak valid");
        }
        String method = editing ? "PUT" : "POST";
        String path = "/api/items/" + normalizedResource;
        if (editing) {
            String itemId = item == null ? "" : item.optString("id", "");
            if (itemId.length() == 0) {
                throw new IOException("ID item wajib ada untuk update");
            }
            path += "/" + urlEncode(itemId);
        }
        JSONObject payload = new JSONObject();
        try {
            payload.put("item", item == null ? new JSONObject() : item);
        } catch (JSONException error) {
            throw new IOException("Payload item tidak valid", error);
        }
        return request(method, path, payload);
    }

    JSONObject fetchItems(String resourceKey) throws IOException {
        return fetchItems(resourceKey, "");
    }

    JSONObject fetchItems(String resourceKey, String query) throws IOException {
        String normalizedResource = String.valueOf(resourceKey == null ? "" : resourceKey).trim();
        if (normalizedResource.length() == 0) {
            throw new IOException("Resource item tidak valid");
        }
        String path = "/api/items/" + urlEncode(normalizedResource);
        String normalizedQuery = String.valueOf(query == null ? "" : query).trim();
        if (normalizedQuery.length() > 0) {
            path += "?" + normalizedQuery;
        }
        return request("GET", path, null);
    }

    JSONObject saveInspectionScheduleRealization(JSONObject payload) throws IOException {
        return request("POST", "/api/inspection-schedule/realization", payload == null ? new JSONObject() : payload);
    }

    private String urlEncode(String value) throws IOException {
        try {
            return java.net.URLEncoder.encode(value, "UTF-8").replace("+", "%20");
        } catch (Exception error) {
            throw new IOException("Gagal encode URL", error);
        }
    }

    private JSONObject request(String method, String path, JSONObject payload) throws IOException {
        HttpURLConnection connection = null;
        try {
            URL url = new URL(baseUrl + path);
            connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
            connection.setReadTimeout(READ_TIMEOUT_MS);
            connection.setRequestMethod(method);
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("User-Agent", "PLIRM34-Native-Android");
            if (sessionCookie.length() > 0) {
                connection.setRequestProperty("Cookie", sessionCookie);
            }
            if (payload != null) {
                byte[] bytes = payload.toString().getBytes(StandardCharsets.UTF_8);
                connection.setDoOutput(true);
                connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                connection.setRequestProperty("Content-Length", String.valueOf(bytes.length));
                OutputStream outputStream = connection.getOutputStream();
                try {
                    outputStream.write(bytes);
                } finally {
                    outputStream.close();
                }
            }

            int status = connection.getResponseCode();
            captureSessionCookie(connection.getHeaderFields());
            String body = readBody(connection, status);
            JSONObject json = body.length() > 0 ? new JSONObject(body) : new JSONObject();
            if (status < 200 || status >= 300) {
                String message = json.optString("error", "HTTP " + status);
                throw new IOException(message);
            }
            return json;
        } catch (org.json.JSONException error) {
            throw new IOException("Response JSON tidak valid", error);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private void captureSessionCookie(Map<String, List<String>> headers) {
        if (headers == null) {
            return;
        }
        List<String> values = null;
        for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
            if (entry.getKey() != null && "set-cookie".equalsIgnoreCase(entry.getKey())) {
                values = entry.getValue();
                break;
            }
        }
        if (values == null) {
            return;
        }
        for (String value : values) {
            if (value == null || !value.startsWith("plirm34_session=")) {
                continue;
            }
            int separator = value.indexOf(';');
            sessionCookie = separator >= 0 ? value.substring(0, separator) : value;
            return;
        }
    }

    private String readBody(HttpURLConnection connection, int status) throws IOException {
        java.io.InputStream stream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        if (stream == null) {
            return "";
        }
        if ("gzip".equalsIgnoreCase(connection.getContentEncoding())) {
            stream = new GZIPInputStream(stream);
        }
        BufferedInputStream inputStream = new BufferedInputStream(stream);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int read;
        try {
            while ((read = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, read);
            }
        } finally {
            inputStream.close();
        }
        return new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
    }
}
