import React, {useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRNIAP} from '../../hooks/useRNIAP';
import {android, ios} from '../../utility/size';

import HeaderContainer from '../../components/containers/headerContainer';
import styles from './styles';
import Loader from '../../components/Loader';
import colors from '../../utility/colors';
import Icons from '../../utility/icons';

const PayWall = ({navigation}) => {
  const {
    loading,
    disableBtn,
    productList,
    subscriptionList,
    handlePurchase,
    handleSubscribe,
    handleRequestSubscriptionIOS,
  } = useRNIAP(true);

  const billingPeriod = {
    P1M: 'Monthly',
    P6M: '6 Month',
    P1Y: 'Yearly',
  };

  const packagePoints = [
    'Chat Insights',
    'Premium Privacies',
    'Profiles Remaining',
    'Premium Preferences',
  ];

  const [selectedId, setSelectedId] = useState(null);

  const handlePurchasePackage = productId => {
    setSelectedId(productId);
    handlePurchase(productId);
  };

  const handlePurchaseSub = (productId, offerToken = null) => {
    setSelectedId(productId);
    if (ios) {
      handleRequestSubscriptionIOS(productId);
    } else {
      handleSubscribe(productId, offerToken);
    }
  };

  const styleFlags = {
    borderWidth: selectedId != null ? 1 : 0,
    borderColor: ios
      ? /product_002|sub_no_1|sub_no_2/.test(selectedId)
      : /product_001|sub_no_1/.test(selectedId)
      ? colors.orange
      : ios
      ? /sub_no_2/.test(selectedId)
      : /product_003|sub_no_2/.test(selectedId)
      ? colors.cleanBlue
      : colors.primaryPink,
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderContainer
        goback={'arrow-back'}
        backButton
        Icon
        gobackButtonPress={() => navigation.goBack()}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {productList.length > 0 && (
              <View style={styles.headingWrap}>
                <Text style={styles.h3}>Spotlight</Text>
              </View>
            )}

            <View style={styles.container}>
              {productList.length > 0 &&
                productList.map((el, index) => (
                  <Pressable
                    disabled={disableBtn}
                    key={el.productId}
                    onPressIn={() => handlePurchasePackage(el.productId)}
                    style={[
                      styles.topContainer,
                      selectedId == el.productId && styleFlags,
                    ]}>
                    <View>
                      <Text style={styles.title}>
                        {ios ? el.title : el.name}
                      </Text>
                      <View key={index} style={styles.row}>
                        <Icons.Octicons
                          name="check-circle"
                          size={12}
                          color={colors.primaryPink}
                        />
                        <Text style={[styles.txt, styles.ml]}>
                          10 Spotlights
                        </Text>
                      </View>
                      {el.description ? (
                        <Text style={styles.txt}>{el.description}</Text>
                      ) : null}
                    </View>
                    <Text style={[styles.txt, {color: colors.primaryPink}]}>
                      {ios
                        ? el.localizedPrice
                        : el.oneTimePurchaseOfferDetails.formattedPrice}
                    </Text>
                  </Pressable>
                ))}

              {subscriptionList.length > 0 && (
                <View style={[styles.headingWrap, {marginTop: 0}]}>
                  <Text style={styles.h3}>Choose a plan</Text>
                  <View style={[styles.row, styles.mt]}>
                    <Icons.Ionicons name="star" size={14} color={colors.gold} />
                    <Text style={[styles.premiumTxt, styles.ml]}>
                      Go Premium
                    </Text>
                  </View>
                </View>
              )}
              {subscriptionList.length > 0 &&
                subscriptionList.map((el, index) => (
                  <Pressable
                    disabled={disableBtn}
                    key={el.productId}
                    onPressIn={() => {
                      handlePurchaseSub(
                        el.productId,
                        android && el?.subscriptionOfferDetails[0].offerToken,
                      );
                    }}
                    style={[
                      styles.topContainer,
                      selectedId == el.productId && styleFlags,
                    ]}>
                    <View>
                      <Text style={styles.title}>
                        {ios ? el.title : el.name}
                      </Text>
                      {packagePoints.map((el, index) => (
                        <View key={index} style={styles.row}>
                          <Icons.Octicons
                            name="check-circle"
                            size={12}
                            color={colors.primaryPink}
                          />
                          <Text style={[styles.txt, styles.ml]}>{el}</Text>

                          {el.description ? (
                            <Text style={[styles.txt, styles.mt]}>
                              {el.description}
                            </Text>
                          ) : null}

                        </View>
                      ))}
                      {el.description ? (
                        <Text style={[styles.txt, styles.mt]}>
                          {el.description}
                        </Text>
                      ) : null}
                    </View>
                    {ios ? (
                      <Text style={[styles.txt, {color: colors.primaryPink}]}>
                        {el.localizedPrice}/{el.subscriptionPeriodUnitIOS}
                      </Text>
                    ) : (
                      <Text style={[styles.txt, {color: colors.primaryPink}]}>
                        {
                          el.subscriptionOfferDetails[0].pricingPhases
                            .pricingPhaseList[0].formattedPrice
                        }
                        /
                        {
                          billingPeriod[
                            el.subscriptionOfferDetails[0].pricingPhases
                              .pricingPhaseList[0].billingPeriod
                          ]
                        }
                      </Text>
                    )}
                  </Pressable>
                ))}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default PayWall;