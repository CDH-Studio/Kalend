package com.kalend;

import android.app.Application;

import com.facebook.react.ReactApplication;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;

import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import org.reactnative.camera.RNCameraPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.RNFetchBlob.RNFetchBlobPackage;   

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CustomTabsPackage(),
            new ReactNativeRestartPackage(),
            new CameraRollPackage(),
            new RNCViewPagerPackage(),
            new ReactSliderPackage(),
            new AsyncStoragePackage(),
		       new RNFirebasePackage(),
          new LottiePackage(),
          new RNGestureHandlerPackage(),
          new LinearGradientPackage(),
          new RNGoogleSigninPackage(),
          new RNCameraPackage(),
          new RNFirebaseRemoteConfigPackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNFirebaseCrashlyticsPackage(),
          new RNFirebasePerformancePackage(),
          new RNFetchBlobPackage(),
          new ExtraDimensionsPackage() 
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
