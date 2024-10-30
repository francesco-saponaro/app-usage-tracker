import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// Updated method in AppUsagePlugin.java
@PluginMethod
public void getAppUsage(PluginCall call) {
    Context context = getContext();
    UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);

    long time = System.currentTimeMillis();
    long startTime = time - (1000 * 3600 * 24); // last 24 hours

    List<UsageStats> appList = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, time);
    if (appList == null || appList.isEmpty()) {
        call.reject("No app usage data available.");
        return;
    }

    JSONArray usageArray = new JSONArray();
    for (UsageStats usageStats : appList) {
        JSONObject appUsage = new JSONObject();
        try {
            appUsage.put("packageName", usageStats.getPackageName());
            appUsage.put("timeInForeground", usageStats.getTotalTimeInForeground());
            usageArray.put(appUsage);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    JSObject result = new JSObject();
    result.put("usageData", usageArray);
    call.resolve(result);
}
