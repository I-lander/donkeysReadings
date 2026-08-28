import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.donkeysisle.donkeysreadings',
  appName: "Les Lectures de l'Âne",
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
