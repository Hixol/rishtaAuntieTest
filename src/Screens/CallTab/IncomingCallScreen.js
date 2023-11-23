import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { getUserById } from "../../utility/utils";

import CallService from "../../services/call-service";
import Icons from "../../utility/icons";
import colors from "../../utility/colors";

export default function IncomingCallScreen({ navigation }) {
  const [initiator, setInitiator] = useState(null);
  const callSession = useSelector(store => store.ActiveCall.session);
  const isCallAccepted = useSelector(store => store.ActiveCall.isAccepted);

  useEffect(() => {
    getUserById(callSession?.initiatorID).then(user => setInitiator(user));
  }, []);

  useEffect(() => {
    if (isCallAccepted) {
      navigation.push("VideoScreen", { initiatorName: initiator });
    }
  }, [isCallAccepted]);

  const acceptCall = async () => {
    await CallService.acceptCall();
  };

  const rejectCall = () => {
    CallService.rejectCall();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.msgGrey }}>
      <StatusBar backgroundColor={colors.msgGrey} barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.incomingCallText}>Incoming Call</Text>
        {initiator != null && (
          <Text style={styles.incomingCallText}>
            {initiator.firstName} is calling
          </Text>
        )}
        <View style={styles.containerButtons}>
          <TouchableOpacity
            style={[styles.buttonAcceptCall]}
            onPress={acceptCall}
          >
            <Icons.MaterialIcons name={"call"} size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonRejectCall]}
            onPress={rejectCall}
          >
            <Icons.MaterialIcons name={"call-end"} size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    justifyContent: "space-around",
    alignItems: "stretch",
  },

  containerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  incomingCallText: {
    fontSize: 28,
    textAlign: "center",
    color: colors.blackBlue,
    fontFamily: "Inter-Bold",
  },

  buttonAcceptCall: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.callGreen,
    borderWidth: 7,
    borderColor: "rgba(39, 174, 96, 0.2)",
  },

  buttonRejectCall: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.callRed,
    borderWidth: 7,
    borderColor: "rgba(235, 87, 87, 0.2)",
  },
});
