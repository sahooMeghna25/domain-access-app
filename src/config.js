export const ALLOWED_DOMAIN = (
  process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || 'hbplus.fit'
).toLowerCase();

export const GOOGLE_CLIENT_IDS = {
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};
