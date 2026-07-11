package id.plirm34.nativeapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.FrameLayout;
import android.widget.GridLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.io.File;
import java.io.OutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.net.URL;
import java.net.URLEncoder;

public class MainActivity extends Activity {
    private static final String DEFAULT_BASE_URL = "https://plirm34tuban.id";

    private static final int BG = Color.rgb(5, 10, 12);
    private static final int SURFACE = Color.rgb(12, 20, 24);
    private static final int SURFACE_HIGH = Color.rgb(18, 29, 34);
    private static final int SURFACE_FLOAT = Color.rgb(23, 37, 43);
    private static final int BORDER = Color.rgb(45, 63, 70);
    private static final int BORDER_SOFT = Color.rgb(63, 84, 92);
    private static final int TEXT = Color.rgb(241, 247, 248);
    private static final int MUTED = Color.rgb(150, 168, 176);
    private static final int TEAL = Color.rgb(33, 201, 181);
    private static final int RED = Color.rgb(238, 84, 84);
    private static final int AMBER = Color.rgb(244, 177, 65);
    private static final int GREEN = Color.rgb(69, 203, 141);
    private static final int BLUE = Color.rgb(88, 166, 255);
    private static final int STEEL = Color.rgb(122, 144, 155);
    private static final int DANGER_SURFACE = Color.rgb(45, 21, 24);
    private static final int WARNING_SURFACE = Color.rgb(47, 34, 16);
    private static final int INFO_SURFACE = Color.rgb(7, 39, 45);
    private static final int AUTH_BG = BG;
    private static final int AUTH_SURFACE = SURFACE_HIGH;
    private static final int AUTH_INK = TEXT;
    private static final int AUTH_MUTED = MUTED;
    private static final int AUTH_BLUE = BLUE;
    private static final int AUTH_YELLOW = AMBER;

    private FrameLayout root;
    private LinearLayout appShell;
    private LinearLayout content;
    private EditText serverInput;
    private EditText usernameInput;
    private EditText passwordInput;
    private EditText fullNameInput;
    private TextView loginButton;
    private TextView loginStatus;
    private TextView headerTitle;
    private TextView headerSubtitle;
    private int selectedTab = 0;
    private boolean loading = false;
    private boolean signupMode = false;
    private Typeface appRegularTypeface;
    private Typeface appBoldTypeface;
    private Map<String, TextView> activeCarbonPointViews = new HashMap<String, TextView>();

    private PlirmApiClient apiClient;
    private JSONObject currentUser = new JSONObject();
    private JSONObject bootstrapPayload = new JSONObject();
    private JSONObject calendarPayload = new JSONObject();
    private JSONObject serviceSummaryPayload = new JSONObject();
    private JSONArray serviceItems = new JSONArray();
    private JSONArray negatifItems = new JSONArray();
    private JSONArray bomItems = new JSONArray();
    private JSONArray bomMotorItems = new JSONArray();
    private JSONArray sparepartItems = new JSONArray();
    private JSONArray spbItems = new JSONArray();
    private JSONArray userItems = new JSONArray();
    private JSONArray carbonStockItems = new JSONArray();
    private JSONArray carbonStockLogs = new JSONArray();
    private JSONArray carbonBrushAlerts = new JSONArray();
    private JSONArray equipmentReferenceItems = new JSONArray();
    private String dataStatus = "Data offline";
    private String moreScreen = "menu";
    private String selectedServiceFormType = "service-motor-mv-carbon-brush";
    private String serviceSearchQuery = "";
    private String serviceFilterStatus = "Semua";
    private String bomSearchQuery = "";
    private String bomFilterStatus = "Semua";
    private String sparepartSearchQuery = "";
    private String sparepartFilterStatus = "Semua";
    private String negatifSearchQuery = "";
    private String negatifFilterStatus = "Open";
    private String spbSearchQuery = "";
    private String userSearchQuery = "";
    private String equipmentSetupSearchQuery = "";
    private long lastSyncMillis = 0L;
    private int carbonBannerIndex = 0;
    private final Handler carbonBannerHandler = new Handler(Looper.getMainLooper());
    private final Handler searchDebounceHandler = new Handler(Looper.getMainLooper());
    private Runnable searchDebounceRunnable;
    private final Runnable carbonBannerRunnable = new Runnable() {
        @Override
        public void run() {
            rotateCarbonBanner();
        }
    };

    private interface SaveAction {
        boolean run();
    }

    private interface SearchCallback {
        void onChanged(String value);
    }

    private interface FilterCallback {
        void onSelected(String value);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(AUTH_BG);
        window.setNavigationBarColor(AUTH_BG);
        seedFallbackData();
        showLogin();
    }

    @Override
    protected void onDestroy() {
        stopCarbonBannerRotation();
        super.onDestroy();
    }

    private void showLogin() {
        signupMode = false;
        showAuth(false);
    }

    private void showAuth(final boolean signup) {
        signupMode = signup;
        getWindow().setStatusBarColor(AUTH_BG);
        getWindow().setNavigationBarColor(AUTH_BG);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(0);
        }
        root = new FrameLayout(this);
        root.setBackgroundColor(AUTH_BG);
        root.addView(authPattern(signup), matchMatch());
        ScrollView scroll = new ScrollView(this);
        LinearLayout page = column(20);
        page.setPadding(dp(24), systemTopInset() + dp(24), dp(24), systemBottomInset() + dp(24));
        scroll.addView(page, matchWrap());

        if (signup) {
            page.addView(authHeroBrand(true));
            LinearLayout signupCard = authPanel(20);
            page.addView(signupCard, topMargin(-1, dp(22)));
            signupCard.addView(authLabel("Buat Akun Field", 28, true));
            signupCard.addView(authText("Akun baru otomatis dibuat sebagai role Team.", 13, AUTH_MUTED), topMargin(-1, dp(6)));
            fullNameInput = authInput("NAMA LENGKAP", "Nama teknisi", false, true);
            signupCard.addView(fullNameInput, topMargin(-1, dp(18)));
            usernameInput = authInput("ID OPERATOR", "contoh: team.plirm34", false, true);
            signupCard.addView(usernameInput, topMargin(-1, dp(14)));
            LinearLayout passwordField = authPasswordField("KATA SANDI", "Minimal 6 karakter", true);
            signupCard.addView(passwordField, topMargin(-1, dp(14)));
            serverInput = new EditText(this);
            serverInput.setText(DEFAULT_BASE_URL);
            loginButton = authButton("DAFTAR");
            loginButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    submitAuth();
                }
            });
            signupCard.addView(loginButton, topMargin(-1, dp(22)));
            loginStatus = authStatus("Server production PLIRM34 siap.", AUTH_MUTED);
            signupCard.addView(loginStatus, topMargin(-1, dp(14)));
            page.addView(authSwitch("Sudah memiliki akun? ", "MASUK", false), topMargin(-1, dp(22)));
        } else {
            page.addView(authHeroBrand(false));
            LinearLayout hero = authHeroCard();
            page.addView(hero, topMargin(-1, dp(22)));
            LinearLayout form = authPanel(18);
            page.addView(form, topMargin(-1, dp(18)));
            usernameInput = authInput("USERNAME", "admin.plirm34", false, true);
            form.addView(usernameInput);
            LinearLayout passwordField = authPasswordField("PASSWORD", "Kata sandi", true);
            form.addView(passwordField, topMargin(-1, dp(14)));
            serverInput = new EditText(this);
            serverInput.setText(DEFAULT_BASE_URL);
            loginButton = authButton("MASUK");
            loginButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    submitAuth();
                }
            });
            form.addView(loginButton, topMargin(-1, dp(26)));
            loginStatus = authStatus("Masuk untuk sinkron data PLIRM34.", GREEN);
            form.addView(loginStatus, topMargin(-1, dp(16)));
            form.addView(authSwitch("Belum memiliki akses? ", "DAFTAR AKUN", true), topMargin(-1, dp(12)));
            TextView offline = authSecondaryButton("LIHAT DATA OFFLINE");
            offline.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dataStatus = "Data offline";
                    showApp();
                }
            });
            form.addView(offline, topMargin(-1, dp(20)));
            page.addView(authFooter(), topMargin(-1, dp(32)));
        }

        root.addView(scroll, matchMatch());
        root.setFocusableInTouchMode(true);
        root.requestFocus();
        setContentView(root);
    }

    private void showLegacyLogin() {
        root = new FrameLayout(this);
        root.setBackgroundColor(BG);
        ScrollView scroll = new ScrollView(this);
        LinearLayout page = column(20);
        page.setPadding(dp(24), dp(34), dp(24), dp(24));
        page.setGravity(Gravity.CENTER_HORIZONTAL);
        scroll.addView(page, matchWrap());

        page.addView(label("PLIRM34 FIELD APP", 12, MUTED, true));

        ImageView logo = new ImageView(this);
        logo.setImageResource(getResources().getIdentifier("plirm34_logo", "drawable", getPackageName()));
        logo.setScaleType(ImageView.ScaleType.CENTER_CROP);
        LinearLayout.LayoutParams logoLp = new LinearLayout.LayoutParams(dp(112), dp(112));
        logoLp.topMargin = dp(18);
        page.addView(logo, logoLp);

        TextView title = label("PLIRM34", 32, TEXT, true);
        title.setGravity(Gravity.CENTER);
        page.addView(title);

        TextView subtitle = label("Aplikasi native pekerja lapangan untuk dashboard, service, BOM, sparepart, dan stock carbon brush.", 14, MUTED, false);
        subtitle.setGravity(Gravity.CENTER);
        page.addView(subtitle, widthWrap(-1));

        LinearLayout card = card(16);
        LinearLayout.LayoutParams cardLp = new LinearLayout.LayoutParams(-1, -2);
        cardLp.topMargin = dp(18);
        page.addView(card, cardLp);
        card.addView(label("Masuk", 18, TEXT, true));
        serverInput = input("Server", false);
        serverInput.setText(DEFAULT_BASE_URL);
        card.addView(serverInput);
        usernameInput = input("Username", false);
        card.addView(usernameInput);
        passwordInput = input("Password", true);
        card.addView(passwordInput);
        loginButton = button("MASUK", false);
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginToServer();
            }
        });
        card.addView(loginButton, topMargin(-1, dp(14)));
        loginStatus = statusLine("Server: " + DEFAULT_BASE_URL, GREEN);
        card.addView(loginStatus, topMargin(-1, dp(12)));

        TextView offline = button("LIHAT DATA OFFLINE", true);
        offline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dataStatus = "Data offline";
                showApp();
            }
        });
        card.addView(offline, topMargin(-1, dp(10)));

        root.addView(scroll, matchMatch());
        setContentView(root);
    }

    private void loginToServer() {
        signupMode = false;
        submitAuth();
    }

    private void submitAuth() {
        if (loading) {
            return;
        }
        String baseUrlValue = textOf(serverInput);
        if (baseUrlValue.length() == 0) {
            baseUrlValue = DEFAULT_BASE_URL;
        }
        final String baseUrl = baseUrlValue;
        final String username = textOf(usernameInput);
        final String password = textOf(passwordInput);
        if (baseUrl.length() == 0 || username.length() == 0 || password.length() == 0) {
            setLoginStatus("Server, username, dan password wajib diisi.", RED);
            return;
        }
        if (signupMode && password.length() < 6) {
            setLoginStatus("Kata sandi minimal 6 karakter.", RED);
            return;
        }
        loading = true;
        loginButton.setText(signupMode ? "MENDAFTAR..." : "MEMPROSES...");
        setLoginStatus(signupMode ? "Membuat akun Team..." : "Login ke server PLIRM34...", AMBER);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    apiClient = new PlirmApiClient(baseUrl);
                    JSONObject login = signupMode ? apiClient.signup(username, password) : apiClient.login(username, password);
                    currentUser = login.optJSONObject("user") != null ? login.optJSONObject("user") : new JSONObject();
                    fetchLiveData();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            loading = false;
                            loginButton.setText(signupMode ? "DAFTAR" : "MASUK");
                            Toast.makeText(MainActivity.this, signupMode ? "Akun dibuat dan login berhasil" : "Login berhasil", Toast.LENGTH_SHORT).show();
                            showApp();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            loading = false;
                            loginButton.setText(signupMode ? "DAFTAR" : "MASUK");
                            setLoginStatus(error.getMessage() == null ? (signupMode ? "Signup gagal" : "Login gagal") : error.getMessage(), RED);
                        }
                    });
                }
            }
        }).start();
    }

    private void setLoginStatus(String message, int color) {
        if (loginStatus != null) {
            loginStatus.setText("*  " + message);
            loginStatus.setTextColor(color);
        }
    }

    private void showApp() {
        stopCarbonBannerRotation();
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(0);
        }
        root = new FrameLayout(this);
        root.setBackgroundColor(BG);
        appShell = column(0);
        root.addView(appShell, matchMatch());
        appShell.addView(header(), new LinearLayout.LayoutParams(-1, systemTopInset() + dp(66)));

        ScrollView scroll = new ScrollView(this);
        content = column(14);
        content.setPadding(dp(16), dp(18), dp(16), bottomNavHeight() + systemBottomInset() + dp(26));
        scroll.addView(content, matchWrap());
        appShell.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));

        root.addView(bottomNav(), bottomParams());
        setContentView(root);
        renderSelected();
    }

    private LinearLayout header() {
        LinearLayout header = row(10);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setPadding(dp(16), systemTopInset() + dp(5), dp(16), dp(5));
        header.setBackgroundColor(BG);
        ImageView logo = new ImageView(this);
        logo.setImageResource(getResources().getIdentifier("plirm34_logo", "drawable", getPackageName()));
        logo.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        logo.setBackground(rounded(SURFACE_FLOAT, BORDER_SOFT, 14));
        logo.setPadding(dp(6), dp(6), dp(6), dp(6));
        header.addView(logo, new LinearLayout.LayoutParams(dp(44), dp(44)));
        LinearLayout titleCol = column(1);
        headerTitle = label(titleForTab(), 18, TEXT, true);
        titleCol.addView(headerTitle);
        headerSubtitle = label(syncSubtitle(), 11, MUTED, false);
        titleCol.addView(headerSubtitle);
        header.addView(titleCol, new LinearLayout.LayoutParams(0, -2, 1));
        IconButton sync = iconButton("sync", TEAL, SURFACE_FLOAT, "Refresh data");
        sync.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                refreshLiveData();
            }
        });
        header.addView(sync, new LinearLayout.LayoutParams(dp(48), dp(48)));
        IconButton logout = iconButton("logout", RED, DANGER_SURFACE, "Logout");
        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirmLogout();
            }
        });
        header.addView(logout, new LinearLayout.LayoutParams(dp(48), dp(48)));
        return header;
    }

    private String titleForTab() {
        switch (selectedTab) {
            case 1:
                return "Service";
            case 2:
                return "BOM";
            case 3:
                return "Sparepart";
            case 4:
                return "More";
            default:
                return "PLIRM34 Tuban";
        }
    }

    private String syncSubtitle() {
        if (selectedTab == 0) {
            return "";
        }
        if (lastSyncMillis <= 0L) {
            return dataStatus;
        }
        return "Sync " + new SimpleDateFormat("dd MMM HH:mm", Locale("id", "ID")).format(new Date(lastSyncMillis));
    }

    private LinearLayout bottomNav() {
        LinearLayout nav = row(0);
        nav.setPadding(dp(8), dp(6), dp(8), dp(6));
        nav.setBackground(rounded(Color.rgb(9, 20, 24), BORDER, 22, 1));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            nav.setElevation(dp(12));
            nav.setTranslationZ(dp(8));
        }
        String[] labels = {"Dashboard", "Service", "BOM", "Sparepart", "More"};
        String[] icons = {"home", "service", "bom", "sparepart", "more"};
        for (int i = 0; i < labels.length; i++) {
            final int index = i;
            LinearLayout item = column(2);
            item.setGravity(Gravity.CENTER);
            item.setPadding(0, dp(4), 0, dp(4));
            item.setBackground(selectableBackground(selectedTab == i ? Color.rgb(16, 53, 58) : Color.TRANSPARENT, selectedTab == i ? TEAL : Color.TRANSPARENT, 18));
            IconGlyph navIcon = new IconGlyph(this, icons[i], selectedTab == i ? TEAL : MUTED);
            TextView navLabel = label(labels[i], 10, selectedTab == i ? TEXT : MUTED, true);
            navLabel.setGravity(Gravity.CENTER);
            item.addView(navIcon, new LinearLayout.LayoutParams(dp(26), dp(24)));
            item.addView(navLabel);
            item.setContentDescription(labels[i]);
            item.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedTab = index;
                    if (selectedTab != 4) {
                        moreScreen = "menu";
                    }
                    renderSelected();
                    root.removeViewAt(root.getChildCount() - 1);
                    root.addView(bottomNav(), bottomParams());
                }
            });
            nav.addView(item, new LinearLayout.LayoutParams(0, -1, 1));
        }
        return nav;
    }

    private FrameLayout.LayoutParams bottomParams() {
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(-1, bottomNavHeight());
        lp.gravity = Gravity.BOTTOM;
        lp.leftMargin = dp(14);
        lp.rightMargin = dp(14);
        lp.bottomMargin = systemBottomInset() + dp(10);
        return lp;
    }

    private int bottomNavHeight() {
        return dp(66);
    }

    private void renderSelected() {
        if (content == null) {
            return;
        }
        content.removeAllViews();
        switch (selectedTab) {
            case 1:
                renderService();
                break;
            case 2:
                renderBom();
                break;
            case 3:
                renderSparepart();
                break;
            case 4:
                renderMore();
                break;
            default:
                renderDashboard();
        }
        if (headerTitle != null) {
            headerTitle.setText(titleForTab());
        }
        if (headerSubtitle != null) {
            headerSubtitle.setText(syncSubtitle());
        }
    }

    private void renderDashboard() {
        content.addView(dashboardHero());

        List<JSONObject> alerts = buildCarbonAlerts();
        content.addView(sectionTitle("Carbon Brush Early Warning"));
        if (alerts.isEmpty()) {
            LinearLayout empty = emptyCard("Belum ada early warning", "Data muncul setelah service Carbon Brush memiliki measurement.");
            empty.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedTab = 1;
                    renderSelected();
                    refreshBottomNav();
                }
            });
            content.addView(empty);
        } else {
            int safeIndex = alerts.size() == 0 ? 0 : Math.abs(carbonBannerIndex) % alerts.size();
            content.addView(carbonAlertBanner(alerts.get(safeIndex), safeIndex + 1, alerts.size()));
            startCarbonBannerRotation(alerts.size());
        }

        content.addView(sectionTitle("Jadwal Inspeksi Hari Ini"));
        JSONArray today = calendarPayload.optJSONArray("today");
        if (today == null || today.length() == 0) {
            content.addView(emptyCard("Tidak ada jadwal hari ini", "Sinkron dari Google Calendar PLIRM34."));
        } else {
            for (int i = 0; i < Math.min(5, today.length()); i++) {
                final JSONObject item = today.optJSONObject(i);
                if (item != null) {
                    LinearLayout task = taskRow(item.optString("summary", "Jadwal inspeksi"), scheduleDetail(item), "KONFIRMASI", AMBER);
                    task.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            showScheduleDetail(item);
                        }
                    });
                    content.addView(task);
                }
            }
        }

        LinearLayout statsTop = row(8);
        statsTop.addView(statCard("Negatif Open", String.valueOf(countOpenNegatif()), countOpenNegatif() > 0 ? AMBER : GREEN), new LinearLayout.LayoutParams(0, -2, 1));
        statsTop.addView(statCard("Jadwal Hari Ini", String.valueOf(todayScheduleCount()), AMBER), new LinearLayout.LayoutParams(0, -2, 1));
        content.addView(statsTop);
        LinearLayout statsBottom = row(8);
        statsBottom.addView(statCard("Service", String.valueOf(serviceItems.length()), TEXT), new LinearLayout.LayoutParams(0, -2, 1));
        statsBottom.addView(statCard("Stock Low", String.valueOf(buildLowStockSpareparts().size() + countLowCarbonStock()), buildLowStockSpareparts().isEmpty() && countLowCarbonStock() == 0 ? GREEN : RED), new LinearLayout.LayoutParams(0, -2, 1));
        content.addView(statsBottom);

        content.addView(sectionTitle("Negatif List Open"));
        List<JSONObject> openNegatif = buildOpenNegatifList();
        if (openNegatif.isEmpty()) {
            content.addView(emptyCard("Tidak ada negatif list open", "Semua temuan negatif list sudah close atau belum sinkron."));
        } else {
            for (int i = 0; i < Math.min(3, openNegatif.size()); i++) {
                content.addView(negatifCard(openNegatif.get(i), true));
            }
        }

        content.addView(sectionTitle("Hasil Service Terakhir"));
        List<JSONObject> latestServices = sortByInspectionDate(serviceItems, false);
        if (latestServices.isEmpty()) {
            content.addView(emptyCard("Belum ada service", "Data service akan tampil setelah sinkron backend."));
        } else {
            for (int i = 0; i < Math.min(4, latestServices.size()); i++) {
                final JSONObject item = latestServices.get(i);
                content.addView(serviceResult(item, true));
            }
        }

        content.addView(sectionTitle("Alert Stok Sparepart"));
        List<JSONObject> lowStock = buildLowStockSpareparts();
        if (lowStock.isEmpty()) {
            content.addView(emptyCard("Belum ada alert stok", "Stock rendah akan tampil dari data sparepart."));
        } else {
            for (int i = 0; i < Math.min(3, lowStock.size()); i++) {
                final JSONObject item = lowStock.get(i);
                content.addView(sparepartSummaryCard(item, true));
            }
        }
    }

    private LinearLayout dashboardHero() {
        LinearLayout hero = actionCard(14);
        hero.setBackground(rounded(INFO_SURFACE, TEAL, 24, 1));
        String username = currentUser.optString("username", "offline");
        String role = currentUser.optString("role", "offline");
        hero.addView(rowBetween("PLIRM34 Tuban", badge(lastSyncMillis > 0 ? "LIVE" : "OFFLINE", lastSyncMillis > 0 ? TEAL : AMBER)));
        hero.addView(label("Prioritas inspeksi, service, negatif list, dan stok lapangan hari ini.", 14, TEXT, false), topMargin(-1, dp(10)));
        LinearLayout chips = row(8);
        chips.addView(metric("User", username), new LinearLayout.LayoutParams(0, -2, 1));
        chips.addView(metric("Role", role), new LinearLayout.LayoutParams(0, -2, 1));
        chips.addView(metric("Sync", lastSyncMillis > 0 ? new SimpleDateFormat("HH:mm", Locale("id", "ID")).format(new Date(lastSyncMillis)) : "-"), new LinearLayout.LayoutParams(0, -2, 1));
        hero.addView(chips, topMargin(-1, dp(14)));
        hero.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showStatusDetail();
            }
        });
        return hero;
    }

    private LinearLayout statusCard() {
        LinearLayout card = card(12);
        String username = currentUser.optString("username", "offline");
        String role = currentUser.optString("role", "offline");
        card.addView(rowBetween("Status Koneksi", badge(lastSyncMillis > 0 ? "LIVE" : "OFFLINE", lastSyncMillis > 0 ? TEAL : AMBER)));
        card.addView(label("User: " + username + " | Role: " + role, 12, MUTED, false), topMargin(-1, dp(6)));
        card.addView(label("Service " + serviceItems.length() + " | BOM " + (bomItems.length() + bomMotorItems.length()) + " | Sparepart " + sparepartItems.length() + " | Carbon Stock " + carbonStockItems.length(), 12, TEXT, false), topMargin(-1, dp(8)));
        return card;
    }

    private LinearLayout carbonAlertCard(JSONObject alert) {
        LinearLayout warning = card(12);
        int severity = statusSeverity(alert);
        int color = severity >= 3 ? RED : severity >= 1 ? AMBER : BLUE;
        warning.addView(rowBetween("Carbon Brush Early Warning", badge(alert.optString("status", "MONITOR"), color)));
        warning.addView(label(alert.optString("equipment", "-"), 22, TEXT, true), topMargin(-1, dp(10)));
        warning.addView(label("Titik " + alert.optString("point", "-") + " | ukuran terakhir " + alert.optString("valueText", "-") + " mm", 12, MUTED, false));
        LinearLayout metrics = row(8);
        metrics.addView(metric("Estimasi Ganti", alert.optString("estimate", "Histori kurang")), new LinearLayout.LayoutParams(0, -2, 1));
        metrics.addView(metric("Pengukuran", alert.optString("date", "-")), new LinearLayout.LayoutParams(0, -2, 1));
        metrics.addView(metric("Ukuran Min", alert.optString("valueText", "-") + " mm"), new LinearLayout.LayoutParams(0, -2, 1));
        warning.addView(metrics, topMargin(-1, dp(12)));
        warning.addView(label(alert.optString("note", "Prioritaskan saat rawmill/kiln off terdekat."), 12, TEXT, false), topMargin(-1, dp(10)));
        return warning;
    }

    private LinearLayout carbonAlertBanner(final JSONObject alert, int index, int total) {
        LinearLayout banner = actionCard(14);
        int severity = statusSeverity(alert);
        int color = severity >= 3 ? RED : severity >= 1 ? AMBER : BLUE;
        int surface = severity >= 3 ? DANGER_SURFACE : severity >= 1 ? WARNING_SURFACE : INFO_SURFACE;
        banner.setBackground(selectableBackground(surface, color, 24));
        banner.addView(rowBetween("Carbon Brush Early Warning", badge(index + "/" + total + "  " + alert.optString("status", "MONITOR"), color)));
        banner.addView(label(alert.optString("equipment", "-"), 24, TEXT, true), topMargin(-1, dp(10)));
        banner.addView(label("Estimasi penggantian: " + alert.optString("estimate", "Histori kurang"), 13, TEXT, true), topMargin(-1, dp(6)));
        banner.addView(label("Pengukuran terakhir: " + alert.optString("date", "-") + " | " + alert.optString("point", "-") + " = " + alert.optString("valueText", "-") + " mm", 12, MUTED, false), topMargin(-1, dp(6)));
        banner.addView(label(alert.optString("note", "Persiapkan sparepart dan jadwal shutdown terdekat."), 12, TEXT, false), topMargin(-1, dp(10)));
        banner.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                JSONObject service = findLatestServiceByEquipment("service-motor-mv-carbon-brush", alert.optString("equipment", ""));
                if (service != null) {
                    showServiceDetail(service);
                }
            }
        });
        return banner;
    }

    private void renderService() {
        content.addView(sectionTitle("Service"));
        content.addView(searchField("Cari equipment, kategori, tanggal, temuan", serviceSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(serviceSearchQuery)) {
                    return;
                }
                serviceSearchQuery = value;
                renderSelected();
            }
        }));
        content.addView(filterChips(serviceFilterStatus, new String[]{"Semua", "Hari Ini", "Carbon Brush", "Critical", "Dengan Temuan"}, new FilterCallback() {
            @Override
            public void onSelected(String value) {
                serviceFilterStatus = value;
                renderSelected();
            }
        }));
        JSONObject details = serviceSummaryPayload.optJSONObject("details");
        JSONObject carbonBrushSummary = details == null ? null : details.optJSONObject("carbonBrush");
        LinearLayout stats = row(8);
        stats.addView(statCard("TOTAL SERVICE", String.valueOf(serviceItems.length()), TEXT), new LinearLayout.LayoutParams(0, -2, 1));
        stats.addView(statCard("CARBON BRUSH", String.valueOf(carbonBrushSummary == null ? countByFormType("service-motor-mv-carbon-brush") : carbonBrushSummary.optInt("total", countByFormType("service-motor-mv-carbon-brush"))), AMBER), new LinearLayout.LayoutParams(0, -2, 1));
        content.addView(stats);

        content.addView(sectionTitle("Kategori Layanan"));
        content.addView(serviceCategoryDropdown());

        TextView add = button("+ INPUT " + serviceTitleForFormType(selectedServiceFormType).toUpperCase(Locale.ROOT), false);
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickServiceInput(selectedServiceFormType);
            }
        });
        content.addView(add, topMargin(-1, dp(10)));

        List<JSONObject> selectedItems = filterServiceItems(serviceItemsByFormType(selectedServiceFormType), serviceSearchQuery, serviceFilterStatus);
        if (!selectedItems.isEmpty()) {
            content.addView(sectionTitle("Terakhir " + serviceTitleForFormType(selectedServiceFormType)));
            for (int i = 0; i < Math.min(3, selectedItems.size()); i++) {
                final JSONObject item = selectedItems.get(i);
                content.addView(serviceResult(item, false));
            }
        }

        content.addView(sectionTitle("Hasil Service Terakhir"));
        List<JSONObject> latest = filterServiceItems(sortByInspectionDate(serviceItems, false), serviceSearchQuery, serviceFilterStatus);
        if (latest.isEmpty()) {
            content.addView(emptyCard("Service tidak ditemukan", "Ubah kata kunci atau filter untuk melihat data lain."));
            return;
        }
        for (int i = 0; i < Math.min(8, latest.size()); i++) {
            final JSONObject item = latest.get(i);
            content.addView(serviceResult(item, false));
        }
    }

    private void renderCarbonInputScreen() {
        selectedTab = 1;
        content.removeAllViews();
        content.addView(sectionTitle("Motor MV Carbon Brush"));
        LinearLayout head = actionCard(12);
        JSONObject latest = latestCarbonBrushService();
        String equipment = latest == null ? "Belum ada service carbon brush" : latest.optString("equipmentName", "-");
        head.addView(rowBetween(equipment, badge("INPUT NATIVE", BLUE)));
        JSONObject payload = latest == null ? new JSONObject() : latest.optJSONObject("payload");
        head.addView(label("Tanggal terakhir: " + formatDate(payload == null ? "" : payload.optString("inspectionDate", "")), 12, MUTED, false), topMargin(-1, dp(4)));
        head.addView(label("Tap untuk input service carbon brush baru.", 12, TEXT, false), topMargin(-1, dp(8)));
        head.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickServiceInput("service-motor-mv-carbon-brush");
            }
        });
        content.addView(head);
        content.addView(formCard("General Info", "Form menyimpan equipment, deskripsi, rekomendasi, tanggal, PIC, dan kategori service.", "Measurement detail A1-I9 terakhir tetap tampil untuk monitoring cepat.", "Stok carbon brush dapat ditambah atau dikoreksi dari tab Sparepart."));
        content.addView(sectionTitle("Measurement A1-I9"));
        content.addView(brushGrid(payload));
        content.addView(formCard("Titik Diganti", "Titik penggantian terakhir: " + joinArray(payload == null ? null : payload.optJSONArray("replacedPoints")), "Gunakan tombol input service untuk mencatat follow up dan rekomendasi baru."));
    }

    private void renderBom() {
        content.addView(sectionTitle("BOM"));
        content.addView(searchField("Cari equipment, SAP, material, manufacture", bomSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(bomSearchQuery)) {
                    return;
                }
                bomSearchQuery = value;
                renderSelected();
            }
        }));
        content.addView(filterChips(bomFilterStatus, new String[]{"Semua", "BOM General", "BOM Motor", "Ada Foto", "Tanpa Foto"}, new FilterCallback() {
            @Override
            public void onSelected(String value) {
                bomFilterStatus = value;
                renderSelected();
            }
        }));
        LinearLayout actions = row(8);
        TextView addBom = linkButton("+ Input BOM");
        addBom.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickBomInput(false);
            }
        });
        TextView addMotor = linkButton("+ Input Motor");
        addMotor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickBomInput(true);
            }
        });
        actions.addView(addBom, new LinearLayout.LayoutParams(0, dp(44), 1));
        actions.addView(addMotor, new LinearLayout.LayoutParams(0, dp(44), 1));
        content.addView(actions);
        List<JSONObject> generalBom = filterBomItems(toList(bomItems), false);
        List<JSONObject> motorBom = filterBomItems(toList(bomMotorItems), true);
        for (int i = 0; i < Math.min(8, generalBom.size()); i++) {
            content.addView(bomCard(generalBom.get(i), false));
        }
        for (int i = 0; i < Math.min(8, motorBom.size()); i++) {
            content.addView(bomCard(motorBom.get(i), true));
        }
        if (generalBom.isEmpty() && motorBom.isEmpty()) {
            content.addView(emptyCard("BOM tidak ditemukan", "Ubah kata kunci atau filter untuk melihat data lain."));
        }
    }

    private void renderSparepart() {
        content.addView(sectionTitle("Katalog Sparepart"));
        content.addView(searchField("Cari SAP, nama, equipment, lokasi", sparepartSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(sparepartSearchQuery)) {
                    return;
                }
                sparepartSearchQuery = value;
                renderSelected();
            }
        }));
        content.addView(filterChips(sparepartFilterStatus, new String[]{"Semua", "Kritis", "Stok Rendah", "Normal", "Electrical", "Mechanical", "Carbon Brush"}, new FilterCallback() {
            @Override
            public void onSelected(String value) {
                sparepartFilterStatus = value;
                renderSelected();
            }
        }));
        TextView add = linkButton("+ Input Sparepart");
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickSparepartInput();
            }
        });
        content.addView(add);
        List<JSONObject> filteredSpareparts = filterSparepartItems(toList(sparepartItems), sparepartSearchQuery, sparepartFilterStatus);
        for (int i = 0; i < Math.min(10, filteredSpareparts.size()); i++) {
            content.addView(sparepartSummaryCard(filteredSpareparts.get(i), false));
        }
        if (filteredSpareparts.isEmpty()) {
            content.addView(emptyCard("Sparepart tidak ditemukan", "Ubah kata kunci atau filter untuk melihat data lain."));
        }

        content.addView(sectionTitle("Stock Carbon Brush"));
        if (carbonStockItems.length() == 0) {
            content.addView(emptyCard("Stock Carbon Brush kosong", "Data stock akan tampil setelah login live."));
        }
        for (int i = 0; i < carbonStockItems.length(); i++) {
            JSONObject item = carbonStockItems.optJSONObject(i);
            if (item != null) {
                content.addView(carbonStockCard(item));
            }
        }

        content.addView(sectionTitle("Riwayat Mutasi"));
        if (carbonStockLogs.length() == 0) {
            content.addView(emptyCard("Belum ada mutasi", "Log masuk, keluar, dan koreksi akan tampil di sini."));
        }
        for (int i = 0; i < Math.min(8, carbonStockLogs.length()); i++) {
            JSONObject item = carbonStockLogs.optJSONObject(i);
            if (item != null) {
                content.addView(mutation(
                        item.optString("brushName", item.optString("stockKey", "-")),
                        mutationText(item),
                        item.optString("source", "-") + " | " + formatDate(item.optString("createdAt", "")),
                        item.optInt("quantityDelta", 0) < 0 ? RED : GREEN
                ));
            }
        }
    }

    private void renderMore() {
        if ("negatif".equals(moreScreen)) {
            renderNegatifList();
            return;
        }
        if ("spb".equals(moreScreen)) {
            renderSpb();
            return;
        }
        if ("users".equals(moreScreen)) {
            renderUsers();
            return;
        }

        content.addView(sectionTitle("Menu Lainnya"));
        GridLayout grid = new GridLayout(this);
        grid.setColumnCount(2);
        grid.setUseDefaultMargins(false);
        grid.addView(moduleThumbnail("Negatif List", countOpenNegatif() + " open", "Temuan pending", AMBER, "service", "negatif"), thumbnailParams(0));
        grid.addView(moduleThumbnail("SPB", spbItems.length() + " item", "PR, PO, reservasi", BLUE, "bom", "spb"), thumbnailParams(1));
        grid.addView(moduleThumbnail("User", currentUser.optString("role", "").equals("admin") ? userItems.length() + " akun" : "Admin only", "Role dan setup", GREEN, "user", "users"), thumbnailParams(0));
        grid.addView(moduleThumbnail("Refresh", lastSyncMillis <= 0L ? "Tarik data" : "Live sync", syncSubtitle(), TEAL, "sync", "refresh"), thumbnailParams(1));
        content.addView(grid, new LinearLayout.LayoutParams(-1, -2));
        content.addView(statusCard());
    }

    private GridLayout.LayoutParams thumbnailParams(int column) {
        GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
        lp.width = 0;
        lp.height = dp(152);
        lp.columnSpec = GridLayout.spec(column, 1f);
        lp.setMargins(column == 0 ? 0 : dp(6), 0, column == 0 ? dp(6) : 0, dp(12));
        return lp;
    }

    private LinearLayout moduleThumbnail(String title, String meta, String desc, int color, String iconName, final String target) {
        LinearLayout card = actionCard(12);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setGravity(Gravity.TOP);
        card.setPadding(dp(12), dp(12), dp(12), dp(12));
        LinearLayout top = row(8);
        top.setGravity(Gravity.CENTER_VERTICAL);
        top.addView(iconTile(iconName, color), new LinearLayout.LayoutParams(dp(44), dp(44)));
        top.addView(badge(meta == null || meta.length() == 0 ? "-" : meta, color), new LinearLayout.LayoutParams(0, -2, 1));
        card.addView(top);
        TextView titleView = label(title, 15, TEXT, true);
        titleView.setMaxLines(2);
        card.addView(titleView, topMargin(-1, dp(12)));
        TextView descView = label(desc == null || desc.length() == 0 ? "-" : desc, 11, MUTED, false);
        descView.setMaxLines(2);
        card.addView(descView, topMargin(-1, dp(4)));
        TextView open = label("Buka", 12, color, true);
        open.setGravity(Gravity.BOTTOM | Gravity.RIGHT);
        card.addView(open, new LinearLayout.LayoutParams(-1, 0, 1));
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if ("refresh".equals(target)) {
                    refreshLiveData();
                    return;
                }
                moreScreen = target;
                renderSelected();
            }
        });
        return card;
    }

    private void renderNegatifList() {
        content.addView(backRow("Negatif List", "Open " + countOpenNegatif() + " dari " + negatifItems.length()));
        content.addView(searchField("Cari equipment, kerusakan, mark, area", negatifSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(negatifSearchQuery)) {
                    return;
                }
                negatifSearchQuery = value;
                renderSelected();
            }
        }));
        content.addView(filterChips(negatifFilterStatus, new String[]{"Open", "Tunggu RM Off", "Kiln Off", "Sparepart", "Close", "Semua"}, new FilterCallback() {
            @Override
            public void onSelected(String value) {
                negatifFilterStatus = value;
                renderSelected();
            }
        }));
        TextView add = linkButton("+ Input Negatif List");
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickNegatifInput();
            }
        });
        content.addView(add);
        List<JSONObject> openItems = filterNegatifItems(toList(negatifItems), negatifSearchQuery, negatifFilterStatus);
        if (openItems.isEmpty()) {
            content.addView(emptyCard("Negatif list tidak ditemukan", "Ubah kata kunci atau filter untuk melihat data lain."));
        }
        for (int i = 0; i < Math.min(30, openItems.size()); i++) {
            content.addView(negatifCard(openItems.get(i), false));
        }
    }

    private void renderSpb() {
        content.addView(backRow("SPB", spbItems.length() + " item"));
        content.addView(searchField("Cari material, stock no, PR, PO, reservasi", spbSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(spbSearchQuery)) {
                    return;
                }
                spbSearchQuery = value;
                renderSelected();
            }
        }));
        TextView add = linkButton("+ Input SPB");
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickSpbInput();
            }
        });
        content.addView(add);
        List<JSONObject> filteredSpb = filterByQuery(toList(spbItems), spbSearchQuery, new String[]{"materialDescription", "stockNo", "prNo", "poNo", "reservationNo", "notificationNo", "note"});
        if (filteredSpb.isEmpty()) {
            content.addView(emptyCard("SPB tidak ditemukan", "Data SPB akan tampil setelah login live atau ubah kata kunci."));
        }
        for (int i = 0; i < Math.min(30, filteredSpb.size()); i++) {
            content.addView(spbCard(filteredSpb.get(i)));
        }
    }

    private void renderUsers() {
        content.addView(backRow("Manajemen User", userItems.length() + " user"));
        if (!"admin".equalsIgnoreCase(currentUser.optString("role", ""))) {
            content.addView(emptyCard("Admin only", "Manajemen user hanya tampil lengkap untuk role admin."));
            return;
        }
        if (userItems.length() == 0) {
            content.addView(emptyCard("User kosong", "Daftar user belum ikut dari bootstrap."));
        }
        content.addView(sectionTitle("Setup Admin"));
        GridLayout setupGrid = new GridLayout(this);
        setupGrid.setColumnCount(2);
        setupGrid.setUseDefaultMargins(false);
        setupGrid.addView(setupThumbnail("WhatsApp Bot", "Kirim otomatis", "Group, jadwal, token", TEAL, "whatsapp", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showWhatsappSetupDialog();
            }
        }), thumbnailParams(0));
        setupGrid.addView(setupThumbnail("Master Equipment", equipmentReferenceItems.length() + " item", "Referensi form service", BLUE, "equipment", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showMasterEquipmentDialog();
            }
        }), thumbnailParams(1));
        content.addView(setupGrid, new LinearLayout.LayoutParams(-1, -2));
        content.addView(sectionTitle("User"));
        content.addView(searchField("Cari username atau role", userSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(userSearchQuery)) {
                    return;
                }
                userSearchQuery = value;
                renderSelected();
            }
        }));
        List<JSONObject> filteredUsers = filterByQuery(toList(userItems), userSearchQuery, new String[]{"username", "role", "createdAt"});
        for (int i = 0; i < filteredUsers.size(); i++) {
            content.addView(userCard(filteredUsers.get(i)));
        }
    }

    private LinearLayout setupThumbnail(String title, String meta, String desc, int color, String iconName, View.OnClickListener listener) {
        LinearLayout card = moduleThumbnail(title, meta, desc, color, iconName, "");
        card.setOnClickListener(listener);
        return card;
    }

    private LinearLayout backRow(String title, String meta) {
        LinearLayout row = actionCard(10);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        TextView back = icon("<", 20);
        row.addView(back, new LinearLayout.LayoutParams(dp(42), dp(42)));
        LinearLayout col = column(1);
        col.addView(label(title, 16, TEXT, true));
        col.addView(label(meta, 11, MUTED, false));
        row.addView(col, new LinearLayout.LayoutParams(0, -2, 1));
        row.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                moreScreen = "menu";
                renderSelected();
            }
        });
        return row;
    }

    private void serviceCategory(String title, String desc, String count, int color) {
        final String formType = formTypeForServiceTitle(title);
        LinearLayout row = actionCard(10);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.addView(iconTile("service", color), new LinearLayout.LayoutParams(dp(40), dp(44)));
        LinearLayout textCol = column(2);
        textCol.addView(label(title, 14, TEXT, true));
        textCol.addView(label(desc, 11, MUTED, false));
        row.addView(textCol, new LinearLayout.LayoutParams(0, -2, 1));
        row.addView(badge(count, color));
        row.addView(label(">", 24, MUTED, false), new LinearLayout.LayoutParams(dp(24), -2));
        row.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showServiceCategorySheet(formType);
            }
        });
        content.addView(row);
    }

    private LinearLayout serviceCategoryDropdown() {
        final String selectedTitle = serviceTitleForFormType(selectedServiceFormType);
        LinearLayout box = actionCard(12);
        box.setOrientation(LinearLayout.HORIZONTAL);
        box.setGravity(Gravity.CENTER_VERTICAL);
        box.addView(iconTile("service", BLUE), new LinearLayout.LayoutParams(dp(46), dp(46)));
        LinearLayout col = column(2);
        col.addView(label(selectedTitle, 15, TEXT, true));
        col.addView(label(serviceDescriptionForFormType(selectedServiceFormType) + " | " + countByFormType(selectedServiceFormType) + " item", 11, MUTED, false));
        box.addView(col, new LinearLayout.LayoutParams(0, -2, 1));
        box.addView(label("PILIH", 11, AMBER, true), new LinearLayout.LayoutParams(dp(54), -2));
        box.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showServiceCategoryPicker();
            }
        });
        return box;
    }

    private void showServiceCategoryPicker() {
        final String[] formTypes = serviceFormTypes();
        final AlertDialog[] dialogRef = new AlertDialog[1];
        LinearLayout body = dialogBody();
        body.addView(label("Pilih Kategori Layanan", 18, TEXT, true));
        for (int i = 0; i < formTypes.length; i++) {
            final String formType = formTypes[i];
            boolean active = formType.equals(selectedServiceFormType);
            TextView row = label(serviceTitleForFormType(formType) + "  (" + countByFormType(formType) + ")", 14, active ? Color.rgb(3, 24, 27) : TEXT, true);
            row.setGravity(Gravity.CENTER_VERTICAL);
            row.setPadding(dp(14), 0, dp(14), 0);
            row.setBackground(selectableBackground(active ? TEAL : SURFACE_HIGH, active ? TEAL : BORDER_SOFT, 14));
            row.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedServiceFormType = formType;
                    if (dialogRef[0] != null) {
                        dialogRef[0].dismiss();
                    }
                    renderSelected();
                }
            });
            body.addView(row, topMargin(-1, dp(8), dp(48)));
        }
        dialogRef[0] = buildActionDialog("Kategori Service", body, "Tutup", "Tutup", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
            }
        });
        dialogRef[0].show();
    }

    private LinearLayout taskRow(String code, String desc, String status, int color) {
        LinearLayout row = actionCard(10);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout textCol = column(2);
        textCol.addView(label(code, 14, TEXT, true));
        textCol.addView(label(desc, 11, MUTED, false));
        row.addView(textCol, new LinearLayout.LayoutParams(0, -2, 1));
        row.addView(badge(status, color));
        TextView arrow = label(">", 18, MUTED, true);
        arrow.setGravity(Gravity.CENTER);
        row.addView(arrow, new LinearLayout.LayoutParams(dp(20), -2));
        return row;
    }

    private LinearLayout serviceResult(final JSONObject item, boolean compact) {
        JSONObject payload = item.optJSONObject("payload");
        final String formType = item.optString("formType", "");
        String code = item.optString("equipmentName", "-");
        String category = item.optString("subtype", item.optString("type", "-"));
        String date = formatDate(payload == null ? "" : payload.optString("inspectionDate", ""));
        String status = item.optString("type", "SERVICE").toUpperCase(Locale.ROOT);
        String finding = item.optString("detail", item.optString("description", "-"));
        LinearLayout card = actionCard(10);
        card.addView(rowBetween(code + "  |  " + category, badge(status, GREEN)));
        card.addView(label(date, 11, MUTED, false), topMargin(-1, dp(4)));
        card.addView(label(finding, 12, TEXT, false), topMargin(-1, dp(6)));
        LinearLayout actions = row(8);
        TextView send = smallActionButton("Kirim WA", GREEN);
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareServiceToWhatsApp(item);
            }
        });
        TextView edit = smallActionButton("Edit", BLUE);
        edit.setEnabled(!"service-motor-mso".equals(formType));
        edit.setAlpha("service-motor-mso".equals(formType) ? 0.45f : 1f);
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if ("service-motor-mso".equals(formType)) {
                    Toast.makeText(MainActivity.this, "Data MSO hanya bisa diedit dari sumber MSO.", Toast.LENGTH_SHORT).show();
                    return;
                }
                showQuickServiceInput(formType.length() == 0 ? "service-dcs" : formType, item);
            }
        });
        actions.addView(send, new LinearLayout.LayoutParams(0, dp(44), 1));
        actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
        card.addView(actions, topMargin(-1, dp(10)));
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showServiceDetail(item);
            }
        });
        return card;
    }

    private LinearLayout bomCard(final JSONObject item, final boolean motor) {
        String code = item.optString("equipment", "-");
        String name = motor ? item.optString("manufacture", "-") : item.optString("part", item.optString("materialDescription", "-"));
        String status = motor ? "MOTOR" : "BOM";
        int color = motor ? GREEN : BLUE;
        String sap = item.optString("stockNo", "-");
        String qty = motor ? item.optString("materialDescription", "-") : item.optString("qty", "-");
        String make = motor ? item.optString("power", "-") + " kW" : item.optString("materialDescription", "-");
        String power = motor ? item.optString("ampere", "-") + " A" : item.optString("note", "-");
        String amp = motor ? item.optString("speed", "-") + " RPM" : "General";
        String speed = motor ? item.optString("frame", "-") : item.optString("longText", "-");
        LinearLayout card = actionCard(12);
        card.addView(rowBetween(code, badge(status, color)));
        card.addView(bomPhotoStrip(item, motor), topMargin(-1, dp(10)));
        card.addView(label(name, 12, MUTED, false), topMargin(-1, dp(4)));
        LinearLayout stock = row(8);
        stock.addView(metric("No Stock SAP", sap), new LinearLayout.LayoutParams(0, -2, 1));
        stock.addView(metric("Qty/Material", qty), new LinearLayout.LayoutParams(0, -2, 1));
        card.addView(stock, topMargin(-1, dp(10)));
        card.addView(label("Data Teknis", 12, TEXT, true), topMargin(-1, dp(10)));
        GridLayout grid = new GridLayout(this);
        grid.setColumnCount(2);
        grid.addView(metric("Manufacture/Desc", make), new ViewGroup.LayoutParams(dp(150), -2));
        grid.addView(metric("Power/Note", power), new ViewGroup.LayoutParams(dp(150), -2));
        grid.addView(metric("Ampere/Type", amp), new ViewGroup.LayoutParams(dp(150), -2));
        grid.addView(metric("Speed/Frame", speed), new ViewGroup.LayoutParams(dp(150), -2));
        card.addView(grid);
        LinearLayout actions = row(8);
        TextView edit = smallActionButton("Edit", BLUE);
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickBomInput(motor, item);
            }
        });
        actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
        card.addView(actions, topMargin(-1, dp(10)));
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showBomDetail(item, motor);
            }
        });
        return card;
    }

    private LinearLayout bomPhotoStrip(JSONObject item, boolean motor) {
        LinearLayout strip = row(8);
        if (motor) {
            strip.addView(bomPhotoTile("Foto Motor", item.optString("motorPhoto", ""), true), new LinearLayout.LayoutParams(0, dp(92), 1));
            strip.addView(bomPhotoTile("Nameplate", item.optString("nameplatePhoto", ""), true), new LinearLayout.LayoutParams(0, dp(92), 1));
            strip.addView(bomPhotoTile("Koneksi", item.optString("connectionPhoto", ""), true), new LinearLayout.LayoutParams(0, dp(92), 1));
        } else {
            strip.addView(bomPhotoTile("Foto Barang", item.optString("itemPhoto", ""), false), new LinearLayout.LayoutParams(0, dp(92), 1));
            strip.addView(bomPhotoTile("Nameplate", item.optString("nameplatePhoto", ""), false), new LinearLayout.LayoutParams(0, dp(92), 1));
            strip.addView(bomPhotoTile("Foto Lain", item.optString("extraPhoto", ""), false), new LinearLayout.LayoutParams(0, dp(92), 1));
        }
        return strip;
    }

    private FrameLayout bomPhotoTile(String title, String filename, boolean motor) {
        FrameLayout frame = new FrameLayout(this);
        frame.setBackground(rounded(Color.rgb(48, 50, 50), BORDER, 6));
        TextView placeholder = label((title + "\n" + (normalizePhotoName(filename).length() == 0 ? "Belum ada" : normalizePhotoName(filename))), 10, TEXT, true);
        placeholder.setGravity(Gravity.CENTER);
        placeholder.setPadding(dp(6), dp(4), dp(6), dp(4));
        frame.addView(placeholder, matchMatch());
        String url = buildBomPhotoUrl(filename, motor);
        if (url.length() > 0) {
            ImageView image = new ImageView(this);
            image.setScaleType(ImageView.ScaleType.CENTER_CROP);
            image.setContentDescription(title);
            frame.addView(image, matchMatch());
            loadImageAsync(image, url);
        }
        return frame;
    }

    private String buildBomPhotoUrl(String filename, boolean motor) {
        String normalized = normalizePhotoName(filename);
        if (normalized.length() == 0 || apiClient == null) {
            return "";
        }
        try {
            return apiClient.getBaseUrl() + (motor ? "/bom-motor-images/" : "/bom-images/") + URLEncoder.encode(normalized, "UTF-8").replace("+", "%20");
        } catch (Exception error) {
            return "";
        }
    }

    private String normalizePhotoName(String filename) {
        String raw = String.valueOf(filename == null ? "" : filename).trim();
        if (raw.length() == 0) {
            return "";
        }
        raw = raw.replace("\\", "/");
        int slash = raw.lastIndexOf('/');
        return slash >= 0 ? raw.substring(slash + 1) : raw;
    }

    private void loadImageAsync(final ImageView target, final String url) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                InputStream stream = null;
                try {
                    stream = new URL(url).openStream();
                    final Bitmap bitmap = BitmapFactory.decodeStream(stream);
                    if (bitmap != null) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                target.setImageBitmap(bitmap);
                            }
                        });
                    }
                } catch (Exception ignored) {
                } finally {
                    if (stream != null) {
                        try {
                            stream.close();
                        } catch (Exception ignored) {
                        }
                    }
                }
            }
        }).start();
    }

    private LinearLayout sparepartSummaryCard(final JSONObject item, boolean compact) {
        String condition = item.optString("condition", "NORMAL");
        int color = condition.toUpperCase(Locale.ROOT).contains("KOSONG") ? RED : condition.toUpperCase(Locale.ROOT).contains("RENDAH") ? AMBER : GREEN;
        LinearLayout card = actionCard(12);
        card.addView(rowBetween("SAP ID " + item.optString("code", "-"), badge(condition.length() == 0 ? "NORMAL" : condition.toUpperCase(Locale.ROOT), color)));
        card.addView(label(item.optString("name", "-"), 14, TEXT, true), topMargin(-1, dp(4)));
        LinearLayout values = row(8);
        values.addView(metric("Stok Saat Ini", item.optString("qty", "-")), new LinearLayout.LayoutParams(0, -2, 1));
        values.addView(metric("Lokasi", item.optString("location", "-")), new LinearLayout.LayoutParams(0, -2, 1));
        card.addView(values, topMargin(-1, dp(10)));
        if (!compact) {
            card.addView(label("Kategori: " + item.optString("category", "-"), 11, MUTED, false), topMargin(-1, dp(10)));
        }
        LinearLayout actions = row(8);
        TextView edit = smallActionButton("Edit", BLUE);
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickSparepartInput(item);
            }
        });
        actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
        card.addView(actions, topMargin(-1, dp(10)));
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showSparepartDetail(item);
            }
        });
        return card;
    }

    private LinearLayout carbonStockCard(final JSONObject item) {
        final String stockKey = item.optString("stockKey", "");
        int stock = item.optInt("currentStock", 0);
        int color = stock <= 0 ? RED : stock <= 10 ? AMBER : GREEN;
        LinearLayout card = actionCard(12);
        card.addView(rowBetween(item.optString("brushName", "-"), badge(stock <= 0 ? "KOSONG" : stock <= 10 ? "LOW STOCK" : "READY", color)));
        card.addView(label("SAP: " + item.optString("sapNo", "-"), 11, MUTED, false));
        card.addView(label("Equipment: " + item.optString("useLabel", "-"), 11, MUTED, false), topMargin(-1, dp(8)));
        card.addView(label(String.valueOf(stock), 26, color == RED ? RED : TEXT, true), topMargin(-1, dp(8)));
        card.addView(label("Stok Saat Ini", 11, MUTED, false));
        LinearLayout actions = row(8);
        TextView add = button("+ Tambah", true);
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showStockMovementDialog(item, "in");
            }
        });
        TextView adjust = button("Koreksi", true);
        adjust.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showStockMovementDialog(item, "adjust");
            }
        });
        actions.addView(add, new LinearLayout.LayoutParams(0, dp(44), 1));
        actions.addView(adjust, new LinearLayout.LayoutParams(0, dp(44), 1));
        card.addView(actions, topMargin(-1, dp(10)));
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showCarbonStockDetail(item);
            }
        });
        card.setTag(stockKey);
        return card;
    }

    private void showStockMovementDialog(final JSONObject item, final String movementType) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk mutasi stok.", Toast.LENGTH_LONG).show();
            return;
        }
        LinearLayout form = quickFormBody(movementType.equals("adjust") ? "Koreksi Stock Carbon Brush" : "Tambah Stock Carbon Brush");
        final EditText qty = lightInput(movementType.equals("adjust") ? "Stok final" : "Qty masuk");
        qty.setInputType(InputType.TYPE_CLASS_NUMBER);
        final EditText note = lightInput("Catatan");
        form.addView(label(item.optString("brushName", "-") + " | stock sekarang " + item.optInt("currentStock", 0), 13, TEXT, true), topMargin(-1, dp(8)));
        form.addView(qty);
        form.addView(note);
        final AlertDialog dialog = buildActionDialog(movementType.equals("adjust") ? "Koreksi Stock" : "Tambah Stock", form, "Batal", "Simpan", new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String qtyText = textOf(qty);
                        if (qtyText.length() == 0) {
                            Toast.makeText(MainActivity.this, "Qty wajib diisi", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        try {
                            int quantity = Integer.parseInt(qtyText);
                            Object tag = v.getTag();
                            if (tag instanceof AlertDialog) {
                                ((AlertDialog) tag).dismiss();
                            }
                            saveStockMovement(item.optString("stockKey", ""), movementType, quantity, textOf(note));
                        } catch (NumberFormatException error) {
                            Toast.makeText(MainActivity.this, "Qty wajib angka", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
        dialog.show();
    }

    private void saveStockMovement(final String stockKey, final String movementType, final int quantity, final String note) {
        Toast.makeText(this, "Menyimpan mutasi stok...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject response = apiClient.saveCarbonBrushStockMovement(stockKey, movementType, quantity, note);
                    carbonStockItems = response.optJSONArray("items") != null ? response.optJSONArray("items") : carbonStockItems;
                    carbonStockLogs = response.optJSONArray("logs") != null ? response.optJSONArray("logs") : carbonStockLogs;
                    carbonBrushAlerts = response.optJSONArray("alerts") != null ? response.optJSONArray("alerts") : carbonBrushAlerts;
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Mutasi stok tersimpan", Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal menyimpan stok" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void showServiceCategorySheet(final String formType) {
        final List<JSONObject> items = serviceItemsByFormType(formType);
        LinearLayout body = dialogBody();
        String title = serviceTitleForFormType(formType);
        body.addView(label(title, 17, TEXT, true));
        body.addView(label(items.size() + " hasil service tersimpan. Field inti mengikuti format service PLIRM34.", 13, MUTED, false), topMargin(-1, dp(6)));
        TextView input = dialogAction("Input Service Baru");
        body.addView(input, topMargin(-1, dp(12)));
        for (int i = 0; i < Math.min(5, items.size()); i++) {
            JSONObject item = items.get(i);
            body.addView(dialogLine(item.optString("equipmentName", "-"), formatDate(item.optJSONObject("payload") == null ? "" : item.optJSONObject("payload").optString("inspectionDate", "")) + " | " + item.optString("detail", "-")));
        }
        final AlertDialog dialog = buildActionDialog(title, body, "Tutup", "Input", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                showQuickServiceInput(formType);
            }
        });
        input.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                showQuickServiceInput(formType);
            }
        });
        dialog.show();
    }

    private void showQuickServiceInput(final String formType) {
        showQuickServiceInput(formType, null);
    }

    private void showQuickServiceInput(final String formType, final JSONObject editingItem) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk simpan service.", Toast.LENGTH_LONG).show();
            return;
        }
        final boolean editing = editingItem != null;
        final JSONObject editingPayload = editing ? editingItem.optJSONObject("payload") : null;
        final LinearLayout form = quickFormBody((editing ? "Edit " : "") + serviceTitleForFormType(formType));
        form.addView(label("Pilih equipment dari Master Equipment. Bila master belum sinkron, field tetap bisa diisi manual.", 12, MUTED, false), topMargin(-1, dp(4)));
        final EditText inspectionDate = lightInput("Tanggal inspeksi YYYY-MM-DD");
        inspectionDate.setSingleLine(true);
        inspectionDate.setText(editingPayload == null ? today() : editingPayload.optString("inspectionDate", today()));
        final AutoCompleteTextView equipment = equipmentAutocomplete(formType);
        equipment.setSingleLine(true);
        if (editing) {
            equipment.setText(editingItem.optString("equipmentName", ""), false);
        }
        final TextView carbonStockStatus = "service-motor-mv-carbon-brush".equals(formType) ? carbonStockStatusView("") : null;
        form.addView(inspectionDate);
        form.addView(equipment);
        form.addView(label("Ketik equipment, lalu pilih dari list Master Equipment yang muncul.", 12, MUTED, false), topMargin(-1, dp(4)));
        if (carbonStockStatus != null) {
            form.addView(carbonStockStatus, topMargin(-1, dp(8)));
        }
        final LinkedHashMap<String, EditText> fields = new LinkedHashMap<String, EditText>();
        addServiceSpecificFields(form, formType, fields);
        if (editingPayload != null) {
            populateServiceFields(fields, editingPayload);
        }
        if (carbonStockStatus != null) {
            final String editingId = editing ? editingItem.optString("id", "") : "";
            updateCarbonStockFieldForEquipment(textOf(equipment), fields, carbonStockStatus);
            updateCarbonMeasurementHintsForEquipment(textOf(equipment), fields, editingId);
            equipment.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    updateCarbonStockFieldForEquipment(String.valueOf(s), fields, carbonStockStatus);
                    updateCarbonMeasurementHintsForEquipment(String.valueOf(s), fields, editingId);
                }

                @Override
                public void afterTextChanged(Editable s) {
                }
            });
        }
        final EditText description = lightInput("Deskripsi / temuan");
        final EditText recommendation = lightInput("Rekomendasi / follow up");
        final EditText pic = lightInput("PIC / Teknisi");
        description.setText(editing ? editingItem.optString("description", "") : "");
        recommendation.setText(editingPayload == null ? "" : editingPayload.optString("recommendation", ""));
        pic.setSingleLine(true);
        pic.setText(editingPayload == null ? currentUser.optString("username", "") : editingPayload.optString("pic", currentUser.optString("username", "")));
        form.addView(description);
        form.addView(recommendation);
        form.addView(pic);
        final AlertDialog dialog = buildActionDialog(editing ? "Edit Service" : "Input Service", form, "Batal", "Simpan", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String equipmentName = textOf(equipment).toUpperCase(Locale.ROOT);
                if (equipmentName.length() == 0) {
                    Toast.makeText(MainActivity.this, "Equipment wajib diisi", Toast.LENGTH_SHORT).show();
                    return;
                }
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                saveQuickService(formType, equipmentName, textOf(inspectionDate), textOf(description), textOf(recommendation), textOf(pic), collectFieldValues(fields), editingItem);
            }
        });
        dialog.show();
    }

    private void saveQuickService(final String formType, final String equipmentName, final String inspectionDate, final String description, final String recommendation, final String pic, final JSONObject fieldValues) {
        saveQuickService(formType, equipmentName, inspectionDate, description, recommendation, pic, fieldValues, null);
    }

    private void saveQuickService(final String formType, final String equipmentName, final String inspectionDate, final String description, final String recommendation, final String pic, final JSONObject fieldValues, final JSONObject editingItem) {
        final boolean editing = editingItem != null;
        Toast.makeText(this, editing ? "Mengupdate service..." : "Menyimpan service...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject payload = mergeServicePayload(editingItem == null ? null : editingItem.optJSONObject("payload"), buildServicePayload(formType, inspectionDate, recommendation, pic, fieldValues));
                    JSONObject item = copyJson(editingItem)
                            .put("id", editing ? editingItem.optString("id", "") : "service-" + UUID.randomUUID().toString())
                            .put("type", serviceTypeForFormType(formType))
                            .put("subtype", serviceTitleForFormType(formType))
                            .put("formType", formType)
                            .put("equipmentName", equipmentName)
                            .put("description", description.length() == 0 ? serviceTitleForFormType(formType) : description)
                            .put("detail", buildNativeServiceDetail(formType, payload, recommendation))
                            .put("payload", payload);
                    JSONObject response = apiClient.saveItem("service", item, editing);
                    JSONObject saved = response.optJSONObject("item") != null ? response.optJSONObject("item") : item;
                    replaceOrAppend(serviceItems, saved);
                    JSONObject stock = response.optJSONObject("carbonBrushStock");
                    if (stock != null) {
                        JSONObject freshStock = apiClient.carbonBrushStock();
                        carbonStockItems = freshStock.optJSONArray("items") != null ? freshStock.optJSONArray("items") : carbonStockItems;
                        carbonStockLogs = freshStock.optJSONArray("logs") != null ? freshStock.optJSONArray("logs") : carbonStockLogs;
                        carbonBrushAlerts = freshStock.optJSONArray("alerts") != null ? freshStock.optJSONArray("alerts") : carbonBrushAlerts;
                    }
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, editing ? "Service diperbarui" : "Service tersimpan", Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal simpan service" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void addServiceSpecificFields(LinearLayout form, String formType, LinkedHashMap<String, EditText> fields) {
        form.addView(label("Data inspeksi", 13, TEXT, true), topMargin(-1, dp(12)));
        if ("service-electrical-room".equals(formType)) {
            addServiceField(form, fields, "panelDoorCondition", "Pintu panel (OK/NG)");
            addServiceField(form, fields, "floorCleanliness", "Kebersihan lantai/room");
            addServiceField(form, fields, "roomTemperature", "Temperature ruangan");
            addServiceField(form, fields, "batteryVdc", "Battery VDC");
            addServiceField(form, fields, "batteryAmpere", "Battery Ampere");
            addServiceField(form, fields, "batteryTotalVdc", "Total battery VDC");
            for (int i = 1; i <= 10; i++) {
                addServiceField(form, fields, "battery" + i, "Battery cell " + i);
            }
            addServiceField(form, fields, "transformerEquipment", "Equipment transformer");
            addServiceField(form, fields, "transformerWindingTemperature", "Winding temperature");
            addServiceField(form, fields, "transformerOilTemperature", "Oil temperature");
            addServiceField(form, fields, "transformerOilLevel", "Oil level");
            addServiceField(form, fields, "transformerSilicaGel", "Silica gel");
            return;
        }
        if ("service-motor-mv".equals(formType)) {
            addServiceField(form, fields, "vibrationDe", "Vibration DE");
            addServiceField(form, fields, "vibrationNde", "Vibration NDE");
            addServiceField(form, fields, "windingTemperature", "Winding temperature");
            addServiceField(form, fields, "bearingCondition", "Bearing condition");
            addServiceField(form, fields, "motorCurrent", "Motor current");
            return;
        }
        if ("service-motor-mso".equals(formType)) {
            addServiceField(form, fields, "condition", "Condition");
            addServiceField(form, fields, "inspId", "Inspection ID");
            addServiceField(form, fields, "idAmtrans", "ID Amtrans");
            addServiceField(form, fields, "creator", "Creator");
            addServiceField(form, fields, "mplant", "Plant");
            addServiceField(form, fields, "equipmentDesc", "Equipment description");
            addServiceField(form, fields, "temperaturDs", "Temperature DS");
            addServiceField(form, fields, "temperaturNds", "Temperature NDS");
            addServiceField(form, fields, "kelengkapanMotor", "Kelengkapan motor");
            addServiceField(form, fields, "geDsVertBefore", "GE DS Vert Before");
            addServiceField(form, fields, "geDsHorBefore", "GE DS Hor Before");
            addServiceField(form, fields, "vibrasiDsVertBefore", "Vibrasi DS Vert Before");
            addServiceField(form, fields, "vibrasiDsHorBefore", "Vibrasi DS Hor Before");
            addServiceField(form, fields, "geNdsVertBefore", "GE NDS Vert Before");
            addServiceField(form, fields, "geNdsHorBefore", "GE NDS Hor Before");
            addServiceField(form, fields, "vibrasiNdsVertBefore", "Vibrasi NDS Vert Before");
            addServiceField(form, fields, "vibrasiNdsHorBefore", "Vibrasi NDS Hor Before");
            addServiceField(form, fields, "regreaseDe", "Regrease DE");
            addServiceField(form, fields, "regreaseNde", "Regrease NDE");
            addServiceField(form, fields, "geDsVertAfter", "GE DS Vert After");
            addServiceField(form, fields, "geDsHorAfter", "GE DS Hor After");
            addServiceField(form, fields, "geNdsVertAfter", "GE NDS Vert After");
            addServiceField(form, fields, "geNdsHorAfter", "GE NDS Hor After");
            addServiceField(form, fields, "inspectionNote", "Catatan inspeksi");
            return;
        }
        if ("service-motor-mv-carbon-brush".equals(formType)) {
            addServiceField(form, fields, "replacement", "Replacement");
            addServiceField(form, fields, "megger", "Megger");
            EditText stockKey = lightInput("Type stock Carbon Brush");
            stockKey.setSingleLine(false);
            stockKey.setEnabled(false);
        stockKey.setTextColor(MUTED);
            fields.put("carbonBrushStockKey", stockKey);
            form.addView(stockKey);
            EditText replacedPoints = lightInput("Titik diganti");
            replacedPoints.setSingleLine(false);
            replacedPoints.setEnabled(false);
        replacedPoints.setTextColor(MUTED);
            fields.put("replacedPoints", replacedPoints);
            form.addView(replacedPoints);
            addCarbonBrushMeasurementFields(form, fields);
            return;
        }
        if ("service-mcc".equals(formType)) {
            addServiceField(form, fields, "testFunction", "Test function (OK/NG)");
            addServiceField(form, fields, "visualCondition", "Visual condition (OK/NG)");
            addServiceField(form, fields, "partCleanliness", "Part cleanliness (OK/NG)");
            return;
        }
        if ("service-ehca".equals(formType)) {
            addServiceField(form, fields, "systemPressure", "System pressure");
            addServiceField(form, fields, "fluidLevel", "Fluid level");
            addServiceField(form, fields, "filterCondition", "Filter condition");
            addServiceField(form, fields, "leakCondition", "Leak condition");
            addServiceField(form, fields, "unitCondition", "Unit condition");
            return;
        }
        if ("service-instrument".equals(formType)) {
            addServiceField(form, fields, "sensorCondition", "Kondisi sensor");
            return;
        }
        if ("service-cems".equals(formType)) {
            addServiceField(form, fields, "inspectorName", "Inspector");
            addServiceField(form, fields, "o2Status", "O2 status");
            addServiceField(form, fields, "o2Value", "O2 value");
            addServiceField(form, fields, "o2Unit", "O2 unit");
            addServiceField(form, fields, "o2Note", "O2 note");
            addServiceField(form, fields, "coStatus", "CO status");
            addServiceField(form, fields, "coValue", "CO value");
            addServiceField(form, fields, "coUnit", "CO unit");
            addServiceField(form, fields, "coNote", "CO note");
            addServiceField(form, fields, "noxStatus", "NOx status");
            addServiceField(form, fields, "noxValue", "NOx value");
            addServiceField(form, fields, "noxUnit", "NOx unit");
            addServiceField(form, fields, "noxNote", "NOx note");
            addServiceField(form, fields, "so2Status", "SO2 status");
            addServiceField(form, fields, "so2Value", "SO2 value");
            addServiceField(form, fields, "so2Unit", "SO2 unit");
            addServiceField(form, fields, "so2Note", "SO2 note");
            addServiceField(form, fields, "dustStatus", "Dust status");
            addServiceField(form, fields, "dustValue", "Dust value");
            addServiceField(form, fields, "dustUnit", "Dust unit");
            addServiceField(form, fields, "dustNote", "Dust note");
            addServiceField(form, fields, "flowStatus", "Flow status");
            addServiceField(form, fields, "flowValue", "Flow value");
            addServiceField(form, fields, "flowUnit", "Flow unit");
            addServiceField(form, fields, "flowNote", "Flow note");
            addServiceField(form, fields, "temperatureStatus", "Temperature status");
            addServiceField(form, fields, "temperatureValue", "Temperature value");
            addServiceField(form, fields, "temperatureUnit", "Temperature unit");
            addServiceField(form, fields, "temperatureNote", "Temperature note");
            addServiceField(form, fields, "pressureStatus", "Pressure status");
            addServiceField(form, fields, "pressureValue", "Pressure value");
            addServiceField(form, fields, "pressureUnit", "Pressure unit");
            addServiceField(form, fields, "pressureNote", "Pressure note");
            addServiceField(form, fields, "analyzerPower", "Analyzer power");
            addServiceField(form, fields, "analyzerStatus", "Analyzer status");
            addServiceField(form, fields, "analyzerAlarm", "Analyzer alarm");
            addServiceField(form, fields, "analyzerResponseTime", "Analyzer response time");
            addServiceField(form, fields, "analyzerSpanDrift", "Analyzer span drift");
            addServiceField(form, fields, "analyzerZeroDrift", "Analyzer zero drift");
            addServiceField(form, fields, "analyzerNote", "Analyzer note");
            addServiceField(form, fields, "samplingProbe", "Sampling probe");
            addServiceField(form, fields, "samplingFilter", "Sampling filter");
            addServiceField(form, fields, "samplingHeatedLine", "Sampling heated line");
            addServiceField(form, fields, "samplingPump", "Sampling pump");
            addServiceField(form, fields, "samplingFlow", "Sampling flow");
            addServiceField(form, fields, "samplingNote", "Sampling note");
            addServiceField(form, fields, "calibrationCylinder", "Calibration cylinder");
            addServiceField(form, fields, "calibrationPressure", "Calibration pressure");
            addServiceField(form, fields, "calibrationRegulator", "Calibration regulator");
            addServiceField(form, fields, "calibrationAuto", "Calibration auto");
            addServiceField(form, fields, "calibrationSchedule", "Calibration schedule");
            addServiceField(form, fields, "calibrationNote", "Calibration note");
            addServiceField(form, fields, "dataDasScada", "Data DAS/SCADA");
            addServiceField(form, fields, "dataLogger", "Data logger");
            addServiceField(form, fields, "dataLoss", "Data loss");
            addServiceField(form, fields, "timeSync", "Time sync");
            addServiceField(form, fields, "dataCommunicationNote", "Data communication note");
            addServiceField(form, fields, "supportPowerSupply", "Support power supply");
            addServiceField(form, fields, "supportUps", "Support UPS");
            addServiceField(form, fields, "supportAcPanel", "Support AC panel");
            addServiceField(form, fields, "supportShelter", "Support shelter");
            addServiceField(form, fields, "supportNote", "Support note");
            addServiceField(form, fields, "findingIssue", "Finding issue");
            addServiceField(form, fields, "possibleCause", "Possible cause");
            addServiceField(form, fields, "emissionImpact", "Emission impact");
            addServiceField(form, fields, "urgencyLevel", "Urgency level");
            return;
        }
        if ("service-opacity-meter".equals(formType)) {
            addServiceField(form, fields, "inspectionTime", "Inspection time");
            addServiceField(form, fields, "technicianName", "Technician");
            addServiceField(form, fields, "brandModel", "Brand/model");
            addServiceField(form, fields, "shift", "Shift");
            addServiceField(form, fields, "opacityValue", "Opacity value");
            addServiceField(form, fields, "opacityUnit", "Opacity unit");
            addServiceField(form, fields, "opacityLimit", "Opacity limit");
            addServiceField(form, fields, "opacityStatus", "Opacity status");
            addServiceField(form, fields, "transmittanceValue", "Transmittance value");
            addServiceField(form, fields, "transmittanceUnit", "Transmittance unit");
            addServiceField(form, fields, "transmittanceLimit", "Transmittance limit");
            addServiceField(form, fields, "transmittanceStatus", "Transmittance status");
            addServiceField(form, fields, "alarmStatusValue", "Alarm status value");
            addServiceField(form, fields, "alarmStatusUnit", "Alarm status unit");
            addServiceField(form, fields, "alarmStatusLimit", "Alarm status limit");
            addServiceField(form, fields, "alarmStatusCondition", "Alarm status");
            addServiceField(form, fields, "visualHousingClean", "Visual housing clean");
            addServiceField(form, fields, "visualMounting", "Visual mounting");
            addServiceField(form, fields, "visualAlignment", "Visual alignment");
            addServiceField(form, fields, "visualVibration", "Visual vibration");
            addServiceField(form, fields, "visualCondensation", "Visual condensation");
            addServiceField(form, fields, "visualNote", "Visual note");
            addServiceField(form, fields, "opticLens", "Optic lens");
            addServiceField(form, fields, "opticReflector", "Optic reflector");
            addServiceField(form, fields, "opticDeposit", "Optic deposit");
            addServiceField(form, fields, "opticSignal", "Optic signal");
            addServiceField(form, fields, "opticLightIntensity", "Optic light intensity");
            addServiceField(form, fields, "opticNote", "Optic note");
            addServiceField(form, fields, "purgeActive", "Purge active");
            addServiceField(form, fields, "purgePressure", "Purge pressure");
            addServiceField(form, fields, "purgeFlow", "Purge flow");
            addServiceField(form, fields, "purgeFilter", "Purge filter");
            addServiceField(form, fields, "purgeNote", "Purge note");
            addServiceField(form, fields, "electricalPowerSupply", "Electrical power supply");
            addServiceField(form, fields, "electricalOutput", "Electrical output");
            addServiceField(form, fields, "electricalCable", "Electrical cable");
            addServiceField(form, fields, "electricalNoise", "Electrical noise");
            addServiceField(form, fields, "electricalNote", "Electrical note");
            addServiceField(form, fields, "zeroCheckValue", "Zero check value");
            addServiceField(form, fields, "zeroCheckStatus", "Zero check status");
            addServiceField(form, fields, "zeroCheckNote", "Zero check note");
            addServiceField(form, fields, "spanCheckValue", "Span check value");
            addServiceField(form, fields, "spanCheckStatus", "Span check status");
            addServiceField(form, fields, "spanCheckNote", "Span check note");
            addServiceField(form, fields, "driftValue", "Drift value");
            addServiceField(form, fields, "driftStatus", "Drift status");
            addServiceField(form, fields, "driftNote", "Drift note");
            addServiceField(form, fields, "findingIssue", "Finding issue");
            addServiceField(form, fields, "possibleCause", "Possible cause");
            addServiceField(form, fields, "readingImpact", "Reading impact");
            addServiceField(form, fields, "recommendationCleaning", "Recommendation cleaning");
            addServiceField(form, fields, "recommendationRealignment", "Recommendation realignment");
            addServiceField(form, fields, "recommendationCalibration", "Recommendation calibration");
            addServiceField(form, fields, "recommendationSparePart", "Recommendation spare part");
            addServiceField(form, fields, "recommendationOther", "Rekomendasi lain");
            return;
        }
        addServiceField(form, fields, "equipmentDescription", "Equipment description");
        addServiceField(form, fields, "plcPowerSupplyModule", "PLC power supply module");
        addServiceField(form, fields, "plcCommunicationModule", "PLC communication module");
        addServiceField(form, fields, "plcProcessorModule", "PLC processor module");
        addServiceField(form, fields, "plcDigitalInputModule", "PLC digital input module");
        addServiceField(form, fields, "plcDigitalOutputModule", "PLC digital output module");
        addServiceField(form, fields, "plcAnalogInputModule", "PLC analog input module");
        addServiceField(form, fields, "plcAnalogOutputModule", "PLC analog output module");
        addServiceField(form, fields, "fiberOpticEthernetCommunication", "Fiber optic / ethernet communication");
        addServiceField(form, fields, "groundingEeEa", "Grounding EE-EA");
        addServiceField(form, fields, "groundingEePe", "Grounding EE-PE");
        addServiceField(form, fields, "groundingEaPe", "Grounding EA-PE");
        addServiceField(form, fields, "cableTermination", "Cable termination");
        addServiceField(form, fields, "upsOutput", "UPS output");
        addServiceField(form, fields, "pdbOutput", "PDB output");
        addServiceField(form, fields, "roomAcCondition", "Room AC condition");
        addServiceField(form, fields, "roomCleanliness", "Room cleanliness");
        addServiceField(form, fields, "damagedPartReplacement", "Damaged part replacement");
        addServiceField(form, fields, "adjustmentRepair", "Adjustment / repair");
    }

    private void addServiceField(LinearLayout form, LinkedHashMap<String, EditText> fields, String key, String hint) {
        EditText input = lightInput(hint);
        if (hint.length() < 28 && !hint.toLowerCase(Locale.ROOT).contains("note") && !hint.toLowerCase(Locale.ROOT).contains("deskripsi")) {
            input.setSingleLine(true);
        }
        fields.put(key, input);
        form.addView(input);
    }

    private void populateServiceFields(LinkedHashMap<String, EditText> fields, JSONObject payload) {
        if (payload == null) {
            return;
        }
        JSONObject measurements = payload.optJSONObject("measurements");
        for (Map.Entry<String, EditText> entry : fields.entrySet()) {
            String key = entry.getKey();
            EditText edit = entry.getValue();
            if (edit == null) {
                continue;
            }
            if (measurements != null && isCarbonPoint(key)) {
                edit.setText(measurements.optString(key, ""));
            } else if ("replacedPoints".equals(key)) {
                edit.setText(joinArray(payload.optJSONArray("replacedPoints")));
                updateActiveCarbonPointViews(parsePointList(edit.getText() == null ? "" : edit.getText().toString()));
            } else {
                edit.setText(payload.optString(key, ""));
            }
        }
    }

    private AutoCompleteTextView equipmentAutocomplete(String formType) {
        AutoCompleteTextView edit = new AutoCompleteTextView(this);
        edit.setHint("Equipment");
        edit.setHintTextColor(MUTED);
        edit.setTextColor(TEXT);
        edit.setTextSize(14);
        edit.setThreshold(1);
        edit.setTypeface(appTypeface(false));
        edit.setSingleLine(true);
        edit.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS);
        edit.setPadding(dp(13), 0, dp(13), 0);
        edit.setBackground(selectableBackground(SURFACE_HIGH, BORDER_SOFT, 14));
        prepareInput(edit);
        List<String> names = equipmentNamesForFormType(formType);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_dropdown_item_1line, names);
        edit.setAdapter(adapter);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.topMargin = dp(9);
        edit.setLayoutParams(lp);
        edit.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    ((AutoCompleteTextView) v).showDropDown();
                }
            }
        });
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ((AutoCompleteTextView) v).showDropDown();
            }
        });
        return edit;
    }

    private TextView carbonStockStatusView(String text) {
        TextView view = label(text.length() == 0 ? "Stock Carbon Brush otomatis mengikuti equipment." : text, 12, TEXT, true);
        view.setPadding(dp(10), dp(8), dp(10), dp(8));
        view.setBackground(rounded(INFO_SURFACE, BLUE, 12));
        return view;
    }

    private void updateCarbonStockFieldForEquipment(String equipmentName, LinkedHashMap<String, EditText> fields, TextView status) {
        EditText stockField = fields.get("carbonBrushStockKey");
        if (stockField == null || status == null) {
            return;
        }
        JSONObject stock = carbonStockForEquipment(equipmentName);
        if (stock == null) {
            if (textOf(stockField).length() > 0) {
                status.setText("Stock memakai data service lama: " + textOf(stockField));
                status.setTextColor(AMBER);
                return;
            }
            stockField.setText("");
            status.setText("Stock akan dicocokkan otomatis oleh server dari equipment ini.");
            status.setTextColor(RED);
            return;
        }
        String stockKey = stock.optString("stockKey", "");
        stockField.setText(stockKey);
        status.setText("Stock: " + stock.optString("brushName", "-") + " | SAP " + stock.optString("sapNo", "-") + " | " + stock.optInt("currentStock", 0) + " pcs");
        status.setTextColor(GREEN);
    }

    private void updateCarbonMeasurementHintsForEquipment(String equipmentName, LinkedHashMap<String, EditText> fields, String skipServiceId) {
        JSONObject latest = findLatestServiceByEquipment("service-motor-mv-carbon-brush", equipmentName, skipServiceId);
        JSONObject payload = latest == null ? null : latest.optJSONObject("payload");
        JSONObject measurements = payload == null ? null : payload.optJSONObject("measurements");
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        for (String rowName : rows) {
            for (int col = 1; col <= 9; col++) {
                String key = rowName + col;
                EditText edit = fields.get(key);
                if (edit == null) {
                    continue;
                }
                String previous = measurements == null ? "" : measurements.optString(key, "");
                edit.setHint(previous.length() == 0 ? "-" : previous + " mm");
            }
        }
    }

    private JSONObject carbonStockForEquipment(String equipmentName) {
        String normalizedEquipment = normalizeCarbonEquipmentKey(equipmentName);
        if (normalizedEquipment.length() == 0) {
            return null;
        }
        JSONObject best = null;
        int bestScore = 0;
        for (int i = 0; i < carbonStockItems.length(); i++) {
            JSONObject item = carbonStockItems.optJSONObject(i);
            if (item == null) {
                continue;
            }
            int score = scoreCarbonStockMatch(normalizedEquipment, item.optString("useLabel", ""));
            if (score > bestScore) {
                bestScore = score;
                best = item;
            }
        }
        if (best != null) {
            return best;
        }
        return null;
    }

    private int scoreCarbonStockMatch(String normalizedEquipment, String useLabel) {
        int score = 0;
        String[] parts = String.valueOf(useLabel == null ? "" : useLabel).split(",");
        for (String part : parts) {
            String use = normalizeCarbonEquipmentKey(part);
            if (use.length() == 0) {
                continue;
            }
            if (normalizedEquipment.equals(use)) {
                score = Math.max(score, 100);
            } else if (normalizedEquipment.startsWith(use) || use.startsWith(normalizedEquipment)) {
                score = Math.max(score, 70);
            } else if (normalizedEquipment.contains(use) || use.contains(normalizedEquipment)) {
                score = Math.max(score, 45);
            }
        }
        return score;
    }

    private String normalizeCarbonEquipmentKey(String value) {
        String normalized = normalizeKey(value).replaceAll("[^A-Z0-9-]", "");
        int separator = normalized.indexOf("-");
        if (separator > 0) {
            normalized = normalized.substring(0, separator);
        }
        return normalized;
    }

    private void addCarbonBrushMeasurementFields(LinearLayout form, LinkedHashMap<String, EditText> fields) {
        form.addView(label("Measurement A1-I9", 13, TEXT, true), topMargin(-1, dp(12)));
        form.addView(label("Tap kode titik untuk menandai titik yang diganti. Hint tiap field memakai ukuran service sebelumnya pada equipment yang sama.", 12, MUTED, false), topMargin(-1, dp(4)));
        LinearLayout grid = column(6);
        activeCarbonPointViews = new HashMap<String, TextView>();
        final LinkedHashSet<String> replacedSet = new LinkedHashSet<String>();
        final EditText replacedField = fields.get("replacedPoints");
        if (replacedField != null) {
            JSONArray existingPoints = parsePointList(replacedField.getText() == null ? "" : replacedField.getText().toString());
            for (int i = 0; i < existingPoints.length(); i++) {
                String point = existingPoints.optString(i, "");
                if (point.length() > 0) {
                    replacedSet.add(point);
                }
            }
            replacedField.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    replacedSet.clear();
                    JSONArray selectedPoints = parsePointList(String.valueOf(s));
                    for (int i = 0; i < selectedPoints.length(); i++) {
                        String point = selectedPoints.optString(i, "");
                        if (point.length() > 0) {
                            replacedSet.add(point);
                        }
                    }
                    updateActiveCarbonPointViews(selectedPoints);
                }

                @Override
                public void afterTextChanged(Editable s) {
                }
            });
        }
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        for (String rowName : rows) {
            grid.addView(label("Baris " + rowName, 11, MUTED, true), topMargin(-1, dp(6)));
            for (int group = 0; group < 3; group++) {
                LinearLayout row = row(8);
                row.setGravity(Gravity.CENTER_VERTICAL);
                for (int offset = 1; offset <= 3; offset++) {
                    int col = group * 3 + offset;
                    final String key = rowName + col;
                    LinearLayout cell = column(3);
                    cell.setPadding(dp(8), dp(7), dp(8), dp(8));
                    cell.setBackground(rounded(SURFACE_FLOAT, BORDER, 12));
                    final TextView point = label(key, 12, TEXT, true);
                    activeCarbonPointViews.put(key, point);
                    point.setGravity(Gravity.CENTER);
                    applyCarbonPointState(point, replacedSet.contains(key));
                    point.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            if (replacedSet.contains(key)) {
                                replacedSet.remove(key);
                            } else {
                                replacedSet.add(key);
                            }
                            applyCarbonPointState(point, replacedSet.contains(key));
                            if (replacedField != null) {
                                replacedField.setText(join(new ArrayList<String>(replacedSet), ", "));
                            }
                        }
                    });
                    cell.addView(point, new LinearLayout.LayoutParams(-1, dp(30)));
                    EditText input = lightInput("-");
                    input.setSingleLine(true);
                    input.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
                    input.setTextSize(13);
                    input.setGravity(Gravity.CENTER);
                    input.setPadding(dp(6), 0, dp(6), 0);
                    fields.put(key, input);
                    LinearLayout.LayoutParams inputLp = new LinearLayout.LayoutParams(-1, dp(46));
                    inputLp.topMargin = dp(4);
                    cell.addView(input, inputLp);
                    row.addView(cell, new LinearLayout.LayoutParams(0, -2, 1));
                }
                grid.addView(row, topMargin(-1, dp(6)));
            }
        }
        form.addView(grid, topMargin(-1, dp(8)));
    }

    private void applyCarbonPointState(TextView point, boolean selected) {
        point.setTextColor(selected ? Color.rgb(3, 24, 27) : TEXT);
        point.setBackground(rounded(selected ? TEAL : Color.rgb(10, 24, 29), selected ? TEAL : BORDER_SOFT, 10));
    }

    private void updateActiveCarbonPointViews(JSONArray selectedPoints) {
        LinkedHashSet<String> selected = new LinkedHashSet<String>();
        if (selectedPoints != null) {
            for (int i = 0; i < selectedPoints.length(); i++) {
                selected.add(selectedPoints.optString(i, ""));
            }
        }
        for (Map.Entry<String, TextView> entry : activeCarbonPointViews.entrySet()) {
            applyCarbonPointState(entry.getValue(), selected.contains(entry.getKey()));
        }
    }

    private JSONObject collectFieldValues(LinkedHashMap<String, EditText> fields) {
        JSONObject values = new JSONObject();
        for (Map.Entry<String, EditText> entry : fields.entrySet()) {
            try {
                values.put(entry.getKey(), textOf(entry.getValue()));
            } catch (JSONException ignored) {
            }
        }
        return values;
    }

    private JSONObject buildServicePayload(String formType, String inspectionDate, String recommendation, String pic, JSONObject values) throws JSONException {
        JSONObject payload = new JSONObject();
        payload.put("inspectionDate", inspectionDate == null || inspectionDate.length() == 0 ? today() : inspectionDate);
        payload.put("recommendation", recommendation == null ? "" : recommendation);
        payload.put("pic", pic == null ? "" : pic);
        Iterator<String> keys = values == null ? null : values.keys();
        while (keys != null && keys.hasNext()) {
            String key = keys.next();
            payload.put(key, values.optString(key, ""));
        }
        if ("service-motor-mv-carbon-brush".equals(formType)) {
            JSONObject measurements = new JSONObject();
            JSONArray replacedPoints = parsePointList(payload.optString("replacedPoints", ""));
            payload.remove("replacedPoints");
            String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
            for (String rowName : rows) {
                for (int col = 1; col <= 9; col++) {
                    String key = rowName + col;
                    String value = values == null ? "" : values.optString(key, "");
                    if (value.length() > 0) {
                        measurements.put(key, value);
                    }
                    payload.remove(key);
                }
            }
            payload.put("measurements", measurements);
            payload.put("replacedPoints", replacedPoints);
            payload.put("stats", carbonStats(measurements));
        }
        if ("service-motor-mso".equals(formType)) {
            payload.put("source", "MANUAL");
            payload.put("sourceType", "native-android");
        }
        return payload;
    }

    private JSONObject mergeServicePayload(JSONObject existing, JSONObject updates) throws JSONException {
        JSONObject merged = copyJson(existing);
        if (updates == null) {
            return merged;
        }
        Iterator<String> keys = updates.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = updates.opt(key);
            if (value instanceof JSONObject) {
                merged.put(key, new JSONObject(value.toString()));
            } else if (value instanceof JSONArray) {
                merged.put(key, new JSONArray(value.toString()));
            } else {
                merged.put(key, value);
            }
        }
        return merged;
    }

    private JSONArray parsePointList(String raw) {
        JSONArray array = new JSONArray();
        LinkedHashSet<String> points = new LinkedHashSet<String>();
        String[] tokens = String.valueOf(raw == null ? "" : raw).split(",");
        for (String token : tokens) {
            String point = token.trim().toUpperCase(Locale.ROOT);
            if (isCarbonPoint(point)) {
                points.add(point);
            }
        }
        for (String point : points) {
            array.put(point);
        }
        return array;
    }

    private boolean isCarbonPoint(String point) {
        if (point == null || point.length() < 2 || point.length() > 3) {
            return false;
        }
        char row = point.charAt(0);
        if (row < 'A' || row > 'I') {
            return false;
        }
        try {
            int col = Integer.parseInt(point.substring(1));
            return col >= 1 && col <= 9;
        } catch (Exception error) {
            return false;
        }
    }

    private JSONObject carbonStats(JSONObject measurements) throws JSONException {
        int low = 0;
        int medium = 0;
        int high = 0;
        int empty = 0;
        double min = Double.MAX_VALUE;
        Iterator<String> keys = measurements.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            String raw = measurements.optString(key, "");
            if (raw.length() == 0) {
                empty++;
                continue;
            }
            double value = parseDouble(raw);
            if (value < 0) {
                empty++;
            } else if (value < 30) {
                low++;
                min = Math.min(min, value);
            } else if (value < 34) {
                medium++;
                min = Math.min(min, value);
            } else {
                high++;
                min = Math.min(min, value);
            }
        }
        JSONObject stats = new JSONObject();
        stats.put("low", low);
        stats.put("medium", medium);
        stats.put("high", high);
        stats.put("empty", empty);
        stats.put("min", min == Double.MAX_VALUE ? JSONObject.NULL : trimNumber(min));
        return stats;
    }

    private String buildNativeServiceDetail(String formType, JSONObject payload, String recommendation) {
        if ("service-motor-mv-carbon-brush".equals(formType)) {
            JSONObject stats = payload.optJSONObject("stats");
            return "Merah: " + (stats == null ? "0" : stats.optString("low", "0"))
                    + " | Kuning: " + (stats == null ? "0" : stats.optString("medium", "0"))
                    + " | Hijau: " + (stats == null ? "0" : stats.optString("high", "0"))
                    + " | Terendah: " + (stats == null ? "-" : stats.optString("min", "-"));
        }
        if ("service-electrical-room".equals(formType)) {
            return "Pintu panel: " + payload.optString("panelDoorCondition", "-")
                    + " | Lantai: " + payload.optString("floorCleanliness", "-")
                    + " | Temperature: " + payload.optString("roomTemperature", "-");
        }
        if ("service-mcc".equals(formType)) {
            return "Test: " + payload.optString("testFunction", "-")
                    + " | Visual: " + payload.optString("visualCondition", "-")
                    + " | Clean: " + payload.optString("partCleanliness", "-");
        }
        if ("service-ehca".equals(formType)) {
            return "Pressure: " + payload.optString("systemPressure", "-")
                    + " | Filter: " + payload.optString("filterCondition", "-")
                    + " | Leakage: " + payload.optString("leakCondition", "-");
        }
        if ("service-cems".equals(formType)) {
            return "O2: " + payload.optString("o2Status", "-")
                    + " | CO: " + payload.optString("coStatus", "-")
                    + " | Analyzer: " + payload.optString("analyzerStatus", "-");
        }
        if ("service-opacity-meter".equals(formType)) {
            return "Opacity: " + payload.optString("opacityValue", "-") + " " + payload.optString("opacityUnit", "")
                    + " | Status: " + payload.optString("opacityStatus", "-");
        }
        if ("service-dcs".equals(formType)) {
            return "Power: " + payload.optString("plcPowerSupplyModule", "-")
                    + " | Comm: " + payload.optString("plcCommunicationModule", "-")
                    + " | Processor: " + payload.optString("plcProcessorModule", "-");
        }
        if ("service-motor-mso".equals(formType)) {
            return "Condition: " + payload.optString("condition", "-")
                    + " | Temp DS: " + payload.optString("temperaturDs", "-")
                    + " | Temp NDS: " + payload.optString("temperaturNds", "-");
        }
        if ("service-instrument".equals(formType)) {
            return "Kondisi sensor: " + payload.optString("sensorCondition", "-");
        }
        return recommendation == null || recommendation.length() == 0 ? "Catatan service" : recommendation;
    }

    private void showQuickNegatifInput() {
        showQuickNegatifInput(null);
    }

    private void showQuickNegatifInput(final JSONObject editingItem) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk simpan negatif list.", Toast.LENGTH_LONG).show();
            return;
        }
        final boolean editing = editingItem != null;
        LinearLayout form = quickFormBody(editing ? "Edit Negatif List" : "Input Negatif List");
        final EditText equipment = lightInput("Equipment");
        final EditText damage = lightInput("Short deskripsi");
        final EditText mark = lightInput("Mark: tunggu RM off / Kiln Off / Sparepart");
        if (editing) {
            equipment.setText(editingItem.optString("equipment", ""));
            damage.setText(editingItem.optString("damageDescription", ""));
            mark.setText(editingItem.optString("pendingMark", ""));
        }
        form.addView(equipment);
        form.addView(damage);
        form.addView(mark);
        showSaveDialog("Negatif List", form, new SaveAction() {
            @Override
            public boolean run() {
                if (textOf(equipment).length() == 0 || textOf(damage).length() == 0) {
                    Toast.makeText(MainActivity.this, "Equipment dan deskripsi wajib diisi", Toast.LENGTH_SHORT).show();
                    return false;
                }
                JSONObject item = copyJson(editingItem);
                try {
                    item.put("id", editing ? editingItem.optString("id", "") : "negatif-" + UUID.randomUUID().toString());
                    item.put("equipment", textOf(equipment).toUpperCase(Locale.ROOT));
                    item.put("damageDescription", textOf(damage));
                    item.put("followUpPlan", item.optString("followUpPlan", "-"));
                    item.put("foundDate", item.optString("foundDate", today()));
                    item.put("pendingMark", textOf(mark).length() == 0 ? "Sparepart" : textOf(mark));
                    item.put("workStatus", item.optString("workStatus", "Open"));
                    item.put("category", item.optString("category", "-"));
                    item.put("area", item.optString("area", "-"));
                } catch (JSONException ignored) {
                }
                saveGenericItem("negatif-list", item, negatifItems, editing ? "Negatif list diperbarui" : "Negatif list tersimpan", editing);
                return true;
            }
        });
    }

    private void showQuickSparepartInput() {
        showQuickSparepartInput(null);
    }

    private void showQuickSparepartInput(final JSONObject editingItem) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk simpan sparepart.", Toast.LENGTH_LONG).show();
            return;
        }
        final boolean editing = editingItem != null;
        LinearLayout form = quickFormBody(editing ? "Edit Sparepart" : "Input Sparepart");
        final EditText sap = lightInput("No SAP / Stock No");
        final EditText name = lightInput("Nama sparepart");
        final EditText qty = lightInput("Stock");
        if (editing) {
            sap.setText(editingItem.optString("code", ""));
            name.setText(editingItem.optString("name", ""));
            qty.setText(editingItem.optString("qty", ""));
        }
        form.addView(sap);
        form.addView(name);
        form.addView(qty);
        showSaveDialog("Sparepart", form, new SaveAction() {
            @Override
            public boolean run() {
                if (textOf(sap).length() == 0 || textOf(name).length() == 0) {
                    Toast.makeText(MainActivity.this, "SAP dan nama wajib diisi", Toast.LENGTH_SHORT).show();
                    return false;
                }
                JSONObject item = copyJson(editingItem);
                try {
                    item.put("id", editing ? editingItem.optString("id", "") : "sparepart-" + UUID.randomUUID().toString());
                    item.put("code", textOf(sap));
                    item.put("name", textOf(name));
                    item.put("qty", textOf(qty).length() == 0 ? "0" : textOf(qty));
                    item.put("condition", item.optString("condition", "NORMAL"));
                    item.put("location", item.optString("location", "-"));
                    item.put("category", item.optString("category", "-"));
                } catch (JSONException ignored) {
                }
                saveGenericItem("sparepart", item, sparepartItems, editing ? "Sparepart diperbarui" : "Sparepart tersimpan", editing);
                return true;
            }
        });
    }

    private void showQuickBomInput(final boolean motor) {
        showQuickBomInput(motor, null);
    }

    private void showQuickBomInput(final boolean motor, final JSONObject editingItem) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk simpan BOM.", Toast.LENGTH_LONG).show();
            return;
        }
        final boolean editing = editingItem != null;
        LinearLayout form = quickFormBody((editing ? "Edit " : "Input ") + (motor ? "BOM Motor" : "BOM"));
        final EditText equipment = lightInput("Equipment");
        final EditText sap = lightInput("No SAP / Stock No");
        final EditText desc = lightInput(motor ? "Manufacture / deskripsi motor" : "Part / material description");
        if (editing) {
            equipment.setText(editingItem.optString("equipment", ""));
            sap.setText(editingItem.optString("stockNo", ""));
            desc.setText(motor ? editingItem.optString("manufacture", editingItem.optString("materialDescription", "")) : editingItem.optString("part", editingItem.optString("materialDescription", "")));
        }
        form.addView(equipment);
        form.addView(sap);
        form.addView(desc);
        showSaveDialog(motor ? "BOM Motor" : "BOM", form, new SaveAction() {
            @Override
            public boolean run() {
                if (textOf(equipment).length() == 0 || textOf(desc).length() == 0) {
                    Toast.makeText(MainActivity.this, "Equipment dan deskripsi wajib diisi", Toast.LENGTH_SHORT).show();
                    return false;
                }
                JSONObject item = copyJson(editingItem);
                try {
                    item.put("id", editing ? editingItem.optString("id", "") : (motor ? "bom-motor-" : "bom-") + UUID.randomUUID().toString());
                    item.put("equipment", textOf(equipment).toUpperCase(Locale.ROOT));
                    item.put("stockNo", textOf(sap));
                    item.put("materialDescription", motor ? item.optString("materialDescription", textOf(desc)) : textOf(desc));
                    if (motor) {
                        item.put("manufacture", textOf(desc));
                        item.put("power", item.optString("power", "-"));
                        item.put("ampere", item.optString("ampere", "-"));
                        item.put("voltage", item.optString("voltage", "-"));
                        item.put("speed", item.optString("speed", "-"));
                        item.put("frame", item.optString("frame", "-"));
                        item.put("serialNumber", item.optString("serialNumber", "-"));
                        item.put("note", item.optString("note", "-"));
                        item.put("longText", item.optString("longText", ""));
                    } else {
                        item.put("part", textOf(desc));
                        item.put("qty", item.optString("qty", "1"));
                        item.put("note", item.optString("note", "-"));
                        item.put("longText", item.optString("longText", ""));
                    }
                } catch (JSONException ignored) {
                }
                saveGenericItem(motor ? "bom-motor" : "bom", item, motor ? bomMotorItems : bomItems, editing ? (motor ? "BOM Motor diperbarui" : "BOM diperbarui") : (motor ? "BOM Motor tersimpan" : "BOM tersimpan"), editing);
                return true;
            }
        });
    }

    private void showQuickSpbInput() {
        showQuickSpbInput(null);
    }

    private void showQuickSpbInput(final JSONObject editingItem) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk simpan SPB.", Toast.LENGTH_LONG).show();
            return;
        }
        final boolean editing = editingItem != null;
        LinearLayout form = quickFormBody(editing ? "Edit SPB" : "Input SPB");
        final EditText stockNo = lightInput("Stock No");
        final EditText desc = lightInput("Material description");
        final EditText qty = lightInput("Qty");
        if (editing) {
            stockNo.setText(editingItem.optString("stockNo", ""));
            desc.setText(editingItem.optString("materialDescription", ""));
            qty.setText(editingItem.optString("qty", ""));
        }
        form.addView(stockNo);
        form.addView(desc);
        form.addView(qty);
        showSaveDialog("SPB", form, new SaveAction() {
            @Override
            public boolean run() {
                if (textOf(stockNo).length() == 0 || textOf(desc).length() == 0) {
                    Toast.makeText(MainActivity.this, "Stock No dan deskripsi wajib diisi", Toast.LENGTH_SHORT).show();
                    return false;
                }
                JSONObject item = copyJson(editingItem);
                try {
                    item.put("id", editing ? editingItem.optString("id", "") : "spb-" + UUID.randomUUID().toString());
                    item.put("year", item.optString("year", new SimpleDateFormat("yyyy", Locale.US).format(new Date())));
                    item.put("quarter", item.optString("quarter", "-"));
                    item.put("spbType", item.optString("spbType", "Pembelian"));
                    item.put("notificationNo", item.optString("notificationNo", "-"));
                    item.put("orderNo", item.optString("orderNo", "-"));
                    item.put("reservationNo", item.optString("reservationNo", "-"));
                    item.put("stockNo", textOf(stockNo));
                    item.put("materialDescription", textOf(desc));
                    item.put("qty", textOf(qty).length() == 0 ? "1" : textOf(qty));
                    item.put("mrp", item.optString("mrp", "-"));
                    item.put("totalEce", item.optString("totalEce", "-"));
                    item.put("note", item.optString("note", "Input aplikasi"));
                    item.put("prNo", item.optString("prNo", "-"));
                    item.put("poNo", item.optString("poNo", "-"));
                    item.put("deliveryDate", item.optString("deliveryDate", ""));
                } catch (JSONException ignored) {
                }
                saveGenericItem("spb", item, spbItems, editing ? "SPB diperbarui" : "SPB tersimpan", editing);
                return true;
            }
        });
    }

    private LinearLayout quickFormBody(String title) {
        LinearLayout form = column(8);
        form.setPadding(dp(16), dp(14), dp(16), dp(8));
        form.setBackgroundColor(SURFACE);
        form.addView(label(title, 18, TEXT, true));
        return form;
    }

    private void showSaveDialog(String title, LinearLayout form, final SaveAction onSave) {
        final AlertDialog dialog = buildActionDialog(title, form, "Batal", "Simpan", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onSave.run()) {
                    Object tag = v.getTag();
                    if (tag instanceof AlertDialog) {
                        ((AlertDialog) tag).dismiss();
                    }
                }
            }
        });
        dialog.show();
    }

    private void saveGenericItem(final String resourceKey, final JSONObject item, final JSONArray target, final String successMessage) {
        saveGenericItem(resourceKey, item, target, successMessage, false);
    }

    private void saveGenericItem(final String resourceKey, final JSONObject item, final JSONArray target, final String successMessage, final boolean editing) {
        Toast.makeText(this, "Menyimpan data...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject response = apiClient.saveItem(resourceKey, item, editing);
                    JSONObject saved = response.optJSONObject("item") != null ? response.optJSONObject("item") : item;
                    replaceOrAppend(target, saved);
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, successMessage, Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal simpan data" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void showServiceDetail(JSONObject item) {
        final JSONObject service = item;
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("equipmentName", "-"), 18, TEXT, true));
        body.addView(label(item.optString("subtype", item.optString("type", "-")), 13, MUTED, false));
        LinearLayout actions = row(8);
        TextView send = dialogAction("Kirim WhatsApp");
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareServiceToWhatsApp(service);
            }
        });
        TextView edit = dialogAction("Edit");
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String formType = service.optString("formType", "service-dcs");
                if ("service-motor-mso".equals(formType)) {
                    Toast.makeText(MainActivity.this, "Data MSO hanya bisa diedit dari sumber MSO.", Toast.LENGTH_SHORT).show();
                    return;
                }
                showQuickServiceInput(formType.length() == 0 ? "service-dcs" : formType, service);
            }
        });
        actions.addView(send, new LinearLayout.LayoutParams(0, dp(44), 1));
        actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
        body.addView(actions, topMargin(-1, dp(12)));
        JSONObject payload = item.optJSONObject("payload");
        body.addView(dialogLine("Tanggal", formatDate(payload == null ? "" : payload.optString("inspectionDate", ""))));
        body.addView(dialogLine("Deskripsi", item.optString("description", "-")));
        body.addView(dialogLine("Detail", item.optString("detail", "-")));
        if ("service-motor-mv-carbon-brush".equals(item.optString("formType", ""))) {
            body.addView(label("Measurement Carbon Brush", 14, TEXT, true), topMargin(-1, dp(8)));
            body.addView(lightBrushGrid(payload));
        }
        if (payload != null) {
            body.addView(label("Payload Inspeksi", 14, TEXT, true), topMargin(-1, dp(10)));
            appendJsonFields(body, payload, "payload");
        }
        showDetailDialog("Detail Service", body);
    }

    private void showScheduleDetail(final JSONObject item) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk konfirmasi realisasi.", Toast.LENGTH_LONG).show();
            return;
        }
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("summary", "Jadwal inspeksi"), 18, TEXT, true));
        body.addView(dialogLine("Tanggal", formatDate(item.optString("date", today()))));
        body.addView(dialogLine("Detail", scheduleDetail(item)));
        final EditText realizedDate = lightInput("Tanggal realisasi YYYY-MM-DD");
        realizedDate.setSingleLine(true);
        realizedDate.setText(today());
        final EditText note = lightInput("Catatan realisasi");
        body.addView(realizedDate);
        body.addView(note);
        final AlertDialog dialog = buildActionDialog("Jadwal Inspeksi", body, "Tutup", "Simpan", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String date = textOf(realizedDate);
                if (date.length() == 0) {
                    Toast.makeText(MainActivity.this, "Tanggal realisasi wajib diisi", Toast.LENGTH_SHORT).show();
                    return;
                }
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                saveScheduleRealization(item, date, textOf(note));
            }
        });
        dialog.show();
    }

    private void saveScheduleRealization(final JSONObject item, final String realizedDate, final String note) {
        Toast.makeText(this, "Menyimpan realisasi inspeksi...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject payload = new JSONObject()
                            .put("scheduleKey", item.optString("scheduleKey", fallbackScheduleKey(item)))
                            .put("plannedDate", item.optString("date", today()))
                            .put("plannedTitle", item.optString("summary", "Jadwal inspeksi"))
                            .put("plannedTimeLabel", item.optString("timeLabel", item.optBoolean("allDay", false) ? "Seharian" : ""))
                            .put("realizedDate", realizedDate)
                            .put("note", note);
                    apiClient.saveInspectionScheduleRealization(payload);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Realisasi inspeksi tersimpan", Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal simpan realisasi" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void showBomDetail(JSONObject item, boolean motor) {
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("equipment", "-"), 18, TEXT, true));
        body.addView(bomPhotoStrip(item, motor), topMargin(-1, dp(10)));
        if (motor) {
            body.addView(dialogLine("Manufacture", item.optString("manufacture", "-")));
            body.addView(dialogLine("No SAP", item.optString("stockNo", "-")));
            body.addView(dialogLine("Material", item.optString("materialDescription", "-")));
            body.addView(dialogLine("Power", item.optString("power", "-")));
            body.addView(dialogLine("Ampere", item.optString("ampere", "-")));
            body.addView(dialogLine("Voltage", item.optString("voltage", "-")));
            body.addView(dialogLine("Speed", item.optString("speed", "-")));
            body.addView(dialogLine("Frame", item.optString("frame", "-")));
            body.addView(dialogLine("Serial", item.optString("serialNumber", "-")));
            body.addView(dialogLine("Note", item.optString("note", "-")));
        } else {
            body.addView(dialogLine("Part", item.optString("part", "-")));
            body.addView(dialogLine("No SAP", item.optString("stockNo", "-")));
            body.addView(dialogLine("Qty", item.optString("qty", "-")));
            body.addView(dialogLine("Material", item.optString("materialDescription", "-")));
            body.addView(dialogLine("Note", item.optString("note", "-")));
            body.addView(dialogLine("Long Text", item.optString("longText", "-")));
        }
        final JSONObject editItem = item;
        final boolean isMotor = motor;
        TextView edit = dialogAction("Edit BOM");
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickBomInput(isMotor, editItem);
            }
        });
        body.addView(edit, topMargin(-1, dp(12)));
        showDetailDialog("Detail BOM", body);
    }

    private void showSparepartDetail(JSONObject item) {
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("name", "-"), 18, TEXT, true));
        body.addView(dialogLine("SAP ID", item.optString("code", "-")));
        body.addView(dialogLine("Stock", item.optString("qty", "-")));
        body.addView(dialogLine("Kondisi", item.optString("condition", "NORMAL")));
        body.addView(dialogLine("Lokasi", item.optString("location", "-")));
        body.addView(dialogLine("Kategori", item.optString("category", "-")));
        body.addView(dialogLine("Equipment", item.optString("equipment", item.optString("equipmentName", "-"))));
        final JSONObject editItem = item;
        TextView edit = dialogAction("Edit Sparepart");
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickSparepartInput(editItem);
            }
        });
        body.addView(edit, topMargin(-1, dp(12)));
        showDetailDialog("Detail Sparepart", body);
    }

    private void showCarbonStockDetail(JSONObject item) {
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("brushName", "-"), 18, TEXT, true));
        body.addView(dialogLine("SAP", item.optString("sapNo", "-")));
        body.addView(dialogLine("Type", item.optString("brushType", item.optString("brushName", "-"))));
        body.addView(dialogLine("Equipment", item.optString("useLabel", "-")));
        body.addView(dialogLine("Stock sekarang", String.valueOf(item.optInt("currentStock", 0))));
        showDetailDialog("Stock Carbon Brush", body);
    }

    private void showStatusDetail() {
        LinearLayout body = dialogBody();
        body.addView(label("Status PLIRM34 Native", 18, TEXT, true));
        body.addView(dialogLine("Koneksi", lastSyncMillis > 0 ? "Live" : "Offline"));
        body.addView(dialogLine("User", currentUser.optString("username", "-")));
        body.addView(dialogLine("Role", currentUser.optString("role", "-")));
        body.addView(dialogLine("Service", String.valueOf(serviceItems.length())));
        body.addView(dialogLine("Negatif", String.valueOf(negatifItems.length())));
        body.addView(dialogLine("BOM", String.valueOf(bomItems.length() + bomMotorItems.length())));
        body.addView(dialogLine("Sparepart", String.valueOf(sparepartItems.length())));
        showDetailDialog("Status", body);
    }

    private void showDetailDialog(String title, LinearLayout body) {
        AlertDialog dialog = buildActionDialog(title, body, "Tutup", "Tutup", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
            }
        });
        dialog.show();
    }

    private void appendJsonFields(LinearLayout body, JSONObject object, String prefix) {
        if (object == null) {
            return;
        }
        Iterator<String> keys = object.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = object.opt(key);
            if (value instanceof JSONObject) {
                body.addView(label(prettyKey(key), 13, TEXT, true), topMargin(-1, dp(8)));
                appendJsonFields(body, (JSONObject) value, prefix + "." + key);
            } else if (value instanceof JSONArray) {
                body.addView(dialogLine(prettyKey(key), joinArray((JSONArray) value)));
            } else if (value != null && value != JSONObject.NULL) {
                body.addView(dialogLine(prettyKey(key), String.valueOf(value)));
            }
        }
    }

    private String prettyKey(String raw) {
        String value = String.valueOf(raw == null ? "" : raw).replace("_", " ").trim();
        if (value.length() == 0) {
            return "-";
        }
        StringBuilder out = new StringBuilder();
        char previous = 0;
        for (int i = 0; i < value.length(); i++) {
            char current = value.charAt(i);
            if (i > 0 && Character.isUpperCase(current) && Character.isLowerCase(previous)) {
                out.append(' ');
            }
            out.append(i == 0 ? Character.toUpperCase(current) : current);
            previous = current;
        }
        return out.toString();
    }

    private LinearLayout brushGrid(JSONObject payload) {
        HorizontalScrollView hsv = new HorizontalScrollView(this);
        GridLayout grid = new GridLayout(this);
        grid.setColumnCount(9);
        JSONObject measurements = payload == null ? null : payload.optJSONObject("measurements");
        JSONArray replacedPoints = payload == null ? null : payload.optJSONArray("replacedPoints");
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        for (int rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            for (int col = 1; col <= 9; col++) {
                String key = rows[rowIndex] + col;
                String value = measurements == null ? "" : measurements.optString(key, "");
                boolean replaced = jsonArrayContains(replacedPoints, key);
                TextView tv = label(key + "\n" + (replaced ? "BARU" : value.length() == 0 ? "-" : value), 12, replaced ? Color.rgb(4, 28, 29) : TEXT, true);
                tv.setGravity(Gravity.CENTER);
                int bg = replaced ? TEAL : measurementColor(value);
                tv.setBackground(rounded(bg, replaced ? TEAL : BORDER, 10));
                GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
                lp.width = dp(58);
                lp.height = dp(62);
                lp.setMargins(dp(3), dp(3), dp(3), dp(3));
                grid.addView(tv, lp);
            }
        }
        hsv.addView(grid);
        LinearLayout wrap = card(12);
        wrap.addView(label("Preview measurement Carbon Brush terakhir", 13, TEXT, true));
        wrap.addView(label("Biru/teal menandai titik yang sudah diganti dan tidak dihitung sebagai warning lama.", 12, MUTED, false), topMargin(-1, dp(4)));
        wrap.addView(hsv, topMargin(-1, dp(8)));
        return wrap;
    }

    private View lightBrushGrid(JSONObject payload) {
        HorizontalScrollView hsv = new HorizontalScrollView(this);
        GridLayout grid = new GridLayout(this);
        grid.setColumnCount(6);
        JSONObject measurements = payload == null ? null : payload.optJSONObject("measurements");
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        for (int rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            for (int col = 1; col <= 9; col++) {
                String key = rows[rowIndex] + col;
                String value = measurements == null ? "" : measurements.optString(key, "");
                boolean replaced = payload != null && jsonArrayContains(payload.optJSONArray("replacedPoints"), key);
                TextView tv = label(key + "\n" + (replaced ? "BARU" : value.length() == 0 ? "-" : value), 11, replaced ? Color.rgb(3, 24, 27) : TEXT, true);
                tv.setGravity(Gravity.CENTER);
                tv.setBackground(rounded(replaced ? TEAL : measurementColor(value), replaced ? TEAL : BORDER, 8));
                GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
                lp.width = dp(50);
                lp.height = dp(54);
                lp.setMargins(dp(3), dp(3), dp(3), dp(3));
                grid.addView(tv, lp);
            }
        }
        hsv.addView(grid);
        return hsv;
    }

    private LinearLayout formCard(String title, String... lines) {
        LinearLayout card = card(12);
        card.addView(label(title, 15, TEXT, true));
        for (String line : lines) {
            card.addView(label(line, 12, MUTED, false), topMargin(-1, dp(8)));
        }
        return card;
    }

    private LinearLayout statCard(String title, String value, int valueColor) {
        LinearLayout card = card(10);
        card.addView(label(title, 10, MUTED, true));
        card.addView(label(value, 24, valueColor, true));
        return card;
    }

    private LinearLayout mutation(String type, String movement, String ref, int color) {
        LinearLayout row = card(10);
        row.setOrientation(LinearLayout.HORIZONTAL);
        TextView dot = label("*", 18, color, false);
        row.addView(dot, new LinearLayout.LayoutParams(dp(28), -2));
        LinearLayout col = column(2);
        col.addView(label(type + "  " + movement, 12, TEXT, true));
        col.addView(label(ref, 11, MUTED, false));
        row.addView(col, new LinearLayout.LayoutParams(0, -2, 1));
        return row;
    }

    private LinearLayout negatifCard(final JSONObject item, boolean compact) {
        String status = item.optString("workStatus", "Open");
        int color = "open".equalsIgnoreCase(status) ? AMBER : GREEN;
        LinearLayout card = actionCard(12);
        card.addView(rowBetween(item.optString("equipment", "-"), badge(status.toUpperCase(Locale.ROOT), color)));
        card.addView(label(item.optString("damageDescription", "-"), 13, TEXT, true), topMargin(-1, dp(5)));
        card.addView(label(item.optString("pendingMark", "-") + " | " + item.optString("area", "-"), 11, MUTED, false), topMargin(-1, dp(5)));
        if (!compact) {
            card.addView(label("Plan: " + item.optString("followUpPlan", "-"), 11, MUTED, false), topMargin(-1, dp(6)));
            LinearLayout actions = row(8);
            TextView edit = smallActionButton("Edit", BLUE);
            edit.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showQuickNegatifInput(item);
                }
            });
            actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
            card.addView(actions, topMargin(-1, dp(10)));
        }
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showNegatifDetail(item);
            }
        });
        return card;
    }

    private LinearLayout spbCard(final JSONObject item) {
        LinearLayout card = actionCard(12);
        card.addView(rowBetween(item.optString("stockNo", "-"), badge(item.optString("spbType", "SPB"), BLUE)));
        card.addView(label(item.optString("materialDescription", "-"), 13, TEXT, true), topMargin(-1, dp(5)));
        card.addView(label("PR " + item.optString("prNo", "-") + " | PO " + item.optString("poNo", "-") + " | Qty " + item.optString("qty", "-"), 11, MUTED, false), topMargin(-1, dp(5)));
        LinearLayout actions = row(8);
        TextView edit = smallActionButton("Edit", BLUE);
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickSpbInput(item);
            }
        });
        actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
        card.addView(actions, topMargin(-1, dp(10)));
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showSpbDetail(item);
            }
        });
        return card;
    }

    private LinearLayout userCard(final JSONObject user) {
        LinearLayout card = actionCard(12);
        int color = "admin".equalsIgnoreCase(user.optString("role", "")) ? RED : "organik".equalsIgnoreCase(user.optString("role", "")) ? AMBER : GREEN;
        card.addView(rowBetween(user.optString("username", "-"), badge(user.optString("role", "-").toUpperCase(Locale.ROOT), color)));
        card.addView(label("Dibuat: " + formatDate(user.optString("createdAt", "")), 11, MUTED, false), topMargin(-1, dp(5)));
        LinearLayout actions = row(8);
        TextView role = smallActionButton("Ubah Role", BLUE);
        role.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showUserRoleDialog(user);
            }
        });
        TextView delete = smallActionButton("Hapus", RED);
        delete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirmDeleteUser(user);
            }
        });
        actions.addView(role, new LinearLayout.LayoutParams(0, dp(46), 1));
        actions.addView(delete, new LinearLayout.LayoutParams(0, dp(46), 1));
        card.addView(actions, topMargin(-1, dp(12)));
        return card;
    }

    private void showUserRoleDialog(final JSONObject user) {
        final String username = user.optString("username", "");
        LinearLayout body = dialogBody();
        body.addView(label(username, 18, TEXT, true));
        body.addView(label("Pilih role untuk akun ini.", 13, MUTED, false), topMargin(-1, dp(4)));
        final AlertDialog[] dialogRef = new AlertDialog[1];
        String[] roles = {"admin", "organik", "team"};
        for (final String role : roles) {
            TextView action = dialogAction(role.toUpperCase(Locale.ROOT));
            action.setBackground(selectableBackground(role.equalsIgnoreCase(user.optString("role", "")) ? TEAL : SURFACE_FLOAT, role.equalsIgnoreCase(user.optString("role", "")) ? TEAL : BORDER_SOFT, 14));
            action.setTextColor(role.equalsIgnoreCase(user.optString("role", "")) ? Color.rgb(3, 24, 27) : TEXT);
            action.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (dialogRef[0] != null) {
                        dialogRef[0].dismiss();
                    }
                    updateUserRole(username, role);
                }
            });
            body.addView(action, topMargin(-1, dp(9)));
        }
        dialogRef[0] = buildActionDialog("Ubah Role", body, "Tutup", "Tutup", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
            }
        });
        dialogRef[0].show();
    }

    private void updateUserRole(final String username, final String role) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan.", Toast.LENGTH_LONG).show();
            return;
        }
        Toast.makeText(this, "Mengubah role user...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject response = apiClient.updateUserRole(username, role);
                    userItems = response.optJSONArray("users") != null ? response.optJSONArray("users") : userItems;
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Role user diperbarui", Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal ubah role" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void confirmDeleteUser(final JSONObject user) {
        final String username = user.optString("username", "");
        LinearLayout body = dialogBody();
        body.addView(label("Hapus " + username + "?", 18, TEXT, true));
        body.addView(label("Akun dan sesi aktifnya akan dihapus dari server.", 13, MUTED, false), topMargin(-1, dp(8)));
        AlertDialog dialog = buildActionDialog("Hapus User", body, "Batal", "Hapus", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                deleteUser(username);
            }
        });
        dialog.show();
    }

    private void deleteUser(final String username) {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan.", Toast.LENGTH_LONG).show();
            return;
        }
        Toast.makeText(this, "Menghapus user...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject response = apiClient.deleteUser(username);
                    userItems = response.optJSONArray("users") != null ? response.optJSONArray("users") : userItems;
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "User dihapus", Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal hapus user" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void showWhatsappSetupDialog() {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk setup WhatsApp.", Toast.LENGTH_LONG).show();
            return;
        }
        Toast.makeText(this, "Membuka setup WhatsApp...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    final JSONObject response = apiClient.whatsappBot();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            renderWhatsappSetupDialog(response);
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal membuka setup WhatsApp" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void renderWhatsappSetupDialog(JSONObject response) {
        JSONObject settings = response == null ? null : response.optJSONObject("settings");
        JSONObject status = response == null ? null : response.optJSONObject("status");
        final LinearLayout body = dialogBody();
        body.addView(label("WhatsApp Bot", 18, TEXT, true));
        String statusText = status == null ? "Status belum tersedia" : status.optString("message", status.optString("state", "Status belum tersedia"));
        body.addView(label(statusText, 12, MUTED, false), topMargin(-1, dp(5)));
        final TextView enabled = toggleRow("Bot aktif", settings == null || settings.optBoolean("enabled", false));
        final TextView autoWrite = toggleRow("Auto write negatif", settings == null || settings.optBoolean("autoWriteEnabled", true));
        final TextView daily = toggleRow("Kirim jadwal harian", settings == null || settings.optBoolean("dailyScheduleEnabled", true));
        final EditText groupId = lightInput("Group ID WhatsApp");
        final EditText groupName = lightInput("Nama group");
        final EditText time = lightInput("Jam jadwal HH:MM");
        final EditText prefix = lightInput("Command prefix");
        groupId.setSingleLine(true);
        groupName.setSingleLine(true);
        time.setSingleLine(true);
        prefix.setSingleLine(true);
        if (settings != null) {
            groupId.setText(settings.optString("groupId", ""));
            groupName.setText(settings.optString("groupName", ""));
            time.setText(settings.optString("dailyScheduleTime", "08:00"));
            prefix.setText(settings.optString("commandPrefix", "!"));
        } else {
            time.setText("08:00");
            prefix.setText("!");
        }
        body.addView(enabled, topMargin(-1, dp(10)));
        body.addView(autoWrite, topMargin(-1, dp(8)));
        body.addView(daily, topMargin(-1, dp(8)));
        body.addView(groupId);
        body.addView(groupName);
        body.addView(time);
        body.addView(prefix);
        TextView reset = linkButton("Reset Token Bot");
        reset.setTextColor(AMBER);
        reset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                resetWhatsappToken();
            }
        });
        body.addView(reset, topMargin(-1, dp(10), dp(48)));
        final AlertDialog dialog = buildActionDialog("Setup WhatsApp", body, "Batal", "Simpan", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                JSONObject payload = new JSONObject();
                try {
                    payload.put("enabled", Boolean.TRUE.equals(enabled.getTag()));
                    payload.put("autoWriteEnabled", Boolean.TRUE.equals(autoWrite.getTag()));
                    payload.put("dailyScheduleEnabled", Boolean.TRUE.equals(daily.getTag()));
                    payload.put("groupId", textOf(groupId));
                    payload.put("groupName", textOf(groupName));
                    payload.put("dailyScheduleTime", textOf(time).length() == 0 ? "08:00" : textOf(time));
                    payload.put("commandPrefix", textOf(prefix).length() == 0 ? "!" : textOf(prefix));
                } catch (JSONException ignored) {
                }
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                saveWhatsappSettings(payload);
            }
        });
        dialog.show();
    }

    private TextView toggleRow(final String text, boolean checked) {
        final TextView toggle = label("", 13, TEXT, true);
        toggle.setGravity(Gravity.CENTER_VERTICAL);
        toggle.setMinHeight(dp(48));
        toggle.setPadding(dp(14), 0, dp(14), 0);
        toggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean next = !Boolean.TRUE.equals(toggle.getTag());
                setToggleState(toggle, text, next);
            }
        });
        setToggleState(toggle, text, checked);
        return toggle;
    }

    private void setToggleState(TextView toggle, String text, boolean checked) {
        toggle.setTag(Boolean.valueOf(checked));
        toggle.setText((checked ? "ON  " : "OFF ") + text);
        toggle.setTextColor(checked ? Color.rgb(3, 24, 27) : TEXT);
        toggle.setBackground(selectableBackground(checked ? TEAL : SURFACE_FLOAT, checked ? TEAL : BORDER_SOFT, 14));
    }

    private void saveWhatsappSettings(final JSONObject payload) {
        Toast.makeText(this, "Menyimpan setup WhatsApp...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    apiClient.saveWhatsappBot(payload);
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Setup WhatsApp tersimpan", Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal simpan WhatsApp" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void resetWhatsappToken() {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan.", Toast.LENGTH_LONG).show();
            return;
        }
        Toast.makeText(this, "Reset token WhatsApp...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    apiClient.resetWhatsappBotToken();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Token bot direset", Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal reset token" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void showMasterEquipmentDialog() {
        if (apiClient == null) {
            Toast.makeText(this, "Login live diperlukan untuk Master Equipment.", Toast.LENGTH_LONG).show();
            return;
        }
        Toast.makeText(this, "Memuat Master Equipment...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject response = apiClient.adminMaster("equipment-references");
                    JSONArray items = response.optJSONArray("items");
                    if (items != null) {
                        equipmentReferenceItems = items;
                    }
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            renderMasterEquipmentDialog();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal memuat Master Equipment" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void renderMasterEquipmentDialog() {
        LinearLayout body = dialogBody();
        body.addView(label("Master Equipment", 18, TEXT, true));
        body.addView(label(equipmentReferenceItems.length() + " referensi equipment untuk picker service.", 12, MUTED, false), topMargin(-1, dp(5)));
        TextView add = dialogAction("Tambah Equipment");
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showEquipmentReferenceForm(null);
            }
        });
        body.addView(add, topMargin(-1, dp(10)));
        final LinearLayout list = column(8);
        body.addView(searchField("Cari equipment, group, area", equipmentSetupSearchQuery, new SearchCallback() {
            @Override
            public void onChanged(String value) {
                if (value.equals(equipmentSetupSearchQuery)) {
                    return;
                }
                equipmentSetupSearchQuery = value;
                populateEquipmentReferenceList(list);
            }
        }), topMargin(-1, dp(10)));
        populateEquipmentReferenceList(list);
        body.addView(list);
        AlertDialog dialog = buildActionDialog("Master Equipment", body, "Tutup", "Tutup", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
            }
        });
        dialog.show();
    }

    private void populateEquipmentReferenceList(LinearLayout list) {
        if (list == null) {
            return;
        }
        list.removeAllViews();
        List<JSONObject> filtered = filterByQuery(toList(equipmentReferenceItems), equipmentSetupSearchQuery, new String[]{"sourceGroup", "equipmentCode", "equipmentName", "category", "area", "plant"});
        if (filtered.isEmpty()) {
            list.addView(emptyCard("Equipment tidak ditemukan", "Ubah kata kunci atau tambah referensi baru."));
        }
        for (int i = 0; i < Math.min(18, filtered.size()); i++) {
            list.addView(equipmentReferenceCard(filtered.get(i)), topMargin(-1, dp(8)));
        }
    }

    private LinearLayout equipmentReferenceCard(final JSONObject item) {
        LinearLayout card = card(10);
        card.addView(rowBetween(item.optString("equipmentName", "-"), badge(item.optString("sourceGroup", "-"), BLUE)));
        card.addView(label(item.optString("equipmentCode", "-") + " | " + item.optString("category", "-") + " | " + item.optString("area", "-"), 11, MUTED, false), topMargin(-1, dp(5)));
        LinearLayout actions = row(8);
        TextView edit = smallActionButton("Edit", BLUE);
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showEquipmentReferenceForm(item);
            }
        });
        TextView delete = smallActionButton("Hapus", RED);
        delete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                confirmDeleteEquipmentReference(item);
            }
        });
        actions.addView(edit, new LinearLayout.LayoutParams(0, dp(44), 1));
        actions.addView(delete, new LinearLayout.LayoutParams(0, dp(44), 1));
        card.addView(actions, topMargin(-1, dp(10)));
        return card;
    }

    private void showEquipmentReferenceForm(final JSONObject editingItem) {
        final boolean editing = editingItem != null;
        LinearLayout form = quickFormBody(editing ? "Edit Equipment" : "Tambah Equipment");
        final EditText sourceGroup = lightInput("Source group, contoh carbon-brush");
        final EditText code = lightInput("Equipment code");
        final EditText name = lightInput("Equipment name");
        final EditText category = lightInput("Category");
        final EditText area = lightInput("Area");
        final EditText plant = lightInput("Plant");
        sourceGroup.setSingleLine(true);
        code.setSingleLine(true);
        name.setSingleLine(true);
        category.setSingleLine(true);
        area.setSingleLine(true);
        plant.setSingleLine(true);
        if (editing) {
            sourceGroup.setText(editingItem.optString("sourceGroup", ""));
            code.setText(editingItem.optString("equipmentCode", ""));
            name.setText(editingItem.optString("equipmentName", ""));
            category.setText(editingItem.optString("category", ""));
            area.setText(editingItem.optString("area", ""));
            plant.setText(editingItem.optString("plant", ""));
        } else {
            sourceGroup.setText("carbon-brush");
        }
        form.addView(sourceGroup);
        form.addView(code);
        form.addView(name);
        form.addView(category);
        form.addView(area);
        form.addView(plant);
        showSaveDialog("Master Equipment", form, new SaveAction() {
            @Override
            public boolean run() {
                if (textOf(sourceGroup).length() == 0 || textOf(name).length() == 0) {
                    Toast.makeText(MainActivity.this, "Source group dan equipment wajib diisi", Toast.LENGTH_SHORT).show();
                    return false;
                }
                JSONObject item = copyJson(editingItem);
                try {
                    item.put("sourceGroup", textOf(sourceGroup));
                    item.put("equipmentCode", textOf(code).length() == 0 ? textOf(name).split(" ")[0] : textOf(code));
                    item.put("equipmentName", textOf(name));
                    item.put("category", textOf(category));
                    item.put("area", textOf(area));
                    item.put("plant", textOf(plant));
                } catch (JSONException ignored) {
                }
                saveEquipmentReference(item);
                return true;
            }
        });
    }

    private void saveEquipmentReference(final JSONObject item) {
        Toast.makeText(this, "Menyimpan Master Equipment...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject response = apiClient.saveAdminMasterRecord("equipment-references", item);
                    JSONObject saved = response.optJSONObject("item") != null ? response.optJSONObject("item") : item;
                    replaceOrAppendEquipmentReference(saved);
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Master Equipment tersimpan", Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal simpan Master Equipment" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void confirmDeleteEquipmentReference(final JSONObject item) {
        LinearLayout body = dialogBody();
        body.addView(label("Hapus Equipment?", 18, TEXT, true));
        body.addView(label(item.optString("equipmentName", "-"), 13, MUTED, false), topMargin(-1, dp(8)));
        AlertDialog dialog = buildActionDialog("Hapus Equipment", body, "Batal", "Hapus", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                deleteEquipmentReference(item);
            }
        });
        dialog.show();
    }

    private void deleteEquipmentReference(final JSONObject item) {
        final String identifier = equipmentReferenceIdentifier(item);
        Toast.makeText(this, "Menghapus Master Equipment...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    apiClient.deleteAdminMasterRecord("equipment-references", identifier);
                    removeEquipmentReference(identifier);
                    lastSyncMillis = System.currentTimeMillis();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "Master Equipment dihapus", Toast.LENGTH_SHORT).show();
                            renderSelected();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Gagal hapus Master Equipment" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private String equipmentReferenceIdentifier(JSONObject item) {
        if (item == null) {
            return "";
        }
        String id = item.optString("id", "");
        if (id.length() > 0) {
            return id;
        }
        String composite = item.optString("sourceGroup", "") + "|" + item.optString("equipmentCode", "") + "|" + item.optString("equipmentName", "");
        return composite.replace("||", "|");
    }

    private boolean sameEquipmentReference(JSONObject left, JSONObject right) {
        if (left == null || right == null) {
            return false;
        }
        String leftId = left.optString("id", "");
        String rightId = right.optString("id", "");
        if (leftId.length() > 0 && leftId.equals(rightId)) {
            return true;
        }
        return left.optString("sourceGroup", "").equalsIgnoreCase(right.optString("sourceGroup", ""))
                && left.optString("equipmentCode", "").equalsIgnoreCase(right.optString("equipmentCode", ""))
                && left.optString("equipmentName", "").equalsIgnoreCase(right.optString("equipmentName", ""));
    }

    private void replaceOrAppendEquipmentReference(JSONObject item) {
        if (item == null) {
            return;
        }
        for (int i = 0; i < equipmentReferenceItems.length(); i++) {
            JSONObject current = equipmentReferenceItems.optJSONObject(i);
            if (sameEquipmentReference(current, item)) {
                try {
                    equipmentReferenceItems.put(i, item);
                } catch (JSONException ignored) {
                }
                return;
            }
        }
        equipmentReferenceItems.put(item);
    }

    private void removeEquipmentReference(String identifier) {
        JSONArray next = new JSONArray();
        for (int i = 0; i < equipmentReferenceItems.length(); i++) {
            JSONObject item = equipmentReferenceItems.optJSONObject(i);
            if (item == null) {
                continue;
            }
            if (identifier.equals(equipmentReferenceIdentifier(item))
                    || identifier.equals(item.optString("equipmentName", ""))) {
                continue;
            }
            next.put(item);
        }
        equipmentReferenceItems = next;
    }

    private void showNegatifDetail(JSONObject item) {
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("equipment", "-"), 18, TEXT, true));
        body.addView(dialogLine("Status", item.optString("workStatus", "-")));
        body.addView(dialogLine("Kerusakan", item.optString("damageDescription", "-")));
        body.addView(dialogLine("Follow up", item.optString("followUpPlan", "-")));
        body.addView(dialogLine("Mark", item.optString("pendingMark", "-")));
        body.addView(dialogLine("Tanggal", formatDate(item.optString("foundDate", ""))));
        body.addView(dialogLine("Area", item.optString("area", "-")));
        body.addView(dialogLine("Kategori", item.optString("category", "-")));
        final JSONObject editItem = item;
        TextView edit = dialogAction("Edit Negatif List");
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickNegatifInput(editItem);
            }
        });
        body.addView(edit, topMargin(-1, dp(12)));
        showDetailDialog("Negatif List", body);
    }

    private void showSpbDetail(JSONObject item) {
        LinearLayout body = dialogBody();
        body.addView(label(item.optString("materialDescription", "-"), 18, TEXT, true));
        body.addView(dialogLine("Stock No", item.optString("stockNo", "-")));
        body.addView(dialogLine("Type", item.optString("spbType", "-")));
        body.addView(dialogLine("Notification", item.optString("notificationNo", "-")));
        body.addView(dialogLine("Order", item.optString("orderNo", "-")));
        body.addView(dialogLine("Reservation", item.optString("reservationNo", "-")));
        body.addView(dialogLine("Qty", item.optString("qty", "-")));
        body.addView(dialogLine("PR/PO", item.optString("prNo", "-") + " / " + item.optString("poNo", "-")));
        body.addView(dialogLine("Delivery", formatDate(item.optString("deliveryDate", ""))));
        body.addView(dialogLine("Note", item.optString("note", "-")));
        final JSONObject editItem = item;
        TextView edit = dialogAction("Edit SPB");
        edit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showQuickSpbInput(editItem);
            }
        });
        body.addView(edit, topMargin(-1, dp(12)));
        showDetailDialog("SPB", body);
    }

    private LinearLayout metric(String title, String value) {
        LinearLayout m = column(2);
        m.setPadding(dp(10), dp(8), dp(10), dp(8));
        m.setBackground(rounded(Color.rgb(13, 30, 35), BORDER, 16));
        m.addView(label(title, 10, MUTED, false));
        m.addView(label(value == null || value.length() == 0 ? "-" : value, 14, TEXT, true), topMargin(-1, dp(2)));
        return m;
    }

    private LinearLayout dialogBody() {
        LinearLayout body = column(8);
        body.setPadding(dp(14), dp(12), dp(14), dp(12));
        body.setBackgroundColor(SURFACE);
        return body;
    }

    private LinearLayout dialogLine(String title, String value) {
        LinearLayout line = column(2);
        line.setPadding(0, dp(5), 0, dp(5));
        line.addView(label(title, 11, MUTED, true));
        line.addView(label(value == null || value.length() == 0 ? "-" : value, 13, TEXT, false));
        return line;
    }

    private TextView dialogAction(String text) {
        TextView action = label(text, 13, Color.rgb(3, 24, 27), true);
        action.setGravity(Gravity.CENTER);
        action.setMinHeight(dp(48));
        action.setPadding(dp(12), 0, dp(12), 0);
        action.setBackground(selectableBackground(TEAL, TEAL, 14));
        action.setClickable(true);
        action.setFocusable(true);
        action.setDuplicateParentStateEnabled(false);
        return action;
    }

    private TextView smallActionButton(String text, int color) {
        TextView action = label(text, 13, color == AMBER || color == TEAL ? Color.rgb(4, 28, 29) : Color.WHITE, true);
        action.setGravity(Gravity.CENTER);
        action.setMinHeight(dp(48));
        action.setPadding(dp(12), 0, dp(12), 0);
        action.setBackground(selectableBackground(color, color, 18));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            action.setElevation(dp(3));
        }
        action.setClickable(true);
        action.setFocusable(true);
        action.setDuplicateParentStateEnabled(false);
        return action;
    }

    private AlertDialog buildActionDialog(String title, View body, String cancelText, String primaryText, final View.OnClickListener primaryClick) {
        LinearLayout shell = column(0);
        shell.setPadding(dp(14), dp(12), dp(14), dp(12));
        shell.setBackground(rounded(SURFACE, BORDER_SOFT, 18));

        LinearLayout top = row(10);
        top.setGravity(Gravity.CENTER_VERTICAL);
        IconGlyph marker = new IconGlyph(this, "service", TEAL);
        top.addView(marker, new LinearLayout.LayoutParams(dp(30), dp(30)));
        LinearLayout titleCol = column(1);
        titleCol.addView(label(title, 18, TEXT, true));
        titleCol.addView(label("PLIRM34 native form", 11, MUTED, false));
        top.addView(titleCol, new LinearLayout.LayoutParams(0, -2, 1));
        shell.addView(top);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(false);
        scroll.addView(body, matchWrap());
        shell.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));

        LinearLayout actions = row(8);
        actions.setPadding(0, dp(10), 0, 0);
        TextView cancel = smallActionButton(cancelText, SURFACE_FLOAT);
        cancel.setTextColor(TEXT);
        TextView primary = smallActionButton(primaryText, TEAL);
        actions.addView(cancel, new LinearLayout.LayoutParams(0, dp(48), 1));
        actions.addView(primary, new LinearLayout.LayoutParams(0, dp(48), 1));
        shell.addView(actions);

        final AlertDialog dialog = new AlertDialog.Builder(this).setView(shell).create();
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        primary.setTag(dialog);
        primary.setOnClickListener(primaryClick);
        dialog.setOnShowListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(DialogInterface d) {
                applyDialogWindowStyle(dialog, 0.92f, 0.88f);
            }
        });
        return dialog;
    }

    private void applyDialogWindowStyle(AlertDialog dialog, float widthFactor, float heightFactor) {
        Window window = dialog == null ? null : dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setBackgroundDrawableResource(android.R.color.transparent);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.copyFrom(window.getAttributes());
        params.width = (int) (getResources().getDisplayMetrics().widthPixels * widthFactor);
        params.height = (int) (getResources().getDisplayMetrics().heightPixels * heightFactor);
        window.setAttributes(params);
    }

    private int boxedStroke(int fillColor) {
        return fillColor == Color.TRANSPARENT ? Color.TRANSPARENT : BORDER_SOFT;
    }

    private IconButton iconButton(String iconName, int iconColor, int fillColor, String contentDescription) {
        IconButton button = new IconButton(this, iconName, iconColor, fillColor);
        button.setContentDescription(contentDescription);
        button.setClickable(true);
        button.setFocusable(true);
        return button;
    }

    private FrameLayout iconTile(String iconName, int color) {
        FrameLayout tile = new FrameLayout(this);
        int fill = color == TEXT ? SURFACE_FLOAT : Color.argb(54, Color.red(color), Color.green(color), Color.blue(color));
        tile.setPadding(dp(10), dp(10), dp(10), dp(10));
        tile.setBackground(rounded(fill, color, 12));
        tile.addView(new IconGlyph(this, iconName, color), new FrameLayout.LayoutParams(-1, -1, Gravity.CENTER));
        return tile;
    }

    private class IconButton extends FrameLayout {
        IconButton(android.content.Context context, String name, int color, int fillColor) {
            super(context);
            setPadding(dp(11), dp(11), dp(11), dp(11));
            setBackground(selectableBackground(fillColor, color, 14));
            IconGlyph glyph = new IconGlyph(context, name, color);
            addView(glyph, new FrameLayout.LayoutParams(-1, -1, Gravity.CENTER));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                setElevation(dp(3));
            }
        }
    }

    private class IconGlyph extends View {
        private final String name;
        private final int color;
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        IconGlyph(android.content.Context context, String name, int color) {
            super(context);
            this.name = name == null ? "" : name;
            this.color = color;
        }

        @Override
        protected void onDraw(Canvas canvas) {
            super.onDraw(canvas);
            float w = getWidth();
            float h = getHeight();
            float s = Math.min(w, h);
            float x = (w - s) / 2f;
            float y = (h - s) / 2f;
            paint.setColor(color);
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(Math.max(2f, s * 0.08f));
            paint.setStrokeCap(Paint.Cap.ROUND);
            paint.setStrokeJoin(Paint.Join.ROUND);
            if ("home".equals(name)) {
                Path roof = new Path();
                roof.moveTo(x + s * 0.18f, y + s * 0.48f);
                roof.lineTo(x + s * 0.50f, y + s * 0.20f);
                roof.lineTo(x + s * 0.82f, y + s * 0.48f);
                canvas.drawPath(roof, paint);
                canvas.drawRoundRect(new RectF(x + s * 0.28f, y + s * 0.46f, x + s * 0.72f, y + s * 0.80f), s * 0.06f, s * 0.06f, paint);
            } else if ("service".equals(name)) {
                canvas.drawLine(x + s * 0.24f, y + s * 0.28f, x + s * 0.76f, y + s * 0.28f, paint);
                canvas.drawLine(x + s * 0.24f, y + s * 0.50f, x + s * 0.76f, y + s * 0.50f, paint);
                canvas.drawLine(x + s * 0.24f, y + s * 0.72f, x + s * 0.76f, y + s * 0.72f, paint);
                paint.setStyle(Paint.Style.FILL);
                canvas.drawCircle(x + s * 0.34f, y + s * 0.28f, s * 0.07f, paint);
                canvas.drawCircle(x + s * 0.62f, y + s * 0.50f, s * 0.07f, paint);
                canvas.drawCircle(x + s * 0.44f, y + s * 0.72f, s * 0.07f, paint);
            } else if ("bom".equals(name)) {
                canvas.drawRoundRect(new RectF(x + s * 0.22f, y + s * 0.22f, x + s * 0.78f, y + s * 0.78f), s * 0.08f, s * 0.08f, paint);
                canvas.drawLine(x + s * 0.22f, y + s * 0.42f, x + s * 0.78f, y + s * 0.42f, paint);
                canvas.drawLine(x + s * 0.42f, y + s * 0.22f, x + s * 0.42f, y + s * 0.78f, paint);
            } else if ("sparepart".equals(name)) {
                canvas.drawCircle(x + s * 0.50f, y + s * 0.50f, s * 0.24f, paint);
                for (int i = 0; i < 6; i++) {
                    double a = Math.PI * 2 * i / 6;
                    float cx = (float) (x + s * 0.50f + Math.cos(a) * s * 0.34f);
                    float cy = (float) (y + s * 0.50f + Math.sin(a) * s * 0.34f);
                    canvas.drawLine(x + s * 0.50f, y + s * 0.50f, cx, cy, paint);
                }
            } else if ("more".equals(name)) {
                paint.setStyle(Paint.Style.FILL);
                canvas.drawCircle(x + s * 0.28f, y + s * 0.50f, s * 0.08f, paint);
                canvas.drawCircle(x + s * 0.50f, y + s * 0.50f, s * 0.08f, paint);
                canvas.drawCircle(x + s * 0.72f, y + s * 0.50f, s * 0.08f, paint);
            } else if ("sync".equals(name)) {
                canvas.drawArc(new RectF(x + s * 0.22f, y + s * 0.22f, x + s * 0.78f, y + s * 0.78f), -35, 265, false, paint);
                Path arrow = new Path();
                arrow.moveTo(x + s * 0.72f, y + s * 0.18f);
                arrow.lineTo(x + s * 0.82f, y + s * 0.36f);
                arrow.lineTo(x + s * 0.62f, y + s * 0.34f);
                canvas.drawPath(arrow, paint);
            } else if ("logout".equals(name)) {
                canvas.drawLine(x + s * 0.28f, y + s * 0.26f, x + s * 0.28f, y + s * 0.74f, paint);
                canvas.drawLine(x + s * 0.28f, y + s * 0.26f, x + s * 0.52f, y + s * 0.26f, paint);
                canvas.drawLine(x + s * 0.28f, y + s * 0.74f, x + s * 0.52f, y + s * 0.74f, paint);
                canvas.drawLine(x + s * 0.44f, y + s * 0.50f, x + s * 0.78f, y + s * 0.50f, paint);
                canvas.drawLine(x + s * 0.66f, y + s * 0.38f, x + s * 0.78f, y + s * 0.50f, paint);
                canvas.drawLine(x + s * 0.66f, y + s * 0.62f, x + s * 0.78f, y + s * 0.50f, paint);
            } else if ("user".equals(name)) {
                canvas.drawCircle(x + s * 0.50f, y + s * 0.34f, s * 0.14f, paint);
                canvas.drawRoundRect(new RectF(x + s * 0.27f, y + s * 0.56f, x + s * 0.73f, y + s * 0.82f), s * 0.12f, s * 0.12f, paint);
            } else if ("whatsapp".equals(name)) {
                canvas.drawRoundRect(new RectF(x + s * 0.18f, y + s * 0.18f, x + s * 0.82f, y + s * 0.72f), s * 0.16f, s * 0.16f, paint);
                Path tail = new Path();
                tail.moveTo(x + s * 0.36f, y + s * 0.72f);
                tail.lineTo(x + s * 0.24f, y + s * 0.84f);
                tail.lineTo(x + s * 0.50f, y + s * 0.72f);
                canvas.drawPath(tail, paint);
                canvas.drawArc(new RectF(x + s * 0.34f, y + s * 0.30f, x + s * 0.68f, y + s * 0.64f), 135, 250, false, paint);
                canvas.drawLine(x + s * 0.48f, y + s * 0.42f, x + s * 0.58f, y + s * 0.52f, paint);
            } else if ("equipment".equals(name)) {
                canvas.drawRoundRect(new RectF(x + s * 0.22f, y + s * 0.24f, x + s * 0.78f, y + s * 0.76f), s * 0.07f, s * 0.07f, paint);
                canvas.drawLine(x + s * 0.34f, y + s * 0.24f, x + s * 0.34f, y + s * 0.14f, paint);
                canvas.drawLine(x + s * 0.66f, y + s * 0.24f, x + s * 0.66f, y + s * 0.14f, paint);
                canvas.drawCircle(x + s * 0.38f, y + s * 0.50f, s * 0.06f, paint);
                canvas.drawCircle(x + s * 0.62f, y + s * 0.50f, s * 0.06f, paint);
                canvas.drawLine(x + s * 0.36f, y + s * 0.76f, x + s * 0.36f, y + s * 0.86f, paint);
                canvas.drawLine(x + s * 0.64f, y + s * 0.76f, x + s * 0.64f, y + s * 0.86f, paint);
            } else {
                paint.setStyle(Paint.Style.FILL);
                canvas.drawCircle(x + s * 0.50f, y + s * 0.50f, s * 0.24f, paint);
            }
        }
    }

    private void shareServiceToWhatsApp(JSONObject item) {
        String text = buildServiceShareText(item);
        Uri imageUri = null;
        try {
            imageUri = createServiceShareImage(item);
        } catch (Exception error) {
            imageUri = null;
        }
        if (imageUri != null && tryShareToPackage("com.whatsapp", text, imageUri)) {
            return;
        }
        if (imageUri != null && tryShareToPackage("com.whatsapp.w4b", text, imageUri)) {
            return;
        }
        if (imageUri == null && tryShareToPackage("com.whatsapp", text, null)) {
            return;
        }
        if (imageUri == null && tryShareToPackage("com.whatsapp.w4b", text, null)) {
            return;
        }
        Intent fallback = new Intent(Intent.ACTION_SEND);
        fallback.setType(imageUri == null ? "text/plain" : "image/png");
        fallback.putExtra(Intent.EXTRA_TEXT, text);
        if (imageUri != null) {
            fallback.putExtra(Intent.EXTRA_STREAM, imageUri);
            fallback.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        Intent chooser = Intent.createChooser(fallback, "Kirim hasil service");
        try {
            startActivity(chooser);
        } catch (Exception error) {
            Toast.makeText(this, "Tidak ada aplikasi untuk kirim pesan.", Toast.LENGTH_LONG).show();
        }
    }

    private boolean tryShareToPackage(String packageName, String text, Uri imageUri) {
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setPackage(packageName);
        intent.putExtra(Intent.EXTRA_TEXT, text);
        if (imageUri != null) {
            intent.setType("image/png");
            intent.putExtra(Intent.EXTRA_STREAM, imageUri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            intent.setType("text/plain");
        }
        try {
            startActivity(intent);
            return true;
        } catch (ActivityNotFoundException error) {
            return false;
        } catch (Exception error) {
            return false;
        }
    }

    private Uri createServiceShareImage(JSONObject item) throws Exception {
        int width = 1080;
        boolean carbonBrush = "service-motor-mv-carbon-brush".equals(item.optString("formType", ""));
        int height = carbonBrush ? 3000 : 1800;
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setTypeface(Typeface.create(Typeface.SANS_SERIF, Typeface.NORMAL));
        canvas.drawColor(BG);

        JSONObject payload = item.optJSONObject("payload");
        int y = 34;
        drawShareRoundRect(canvas, paint, 34, y, width - 34, y + 126, TEAL, 30);
        drawShareText(canvas, paint, "PLIRM34 TUBAN", 62, y + 48, 28, Color.rgb(4, 28, 29), true);
        drawShareText(canvas, paint, carbonBrush ? "Inspeksi Carbon Brush" : "Hasil Inspeksi Service", 62, y + 94, 42, Color.rgb(4, 28, 29), true);
        drawSharePill(canvas, paint, width - 298, y + 36, "FIELD REPORT", Color.rgb(10, 24, 28), TEXT);

        y += 148;
        drawShareRoundRect(canvas, paint, 34, y, width - 34, y + 188, SURFACE, 28);
        drawShareText(canvas, paint, item.optString("equipmentName", "-"), 62, y + 58, 50, TEXT, true);
        drawShareText(canvas, paint, item.optString("subtype", item.optString("type", "-")), 62, y + 106, 28, MUTED, false);
        drawShareText(canvas, paint, "Tanggal: " + formatDate(payload == null ? "" : payload.optString("inspectionDate", "")), 62, y + 154, 28, AMBER, true);
        drawSharePill(canvas, paint, width - 260, y + 46, item.optString("type", "SERVICE").toUpperCase(Locale.ROOT), BLUE, Color.WHITE);

        y += 210;
        y = drawShareSection(canvas, paint, "Temuan", item.optString("description", "-"), 34, y, width - 34);
        y = drawShareSection(canvas, paint, "Detail", item.optString("detail", "-"), 34, y + 10, width - 34);
        if (payload != null && payload.optString("recommendation", "").length() > 0) {
            y = drawShareSection(canvas, paint, "Rekomendasi", payload.optString("recommendation", "-"), 34, y + 10, width - 34);
        }
        if (payload != null && payload.optString("pic", "").length() > 0) {
            y = drawShareSection(canvas, paint, "PIC", payload.optString("pic", "-"), 34, y + 10, width - 34);
        }

        if (carbonBrush && payload != null) {
            y += 10;
            drawShareRoundRect(canvas, paint, 34, y, width - 34, y + 204, SURFACE, 28);
            drawShareText(canvas, paint, "Ringkasan Carbon Brush", 62, y + 48, 30, TEXT, true);
            JSONObject stats = payload.optJSONObject("stats");
            String statsText = stats == null
                    ? "Measurement tersedia di detail inspeksi."
                    : "Merah " + stats.optString("low", "0") + " | Kuning " + stats.optString("medium", "0") + " | Hijau " + stats.optString("high", "0") + " | Terendah " + stats.optString("min", "-") + " mm";
            drawShareWrappedText(canvas, paint, statsText, 62, y + 94, width - 96, 28, Color.rgb(218, 226, 226), false, 2);
            drawShareText(canvas, paint, "Titik diganti", 62, y + 154, 23, MUTED, true);
            drawShareText(canvas, paint, joinArray(payload.optJSONArray("replacedPoints")), 228, y + 154, 32, TEAL, true);
            y += 226;
            y = drawCarbonBrushMeasurementTable(canvas, paint, payload, 34, y, width - 34);
        }

        int footerTop = Math.min(y + 4, height - 120);
        int finalHeight = Math.min(height, Math.max(carbonBrush ? 1850 : 980, footerTop + 94));
        drawShareRoundRect(canvas, paint, 34, footerTop, width - 34, footerTop + 76, SURFACE, 22);
        drawShareText(canvas, paint, "Dibuat dari PLIRM34 Native App", 62, footerTop + 49, 24, MUTED, false);
        drawShareText(canvas, paint, new SimpleDateFormat("dd MMM yyyy HH:mm", Locale("id", "ID")).format(new Date()), width - 330, footerTop + 49, 24, AMBER, true);

        if (finalHeight < height) {
            Bitmap cropped = Bitmap.createBitmap(bitmap, 0, 0, width, finalHeight);
            bitmap.recycle();
            bitmap = cropped;
        }

        String path = MediaStore.Images.Media.insertImage(getContentResolver(), bitmap, "plirm34-service-" + System.currentTimeMillis(), "PLIRM34 service inspection");
        bitmap.recycle();
        if (path == null) {
            throw new Exception("Gagal membuat gambar share");
        }
        return Uri.parse(path);
    }

    private int drawShareSection(Canvas canvas, Paint paint, String title, String value, int left, int top, int right) {
        List<String> lines = wrapText(value == null || value.length() == 0 ? "-" : value, 50);
        int height = 74 + Math.min(4, lines.size()) * 34;
        drawShareRoundRect(canvas, paint, left, top, right, top + height, SURFACE, 24);
        drawShareText(canvas, paint, title, left + 28, top + 42, 22, MUTED, true);
        int y = top + 76;
        for (int i = 0; i < Math.min(4, lines.size()); i++) {
            drawShareText(canvas, paint, lines.get(i), left + 28, y, 28, TEXT, false);
            y += 34;
        }
        return top + height;
    }

    private int drawCarbonBrushMeasurementTable(Canvas canvas, Paint paint, JSONObject payload, int left, int top, int right) {
        JSONObject measurements = payload.optJSONObject("measurements");
        JSONArray replacedPoints = payload.optJSONArray("replacedPoints");
        int tableTop = top + 82;
        int rowHeaderWidth = 46;
        int cellGap = 4;
        int cellWidth = (right - left - 48 - rowHeaderWidth - (8 * cellGap)) / 9;
        int cellHeight = 58;
        int sectionHeight = 82 + 10 * (cellHeight + cellGap) + 88;
        drawShareRoundRect(canvas, paint, left, top, right, top + sectionHeight, SURFACE, 26);
        drawShareText(canvas, paint, "Tabel Measurement A1-I9", left + 24, top + 42, 30, TEXT, true);
        drawShareText(canvas, paint, "Nilai real inspeksi dalam mm. Titik diganti ditandai BARU.", left + 24, top + 72, 21, MUTED, false);

        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        for (int col = 0; col <= 9; col++) {
            int x = left + 24 + (col == 0 ? 0 : rowHeaderWidth + (col - 1) * (cellWidth + cellGap));
            int w = col == 0 ? rowHeaderWidth - cellGap : cellWidth;
            drawShareCell(canvas, paint, x, tableTop, w, cellHeight, col == 0 ? "" : String.valueOf(col), SURFACE_HIGH, BORDER_SOFT, TEXT, true);
        }
        for (int rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            int y = tableTop + (rowIndex + 1) * (cellHeight + cellGap);
            drawShareCell(canvas, paint, left + 24, y, rowHeaderWidth - cellGap, cellHeight, rows[rowIndex], SURFACE_HIGH, BORDER_SOFT, TEXT, true);
            for (int col = 1; col <= 9; col++) {
                String key = rows[rowIndex] + col;
                String value = measurements == null ? "" : measurements.optString(key, "");
                boolean replaced = jsonArrayContains(replacedPoints, key);
                int color = replaced ? TEAL : shareMeasurementColor(value);
                int textColor = shareMeasurementTextColor(color);
                String display = replaced ? "BARU" : value.length() == 0 ? "-" : value;
                int x = left + 24 + rowHeaderWidth + (col - 1) * (cellWidth + cellGap);
                drawShareCell(canvas, paint, x, y, cellWidth, cellHeight, display, color, replaced ? TEAL : BORDER, textColor, true);
                drawShareText(canvas, paint, key, x + 6, y + 15, 13, textColor, true);
            }
        }

        int legendTop = tableTop + 10 * (cellHeight + cellGap) + 16;
        drawShareLegend(canvas, paint, left + 24, legendTop, RED, "Merah <30");
        drawShareLegend(canvas, paint, left + 236, legendTop, AMBER, "Kuning 30-33.9");
        drawShareLegend(canvas, paint, left + 500, legendTop, GREEN, "Hijau >=34");
        drawShareLegend(canvas, paint, left + 720, legendTop, TEAL, "BARU");
        return top + sectionHeight + 8;
    }

    private void drawShareCell(Canvas canvas, Paint paint, int x, int y, int width, int height, String text, int fill, int stroke, int textColor, boolean bold) {
        drawShareRoundRect(canvas, paint, x, y, x + width, y + height, fill, 14);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(2);
        paint.setColor(stroke);
        canvas.drawRoundRect(new RectF(x, y, x + width, y + height), 14, 14, paint);
        paint.setStyle(Paint.Style.FILL);
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setColor(textColor);
        paint.setTextSize(text == null || text.length() > 5 ? 16 : 20);
        paint.setTypeface(Typeface.create(Typeface.SANS_SERIF, bold ? Typeface.BOLD : Typeface.NORMAL));
        canvas.drawText(text == null ? "-" : text, x + (width / 2), y + 39, paint);
        paint.setTextAlign(Paint.Align.LEFT);
    }

    private void drawShareLegend(Canvas canvas, Paint paint, int x, int y, int color, String label) {
        drawShareRoundRect(canvas, paint, x, y, x + 26, y + 26, color, 7);
        drawShareText(canvas, paint, label, x + 36, y + 21, 20, TEXT, true);
    }

    private int shareMeasurementColor(String value) {
        double parsed = parseDouble(value);
        if (parsed < 0) {
            return SURFACE_HIGH;
        }
        if (parsed < 30) {
            return RED;
        }
        if (parsed < 34) {
            return AMBER;
        }
        return GREEN;
    }

    private int shareMeasurementTextColor(int fill) {
        if (fill == AMBER || fill == TEAL || fill == GREEN) {
            return Color.rgb(3, 24, 27);
        }
        return Color.WHITE;
    }

    private void drawShareRoundRect(Canvas canvas, Paint paint, int left, int top, int right, int bottom, int color, int radius) {
        paint.setStyle(Paint.Style.FILL);
        paint.setTextAlign(Paint.Align.LEFT);
        paint.setColor(color);
        canvas.drawRoundRect(new RectF(left, top, right, bottom), radius, radius, paint);
    }

    private void drawSharePill(Canvas canvas, Paint paint, int left, int top, String text, int color, int textColor) {
        int width = Math.max(180, text.length() * 18 + 54);
        drawShareRoundRect(canvas, paint, left, top, left + width, top + 54, color, 27);
        drawShareText(canvas, paint, text, left + 26, top + 36, 22, textColor, true);
    }

    private void drawShareText(Canvas canvas, Paint paint, String text, int x, int y, int sp, int color, boolean bold) {
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(color);
        paint.setTextSize(sp);
        paint.setTypeface(Typeface.create(Typeface.SANS_SERIF, bold ? Typeface.BOLD : Typeface.NORMAL));
        canvas.drawText(text == null ? "-" : text, x, y, paint);
    }

    private void drawShareWrappedText(Canvas canvas, Paint paint, String text, int x, int y, int maxWidth, int sp, int color, boolean bold, int maxLines) {
        List<String> lines = wrapText(text, Math.max(20, maxWidth / Math.max(14, sp / 2)));
        for (int i = 0; i < Math.min(maxLines, lines.size()); i++) {
            drawShareText(canvas, paint, lines.get(i), x, y + (i * (sp + 10)), sp, color, bold);
        }
    }

    private List<String> wrapText(String text, int maxChars) {
        List<String> lines = new ArrayList<String>();
        String[] words = String.valueOf(text == null ? "-" : text).split("\\s+");
        StringBuilder current = new StringBuilder();
        for (String word : words) {
            if (current.length() + word.length() + 1 > maxChars && current.length() > 0) {
                lines.add(current.toString());
                current = new StringBuilder();
            }
            if (current.length() > 0) {
                current.append(' ');
            }
            current.append(word);
        }
        if (current.length() > 0) {
            lines.add(current.toString());
        }
        if (lines.isEmpty()) {
            lines.add("-");
        }
        return lines;
    }

    private String buildServiceShareText(JSONObject item) {
        JSONObject payload = item.optJSONObject("payload");
        StringBuilder builder = new StringBuilder();
        builder.append("PLIRM34 - Hasil Inspeksi Service\n");
        builder.append("Tipe: ").append(item.optString("type", "-")).append('\n');
        builder.append("Sub menu: ").append(item.optString("subtype", item.optString("type", "-"))).append('\n');
        builder.append("Equipment: ").append(item.optString("equipmentName", "-")).append('\n');
        builder.append("Tanggal: ").append(formatDate(payload == null ? "" : payload.optString("inspectionDate", ""))).append('\n');
        builder.append("Temuan: ").append(item.optString("description", "-")).append('\n');
        builder.append("Detail: ").append(item.optString("detail", "-")).append('\n');
        if (payload != null) {
            String recommendation = payload.optString("recommendation", "");
            if (recommendation.length() > 0) {
                builder.append("Rekomendasi: ").append(recommendation).append('\n');
            }
            String pic = payload.optString("pic", "");
            if (pic.length() > 0) {
                builder.append("PIC: ").append(pic).append('\n');
            }
            if ("service-motor-mv-carbon-brush".equals(item.optString("formType", ""))) {
                builder.append("Titik diganti: ").append(joinArray(payload.optJSONArray("replacedPoints"))).append('\n');
                JSONObject stats = payload.optJSONObject("stats");
                if (stats != null) {
                    builder.append("Carbon Brush: Merah ").append(stats.optString("low", "0"))
                            .append(", Kuning ").append(stats.optString("medium", "0"))
                            .append(", Hijau ").append(stats.optString("high", "0"))
                            .append(", Terendah ").append(stats.optString("min", "-"))
                            .append('\n');
                }
            }
        }
        return builder.toString().trim();
    }

    private void tintDialogButtons(AlertDialog dialog) {
        if (dialog == null) {
            return;
        }
        try {
            if (dialog.getButton(AlertDialog.BUTTON_POSITIVE) != null) {
                dialog.getButton(AlertDialog.BUTTON_POSITIVE).setTextColor(Color.WHITE);
            }
            if (dialog.getButton(AlertDialog.BUTTON_NEGATIVE) != null) {
                dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setTextColor(Color.WHITE);
            }
        } catch (Exception ignored) {
        }
    }

    private EditText lightInput(String hint) {
        EditText edit = new EditText(this);
        edit.setHint(hint);
        edit.setHintTextColor(MUTED);
        edit.setTextColor(TEXT);
        edit.setTextSize(14);
        edit.setSingleLine(false);
        edit.setMinLines(1);
        edit.setMaxLines(3);
        edit.setTypeface(appTypeface(false));
        edit.setPadding(dp(13), 0, dp(13), 0);
        edit.setBackground(selectableBackground(SURFACE_HIGH, BORDER_SOFT, 14));
        prepareInput(edit);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.topMargin = dp(9);
        edit.setLayoutParams(lp);
        return edit;
    }

    private void refreshBottomNav() {
        if (root == null || root.getChildCount() == 0) {
            return;
        }
        root.removeViewAt(root.getChildCount() - 1);
        root.addView(bottomNav(), bottomParams());
    }

    private void confirmLogout() {
        LinearLayout body = dialogBody();
        body.addView(label("Logout", 18, TEXT, true));
        body.addView(label("Keluar dari aplikasi PLIRM34 di perangkat ini?", 13, MUTED, false), topMargin(-1, dp(8)));
        AlertDialog dialog = buildActionDialog("Logout", body, "Batal", "Logout", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
                logoutLocal();
            }
        });
        dialog.show();
    }

    private void logoutLocal() {
        stopCarbonBannerRotation();
        apiClient = null;
        currentUser = new JSONObject();
        lastSyncMillis = 0L;
        dataStatus = "Data offline";
        selectedTab = 0;
        moreScreen = "menu";
        seedFallbackData();
        showLogin();
    }

    @Override
    public void onBackPressed() {
        if (selectedTab == 4 && !"menu".equals(moreScreen)) {
            moreScreen = "menu";
            renderSelected();
            return;
        }
        if (selectedTab != 0) {
            selectedTab = 0;
            moreScreen = "menu";
            renderSelected();
            refreshBottomNav();
            return;
        }
        super.onBackPressed();
    }

    private View authPattern(boolean grid) {
        GridLayout pattern = new GridLayout(this);
        pattern.setColumnCount(12);
        pattern.setRowCount(26);
        pattern.setAlpha(grid ? 0.08f : 0.18f);
        pattern.setPadding(dp(5), dp(5), dp(5), dp(5));
        for (int i = 0; i < (grid ? 220 : 150); i++) {
            TextView dot = new TextView(this);
            dot.setText(grid ? "+" : ".");
            dot.setTextColor(AUTH_INK);
            dot.setGravity(Gravity.CENTER);
            dot.setTextSize(grid ? 8 : 12);
            dot.setTypeface(appTypeface(false));
            GridLayout.LayoutParams lp = new GridLayout.LayoutParams();
            lp.width = dp(grid ? 32 : 24);
            lp.height = dp(grid ? 32 : 24);
            pattern.addView(dot, lp);
        }
        return pattern;
    }

    private LinearLayout authBrand(boolean withSubtitle) {
        LinearLayout brand = column(0);
        TextView name = authLabel("PLIRM34", withSubtitle ? 24 : 18, true);
        brand.addView(name);
        if (withSubtitle) {
            brand.addView(authText("FIELD OPERATIONS", 11, AUTH_MUTED), topMargin(-1, dp(3)));
            View line = new View(this);
            line.setBackgroundColor(AUTH_INK);
            brand.addView(line, topMargin(-1, dp(12), dp(4)));
        } else {
            View line = new View(this);
            line.setBackgroundColor(AUTH_INK);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(48), dp(5));
            lp.topMargin = dp(8);
            brand.addView(line, lp);
        }
        return brand;
    }

    private LinearLayout authHeroBrand(boolean compact) {
        LinearLayout brand = row(12);
        brand.setGravity(Gravity.CENTER_VERTICAL);
        ImageView logo = new ImageView(this);
        logo.setImageResource(getResources().getIdentifier("plirm34_logo", "drawable", getPackageName()));
        logo.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        logo.setBackground(rounded(SURFACE_FLOAT, TEAL, 12, 1));
        logo.setPadding(dp(7), dp(7), dp(7), dp(7));
        brand.addView(logo, new LinearLayout.LayoutParams(dp(46), dp(46)));

        LinearLayout text = column(2);
        text.addView(label("PLIRM34", compact ? 23 : 25, TEXT, true));
        text.addView(label("Field operations native app", 12, MUTED, false));
        brand.addView(text, new LinearLayout.LayoutParams(0, -2, 1));

        TextView live = label("LIVE", 11, Color.rgb(3, 24, 27), true);
        live.setGravity(Gravity.CENTER);
        live.setPadding(dp(10), dp(5), dp(10), dp(5));
        live.setBackground(rounded(TEAL, TEAL, 12));
        brand.addView(live);
        return brand;
    }

    private LinearLayout authHeroCard() {
        LinearLayout hero = column(0);
        hero.setPadding(dp(18), dp(18), dp(18), dp(18));
        hero.setBackground(rounded(INFO_SURFACE, TEAL, 18, 1));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            hero.setElevation(dp(6));
        }
        hero.addView(label("Masuk PLIRM34", 28, TEXT, true));
        hero.addView(label("Dashboard, service, BOM, sparepart, dan stock carbon brush untuk pekerja lapangan.", 13, Color.rgb(210, 224, 225), false), topMargin(-1, dp(8)));
        LinearLayout row = row(8);
        row.addView(authHeroMetric("service", "Early warning", AMBER), new LinearLayout.LayoutParams(0, -2, 1));
        row.addView(authHeroMetric("bom", "Service log", BLUE), new LinearLayout.LayoutParams(0, -2, 1));
        row.addView(authHeroMetric("sparepart", "Stock", GREEN), new LinearLayout.LayoutParams(0, -2, 1));
        hero.addView(row, topMargin(-1, dp(16)));
        return hero;
    }

    private LinearLayout authHeroMetric(String iconName, String labelText, int color) {
        LinearLayout metric = column(2);
        metric.setPadding(dp(10), dp(8), dp(10), dp(8));
        metric.setBackground(rounded(Color.rgb(11, 25, 30), color, 10, 1));
        IconGlyph glyph = new IconGlyph(this, iconName, color);
        LinearLayout.LayoutParams glyphLp = new LinearLayout.LayoutParams(dp(30), dp(26));
        glyphLp.gravity = Gravity.CENTER_HORIZONTAL;
        metric.addView(glyph, glyphLp);
        TextView labelView = label(labelText, 10, MUTED, false);
        labelView.setGravity(Gravity.CENTER);
        metric.addView(labelView);
        return metric;
    }

    private LinearLayout authPasswordField(String labelText, String hint, boolean boxed) {
        LinearLayout field = row(0);
        field.setGravity(Gravity.CENTER_VERTICAL);
        field.setPadding(boxed ? dp(10) : 0, 0, boxed ? dp(8) : 0, 0);
        field.setBackground(authInputBackground(boxed ? SURFACE_FLOAT : Color.TRANSPARENT));

        passwordInput = new EditText(this);
        passwordInput.setHint(labelText + "\n" + hint);
        passwordInput.setHintTextColor(MUTED);
        passwordInput.setTextColor(TEXT);
        passwordInput.setTextSize(16);
        passwordInput.setSingleLine(false);
        passwordInput.setMinLines(2);
        passwordInput.setMaxLines(2);
        passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        passwordInput.setTypeface(appTypeface(false));
        passwordInput.setPadding(0, 0, 0, 0);
        passwordInput.setBackgroundColor(Color.TRANSPARENT);
        prepareInput(passwordInput);
        field.addView(passwordInput, new LinearLayout.LayoutParams(0, dp(64), 1));

        final ImageButton toggle = new ImageButton(this);
        toggle.setImageResource(android.R.drawable.ic_menu_view);
        toggle.setBackgroundColor(Color.TRANSPARENT);
        toggle.setColorFilter(MUTED);
        toggle.setContentDescription("Tampilkan password");
        toggle.setPadding(dp(10), dp(10), dp(10), dp(10));
        toggle.setOnClickListener(new View.OnClickListener() {
            private boolean visible = false;

            @Override
            public void onClick(View v) {
                visible = !visible;
                int selection = passwordInput.getSelectionStart();
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | (visible ? InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD : InputType.TYPE_TEXT_VARIATION_PASSWORD));
                passwordInput.setTypeface(appTypeface(false));
                if (selection >= 0) {
                    passwordInput.setSelection(Math.min(selection, passwordInput.length()));
                }
                toggle.setAlpha(visible ? 1f : 0.55f);
                toggle.setContentDescription(visible ? "Sembunyikan password" : "Tampilkan password");
            }
        });
        toggle.setAlpha(0.55f);
        field.addView(toggle, new LinearLayout.LayoutParams(dp(48), dp(56)));
        return field;
    }

    private LinearLayout authPanel(int padding) {
        LinearLayout panel = column(0);
        panel.setPadding(dp(padding), dp(padding), dp(padding), dp(padding));
        panel.setBackground(rounded(SURFACE_HIGH, BORDER_SOFT, 18, 1));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            panel.setElevation(dp(8));
        }
        return panel;
    }

    private TextView authLabel(String text, int sp, boolean bold) {
        TextView view = label(text, sp, TEXT, bold);
        view.setAllCaps(false);
        view.setLetterSpacing(0f);
        return view;
    }

    private TextView authText(String text, int sp, int color) {
        TextView view = label(text, sp, color, false);
        view.setLineSpacing(dp(2), 1f);
        return view;
    }

    private TextView authStatus(String text, int color) {
        TextView status = label("* " + text, 13, color, true);
        status.setGravity(Gravity.CENTER);
        return status;
    }

    private EditText authInput(String labelText, String hint, boolean password, boolean boxed) {
        EditText edit = new EditText(this);
        edit.setHint(labelText + "\n" + hint);
        edit.setHintTextColor(MUTED);
        edit.setTextColor(TEXT);
        edit.setTextSize(16);
        edit.setSingleLine(false);
        edit.setMinLines(2);
        edit.setMaxLines(2);
        edit.setInputType(password ? InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD : InputType.TYPE_CLASS_TEXT);
        edit.setTypeface(appTypeface(false));
        edit.setPadding(boxed ? dp(10) : 0, 0, boxed ? dp(10) : 0, 0);
        edit.setBackground(authInputBackground(boxed ? SURFACE_FLOAT : Color.TRANSPARENT));
        edit.setMinHeight(dp(64));
        prepareInput(edit);
        return edit;
    }

    private View authUnderline() {
        View line = new View(this);
        line.setBackgroundColor(AUTH_INK);
        return line;
    }

    private GradientDrawable authInputBackground(int fillColor) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(fillColor);
        drawable.setCornerRadius(dp(14));
        drawable.setStroke(dp(1), boxedStroke(fillColor));
        return drawable;
    }

    private TextView authButton(String text) {
        TextView button = label(text, 15, Color.rgb(3, 24, 27), true);
        button.setGravity(Gravity.CENTER);
        button.setMinHeight(dp(56));
        button.setPadding(dp(14), 0, dp(14), 0);
        button.setBackground(selectableBackground(TEAL, TEAL, 16));
        return button;
    }

    private TextView authSecondaryButton(String text) {
        TextView button = label(text, 14, TEXT, true);
        button.setGravity(Gravity.CENTER);
        button.setMinHeight(dp(52));
        button.setPadding(dp(14), 0, dp(14), 0);
        button.setBackground(selectableBackground(SURFACE_FLOAT, BORDER_SOFT, 16));
        return button;
    }

    private LinearLayout authSwitch(String prefix, String action, final boolean goSignup) {
        LinearLayout row = row(0);
        row.setGravity(Gravity.CENTER);
        row.addView(authText(prefix, 13, MUTED));
        TextView link = label(action, 13, TEAL, true);
        link.setPadding(dp(6), 0, 0, dp(2));
        link.setPaintFlags(link.getPaintFlags() | android.graphics.Paint.UNDERLINE_TEXT_FLAG);
        link.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAuth(goSignup);
            }
        });
        row.addView(link);
        return row;
    }

    private TextView authFooter() {
        TextView footer = label("SISTEM INFORMASI LAPANGAN PLIRM34 // VERSI NATIVE", 10, MUTED, true);
        footer.setGravity(Gravity.CENTER);
        return footer;
    }

    private TextView searchBox(String hint) {
        TextView search = label("Cari: " + hint, 13, MUTED, false);
        search.setPadding(dp(12), 0, dp(12), 0);
        search.setGravity(Gravity.CENTER_VERTICAL);
        search.setBackground(rounded(SURFACE_FLOAT, BORDER_SOFT, 18));
        return search;
    }

    private EditText searchField(String hint, String value, final SearchCallback callback) {
        final EditText search = new EditText(this);
        search.setHint(hint);
        search.setText(value == null ? "" : value);
        search.setSingleLine(true);
        search.setTextColor(TEXT);
        search.setHintTextColor(MUTED);
        search.setTextSize(14);
        search.setTypeface(appTypeface(false));
        search.setInputType(InputType.TYPE_CLASS_TEXT);
        search.setPadding(dp(16), 0, dp(16), 0);
        search.setMinHeight(dp(52));
        search.setBackground(selectableBackground(Color.rgb(10, 25, 30), BORDER_SOFT, 16));
        prepareInput(search);
        search.setCompoundDrawablesWithIntrinsicBounds(android.R.drawable.ic_menu_search, 0, 0, 0);
        search.setCompoundDrawablePadding(dp(12));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            search.setElevation(dp(4));
        }
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.bottomMargin = dp(10);
        search.setLayoutParams(lp);
        search.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                final String next = s == null ? "" : s.toString();
                if (callback == null) {
                    return;
                }
                if (searchDebounceRunnable != null) {
                    searchDebounceHandler.removeCallbacks(searchDebounceRunnable);
                }
                searchDebounceRunnable = new Runnable() {
                    @Override
                    public void run() {
                        callback.onChanged(next);
                    }
                };
                searchDebounceHandler.postDelayed(searchDebounceRunnable, 450L);
            }
        });
        return search;
    }

    private LinearLayout segmented(String first, String second) {
        LinearLayout row = row(8);
        row.addView(button(first, true), new LinearLayout.LayoutParams(0, dp(48), 1));
        row.addView(button(second, false), new LinearLayout.LayoutParams(0, dp(48), 1));
        return row;
    }

    private HorizontalScrollView chips(String... labels) {
        HorizontalScrollView scroll = new HorizontalScrollView(this);
        LinearLayout row = row(8);
        row.setPadding(0, dp(2), 0, dp(2));
        for (String label : labels) {
            TextView chip = label(label, 12, TEXT, true);
            chip.setPadding(dp(14), 0, dp(14), 0);
            chip.setGravity(Gravity.CENTER);
            chip.setBackground(rounded(SURFACE_FLOAT, BORDER_SOFT, 18));
            row.addView(chip, new LinearLayout.LayoutParams(-2, dp(38)));
        }
        scroll.addView(row);
        return scroll;
    }

    private HorizontalScrollView filterChips(final String selected, String[] labels, final FilterCallback callback) {
        HorizontalScrollView scroll = new HorizontalScrollView(this);
        scroll.setHorizontalScrollBarEnabled(false);
        LinearLayout row = row(8);
        row.setPadding(0, dp(2), 0, dp(10));
        for (final String item : labels) {
            boolean active = item.equalsIgnoreCase(selected == null ? "" : selected);
            TextView chip = label(item, 12, active ? Color.rgb(3, 27, 27) : TEXT, true);
            chip.setPadding(dp(16), 0, dp(16), 0);
            chip.setGravity(Gravity.CENTER);
            chip.setMinHeight(dp(40));
            chip.setBackground(selectableBackground(active ? TEAL : SURFACE_FLOAT, active ? TEAL : BORDER_SOFT, 16));
            chip.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (callback != null) {
                        callback.onSelected(item);
                    }
                }
            });
            row.addView(chip, new LinearLayout.LayoutParams(-2, dp(40)));
        }
        scroll.addView(row);
        return scroll;
    }

    private TextView sectionTitle(String text) {
        TextView title = label(text, 16, TEXT, true);
        title.setPadding(dp(2), dp(12), 0, dp(2));
        return title;
    }

    private LinearLayout rowBetween(String left, TextView right) {
        LinearLayout row = row(8);
        row.setGravity(Gravity.CENTER_VERTICAL);
        TextView l = label(left, 13, TEXT, true);
        row.addView(l, new LinearLayout.LayoutParams(0, -2, 1));
        row.addView(right);
        return row;
    }

    private TextView badge(String text, int color) {
        TextView badge = label(text, 10, color == AMBER || color == TEAL ? Color.rgb(5, 24, 27) : Color.WHITE, true);
        badge.setPadding(dp(11), dp(6), dp(11), dp(6));
        badge.setGravity(Gravity.CENTER);
        badge.setBackground(rounded(color, color, 16));
        return badge;
    }

    private TextView button(String text, boolean secondary) {
        TextView button = label(text, 13, secondary ? TEXT : Color.rgb(4, 28, 29), true);
        button.setGravity(Gravity.CENTER);
        button.setPadding(dp(16), 0, dp(16), 0);
        button.setMinHeight(dp(50));
        button.setBackground(selectableBackground(secondary ? SURFACE_FLOAT : TEAL, secondary ? BORDER_SOFT : TEAL, 14));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            button.setElevation(dp(secondary ? 2 : 5));
        }
        return button;
    }

    private TextView linkButton(String text) {
        TextView button = label(text, 13, TEXT, true);
        button.setGravity(Gravity.CENTER);
        button.setPadding(dp(16), 0, dp(16), 0);
        button.setMinHeight(dp(50));
        button.setBackground(selectableBackground(SURFACE_FLOAT, BORDER_SOFT, 14));
        return button;
    }

    private LinearLayout emptyCard(String title, String description) {
        LinearLayout card = card(10);
        card.addView(label(title, 14, TEXT, true));
        card.addView(label(description, 12, MUTED, false), topMargin(-1, dp(6)));
        return card;
    }

    private LinearLayout card(int padding) {
        LinearLayout card = column(0);
        int inset = Math.max(padding, 10);
        card.setPadding(dp(inset), dp(inset), dp(inset), dp(inset));
        card.setBackground(rounded(SURFACE, BORDER, 16));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            card.setElevation(dp(3));
            card.setTranslationZ(dp(1));
        }
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.bottomMargin = dp(10);
        card.setLayoutParams(lp);
        return card;
    }

    private LinearLayout actionCard(int padding) {
        LinearLayout card = card(padding);
        card.setClickable(true);
        card.setFocusable(true);
        card.setBackground(selectableBackground(SURFACE_HIGH, BORDER_SOFT, 16));
        return card;
    }

    private EditText input(String hint, boolean password) {
        EditText edit = new EditText(this);
        edit.setHint(hint);
        edit.setHintTextColor(MUTED);
        edit.setTextColor(TEXT);
        edit.setTextSize(15);
        edit.setTypeface(appTypeface(false));
        edit.setSingleLine(true);
        edit.setInputType(password ? InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD : InputType.TYPE_CLASS_TEXT);
        edit.setPadding(dp(14), 0, dp(14), 0);
        edit.setBackground(rounded(SURFACE_HIGH, BORDER_SOFT, 16));
        prepareInput(edit);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.topMargin = dp(12);
        edit.setLayoutParams(lp);
        return edit;
    }

    private TextView statusLine(String text, int color) {
        TextView status = label("*  " + text, 12, color, true);
        status.setGravity(Gravity.CENTER);
        return status;
    }

    private TextView icon(String text, int size) {
        TextView icon = label(text, size, TEXT, true);
        icon.setGravity(Gravity.CENTER);
        return icon;
    }

    private TextView label(String text, int sp, int color, boolean bold) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(color);
        view.setTextSize(sp);
        view.setIncludeFontPadding(true);
        view.setTypeface(appTypeface(bold));
        view.setLineSpacing(dp(1), 1f);
        return view;
    }

    private void prepareInput(EditText edit) {
        if (edit == null) {
            return;
        }
        edit.setSelectAllOnFocus(false);
        edit.setHighlightColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= 26) {
            edit.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);
            edit.setAutofillHints((String[]) null);
        }
        if (Build.VERSION.SDK_INT >= 29) {
            try {
                edit.getTextCursorDrawable().setTint(TEAL);
                edit.getTextSelectHandle().setTint(TEAL);
                edit.getTextSelectHandleLeft().setTint(TEAL);
                edit.getTextSelectHandleRight().setTint(TEAL);
            } catch (Exception ignored) {
            }
        }
    }

    private Typeface appTypeface(boolean bold) {
        if (appRegularTypeface == null) {
            appRegularTypeface = loadTypefaceFromSystem(new String[]{
                    "/system/fonts/Roboto-Regular.ttf",
                    "/system/fonts/NotoSans-Regular.ttf",
                    "/system/fonts/DroidSans.ttf"
            }, Typeface.NORMAL);
        }
        if (appBoldTypeface == null) {
            appBoldTypeface = loadTypefaceFromSystem(new String[]{
                    "/system/fonts/Roboto-Bold.ttf",
                    "/system/fonts/NotoSans-Bold.ttf",
                    "/system/fonts/DroidSans-Bold.ttf"
            }, Typeface.BOLD);
        }
        return bold ? appBoldTypeface : appRegularTypeface;
    }

    private Typeface loadTypefaceFromSystem(String[] candidates, int style) {
        for (String candidate : candidates) {
            try {
                File file = new File(candidate);
                if (file.exists() && file.length() > 0) {
                    return Typeface.createFromFile(file);
                }
            } catch (Exception ignored) {
            }
        }
        return Typeface.create(Typeface.SANS_SERIF, style);
    }

    private LinearLayout column(int gap) {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        return layout;
    }

    private LinearLayout row(int gap) {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.HORIZONTAL);
        return layout;
    }

    private GradientDrawable rounded(int color, int stroke, int radius) {
        return rounded(color, stroke, radius, 1);
    }

    private GradientDrawable rounded(int color, int stroke, int radius, int strokeWidth) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radius));
        if (stroke != Color.TRANSPARENT) {
            drawable.setStroke(dp(strokeWidth), stroke);
        }
        return drawable;
    }

    private android.graphics.drawable.Drawable selectableBackground(int color, int stroke, int radius) {
        GradientDrawable normal = rounded(color, stroke, radius);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            return normal;
        }
        TypedValue outValue = new TypedValue();
        getTheme().resolveAttribute(android.R.attr.selectableItemBackground, outValue, true);
        android.graphics.drawable.Drawable rippleMask = rounded(Color.WHITE, Color.TRANSPARENT, radius);
        return new android.graphics.drawable.RippleDrawable(android.content.res.ColorStateList.valueOf(Color.argb(42, 255, 255, 255)), normal, rippleMask);
    }

    private LinearLayout.LayoutParams topMargin(int width, int margin) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, -2);
        lp.topMargin = margin;
        return lp;
    }

    private LinearLayout.LayoutParams topMargin(int width, int margin, int height) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, height);
        lp.topMargin = margin;
        return lp;
    }

    private LinearLayout.LayoutParams widthWrap(int width) {
        return new LinearLayout.LayoutParams(width, -2);
    }

    private ViewGroup.LayoutParams matchWrap() {
        return new ViewGroup.LayoutParams(-1, -2);
    }

    private ViewGroup.LayoutParams matchMatch() {
        return new ViewGroup.LayoutParams(-1, -1);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private int systemTopInset() {
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        return resourceId > 0 ? getResources().getDimensionPixelSize(resourceId) : dp(24);
    }

    private int systemBottomInset() {
        int resourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        return resourceId > 0 ? getResources().getDimensionPixelSize(resourceId) : dp(16);
    }

    private Locale Locale(String language, String country) {
        return new Locale(language, country);
    }

    private String textOf(EditText editText) {
        return editText == null || editText.getText() == null ? "" : editText.getText().toString().trim();
    }

    private JSONObject copyJson(JSONObject source) {
        if (source == null) {
            return new JSONObject();
        }
        try {
            return new JSONObject(source.toString());
        } catch (JSONException error) {
            return new JSONObject();
        }
    }

    private void replaceOrAppend(JSONArray array, JSONObject item) {
        if (array == null || item == null) {
            return;
        }
        String id = item.optString("id", "");
        if (id.length() > 0) {
            for (int i = 0; i < array.length(); i++) {
                JSONObject current = array.optJSONObject(i);
                if (current != null && id.equals(current.optString("id", ""))) {
                    try {
                        array.put(i, item);
                        return;
                    } catch (JSONException ignored) {
                        return;
                    }
                }
            }
        }
        array.put(item);
    }

    private void refreshLiveData() {
        if (apiClient == null || loading) {
            Toast.makeText(this, "Login live diperlukan untuk refresh.", Toast.LENGTH_SHORT).show();
            return;
        }
        loading = true;
        Toast.makeText(this, "Sinkron data PLIRM34...", Toast.LENGTH_SHORT).show();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    fetchLiveData();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            loading = false;
                            if (headerTitle != null) {
                                headerTitle.setText("PLIRM34");
                            }
                            renderSelected();
                            Toast.makeText(MainActivity.this, "Data live diperbarui", Toast.LENGTH_SHORT).show();
                        }
                    });
                } catch (final Exception error) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            loading = false;
                            Toast.makeText(MainActivity.this, error.getMessage() == null ? "Refresh gagal" : error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        }).start();
    }

    private void fetchLiveData() throws Exception {
        JSONObject bootstrap = apiClient.bootstrap();
        JSONObject summary = safeApiObject("summary");
        JSONObject stock = safeApiObject("carbon-stock");
        JSONObject masters = safeApiObject("masters");
        bootstrapPayload = bootstrap;
        serviceSummaryPayload = summary;
        calendarPayload = bootstrap.optJSONObject("calendar") != null ? bootstrap.optJSONObject("calendar") : new JSONObject();
        userItems = bootstrap.optJSONArray("users") != null ? bootstrap.optJSONArray("users") : new JSONArray();
        serviceItems = fetchResourceItems("service", "compact=1&limit=500", serviceItems);
        negatifItems = fetchResourceItems("negatif-list", "status=Open&limit=50&compact=1", negatifItems);
        bomItems = fetchResourceItems("bom", "", bomItems);
        bomMotorItems = fetchResourceItems("bom-motor", "", bomMotorItems);
        sparepartItems = fetchResourceItems("sparepart", "", sparepartItems);
        spbItems = fetchResourceItems("spb", "", spbItems);
        carbonStockItems = stock.optJSONArray("items") != null ? stock.optJSONArray("items") : new JSONArray();
        carbonStockLogs = stock.optJSONArray("logs") != null ? stock.optJSONArray("logs") : new JSONArray();
        carbonBrushAlerts = stock.optJSONArray("alerts") != null ? stock.optJSONArray("alerts") : new JSONArray();
        equipmentReferenceItems = masters.optJSONArray("equipmentReferences") != null ? masters.optJSONArray("equipmentReferences") : equipmentReferenceItems;
        dataStatus = "Live";
        lastSyncMillis = System.currentTimeMillis();
    }

    private JSONObject safeApiObject(String key) {
        try {
            if ("summary".equals(key)) {
                return apiClient.serviceSummary();
            }
            if ("carbon-stock".equals(key)) {
                return apiClient.carbonBrushStock();
            }
            if ("masters".equals(key)) {
                return apiClient.masters();
            }
        } catch (Exception ignored) {
            return new JSONObject();
        }
        return new JSONObject();
    }

    private JSONArray fetchResourceItems(String resourceKey, String query, JSONArray fallback) {
        try {
            JSONObject response = apiClient.fetchItems(resourceKey, query);
            JSONArray items = response.optJSONArray("items");
            if (items != null) {
                return items;
            }
        } catch (Exception ignored) {
            return fallback == null ? new JSONArray() : fallback;
        }
        return fallback == null ? new JSONArray() : fallback;
    }

    private void seedFallbackData() {
        try {
            currentUser = new JSONObject().put("username", "sample").put("role", "offline");
            calendarPayload = new JSONObject()
                    .put("today", new JSONArray()
                            .put(new JSONObject().put("summary", "343RM1 Motor Rawmill").put("date", today()).put("timeLabel", "").put("description", "Inspeksi rutin")))
                    .put("tomorrow", new JSONArray())
                    .put("history", new JSONArray());
            negatifItems = new JSONArray()
                    .put(new JSONObject()
                            .put("id", "sample-negatif")
                            .put("equipment", "343RM1")
                            .put("damageDescription", "Bearing panas menunggu RM off")
                            .put("followUpPlan", "Cek vibrasi dan jadwalkan penggantian bearing")
                            .put("foundDate", today())
                            .put("pendingMark", "Menunggu Rawmill service")
                            .put("workStatus", "Open")
                            .put("category", "Electrical")
                            .put("area", "Tuban 3"));
            serviceItems = new JSONArray()
                    .put(new JSONObject()
                            .put("id", "sample-carbon")
                            .put("type", "Electrical")
                            .put("subtype", "Motor MV (Carbon Brush)")
                            .put("formType", "service-motor-mv-carbon-brush")
                            .put("equipmentName", "343RM1M01")
                            .put("description", "Inspeksi carbon brush")
                            .put("detail", "Merah: 1 | Kuning: 2 | Hijau: 6 | Terendah: 28")
                            .put("payload", new JSONObject()
                                    .put("inspectionDate", today())
                                    .put("replacement", "Partial")
                                    .put("megger", "OK")
                                    .put("measurements", new JSONObject()
                                            .put("A1", "32").put("A2", "31").put("A3", "30")
                                            .put("B1", "28").put("B2", "33").put("B3", "34")
                                            .put("C1", "35").put("C2", "34").put("C3", "33"))
                                    .put("replacedPoints", new JSONArray().put("B1"))))
                    .put(new JSONObject()
                            .put("id", "sample-service")
                            .put("type", "DCS")
                            .put("subtype", "PLC/DCS")
                            .put("formType", "service-dcs")
                            .put("equipmentName", "PLC Rawmill")
                            .put("description", "Cek status komunikasi")
                            .put("detail", "Network normal")
                            .put("payload", new JSONObject().put("inspectionDate", today())));
            bomItems = new JSONArray()
                    .put(new JSONObject().put("equipment", "343RM1").put("part", "Carbon Brush Holder").put("stockNo", "10023491").put("materialDescription", "Carbon Brush LFC 554").put("qty", "4"));
            bomMotorItems = new JSONArray()
                    .put(new JSONObject().put("equipment", "343RM1M01").put("manufacture", "ABB").put("power", "2500").put("ampere", "280").put("speed", "990").put("frame", "MV").put("stockNo", "10023491").put("materialDescription", "Motor MV Rawmill"));
            sparepartItems = new JSONArray()
                    .put(new JSONObject().put("code", "10023491").put("name", "Carbon Brush LFC 554").put("category", "Electrical").put("location", "Gudang").put("qty", "8").put("condition", "STOK RENDAH"));
            spbItems = new JSONArray()
                    .put(new JSONObject().put("id", "sample-spb").put("year", "2026").put("quarter", "Q2").put("spbType", "Pembelian").put("notificationNo", "4000123").put("orderNo", "-").put("reservationNo", "900321").put("stockNo", "10023491").put("materialDescription", "Carbon Brush LFC 554").put("qty", "4").put("mrp", "MRP").put("note", "PR proses").put("prNo", "PR-123").put("poNo", "-").put("deliveryDate", ""));
            userItems = new JSONArray()
                    .put(new JSONObject().put("username", "admin.plirm34").put("role", "admin"))
                    .put(new JSONObject().put("username", "team.plirm34").put("role", "team"));
            carbonStockItems = new JSONArray()
                    .put(new JSONObject().put("stockKey", "10023491|LFC 554").put("sapNo", "10023491").put("brushName", "LFC 554").put("useLabel", "343RM1, Kiln Drive").put("currentStock", 8))
                    .put(new JSONObject().put("stockKey", "10087652|RC 53").put("sapNo", "10087652").put("brushName", "RC 53").put("useLabel", "Crusher Motor").put("currentStock", 20))
                    .put(new JSONObject().put("stockKey", "10045621|EG 236S").put("sapNo", "10045621").put("brushName", "EG 236S").put("useLabel", "Fan Motor").put("currentStock", 15))
                    .put(new JSONObject().put("stockKey", "10098763|RXZ-99").put("sapNo", "10098763").put("brushName", "RXZ-99").put("useLabel", "Motor MV").put("currentStock", 0));
            carbonStockLogs = new JSONArray()
                    .put(new JSONObject().put("brushName", "LFC 554").put("quantityDelta", -1).put("stockBefore", 9).put("stockAfter", 8).put("source", "sample").put("createdAt", today()));
            carbonBrushAlerts = new JSONArray()
                    .put(new JSONObject()
                            .put("equipment", "343RM1M01")
                            .put("pointKey", "B1")
                            .put("currentValue", 28)
                            .put("lastMeasurementMm", 28)
                            .put("lastInspectionDate", today())
                            .put("countdownDays", 0)
                            .put("estimatedReplacementDate", today())
                            .put("thresholdLow", 30)
                            .put("thresholdHigh", 34)
                            .put("thresholdPlant", "Tuban 3")
                            .put("predictionQuality", new JSONObject().put("label", "Sample offline"))
                            .put("status", new JSONObject().put("label", "Melewati limit").put("key", "critical").put("severity", 3)));
            equipmentReferenceItems = new JSONArray()
                    .put(new JSONObject().put("sourceGroup", "carbon-brush").put("equipmentName", "343RM1M01").put("equipmentCode", "343RM1M01").put("category", "Motor MV").put("area", "Rawmill").put("plant", "Tuban 3"))
                    .put(new JSONObject().put("sourceGroup", "electrical-room").put("equipmentName", "ER23C").put("equipmentCode", "ER23C").put("category", "Electrical Room").put("area", "Rawmill").put("plant", "Tuban 3"))
                    .put(new JSONObject().put("sourceGroup", "service-mcc").put("equipmentName", "Panel MCC Finish Mill").put("equipmentCode", "MCC-FM").put("category", "MCC").put("area", "Finish Mill").put("plant", "Tuban 3"))
                    .put(new JSONObject().put("sourceGroup", "plc-service").put("equipmentName", "PLC Rawmill").put("equipmentCode", "PLC-RM").put("category", "PLC").put("area", "Rawmill").put("plant", "Tuban 3"))
                    .put(new JSONObject().put("sourceGroup", "dcs-service").put("equipmentName", "Operator Station CCR-03").put("equipmentCode", "CCR-03").put("category", "DCS").put("area", "CCR").put("plant", "Tuban 3"))
                    .put(new JSONObject().put("sourceGroup", "cems-service").put("equipmentName", "343SK1-2").put("equipmentCode", "343SK1-2").put("category", "CEMS").put("area", "Stack").put("plant", "Tuban 3"))
                    .put(new JSONObject().put("sourceGroup", "opacity-service").put("equipmentName", "344SK01").put("equipmentCode", "344SK01").put("category", "Opacity").put("area", "Stack").put("plant", "Tuban 4"));
        } catch (JSONException ignored) {
            serviceItems = new JSONArray();
            negatifItems = new JSONArray();
            bomItems = new JSONArray();
            bomMotorItems = new JSONArray();
            sparepartItems = new JSONArray();
            spbItems = new JSONArray();
            userItems = new JSONArray();
            carbonStockItems = new JSONArray();
            carbonStockLogs = new JSONArray();
            carbonBrushAlerts = new JSONArray();
            equipmentReferenceItems = new JSONArray();
        }
    }

    private String today() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    private String scheduleDetail(JSONObject item) {
        List<String> parts = new ArrayList<String>();
        if (item.optString("timeLabel", "").length() > 0 && !"Seharian".equalsIgnoreCase(item.optString("timeLabel", ""))) {
            parts.add(item.optString("timeLabel", ""));
        }
        if (item.optString("location", "").length() > 0) {
            parts.add(item.optString("location", ""));
        }
        if (item.optString("description", "").length() > 0) {
            parts.add(item.optString("description", ""));
        }
        return parts.isEmpty() ? "Rencana inspeksi" : join(parts, " | ");
    }

    private String fallbackScheduleKey(JSONObject item) {
        return item.optString("summary", "Jadwal inspeksi").trim()
                + "|"
                + item.optString("date", today()).trim()
                + "|"
                + item.optString("timeLabel", "").trim();
    }

    private String formatDate(String raw) {
        if (raw == null || raw.trim().length() == 0) {
            return "-";
        }
        String value = raw.trim();
        if (value.length() >= 10) {
            value = value.substring(0, 10);
        }
        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd", Locale.US).parse(value);
            return new SimpleDateFormat("dd MMM yyyy", Locale("id", "ID")).format(date);
        } catch (Exception error) {
            return value;
        }
    }

    private int countByFormType(String formType) {
        int count = 0;
        for (int i = 0; i < serviceItems.length(); i++) {
            JSONObject item = serviceItems.optJSONObject(i);
            if (item != null && formType.equals(item.optString("formType", ""))) {
                count++;
            }
        }
        return count;
    }

    private int countOpenNegatif() {
        return buildOpenNegatifList().size();
    }

    private int todayScheduleCount() {
        JSONArray today = calendarPayload.optJSONArray("today");
        return today == null ? 0 : today.length();
    }

    private int countLowCarbonStock() {
        int count = 0;
        for (int i = 0; i < carbonStockItems.length(); i++) {
            JSONObject item = carbonStockItems.optJSONObject(i);
            if (item != null && item.optInt("currentStock", 0) <= 10) {
                count++;
            }
        }
        return count;
    }

    private List<JSONObject> buildOpenNegatifList() {
        List<JSONObject> result = new ArrayList<JSONObject>();
        for (int i = 0; i < negatifItems.length(); i++) {
            JSONObject item = negatifItems.optJSONObject(i);
            if (item != null && !"close".equalsIgnoreCase(item.optString("workStatus", "Open"))) {
                result.add(item);
            }
        }
        return result;
    }

    private List<JSONObject> serviceItemsByFormType(String formType) {
        List<JSONObject> result = new ArrayList<JSONObject>();
        List<JSONObject> latest = sortByInspectionDate(serviceItems, false);
        for (JSONObject item : latest) {
            if (formType.equals(item.optString("formType", ""))) {
                result.add(item);
            }
        }
        return result;
    }

    private String formTypeForServiceTitle(String title) {
        if ("Electrical Room".equalsIgnoreCase(title)) return "service-electrical-room";
        if ("Motor MV".equalsIgnoreCase(title)) return "service-motor-mv";
        if ("Motor MSO".equalsIgnoreCase(title)) return "service-motor-mso";
        if ("Motor MV Carbon Brush".equalsIgnoreCase(title)) return "service-motor-mv-carbon-brush";
        if ("MCC".equalsIgnoreCase(title)) return "service-mcc";
        if ("EH/CA".equalsIgnoreCase(title)) return "service-ehca";
        if ("Instrument".equalsIgnoreCase(title)) return "service-instrument";
        if ("CEMS".equalsIgnoreCase(title)) return "service-cems";
        if ("Opacity Meter".equalsIgnoreCase(title)) return "service-opacity-meter";
        return "service-dcs";
    }

    private String[] serviceFormTypes() {
        return new String[]{
                "service-motor-mv-carbon-brush",
                "service-electrical-room",
                "service-motor-mv",
                "service-motor-mso",
                "service-mcc",
                "service-ehca",
                "service-instrument",
                "service-cems",
                "service-opacity-meter",
                "service-dcs"
        };
    }

    private String serviceTitleForFormType(String formType) {
        if ("service-electrical-room".equals(formType)) return "Electrical Room";
        if ("service-motor-mv".equals(formType)) return "Motor MV";
        if ("service-motor-mso".equals(formType)) return "Motor MSO";
        if ("service-motor-mv-carbon-brush".equals(formType)) return "Motor MV Carbon Brush";
        if ("service-mcc".equals(formType)) return "MCC";
        if ("service-ehca".equals(formType)) return "EH/CA";
        if ("service-instrument".equals(formType)) return "Instrument";
        if ("service-cems".equals(formType)) return "CEMS";
        if ("service-opacity-meter".equals(formType)) return "Opacity Meter";
        return "PLC/DCS";
    }

    private String serviceDescriptionForFormType(String formType) {
        if ("service-electrical-room".equals(formType)) return "Panel, room, battery, transformer";
        if ("service-motor-mv".equals(formType)) return "Vibrasi, winding, bearing, current";
        if ("service-motor-mso".equals(formType)) return "Monitoring motor MSO";
        if ("service-motor-mv-carbon-brush".equals(formType)) return "Measurement A1-I9 dan stok";
        if ("service-mcc".equals(formType)) return "Inspeksi MCC";
        if ("service-ehca".equals(formType)) return "Hydraulic dan compressed air";
        if ("service-instrument".equals(formType)) return "Sensor dan instrument umum";
        if ("service-cems".equals(formType)) return "Analyzer dan emisi";
        if ("service-opacity-meter".equals(formType)) return "Opacity/transmittance";
        return "PLC, DCS, dan control system";
    }

    private String serviceTypeForFormType(String formType) {
        if ("service-instrument".equals(formType) || "service-cems".equals(formType) || "service-opacity-meter".equals(formType)) {
            return "Instrument";
        }
        if ("service-dcs".equals(formType)) {
            return "DCS";
        }
        return "Electrical";
    }

    private int colorForCount(int count) {
        return count > 0 ? SURFACE_HIGH : BORDER;
    }

    private List<JSONObject> sortByInspectionDate(JSONArray source, final boolean ascending) {
        List<JSONObject> list = toList(source);
        Collections.sort(list, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject left, JSONObject right) {
                long leftTime = dateMillis(left.optJSONObject("payload") == null ? "" : left.optJSONObject("payload").optString("inspectionDate", ""));
                long rightTime = dateMillis(right.optJSONObject("payload") == null ? "" : right.optJSONObject("payload").optString("inspectionDate", ""));
                return ascending ? Long.compare(leftTime, rightTime) : Long.compare(rightTime, leftTime);
            }
        });
        return list;
    }

    private long dateMillis(String value) {
        if (value == null || value.length() == 0) {
            return 0L;
        }
        try {
            String text = value.length() >= 10 ? value.substring(0, 10) : value;
            Date date = new SimpleDateFormat("yyyy-MM-dd", Locale.US).parse(text);
            return date == null ? 0L : date.getTime();
        } catch (Exception error) {
            return 0L;
        }
    }

    private List<JSONObject> toList(JSONArray array) {
        List<JSONObject> list = new ArrayList<JSONObject>();
        if (array == null) {
            return list;
        }
        for (int i = 0; i < array.length(); i++) {
            JSONObject item = array.optJSONObject(i);
            if (item != null) {
                list.add(item);
            }
        }
        return list;
    }

    private List<JSONObject> buildLowStockSpareparts() {
        List<JSONObject> result = new ArrayList<JSONObject>();
        for (int i = 0; i < sparepartItems.length(); i++) {
            JSONObject item = sparepartItems.optJSONObject(i);
            if (item == null) {
                continue;
            }
            String condition = item.optString("condition", "").toUpperCase(Locale.ROOT);
            if (condition.contains("RENDAH") || condition.contains("KOSONG") || condition.contains("LOW")) {
                result.add(item);
            }
        }
        return result;
    }

    private boolean matchesQuery(JSONObject item, String query, String[] keys) {
        String normalizedQuery = normalizeKey(query);
        if (normalizedQuery.length() == 0) {
            return true;
        }
        if (item == null) {
            return false;
        }
        StringBuilder haystack = new StringBuilder();
        for (String key : keys) {
            haystack.append(' ').append(item.optString(key, ""));
        }
        JSONObject payload = item.optJSONObject("payload");
        if (payload != null) {
            Iterator<String> payloadKeys = payload.keys();
            while (payloadKeys.hasNext()) {
                String key = payloadKeys.next();
                Object value = payload.opt(key);
                if (value != null && !(value instanceof JSONObject) && !(value instanceof JSONArray)) {
                    haystack.append(' ').append(String.valueOf(value));
                }
            }
        }
        return normalizeKey(haystack.toString()).contains(normalizedQuery);
    }

    private List<JSONObject> filterByQuery(List<JSONObject> source, String query, String[] keys) {
        List<JSONObject> result = new ArrayList<JSONObject>();
        for (JSONObject item : source) {
            if (matchesQuery(item, query, keys)) {
                result.add(item);
            }
        }
        return result;
    }

    private List<JSONObject> filterServiceItems(List<JSONObject> source, String query, String filter) {
        List<JSONObject> result = new ArrayList<JSONObject>();
        String activeFilter = filter == null ? "Semua" : filter;
        for (JSONObject item : source) {
            if (!matchesQuery(item, query, new String[]{"equipmentName", "type", "subtype", "description", "detail", "formType"})) {
                continue;
            }
            JSONObject payload = item.optJSONObject("payload");
            boolean keep = true;
            if ("Hari Ini".equalsIgnoreCase(activeFilter)) {
                keep = today().equals(payload == null ? "" : payload.optString("inspectionDate", ""));
            } else if ("Carbon Brush".equalsIgnoreCase(activeFilter)) {
                keep = "service-motor-mv-carbon-brush".equals(item.optString("formType", ""));
            } else if ("Critical".equalsIgnoreCase(activeFilter)) {
                keep = normalizeKey(item.optString("detail", "") + " " + item.optString("description", "")).contains("MERAH")
                        || normalizeKey(item.optString("detail", "") + " " + item.optString("description", "")).contains("CRITICAL")
                        || normalizeKey(item.optString("detail", "") + " " + item.optString("description", "")).contains("NOT OK");
            } else if ("Dengan Temuan".equalsIgnoreCase(activeFilter)) {
                keep = item.optString("description", "").trim().length() > 0 || item.optString("detail", "").trim().length() > 0;
            }
            if (keep) {
                result.add(item);
            }
        }
        return result;
    }

    private List<JSONObject> filterBomItems(List<JSONObject> source, boolean motor) {
        List<JSONObject> result = new ArrayList<JSONObject>();
        String filter = bomFilterStatus == null ? "Semua" : bomFilterStatus;
        for (JSONObject item : source) {
            if (!matchesQuery(item, bomSearchQuery, new String[]{"equipment", "part", "stockNo", "materialDescription", "manufacture", "power", "ampere", "speed", "frame", "note", "longText"})) {
                continue;
            }
            if ("BOM General".equalsIgnoreCase(filter) && motor) {
                continue;
            }
            if ("BOM Motor".equalsIgnoreCase(filter) && !motor) {
                continue;
            }
            boolean hasPhoto = hasBomPhoto(item, motor);
            if ("Ada Foto".equalsIgnoreCase(filter) && !hasPhoto) {
                continue;
            }
            if ("Tanpa Foto".equalsIgnoreCase(filter) && hasPhoto) {
                continue;
            }
            result.add(item);
        }
        return result;
    }

    private boolean hasBomPhoto(JSONObject item, boolean motor) {
        if (motor) {
            return normalizePhotoName(item.optString("motorPhoto", "")).length() > 0
                    || normalizePhotoName(item.optString("nameplatePhoto", "")).length() > 0
                    || normalizePhotoName(item.optString("connectionPhoto", "")).length() > 0;
        }
        return normalizePhotoName(item.optString("itemPhoto", "")).length() > 0
                || normalizePhotoName(item.optString("nameplatePhoto", "")).length() > 0
                || normalizePhotoName(item.optString("extraPhoto", "")).length() > 0;
    }

    private List<JSONObject> filterSparepartItems(List<JSONObject> source, String query, String filter) {
        List<JSONObject> result = new ArrayList<JSONObject>();
        String activeFilter = filter == null ? "Semua" : filter;
        for (JSONObject item : source) {
            if (!matchesQuery(item, query, new String[]{"code", "name", "category", "location", "condition", "equipment", "equipmentName"})) {
                continue;
            }
            String condition = normalizeKey(item.optString("condition", ""));
            String category = normalizeKey(item.optString("category", "") + " " + item.optString("name", ""));
            int qty = parseIntSafe(item.optString("qty", ""), 999999);
            boolean keep = true;
            if ("Kritis".equalsIgnoreCase(activeFilter)) {
                keep = condition.contains("KOSONG") || qty <= 0;
            } else if ("Stok Rendah".equalsIgnoreCase(activeFilter)) {
                keep = condition.contains("RENDAH") || condition.contains("LOW") || qty <= 10;
            } else if ("Normal".equalsIgnoreCase(activeFilter)) {
                keep = !condition.contains("KOSONG") && !condition.contains("RENDAH") && !condition.contains("LOW") && qty > 10;
            } else if (!"Semua".equalsIgnoreCase(activeFilter)) {
                keep = category.contains(normalizeKey(activeFilter));
            }
            if (keep) {
                result.add(item);
            }
        }
        return result;
    }

    private List<JSONObject> filterNegatifItems(List<JSONObject> source, String query, String filter) {
        List<JSONObject> result = new ArrayList<JSONObject>();
        String activeFilter = filter == null ? "Open" : filter;
        for (JSONObject item : source) {
            if (!matchesQuery(item, query, new String[]{"equipment", "damageDescription", "followUpPlan", "pendingMark", "workStatus", "category", "area"})) {
                continue;
            }
            String status = normalizeKey(item.optString("workStatus", "Open"));
            String mark = normalizeKey(item.optString("pendingMark", "") + " " + item.optString("followUpPlan", ""));
            boolean keep = true;
            if ("Open".equalsIgnoreCase(activeFilter)) {
                keep = !status.contains("CLOSE");
            } else if ("Close".equalsIgnoreCase(activeFilter)) {
                keep = status.contains("CLOSE");
            } else if (!"Semua".equalsIgnoreCase(activeFilter)) {
                keep = mark.contains(normalizeKey(activeFilter));
            }
            if (keep) {
                result.add(item);
            }
        }
        return result;
    }

    private int parseIntSafe(String value, int fallback) {
        try {
            return Integer.parseInt(String.valueOf(value == null ? "" : value).trim());
        } catch (Exception error) {
            return fallback;
        }
    }

    private JSONObject latestCarbonBrushService() {
        List<JSONObject> latest = sortByInspectionDate(serviceItems, false);
        for (JSONObject item : latest) {
            if ("service-motor-mv-carbon-brush".equals(item.optString("formType", ""))) {
                return item;
            }
        }
        return null;
    }

    private JSONObject findLatestServiceByEquipment(String formType, String equipmentName) {
        return findLatestServiceByEquipment(formType, equipmentName, "");
    }

    private JSONObject findLatestServiceByEquipment(String formType, String equipmentName, String skipServiceId) {
        if (normalizeKey(equipmentName).length() == 0) {
            return null;
        }
        List<JSONObject> latest = sortByInspectionDate(serviceItems, false);
        JSONObject best = null;
        int bestScore = 0;
        for (JSONObject item : latest) {
            if (skipServiceId != null && skipServiceId.length() > 0 && skipServiceId.equals(item.optString("id", ""))) {
                continue;
            }
            if (!formType.equals(item.optString("formType", ""))) {
                continue;
            }
            int score = scoreServiceEquipmentMatch(formType, equipmentName, item.optString("equipmentName", ""));
            if (score >= 100) {
                return item;
            }
            if (score > bestScore) {
                bestScore = score;
                best = item;
            }
        }
        return bestScore >= 45 ? best : null;
    }

    private int scoreServiceEquipmentMatch(String formType, String requestedEquipment, String candidateEquipment) {
        String target = normalizeKey(requestedEquipment);
        String candidate = normalizeKey(candidateEquipment);
        if (target.length() == 0 || candidate.length() == 0) {
            return 0;
        }
        if (target.equals(candidate)) {
            return 100;
        }
        if (!"service-motor-mv-carbon-brush".equals(formType)) {
            return 0;
        }
        String targetCarbon = normalizeCarbonEquipmentKey(requestedEquipment);
        String candidateCarbon = normalizeCarbonEquipmentKey(candidateEquipment);
        if (targetCarbon.length() == 0 || candidateCarbon.length() == 0) {
            return 0;
        }
        if (targetCarbon.equals(candidateCarbon)) {
            return 96;
        }
        if (targetCarbon.startsWith(candidateCarbon) || candidateCarbon.startsWith(targetCarbon)) {
            return 76;
        }
        if (targetCarbon.contains(candidateCarbon) || candidateCarbon.contains(targetCarbon)) {
            return 54;
        }
        return 0;
    }

    private void startCarbonBannerRotation(int total) {
        stopCarbonBannerRotation();
        if (selectedTab != 0 || total <= 1) {
            return;
        }
        carbonBannerHandler.postDelayed(carbonBannerRunnable, 10000L);
    }

    private void stopCarbonBannerRotation() {
        carbonBannerHandler.removeCallbacks(carbonBannerRunnable);
    }

    private void rotateCarbonBanner() {
        if (selectedTab != 0 || content == null) {
            return;
        }
        List<JSONObject> alerts = buildCarbonAlerts();
        if (alerts.size() <= 1) {
            return;
        }
        carbonBannerIndex = (carbonBannerIndex + 1) % alerts.size();
        renderSelected();
    }

    private void showEquipmentPicker(String formType, final EditText target) {
        final List<String> names = equipmentNamesForFormType(formType);
        if (names.isEmpty()) {
            Toast.makeText(this, "Master Equipment belum tersedia untuk " + serviceTitleForFormType(formType), Toast.LENGTH_LONG).show();
            return;
        }
        final AlertDialog[] dialogRef = new AlertDialog[1];
        LinearLayout body = dialogBody();
        body.addView(label("Pilih Equipment", 18, TEXT, true));
        for (final String item : names) {
            TextView row = label(item, 14, TEXT, true);
            row.setGravity(Gravity.CENTER_VERTICAL);
            row.setPadding(dp(14), 0, dp(14), 0);
            row.setBackground(selectableBackground(SURFACE_HIGH, BORDER_SOFT, 14));
            row.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    target.setText(item);
                    if (dialogRef[0] != null) {
                        dialogRef[0].dismiss();
                    }
                }
            });
            body.addView(row, topMargin(-1, dp(8), dp(48)));
        }
        dialogRef[0] = buildActionDialog("Equipment", body, "Tutup", "Tutup", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Object tag = v.getTag();
                if (tag instanceof AlertDialog) {
                    ((AlertDialog) tag).dismiss();
                }
            }
        });
        dialogRef[0].show();
    }

    private List<String> equipmentNamesForFormType(String formType) {
        LinkedHashSet<String> sourceGroups = new LinkedHashSet<String>();
        if ("service-motor-mv-carbon-brush".equals(formType)) {
            sourceGroups.add("carbon-brush");
        } else if ("service-electrical-room".equals(formType)) {
            sourceGroups.add("electrical-room");
        } else if ("service-mcc".equals(formType)) {
            sourceGroups.add("service-mcc");
            sourceGroups.add("mcc-service");
        } else if ("service-motor-mv".equals(formType) || "service-motor-mso".equals(formType)) {
            sourceGroups.add("motor-mv");
            sourceGroups.add("motor-mso");
            sourceGroups.add("service-motor-mv");
            sourceGroups.add("service-motor-mso");
        } else if ("service-cems".equals(formType)) {
            sourceGroups.add("cems-service");
        } else if ("service-opacity-meter".equals(formType)) {
            sourceGroups.add("opacity-service");
        } else if ("service-dcs".equals(formType)) {
            sourceGroups.add("plc-service");
            sourceGroups.add("dcs-service");
        }

        LinkedHashSet<String> result = new LinkedHashSet<String>();
        for (int i = 0; i < equipmentReferenceItems.length(); i++) {
            JSONObject item = equipmentReferenceItems.optJSONObject(i);
            if (item == null) {
                continue;
            }
            String sourceGroup = item.optString("sourceGroup", item.optString("source_group", "")).trim();
            if (!sourceGroups.isEmpty() && !sourceGroups.contains(sourceGroup)) {
                continue;
            }
            String name = item.optString("equipmentName", item.optString("equipment_name", "")).trim();
            if (name.length() > 0) {
                result.add(name);
            }
        }
        if (result.isEmpty()) {
            for (int i = 0; i < serviceItems.length(); i++) {
                JSONObject item = serviceItems.optJSONObject(i);
                if (item != null && formType.equals(item.optString("formType", ""))) {
                    String name = item.optString("equipmentName", "").trim();
                    if (name.length() > 0) {
                        result.add(name);
                    }
                }
            }
        }
        List<String> names = new ArrayList<String>(result);
        Collections.sort(names, new Comparator<String>() {
            @Override
            public int compare(String left, String right) {
                return left.compareToIgnoreCase(right);
            }
        });
        return names;
    }

    private String normalizeKey(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private List<JSONObject> buildCarbonAlerts() {
        List<JSONObject> backendAlerts = buildBackendCarbonAlerts();
        if (!backendAlerts.isEmpty()) {
            return backendAlerts;
        }

        Map<String, JSONObject> latestByEquipment = new HashMap<String, JSONObject>();
        for (int i = 0; i < serviceItems.length(); i++) {
            JSONObject item = serviceItems.optJSONObject(i);
            if (item == null || !"service-motor-mv-carbon-brush".equals(item.optString("formType", ""))) {
                continue;
            }
            String equipment = item.optString("equipmentName", "").trim().toUpperCase(Locale.ROOT);
            if (equipment.length() == 0) {
                continue;
            }
            JSONObject existing = latestByEquipment.get(equipment);
            long itemTime = dateMillis(item.optJSONObject("payload") == null ? "" : item.optJSONObject("payload").optString("inspectionDate", ""));
            long existingTime = existing == null || existing.optJSONObject("payload") == null ? 0L : dateMillis(existing.optJSONObject("payload").optString("inspectionDate", ""));
            if (existing == null || itemTime >= existingTime) {
                latestByEquipment.put(equipment, item);
            }
        }

        List<JSONObject> alerts = new ArrayList<JSONObject>();
        for (JSONObject item : latestByEquipment.values()) {
            JSONObject payload = item.optJSONObject("payload");
            JSONObject measurements = payload == null ? null : payload.optJSONObject("measurements");
            if (measurements == null) {
                continue;
            }
            JSONArray replacedPoints = payload == null ? null : payload.optJSONArray("replacedPoints");
            String worstPoint = "";
            double worstValue = Double.MAX_VALUE;
            Iterator<String> keys = measurements.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                if (jsonArrayContains(replacedPoints, key)) {
                    continue;
                }
                double value = parseDouble(measurements.optString(key, ""));
                if (value >= 0 && value < worstValue) {
                    worstValue = value;
                    worstPoint = key;
                }
            }
            if (worstPoint.length() == 0 || worstValue == Double.MAX_VALUE) {
                continue;
            }
            try {
                JSONObject alert = new JSONObject();
                alert.put("equipment", item.optString("equipmentName", "-"));
                alert.put("point", worstPoint);
                alert.put("value", worstValue);
                alert.put("valueText", trimNumber(worstValue));
                alert.put("date", formatDate(payload.optString("inspectionDate", "")));
                alert.put("estimate", worstValue < 30 ? "Segera" : "Histori kurang");
                alert.put("status", worstValue < 30 ? "CRITICAL" : worstValue < 34 ? "PREPARE" : "MONITOR");
                alert.put("note", worstValue < 34 ? "Persiapkan sparepart dan jadwalkan penggantian." : "Monitoring periodik.");
                alerts.add(alert);
            } catch (JSONException ignored) {
            }
        }
        Collections.sort(alerts, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject left, JSONObject right) {
                return Double.compare(left.optDouble("value", 999), right.optDouble("value", 999));
            }
        });
        return alerts;
    }

    private List<JSONObject> buildBackendCarbonAlerts() {
        List<JSONObject> alerts = new ArrayList<JSONObject>();
        for (int i = 0; i < carbonBrushAlerts.length(); i++) {
            JSONObject source = carbonBrushAlerts.optJSONObject(i);
            if (source == null) {
                continue;
            }
            JSONObject point = source.optJSONObject("worstPoint");
            if (source.optBoolean("latestReplacedConfirmed", false) || (point != null && point.optBoolean("latestReplacedConfirmed", false))) {
                continue;
            }
            JSONObject status = source.optJSONObject("status");
            JSONObject quality = source.optJSONObject("predictionQuality");
            String equipment = source.optString("equipment", "-");
            String pointKey = source.optString("pointKey", point == null ? "-" : point.optString("pointKey", "-"));
            double value = source.has("currentValue") ? source.optDouble("currentValue", source.optDouble("lastMeasurementMm", 999)) : source.optDouble("lastMeasurementMm", 999);
            String statusLabel = status == null ? source.optString("status", "MONITOR") : status.optString("label", "MONITOR");
            String statusKey = status == null ? "" : status.optString("key", "");
            if (latestCarbonPointWasReplaced(equipment, pointKey)) {
                continue;
            }
            String countdownText = source.isNull("countdownDays") ? "" : source.optString("countdownDays", "");
            String estimateDate = source.optString("estimatedReplacementDate", "");
            String estimate;
            if (estimateDate.length() > 0 && countdownText.length() > 0) {
                estimate = formatDate(estimateDate) + " (" + countdownText + " hari)";
            } else if (estimateDate.length() > 0) {
                estimate = formatDate(estimateDate);
            } else {
                estimate = "Histori kurang";
            }
            String threshold = source.optString("thresholdPlant", source.optString("thresholdPlantLabel", "-"))
                    + " limit merah < " + trimNumber(source.optDouble("thresholdLow", 0)) + " mm";
            String historyText = quality == null ? "Histori belum cukup untuk prediksi laju aus." : quality.optString("label", "Histori belum cukup");
            String note = statusLabel + " | " + threshold + " | " + historyText;
            try {
                JSONObject alert = new JSONObject();
                alert.put("equipment", equipment);
                alert.put("point", pointKey);
                alert.put("value", value);
                alert.put("valueText", trimNumber(value));
                alert.put("date", formatDate(source.optString("lastInspectionDate", "")));
                alert.put("estimate", estimate);
                alert.put("status", statusLabel.toUpperCase(Locale.ROOT));
                alert.put("statusKey", statusKey);
                alert.put("note", note);
                alert.put("thresholdLow", source.optDouble("thresholdLow", 0));
                alert.put("thresholdHigh", source.optDouble("thresholdHigh", 0));
                alerts.add(alert);
            } catch (JSONException ignored) {
            }
        }
        Collections.sort(alerts, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject left, JSONObject right) {
                int severityCompare = Integer.compare(statusSeverity(right), statusSeverity(left));
                if (severityCompare != 0) {
                    return severityCompare;
                }
                return Double.compare(left.optDouble("value", 999), right.optDouble("value", 999));
            }
        });
        return alerts;
    }

    private boolean latestCarbonPointWasReplaced(String equipmentName, String pointKey) {
        if (equipmentName == null || pointKey == null || pointKey.trim().length() == 0) {
            return false;
        }
        JSONObject latest = findLatestServiceByEquipment("service-motor-mv-carbon-brush", equipmentName);
        JSONObject payload = latest == null ? null : latest.optJSONObject("payload");
        JSONArray replacedPoints = payload == null ? null : payload.optJSONArray("replacedPoints");
        return jsonArrayContains(replacedPoints, pointKey);
    }

    private int statusSeverity(JSONObject alert) {
        String key = alert.optString("statusKey", "").toLowerCase(Locale.ROOT);
        String label = alert.optString("status", "").toLowerCase(Locale.ROOT);
        if (key.contains("critical") || label.contains("critical") || label.contains("melewati")) {
            return 3;
        }
        if (key.contains("urgent") || label.contains("urgent")) {
            return 2;
        }
        if (key.contains("prepare") || label.contains("prepare") || label.contains("dekat")) {
            return 1;
        }
        return 0;
    }

    private double parseDouble(String raw) {
        if (raw == null) {
            return -1;
        }
        try {
            return Double.parseDouble(raw.trim().replace(",", "."));
        } catch (Exception error) {
            return -1;
        }
    }

    private String trimNumber(double value) {
        if (Math.abs(value - Math.round(value)) < 0.001) {
            return String.valueOf((int) Math.round(value));
        }
        return String.format(Locale.US, "%.1f", value);
    }

    private int measurementColor(String value) {
        double parsed = parseDouble(value);
        if (parsed < 0) {
            return SURFACE_HIGH;
        }
        if (parsed < 30) {
            return RED;
        }
        if (parsed < 34) {
            return AMBER;
        }
        return Color.rgb(47, 58, 49);
    }

    private String joinArray(JSONArray array) {
        if (array == null || array.length() == 0) {
            return "-";
        }
        List<String> values = new ArrayList<String>();
        for (int i = 0; i < array.length(); i++) {
            values.add(array.optString(i, ""));
        }
        return join(values, ", ");
    }

    private boolean jsonArrayContains(JSONArray array, String value) {
        if (array == null) {
            return false;
        }
        String target = normalizeKey(value);
        for (int i = 0; i < array.length(); i++) {
            if (normalizeKey(array.optString(i, "")).equals(target)) {
                return true;
            }
        }
        return false;
    }

    private String join(List<String> values, String separator) {
        StringBuilder builder = new StringBuilder();
        for (String value : values) {
            if (value == null || value.length() == 0) {
                continue;
            }
            if (builder.length() > 0) {
                builder.append(separator);
            }
            builder.append(value);
        }
        return builder.toString();
    }

    private String mutationText(JSONObject item) {
        int delta = item.optInt("quantityDelta", 0);
        String direction = delta < 0 ? "Keluar " : "Masuk ";
        if ("adjust".equalsIgnoreCase(item.optString("movementType", ""))) {
            direction = "Koreksi ";
        }
        return direction + Math.abs(delta) + " unit (" + item.optInt("stockBefore", 0) + " -> " + item.optInt("stockAfter", 0) + ")";
    }
}
