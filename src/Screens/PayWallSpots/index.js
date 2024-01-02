import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRNIAP } from "../../hooks/useRNIAP";
import { ios } from "../../utility/size";
import { Button } from "react-native-elements";
import { alerts } from "../../utility/regex";

import styles from "./styles";
import colors from "../../utility/colors";
import Loader from "../../components/Loader";
import FastImage from "react-native-fast-image";
import PackageCard from "../../components/Cards/PackageCard";

const accessToItems = [
  {
    id: 1,
    title: "✨ Get Noticed Faster: ",
    desc: "Increase your profile views and get more attention.",
  },
  {
    id: 2,
    title: "🔍 Top-tier Visibility: ",
    desc: "Appear more frequently in searches and recommendations.",
  },
  {
    id: 3,
    title: "🌟 Stand Out: ",
    desc: "Your profile gets a distinctive highlight, making sure you don't blend into the crowd.",
  },
];

const PayWallSpots = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { loading, disableBtn, productList, handlePurchase } = useRNIAP();

  const [selectedItem, setSelectedItem] = useState(null);

  const handlePurchasePackage = () => {
    if (selectedItem) {
      handlePurchase(selectedItem.productId);
    } else {
      alerts("error", "Please choose a spotlight.");
    }
  };

  const AccessItem = ({ item }) => (
    <Text style={styles.para2}>
      <Text style={styles.para2Heading}>{item.title}</Text>
      {item.desc}
    </Text>
  );

  return (
    <SafeAreaView style={[styles.container, ios && { marginTop: -insets.top }]}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.contentStyle}>
            <Text style={styles.para1}>
              Step into the spotlight and shine brighter for your perfect match
              with our Spotlight boosts!
            </Text>

            {accessToItems.map(el => (
              <AccessItem key={el.id} item={el} />
            ))}

            <View style={styles.space} />

            {productList.length > 0 &&
              productList.map((el, index) => (
                <PackageCard
                  arr={productList}
                  item={el}
                  key={el.productId}
                  onPress={() => setSelectedItem(el)}
                  boxBgStyle={
                    selectedItem?.productId == el.productId && styles.boxBg
                  }
                />
              ))}

            <Button
              loading={ios ? disableBtn : false}
              onPress={handlePurchasePackage}
              icon={
                <FastImage
                  resizeMode="contain"
                  tintColor={colors.white}
                  style={{ width: 35, height: 35 }}
                  source={require("../../assets/iconimages/pinkspotlight.png")}
                />
              }
              title="Get Spotlight now"
              buttonStyle={styles.btn}
              titleStyle={styles.btnTitle}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default PayWallSpots;
