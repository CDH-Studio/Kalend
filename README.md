[<img src="https://raw.githubusercontent.com/CDH-Studio/Kalend/dev/src/assets/img/dark_logo.png" alt="Kalend" width="300"/>](https://benjeau.github.io/)

[![CircleCI](https://img.shields.io/circleci/project/github/CDH-Studio/Kalend/master.svg?style=flat&logo=circleci)](https://circleci.com/gh/CDH-Studio/Kalend)
[![Release Version](https://img.shields.io/github/release/CDH-Studio/Kalend.svg?style=flat)](https://github.com/CDH-Studio/Kalend/releases)
![](https://img.shields.io/github/license/CDH-Studio/Kalend.svg?style=flat)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/CDH-Studio/Kalend.svg)

A mobile application that leverages Artificial Intelligence technology to create optimized schedules while taking into account various user constraints as well as other information such as the location of activities and their duration. Our project demo website is available [here](https://benjeau.github.io/).

## Dependencies

Below is a list of development dependencies to run the project, you can either install all of them manually or run the PowerShell script.

* [Yarn](https://yarnpkg.com/)
* [Node.js](https://nodejs.org/)
* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [React Native](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies)
* [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (for iOS development)
* [Android Studio](https://developer.android.com/studio) (for Android development)
* Android SDK (for Android development, needed for React Native)
  * Android SDK Platform 28
  * Android SDK Build-Tools 28.0.3
  * Sources for Android 28
  * Intel x86 Emulator Accelerator (HAXM installer)

### Automatic install

If you have none of the dependencies listed above and want to install from scratch, located at the root of this project, there is a file called **setup.ps1**. To install via the script:

1. Open a PowerShell window with Administrator privileges.
2. Run `Set-ExecutionPolicy RemoteSigned` to be able to run the PowerShell script. Then enter **a** when asked for an input.
3. Run `.\script.ps1` to run the script. Follow the instructions displayed in PowerShell when running the script

## Get up and running

Make sure to install every development dependencies mentionned above before proceding.

1. Clone the repo `git clone https://github.com/CDH-Studio/Kalend.git`
2. Change directory `cd Kalend`
3. Install project dependencies `yarn install` or just `yarn`
    * **Note** if you want to test it on iOS, you need to install pod dependencies by doing `cd ios && pod install`
4. Run the application
    1. In the debug environment
        * On Android `yarn android` or `react-native run-android`
        * On iOS `yarn ios` or `react-native run-ios`
    2. In the release environment
        * On Android `yarn android-release` or `react-native run-android`
        * On iOS `yarn ios-release` or `react-native run-android`


#### Go to our [wiki](https://github.com/CDH-Studio/Kalend/wiki) for more information