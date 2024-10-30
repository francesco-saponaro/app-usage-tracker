import { registerPlugin } from "@capacitor/core";
import type { AppUsagePlugin } from "./definitions";

const AppUsage = registerPlugin<AppUsagePlugin>("AppUsagePlugin");

export { AppUsage };
