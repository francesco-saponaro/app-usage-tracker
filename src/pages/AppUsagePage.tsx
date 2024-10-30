import React, { useState, useEffect } from "react";
import { AppUsage } from "../../plugins/app-usage-plugin/android/src"; // Adjust the path as needed
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { LocalNotifications } from "@capacitor/local-notifications";

const AppUsagePage: React.FC = () => {
  const [usageData, setUsageData] = useState<
    { packageName: string; timeInForeground: number }[]
  >([]);

  const usageLimits = {
    "com.instagram.android": 3600 * 1000, // 1 hour in milliseconds
  };

  const getAppUsage = async () => {
    try {
      const result = await AppUsage.getAppUsage();
      setUsageData(result.usageData);
      console.log("App Usage Data:", result.usageData);

      // Check if any app usage exceeds the limit and send a notification
      result.usageData.forEach((app) => {
        const limit = usageLimits[app.packageName as keyof typeof usageLimits];
        if (limit && app.timeInForeground > limit) {
          sendUsageNotification(app.packageName);
        }
      });
    } catch (error) {
      console.error("Error fetching app usage data", error);
    }
  };

  const sendUsageNotification = async (packageName: string) => {
    const appName =
      packageName === "com.instagram.android" ? "Instagram" : packageName;

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Time's up!",
          body: `You've spent too much time on ${appName}. Consider taking a break.`,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 1000) },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: null,
        },
      ],
    });
  };

  useEffect(() => {
    getAppUsage(); // Automatically fetch usage data on component mount
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>App Usage Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={getAppUsage}>
          Refresh Usage Data
        </IonButton>
        <IonList>
          {usageData.length > 0 ? (
            usageData.map((app, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>App: {app.packageName}</h2>
                  <p>
                    Time in Foreground:{" "}
                    {Math.round(app.timeInForeground / 1000)} seconds
                  </p>
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonItem>
              <IonLabel>No usage data available</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AppUsagePage;
