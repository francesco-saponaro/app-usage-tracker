export interface AppUsagePlugin {
  getAppUsage(): Promise<{
    usageData: { packageName: string; timeInForeground: number }[];
  }>;
}
