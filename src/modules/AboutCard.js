import React from "react";
import { View, Text } from "react-native";
import { Divider } from "react-native-elements";
import { CARDWIDTH } from "../constants/Constants";
import { measureUnits } from "../utility/regex";

import colors from "../utility/colors";
import DiscoverItem from "./DiscoverItem";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import DiscoverLocation from "./DiscoverLocation";

export default function AboutScreen({ user }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.header}>
          <Text style={styles.text}>About Me</Text>
          <FastImage
            resizeMode="contain"
            style={{ width: 50, height: 50 }}
            source={require("../assets/iconimages/AboutMe.png")}
          />
        </View>
        <Divider style={[styles.divider, { width: "100%", marginTop: "2%" }]} />
      </View>

      <View style={styles.MainView}>
        <DiscoverItem
          title="Height"
          //remove this in value "{measureUnits.convertCentimetertoFeetAndInches}" to show height
          value={user?.Profile?.height}
        />
        <Divider style={styles.divider} />
        <DiscoverItem title="Age" value={user?.Profile?.age} />
        <Divider style={styles.divider} />
        <DiscoverItem title="Sign" value={user?.Profile?.zodiacSign} />
        <Divider style={styles.divider} />
        <DiscoverLocation
          title="Location"
          value={
            <View>
              <Text
                style={{
                  width: (CARDWIDTH - 50) / 2,
                  color: colors.blackBlue,
                  fontSize: 16,
                  fontFamily: "Inter-SemiBold",
                  textAlign: "right",
                  flexWrap: "wrap",
                }}
              >
                {user?.city}, {user?.country}
              </Text>
            </View>
          }
        />
        <Divider style={styles.divider} />
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     width: CARDWIDTH,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 350,
//     marginTop: 10,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     width: '100%',
//     height: 60,
//     marginVertical: 10,
//   },
//   text: {
//     fontSize: 22,
//     color: '#0F3577',
//     marginLeft: 5,
//     alignSelf: 'center',
//   },
//   textcontainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   MainView: {
//     width: CARDWIDTH - 40,
//     height: 250,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 20,
//   },
//   divider: {
//     backgroundColor: '#C8C8C8',
//     width: CARDWIDTH - 40,
//   },
//   firsttext: {
//     color: '#C8C8C8',
//     fontSize: 15,
//   },
//   secondtext: {
//     color: '#0F3577',
//     fontSize: 15,
//   },
// });
