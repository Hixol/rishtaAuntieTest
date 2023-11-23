import React, { useState } from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import Icons from "../../utility/icons";
import colors from "../../utility/colors";

export default function VideoToolBar({
  isAudioCall,
  onSwitchCamera,
  onStopCall,
  onMute,
  canSwitchCamera,
}) {
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const isMicrophoneMuted = useSelector(
    store => store.ActiveCall.isMicrophoneMuted
  );

  const switchCamera = () => {
    onSwitchCamera();

    setIsFrontCamera(!isFrontCamera);
  };

  const muteUnmuteAudio = () => {
    onMute(!isMicrophoneMuted);
  };

  const renderStopButton = () => {
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.buttonCallEnd]}
        onPress={onStopCall}
      >
        <Icons.MaterialIcons name={"call-end"} size={28} color="white" />
      </TouchableOpacity>
    );
  };

  const renderMuteButton = () => {
    const type = isMicrophoneMuted ? "mic-off" : "mic";

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.buttonMute]}
        onPress={muteUnmuteAudio}
      >
        <Icons.MaterialIcons name={type} size={28} color="white" />
      </TouchableOpacity>
    );
  };

  const renderSwitchVideoSourceButton = () => {
    const type = isFrontCamera ? "camera-rear" : "camera-front";

    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.buttonSwitch]}
        onPress={switchCamera}
      >
        <Icons.MaterialIcons name={type} size={28} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolBarItem}>{renderMuteButton()}</View>
      <View style={styles.toolBarItem}>{renderStopButton()}</View>
      {!isAudioCall && (
        <View style={styles.toolBarItem}>
          {canSwitchCamera && renderSwitchVideoSourceButton()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    height: 60,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    zIndex: 100,
  },
  toolBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCallEnd: {
    backgroundColor: colors.callRed,
  },
  buttonMute: {
    backgroundColor: "blue",
  },
  buttonSwitch: {
    backgroundColor: "orange",
  },
});
