import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { android, ios } from "../../utility/size";

import colors from "../../utility/colors";

const PackageCard = ({ arr, item, boxBgStyle, onPress }) => {
  const handleMonth = () => {
    if (item.productType == "subs") {
      if (ios) {
        return item.title.split(" ")[0];
      } else {
        return item.name.split(" ")[0];
      }
    } else {
      if (ios) {
        return item.title.split(" ")[1];
      } else {
        return item.name.split(" ")[1];
      }
    }
  };

  const handleDurationText = title => {
    if (item.productType == "subs") {
      if (handleMonth() == "12") return " annually";
      else if (title.includes("1")) return "/month";
      else if (title.includes("3")) return " every 3 months";
    }
  };

  const handleStripPrice = item => {
    if (item.productType == "subs") {
      return parseInt(
        item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice
          .replace(/[^0-9\.-]+/g, "")
          .split(".")[0]
      );
    } else {
      return parseInt(
        item.oneTimePurchaseOfferDetails.formattedPrice
          .replace(/[^0-9\.-]+/g, "")
          .split(".")[0]
      );
    }
  };

  const handleCalculateSavingOfPackage = title => {
    let basePrice = 0;
    let percentage = 0;

    basePrice = handleStripPrice(arr[0]);

    // SUBS
    if (item.productType == "subs") {
      if (title.includes("3") && basePrice > 0) {
        let priceIn3Month = basePrice * 3;
        let div = (priceIn3Month - handleStripPrice(arr[1])) / priceIn3Month;
        percentage = (div * 100).toFixed(0);
      } else if (handleMonth() == "12" && basePrice > 0) {
        let priceIn12Month = basePrice * 12;
        let div = (priceIn12Month - handleStripPrice(arr[2])) / priceIn12Month;
        percentage = (div * 100).toFixed(0);
      }
      return percentage;
      // IN-APP
    } else {
      if (handleMonth() == "3" && basePrice > 0) {
        let price3Spots = basePrice * 3;
        let div = (price3Spots - handleStripPrice(arr[1])) / price3Spots;
        percentage = (div * 100).toFixed(0);
      } else if (handleMonth() == "5" && basePrice > 0) {
        let price5Spots = basePrice * 5;
        let div = (price5Spots - handleStripPrice(arr[2])) / price5Spots;
        percentage = (div * 100).toFixed(0);
      }
      return percentage;
    }
  };

  const renderDiscount = () => {
    if (handleMonth() != "1") {
      let per = handleCalculateSavingOfPackage(ios ? item.title : item.name);
      if (item.productType == "subs") return `${per}% OFF`;
      else return `Save ${per}%`;
    }
  };

  return (
    <Pressable onPress={onPress} style={[styles.box, boxBgStyle]}>
      <View style={styles.innerView}>
        <View style={styles.row}>
          <Text style={styles.boxHeading}>{ios ? item.title : item.name}</Text>

          {renderDiscount()?.length > 0 && (
            <View style={styles.capsule}>
              <Text style={styles.capsuleTxt}>{renderDiscount()}</Text>
            </View>
          )}
        </View>

        <Text style={styles.boxTxt}>{item.description}</Text>

        <View style={styles.row1}>
          <Text style={styles.boxPrice}>
            {ios
              ? item.localizedPrice
              : item.productType == "subs"
              ? item.subscriptionOfferDetails[0].pricingPhases
                  .pricingPhaseList[0].formattedPrice
              : android && item.oneTimePurchaseOfferDetails.formattedPrice}
          </Text>

          <Text style={styles.discountTxt}>
            {handleDurationText(ios ? item.title : item.name)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PackageCard;

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.softGrey,
    paddingHorizontal: "3%",
    paddingVertical: "2.5%",
    marginVertical: "2%",
  },
  innerView: {
    marginLeft: "10%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxHeading: {
    fontSize: 20,
    color: colors.blackBlue,
    fontFamily: "Inter-SemiBold",
  },
  capsule: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "1.3%",
    paddingHorizontal: "3.5%",
    backgroundColor: colors.primaryPink,
  },
  capsuleTxt: {
    fontSize: 11,
    color: colors.white,
    fontFamily: "Inter-SemiBold",
  },
  boxTxt: {
    width: "70%",
    fontSize: 14,
    color: colors.textGrey1,
    fontFamily: "Inter-Regular",
  },
  boxPrice: {
    fontSize: 18,
    color: colors.blackBlue,
    fontFamily: "Inter-SemiBold",
  },
  discountTxt: {
    fontSize: 14,
    color: colors.blackBlue,
    fontFamily: "Inter-Regular",
  },
});
