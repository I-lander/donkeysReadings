import {
  AdMob,
  AdmobConsentStatus,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Google test ad unit for rewarded video; replace via VITE_ADMOB_REWARDED_AD_ID.
const TEST_REWARDED_AD_ID = 'ca-app-pub-3940256099942544/5224354917';
const REWARDED_AD_ID: string = import.meta.env.VITE_ADMOB_REWARDED_AD_ID || TEST_REWARDED_AD_ID;
const IS_TESTING = REWARDED_AD_ID === TEST_REWARDED_AD_ID;

export function adsAvailable(): boolean {
  return Capacitor.isNativePlatform();
}

let initialized = false;

export async function initAds(): Promise<void> {
  if (!adsAvailable() || initialized) return;
  await AdMob.initialize();
  const consentInfo = await AdMob.requestConsentInfo();
  if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
    await AdMob.showConsentForm();
  }
  initialized = true;
}

/**
 * Shows a rewarded ad. Resolves true when the user earned the reward
 * (the actual credit is granted server-side through the AdMob SSV callback).
 */
export async function showRewardedAd(deviceId: string): Promise<boolean> {
  await initAds();

  return new Promise<boolean>((resolve, reject) => {
    let rewarded = false;
    const listeners: Promise<{ remove: () => Promise<void> }>[] = [];

    const cleanup = async () => {
      for (const listener of listeners) {
        await (await listener).remove();
      }
    };

    listeners.push(
      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        rewarded = true;
      }),
      AdMob.addListener(RewardAdPluginEvents.Dismissed, async () => {
        await cleanup();
        resolve(rewarded);
      }),
      AdMob.addListener(RewardAdPluginEvents.FailedToShow, async (error) => {
        await cleanup();
        reject(new Error(error.message));
      })
    );

    AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_ID,
      isTesting: IS_TESTING,
      ssv: { userId: deviceId },
    })
      .then(() => AdMob.showRewardVideoAd())
      .catch(async (error) => {
        await cleanup();
        reject(error instanceof Error ? error : new Error(String(error)));
      });
  });
}
