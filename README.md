This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Notes

### For iOS

For **Permissions** library Xcode 15 is required. Either update Xcode to 15 or remove the premissions library from podfile and package.json file.

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

> ❗❗❗**Important**❗❗❗

In case of this error `bash Multiple commands produce 'React-Core-60309c9c-RCTI18nStrings'`.

We need to remove `React-Core-RCTI18nStrings` by goind to Pods in xcode and then search `React-Core-RCTI18nStrings` in filter. And then click on minus to remove it.

> ❗❗❗**Important**❗❗❗
> For intel chips you need to add these lines below `post_install do |installer|` in podfile

```
installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = "arm64"
      end
    end
```

For M chips you need to add these lines below `post_install do |installer|` in podfile

```
installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end
```

> ❗❗❗ Filpper Error ❗❗❗❗
> There might be error related to flipper folly. In that case add the this line `#include <functional>` below `pragma once` line

```
#pragma once
#include <functional>
```

1. Select project in Xcode Project navigator.
2. Select Pods and again select nested Pods.
3. Then go to Flipper folder and select FlipperTransportTypes.h file.

**Build**

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Make build of your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start building your _Android_ or _iOS_ build:

### For Android

1. Run command in root folder of your project

```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

2. cd android

```
./gradlew assembleDebug
```

After process is completed you'll find the apk at this location

```
/android/app/build/outputs/apk/debug
```

### For iOS

1. Open Xcode.
2. In project navigator select your project. You need to select your project in target list too.
3. In Signing & Capabilities tab and select your team.
4. Select General tab and choose version for your app.
   (:warning: **Your version needs to be greater than last uploaded version on app store connect.**: Be very careful here!)
5. Press `cmd + shift + k` to clean build.
6. Select any ios device from device list.
7. Select Product from top menu bar and then select Archive.
8. After roughly 20 mins your testflight will be ready. A dialogue box appear, you need to select distribute app and your testflight will be uploaded to app store connect.

**Congratulations!!!** You have successfully built your platform specific build.

## Step 4: ENV

.env file is not pushed to github.

1. You need to create the file by name of `.babelrc` for env configuration at the root level.

```
{
  plugins: [
    [
      "module:react-native-dotenv",
      {
        envName: "APP_API_BASE_URL",
        moduleName: "@env",
        path: ".env"
      }
    ]
  ]
}
```

2. You need to create .env file as well.

```
APP_API_BASE_URL = 'https://your_api_url'
```

## Step 5: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
