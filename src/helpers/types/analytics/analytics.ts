// src/types/analytics.ts
export interface DeviceInfo {
  os: string;
  model: string;
  appVersion: string;
  locale: string;
}

export interface LocationInfo {
  latitude: number | null;
  longitude: number | null;
}

export interface AnalyticsEvent {
  _id: string;
  userId: string | null;
  userType: 'anonymous' | 'logged_in' | string;
  sessionId: string;
  eventType: string;
  eventSource: string;
  deviceInfo: DeviceInfo;
  location: LocationInfo;
  timestamp: string; // ISO date string
  isDebug: boolean;
}
