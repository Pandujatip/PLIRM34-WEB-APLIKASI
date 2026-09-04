// PLIRM34 Android MainActivity - Async HTTP Usage Pattern
// File: MainActivity.java (Refactored sections)

package id.plirm34.nativeapp;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    private PlirmApiClient apiClient;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize API client with SSL pinning
        apiClient = new PlirmApiClient("https://plirm34tuban.id");
        progressBar = findViewById(R.id.progressBar);
        
        setupLoginUI();
    }

    // BEFORE: Synchronous (blocks UI thread)
    // private void login(String username, String password) {
    //     try {
    //         JSONObject response = apiClient.login(username, password);  // ❌ BLOCKS UI!
    //         handleLoginSuccess(response);
    //     } catch (Exception e) {
    //         showError(e.getMessage());
    //     }
    // }

    // AFTER: Asynchronous (non-blocking, responsive UI)
    private void login(String username, String password) {
        showProgress(true);
        apiClient.loginAsync(username, password, new PlirmApiClient.ApiCallback() {
            @Override
            public void onSuccess(JSONObject response) {
                showProgress(false);
                handleLoginSuccess(response);
            }

            @Override
            public void onError(String errorMessage) {
                showProgress(false);
                showError("Login gagal: " + errorMessage);
            }
        });
    }

    private void signup(String username, String password) {
        showProgress(true);
        apiClient.signupAsync(username, password, new PlirmApiClient.ApiCallback() {
            @Override
            public void onSuccess(JSONObject response) {
                showProgress(false);
                Toast.makeText(MainActivity.this, "Akun berhasil dibuat, silakan login", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onError(String errorMessage) {
                showProgress(false);
                showError("Signup gagal: " + errorMessage);
            }
        });
    }

    private void loadBootstrap() {
        showProgress(true);
        apiClient.bootstrapAsync(new PlirmApiClient.ApiCallback() {
            @Override
            public void onSuccess(JSONObject response) {
                showProgress(false);
                // Update UI with bootstrap data (masters, lookups, etc)
                updateUIWithBootstrap(response);
            }

            @Override
            public void onError(String errorMessage) {
                showProgress(false);
                showError("Bootstrap gagal: " + errorMessage);
            }
        });
    }

    private void loadItems(String resourceKey) {
        showProgress(true);
        apiClient.fetchItemsAsync(resourceKey, new PlirmApiClient.ApiCallback() {
            @Override
            public void onSuccess(JSONObject response) {
                showProgress(false);
                displayItems(response);
            }

            @Override
            public void onError(String errorMessage) {
                showProgress(false);
                showError("Gagal load data: " + errorMessage);
            }
        });
    }

    private void saveItem(String resourceKey, JSONObject item) {
        showProgress(true);
        boolean isEditing = item.has("id");
        apiClient.saveItemAsync(resourceKey, item, isEditing, new PlirmApiClient.ApiCallback() {
            @Override
            public void onSuccess(JSONObject response) {
                showProgress(false);
                Toast.makeText(MainActivity.this, 
                    isEditing ? "Data berhasil diupdate" : "Data berhasil disimpan", 
                    Toast.LENGTH_SHORT).show();
                // Refresh list
                loadItems(resourceKey);
            }

            @Override
            public void onError(String errorMessage) {
                showProgress(false);
                showError("Gagal simpan data: " + errorMessage);
            }
        });
    }

    // UI Helper Methods

    private void setupLoginUI() {
        // Find views
        EditText usernameInput = findViewById(R.id.username_input);
        EditText passwordInput = findViewById(R.id.password_input);

        findViewById(R.id.login_button).setOnClickListener(v -> {
            String username = usernameInput.getText().toString().trim();
            String password = passwordInput.getText().toString();

            if (username.isEmpty() || password.isEmpty()) {
                showError("Username dan password wajib diisi");
                return;
            }

            login(username, password);
        });

        findViewById(R.id.signup_button).setOnClickListener(v -> {
            String username = usernameInput.getText().toString().trim();
            String password = passwordInput.getText().toString();

            if (username.isEmpty() || password.isEmpty()) {
                showError("Username dan password wajib diisi");
                return;
            }

            signup(username, password);
        });
    }

    private void handleLoginSuccess(JSONObject response) {
        try {
            String token = response.optString("token", "");
            if (token.isEmpty()) {
                showError("Token tidak diterima dari server");
                return;
            }
            // Save token securely (use Android KeyStore, not SharedPreferences)
            Toast.makeText(this, "Login berhasil", Toast.LENGTH_SHORT).show();
            // Navigate to main screen
            loadBootstrap();
        } catch (Exception e) {
            showError("Login error: " + e.getMessage());
        }
    }

    private void updateUIWithBootstrap(JSONObject response) {
        // Process bootstrap data and update UI state
        try {
            JSONObject meta = response.optJSONObject("meta");
            if (meta != null) {
                String appVersion = meta.optString("version", "");
                // Update UI with app version, available features, etc
            }
        } catch (Exception e) {
            showError("Bootstrap error: " + e.getMessage());
        }
    }

    private void displayItems(JSONObject response) {
        try {
            // Parse and display items in ListView or RecyclerView
            // This is now called after async response, not blocking UI
        } catch (Exception e) {
            showError("Display error: " + e.getMessage());
        }
    }

    private void showProgress(boolean show) {
        progressBar.setVisibility(show ? android.view.View.VISIBLE : android.view.View.GONE);
    }

    private void showError(String message) {
        new AlertDialog.Builder(this)
            .setTitle("Error")
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show();
    }
}
