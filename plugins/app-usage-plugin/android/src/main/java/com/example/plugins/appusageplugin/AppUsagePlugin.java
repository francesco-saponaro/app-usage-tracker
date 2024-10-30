// Import statements for JSON handling and necessary Android packages
import android.content.Context;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import java.util.List;

// Import statements for Capacitor plugin handling and JSON handling
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.PluginMethod;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// Updated method in AppUsagePlugin.java
@PluginMethod
public void getAppUsage(PluginCall call) {
    // Retrieve the current context (i.e., the current application environment)
    Context context = getContext();

    // Get an instance of the UsageStatsManager, which allows access to app usage statistics
    UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);

    // Define the time range for usage stats: current time and 24 hours prior
    long time = System.currentTimeMillis(); // Current time in milliseconds
    long startTime = time - (1000 * 3600 * 24); // 24 hours ago in milliseconds

    // Query for app usage stats within the last 24 hours at a daily interval
    List<UsageStats> appList = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, time);

    // Check if there is any data available. If not, reject the call with an error message
    if (appList == null || appList.isEmpty()) {
        call.reject("No app usage data available.");
        return;
    }

    // Initialize a JSON array to store usage data for each app
    JSONArray usageArray = new JSONArray();

    // Loop through each UsageStats object in the appList
    for (UsageStats usageStats : appList) {
        // Create a JSON object to store data for the current app
        JSONObject appUsage = new JSONObject();
        try {
            // Add the package name of the app to the JSON object
            appUsage.put("packageName", usageStats.getPackageName());
            // Add the total time the app was in the foreground within the specified time range
            appUsage.put("timeInForeground", usageStats.getTotalTimeInForeground());

            // Add the JSON object for this app to the JSON array
            usageArray.put(appUsage);
        } catch (JSONException e) {
            // If there is an error building the JSON data, print the stack trace for debugging
            e.printStackTrace();
        }
    }

    // Create a JSObject to send the result back to the caller
    JSObject result = new JSObject();
    // Add the usage data JSON array to the result object
    result.put("usageData", usageArray);

    // Resolve the plugin call with the result, returning it to the JavaScript side
    call.resolve(result);
}
