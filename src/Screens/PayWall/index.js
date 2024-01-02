import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRNIAP } from "../../hooks/useRNIAP";
import { ios } from "../../utility/size";
import { Button } from "react-native-elements";
import { alerts } from "../../utility/regex";

import styles from "./styles";
import Loader from "../../components/Loader";
import colors from "../../utility/colors";
import PackageCard from "../../components/Cards/PackageCard";
import FastImage from "react-native-fast-image";
import ToggleSwitch from "toggle-switch-react-native";

const accessToItems = [
  {
    id: 1,
    title: "Unlimited Connections: ",
    desc: "More chats, more chances.",
  },
  {
    id: 2,
    title: "Ad-Free Browsing: ",
    desc: "Focus on finding the one, without distractions.",
  },
  {
    id: 3,
    title: "Precision Search: ",
    desc: "Filter for your perfect match down to the detail.",
  },
  {
    id: 4,
    title: "Privacy First: ",
    desc: "Enhanced features to date at your comfort.",
  },
];

const PayWall = ({ navigation }) => {
  const {
    loading,
    disableBtn,
    subscriptionList,
    handleSubscribe,
    handleRequestSubscriptionIOS,
  } = useRNIAP();

  const billingPeriod = {
    P1M: "Monthly",
    P6M: "6 Month",
    P1Y: "Yearly",
  };

  const insets = useSafeAreaInsets();
  const [toggle, setToggle] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePurchaseSub = () => {
    if (selectedItem) {
      if (ios) {
        handleRequestSubscriptionIOS(selectedItem.productId);
      } else {
        handleSubscribe(
          selectedItem.productId,
          selectedItem.subscriptionOfferDetails[0].offerToken
        );
      }
    } else {
      alerts("error", "Please choose a subscription.");
    }
  };

  const AccessItem = ({ item }) => (
    <View style={styles.row}>
      <FastImage
        resizeMode="contain"
        style={styles.checkImage}
        source={require("../../assets/iconimages/check.png")}
      />
      <Text style={styles.para2}>
        <Text style={styles.para2Heading}>{item.title}</Text>
        {item.desc}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, ios && { marginTop: -insets.top }]}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.contentStyle}>
            <Text style={styles.para1}>
              Unlock full access to love using Rishta Auntie Gold!
            </Text>

            {accessToItems.map(el => (
              <AccessItem key={el.id} item={el} />
            ))}

            <View style={styles.space} />

            {subscriptionList.length > 0 &&
              subscriptionList.map((el, index) => (
                <PackageCard
                  arr={subscriptionList}
                  item={el}
                  key={el.productId}
                  onPress={() => setSelectedItem(el)}
                  boxBgStyle={
                    selectedItem?.productId == el.productId && styles.boxBg
                  }
                />
              ))}

            {/* <View style={styles.row1}>
              <Text style={styles.autoTxt}>
                Auto recurring. Cancel anytime.
              </Text>
              <ToggleSwitch
                size="small"
                isOn={toggle}
                onColor={colors.primaryPink}
                offColor={colors.mediumGrey}
                onToggle={setToggle}
              />
            </View> */}

            <Button
              loading={ios ? disableBtn : false}
              onPress={handlePurchaseSub}
              title="Upgrade now"
              buttonStyle={styles.btn}
              titleStyle={styles.btnTitle}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default PayWall;
