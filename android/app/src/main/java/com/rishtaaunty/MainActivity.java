package com.rishtaaunty;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.otomogroove.OGReactNativeWaveform.OGWavePackage;
import com.codegulp.invokeapp.RNInvokeApp;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "rishtaaunty";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
	  RNInvokeApp.sendEvent();
  }
}
