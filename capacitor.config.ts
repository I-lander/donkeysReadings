import 'dotenv/config';
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.donkeysisle.donkeysreadings',
  appName: "Les Lectures de l'Âne",
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // Must be the OAuth *web* client ID (same value as VITE_GOOGLE_CLIENT_ID);
      // baked in at `cap sync` time from .env.
      serverClientId: process.env.VITE_GOOGLE_CLIENT_ID,
      forceCodeForRefreshToken: false,
    },
  },
};

export default config;
