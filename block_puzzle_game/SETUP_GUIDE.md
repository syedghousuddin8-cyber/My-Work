# Setup Guide - Block Puzzle Master

Complete step-by-step guide to set up, configure, and deploy the Block Puzzle Master game.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [AdMob Configuration](#admob-configuration)
4. [Building the App](#building-the-app)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Flutter SDK** (3.0.0 or higher)
  - Download: https://flutter.dev/docs/get-started/install
  - Verify: `flutter --version`

- **Dart SDK** (Included with Flutter)
  - Verify: `dart --version`

- **Android Studio** (for Android development)
  - Download: https://developer.android.com/studio
  - Install Android SDK (API 21+)

- **Xcode** (for iOS development, macOS only)
  - Download from Mac App Store
  - Install Command Line Tools

- **Git**
  - Verify: `git --version`

### AdMob Account
1. Create account at: https://admob.google.com
2. Complete account verification
3. Set up payment information
4. Wait for approval (1-2 business days)

## Initial Setup

### 1. Navigate to Project Directory
```bash
cd block_puzzle_game
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Verify Flutter Installation
```bash
flutter doctor
```

Fix any issues reported by `flutter doctor`.

### 4. Check Connected Devices
```bash
flutter devices
```

## AdMob Configuration

### IMPORTANT: Replace Test Ad Unit IDs

The app currently uses test Ad Unit IDs. You MUST replace these with your own before publishing.

### Step 1: Create App in AdMob Console

1. Log in to [AdMob Console](https://apps.admob.com)
2. Click **Apps** > **Add App**
3. Select platform (Android/iOS)
4. Enter app name: "Block Puzzle Master"
5. Click **Add**
6. Copy the **App ID**

### Step 2: Create Ad Units

Create the following ad units for EACH platform:

**Banner Ad:**
- Ad format: Banner
- Ad unit name: "Home Banner"

**Interstitial Ad:**
- Ad format: Interstitial
- Ad unit name: "Game Over Interstitial"

**Rewarded Video Ad:**
- Ad format: Rewarded
- Ad unit name: "Power-up Reward"

### Step 3: Update Android Configuration

**File: `android/app/src/main/AndroidManifest.xml`**

Replace this line:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3940256099942544~3347511713"/>
```

With your Android App ID:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

### Step 4: Update iOS Configuration

**File: `ios/Runner/Info.plist`**

Replace this section:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3940256099942544~1458002511</string>
```

With your iOS App ID:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY</string>
```

### Step 5: Update Ad Unit IDs in Code

**File: `lib/services/ad_service.dart`**

Replace the test Ad Unit IDs (lines 9-14):

```dart
// ANDROID
static const String _androidBannerAdUnitId = 'ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB';
static const String _androidInterstitialAdUnitId = 'ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII';
static const String _androidRewardedAdUnitId = 'ca-app-pub-XXXXXXXXXXXXXXXX/RRRRRRRRRR';

// iOS
static const String _iosBannerAdUnitId = 'ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB';
static const String _iosInterstitialAdUnitId = 'ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII';
static const String _iosRewardedAdUnitId = 'ca-app-pub-XXXXXXXXXXXXXXXX/RRRRRRRRRR';
```

Replace:
- `XXXXXXXXXXXXXXXX` - Your publisher ID
- `BBBBBBBBBB` - Banner ad unit ID
- `IIIIIIIIII` - Interstitial ad unit ID
- `RRRRRRRRRR` - Rewarded ad unit ID

## Building the App

### Development Build (with hot reload)

**Android:**
```bash
flutter run
```

**iOS:**
```bash
flutter run -d ios
```

### Release Build

**Android APK:**
```bash
flutter build apk --release
```
Output: `build/app/outputs/flutter-apk/app-release.apk`

**Android App Bundle (for Google Play):**
```bash
flutter build appbundle --release
```
Output: `build/app/outputs/bundle/release/app-release.aab`

**iOS:**
```bash
flutter build ios --release
```
Then open `ios/Runner.xcworkspace` in Xcode and archive.

## Testing

### Testing AdMob Integration

#### 1. Test Mode (Current Configuration)
The app includes test ad units by default. You should see test ads with "Test Ad" label.

**What to check:**
- Banner ad appears on home screen
- Interstitial ad shows after 2 games
- Rewarded video ad available for power-ups
- No crashes when showing ads

#### 2. Production Testing

⚠️ **WARNING**: Never click your own ads in production mode!

After replacing with real ad units:

1. **Test on Real Device**
   - Install release build
   - Enable test device mode:
   ```dart
   // In ad_service.dart, add to AdRequest:
   AdRequest(
     testDevices: ['YOUR_DEVICE_ID'],
   )
   ```

2. **Find Device ID**
   - Run the app
   - Check logcat (Android) or Console (iOS)
   - Look for: "Use AdRequest.Builder.addTestDevice("XXXXX")"

3. **Verify Ad Loading**
   - Banner loads on home screen
   - Interstitial shows after game over
   - Rewarded video available for power-ups

### Testing Game Features

**Essential Checklist:**
- [ ] Game starts without crashes
- [ ] All three game modes work
- [ ] Pieces can be dragged and placed
- [ ] Lines clear correctly
- [ ] Score updates properly
- [ ] Daily reward appears on launch
- [ ] Achievements unlock correctly
- [ ] Leaderboard displays scores
- [ ] Settings save correctly
- [ ] Sound effects work
- [ ] Vibration works
- [ ] Sharing works
- [ ] App survives background/foreground

## Deployment

### Android - Google Play Store

#### 1. Create App Signing Key
```bash
keytool -genkey -v -keystore ~/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload
```

#### 2. Configure Signing

**File: `android/key.properties`** (create this file)
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=upload
storeFile=/path/to/upload-keystore.jks
```

**File: `android/app/build.gradle`**

Add before `android` block:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Update `buildTypes`:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ... rest of config
    }
}
```

#### 3. Build Release Bundle
```bash
flutter build appbundle --release
```

#### 4. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in store listing:
   - Title: Block Puzzle Master
   - Short description: Engaging block puzzle with daily rewards
   - Full description: (see README.md for inspiration)
   - Screenshots: Prepare 4-8 screenshots
   - Feature graphic: 1024 x 500 px
   - App icon: 512 x 512 px

4. Upload AAB file
5. Complete content rating questionnaire
6. Set pricing (Free)
7. Select countries
8. Submit for review

### iOS - App Store

#### 1. Configure Xcode Project

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select Runner project
3. Update:
   - Display Name: Block Puzzle Master
   - Bundle Identifier: com.yourcompany.blockpuzzle
   - Version: 1.0.0
   - Build: 1

#### 2. Configure Signing

1. Select Runner target
2. Go to Signing & Capabilities
3. Enable "Automatically manage signing"
4. Select your team

#### 3. Archive and Upload

1. Select "Any iOS Device" as target
2. Product > Archive
3. Click "Distribute App"
4. Select "App Store Connect"
5. Upload

#### 4. Complete App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in app information:
   - Name: Block Puzzle Master
   - Subtitle: Brain Training Puzzle
   - Description: (see README.md)
   - Keywords: puzzle,block,brain,game
   - Screenshots: 5-8 per device size
   - Preview video: Optional but recommended

4. Submit for review

## Troubleshooting

### Common Issues

#### Issue: "Ad failed to load"
**Solution:**
- Check internet connection
- Verify AdMob account is approved
- Confirm Ad Unit IDs are correct
- Test ads have limited fill rate (normal)

#### Issue: "MissingPluginException"
**Solution:**
```bash
flutter clean
flutter pub get
flutter run
```

#### Issue: Build fails on iOS
**Solution:**
```bash
cd ios
pod install
cd ..
flutter run
```

#### Issue: "Gradle build failed"
**Solution:**
1. Update Android SDK
2. Check `android/build.gradle` versions
3. Run `flutter doctor` and fix issues

#### Issue: Ads not showing in release mode
**Solution:**
- Verify you replaced test Ad Unit IDs
- Check AdMob account status
- Ensure app is approved for ads
- Wait 1-2 hours after first build

### Performance Issues

**Low frame rate:**
1. Test on physical device (not simulator)
2. Enable release mode optimizations
3. Profile with Flutter DevTools

**High memory usage:**
1. Dispose controllers properly
2. Check for memory leaks
3. Optimize image assets

### Getting Help

1. **Check logs:**
   ```bash
   flutter logs
   ```

2. **Enable verbose logging:**
   ```bash
   flutter run --verbose
   ```

3. **Check AdMob documentation:**
   - https://developers.google.com/admob/flutter/quick-start

4. **Flutter community:**
   - https://flutter.dev/community
   - Stack Overflow: [flutter] tag

## Post-Launch Checklist

After successful deployment:

- [ ] Monitor crash reports (Firebase Crashlytics recommended)
- [ ] Track ad revenue in AdMob console
- [ ] Monitor user reviews
- [ ] Check analytics in Settings screen
- [ ] Plan first update (bug fixes, new features)
- [ ] Respond to user feedback
- [ ] Update app based on metrics
- [ ] Implement A/B test findings

## Next Steps

1. **Monitor Metrics** (Week 1)
   - Daily revenue
   - DAU
   - Retention rates
   - Ad fill rates

2. **Optimize** (Week 2-4)
   - Adjust ad frequency based on data
   - Fix reported bugs
   - Improve retention features

3. **Grow** (Month 2+)
   - Start user acquisition campaigns
   - Implement referral program
   - Add new content
   - Expand to more countries

## Additional Resources

- **Flutter Documentation**: https://flutter.dev/docs
- **AdMob Help Center**: https://support.google.com/admob
- **Google Play Console Help**: https://support.google.com/googleplay
- **App Store Connect Help**: https://help.apple.com/app-store-connect

---

**Success!** You now have a fully functional block puzzle game with comprehensive monetization ready to generate revenue.

For questions or issues, refer to the README.md or open an issue in the repository.
