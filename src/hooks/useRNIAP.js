import React, { useCallback, useEffect, useState } from "react";
import {
  useIAP,
  initConnection,
  ErrorCode,
  getAvailablePurchases,
  purchaseErrorListener,
  purchaseUpdatedListener,
  ProrationModesAndroid,
  acknowledgePurchaseAndroid,
  clearProductsIOS,
  clearTransactionIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
} from "react-native-iap";
import { Alert, Platform } from "react-native";
import { android, ios } from "../utility/size";
import { useDispatch, useSelector } from "react-redux";
import { alerts } from "../utility/regex";
import IAPServices from "../services/IAPServices";

const product_skus = Platform.select({
  ios: ["Spotlight_001", "Spotlight_003", "Spotlight_005"],
  android: ["product_001", "product_003", "product_005"],
});

const subscription_skus = Platform.select({
  ios: ["sub_no_1", "sub_no_2", "sub_no_3"],
  android: ["sub_no_1", "sub_no_2", "sub_no_3"],
});

const titleIcons = ["🌙 ", "💫 ", "🌟 "];

let executedOnce = false;
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export const useRNIAP = () => {
  const dispatch = useDispatch();

  const { token, userData } = useSelector(store => store.userReducer);

  const [loading, setLoading] = useState(true);
  const [proMember, setProMember] = useState(false);
  const [productList, setProductList] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);

  const {
    products,
    subscriptions,
    currentPurchase,
    currentPurchaseError,
    requestPurchase,
    requestSubscription,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getPurchaseHistory,
    purchaseHistory,
  } = useIAP();

  const getProductsIAP = useCallback(async () => {
    if (productList.length == 0 || subscriptionList.length == 0) {
      initConnection()
        .then(async res => {
          isSubscriptionActive();
          if (ios) {
            await clearProductsIOS();
            await clearTransactionIOS();
          }
          if (android) await flushFailedPurchasesCachedAsPendingAndroid();

          handleGetProducts();
          // handleGetSubscriptions();
        })
        .catch(err => console.log("initConnection err: ", err));
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(async purchase => {
      var runOnlyOnce = (() => {
        return () => {
          if (!executedOnce) {
            executedOnce = true;
            console.log("[EXECUTED ONCE] Function ran once!");

            // SPOTLIGHT
            if (
              ios &&
              /Spotlight_001|Spotlight_003|Spotlight_005/.test(
                purchase.productId
              )
            ) {
              handleBuySpotlight(purchase);
            } else if (
              android &&
              /product_001|product_003|product_005/.test(purchase.productId)
            ) {
              handleBuySpotlight(purchase);
            }

            // SUBSCRIPTION
            if (ios && /sub_no_1|sub_no_2|sub_no_3/.test(purchase.productId)) {
              handleBuySubscription(purchase);
            } else if (
              android &&
              /sub_no_1|sub_no_2|sub_no_3/.test(purchase.productId)
            ) {
              handleBuySubscription(purchase);
            }
          }
        };
      })();
      runOnlyOnce();

      // if (purchase.autoRenewingAndroid) {
      //   setActiveSubscription(purchase);
      //   acknowledgeAndConsume(purchase, false);
      // } else {
      //   acknowledgeAndConsume(purchase);
      // }
    });

    purchaseErrorSubscription = purchaseErrorListener(err => {
      if (!err.responseCode == 2) {
        Alert.alert(
          "Error",
          "There has been an error with your purchase, error code" + err.code
        );
      }
    });
  }, []);

  const handleGetProducts = () => {
    getProducts({ skus: product_skus })
      .then(async res => {
        console.log("getProducts res: ", products);
        if (products.length > 0 && ios) {
          const iosProducts = products.map((el, index) => {
            return {
              ...el,
              title: titleIcons[index] + el.title,
            };
          });
          setProductList(iosProducts);
        } else setProductList(products);

        handleGetSubscriptions();
      })
      .catch(err => console.log("getProducts err: ", err))
      .finally(() => setLoading(false));
  };

  const handleGetSubscriptions = () => {
    getSubscriptions({ skus: subscription_skus })
      .then(res => {
        console.log("getSubscriptions res: ", subscriptions);
        if (subscriptions.length > 0) setSubscriptionList(subscriptions);
      })
      .catch(err => console.log("getSubscriptions err: ", err));
  };

  const checkCurrentPurchase = async () => {
    try {
      if (currentPurchase == undefined) return;

      if (
        (currentPurchase?.transactionId ||
          currentPurchase?.transactionReceipt) &&
        currentPurchase.autoRenewingAndroid
      ) {
        acknowledgeAndConsume(currentPurchase, false);
      } else {
        acknowledgeAndConsume(currentPurchase);
      }
    } catch (err) {
      console.log("checkCurrentPurchase err", err);
    }
  };

  const handleBuySpotlight = useCallback(purchase => {
    const body = {
      purchaseToken: ios ? purchase.transactionReceipt : purchase.purchaseToken,
      productId: purchase.productId,
      packageName: "com.rishtaaunty",
      platform: ios ? "apple" : "google",
    };

    IAPServices.buySpotlight(body, token)
      .then(res => {
        console.log("buySpotlight res", res.data);
        if (res.data.status >= 200 && res.data.status <= 299) {
          alerts("success", res.data.message);
          acknowledgeAndConsume(purchase);
          setProMember(true);

          let copy = { ...userData };
          copy.UserSetting = {
            ...copy.UserSetting,
            isSubscribed: true,
          };
          dispatch({
            type: "AUTH_USER",
            payload: copy,
          });
        } else {
          alerts("error", res?.error?.message);
        }
      })
      .catch(err => console.log("buySpotlight err", err));
  }, []);

  const handleBuySubscription = useCallback(async purchase => {
    const body = {
      purchaseToken: ios ? purchase.transactionReceipt : purchase.purchaseToken,
      productId: purchase.productId,
      packageName: "com.rishtaaunty",
      platform: ios ? "apple" : "google",
    };

    IAPServices.buySubscription(body, token)
      .then(res => {
        console.log("buySubscription res", res.data);
        if (res.data.status >= 200 && res.data.status <= 299) {
          alerts("success", res.data.message);
          acknowledgeAndConsume(purchase, false);
          setProMember(true);

          let copy = { ...userData };
          copy.UserSetting = {
            ...copy.UserSetting,
            isSubscribed: true,
          };
          dispatch({
            type: "AUTH_USER",
            payload: copy,
          });
        } else {
          alerts("error", res?.error?.message);
        }
      })
      .catch(err => {
        console.log("buySubscription err", err);
      });
  }, []);

  useEffect(() => {
    getProductsIAP();

    return () => {
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentPurchaseError) {
      console.log("currentPurchaseError", currentPurchaseError);

      if (currentPurchaseError.code === ErrorCode.E_ALREADY_OWNED) {
        setProMember(true);
      }
    }
  }, [currentPurchaseError]);

  const isSubscriptionActive = async () => {
    console.log("isSubscriptionActive ran");
    const availablePurchases = await getAvailablePurchases();

    if (ios) {
      // const sortedAvailablePurchases = availablePurchases.sort(
      //   (a, b) => b.transactionDate - a.transactionDate,
      // );
      // const latestAvailableReceipt = sortedAvailablePurchases[0];
      // acknowledgeAndConsume(latestAvailableReceipt);

      // validate(latestAvailableReceipt);
      // let originalTransactionIdMap = {};

      // sortedAvailablePurchases.forEach(purchase => {
      //   originalTransactionIdMap[purchase.originalTransactionIdentifierIOS] =
      //     purchase;
      // });

      // Object.keys(originalTransactionIdMap).forEach(transactionId => {
      //   const purchase = originalTransactionIdMap[transactionId];
      //   if (ios && purchase.productId == 'product_002') {
      //     handleBuySpotlight(purchase);
      //   }

      //   if (
      //     purchase.productId == 'sub_no_1' ||
      //     purchase.productId == 'sub_no_2'
      //   ) {
      //     handleBuySubscription(purchase);
      //   }
      // });

      // if (ios && latestAvailableReceipt.productId == 'product_002') {
      //   handleBuySpotlight(latestAvailableReceipt);
      // }

      // if (
      //   latestAvailableReceipt.productId == 'sub_no_1' ||
      //   latestAvailableReceipt.productId == 'sub_no_2'
      // ) {
      //   handleBuySubscription(latestAvailableReceipt);
      // }

      const isSubValid = true;
      return isSubValid;
    }

    if (android) {
      for (let i = 0; i < availablePurchases.length; i++) {
        acknowledgeAndConsume(availablePurchases[i]);
        if (availablePurchases[i].autoRenewingAndroid) {
          setActiveSubscription(availablePurchases[i]);
        }
        if (subscription_skus.includes(availablePurchases[i].productId)) {
          return true;
        }
      }
      return false;
    }
  };

  const restorePurchases = async () => {
    try {
      await getPurchaseHistory();
      // console.log('purchaseHistory', purchaseHistory);
      const receipt =
        purchaseHistory[purchaseHistory.length - 1].transactionReceipt;

      if (receipt) {
        // validate receipt
      }
    } catch (err) {
      console.log("restorePurchases", err);
    }
  };

  const acknowledgeAndConsume = (purchase, isConsumable = true) => {
    // if (android) {
    //   acknowledgePurchaseAndroid({token: purchase.purchaseToken});
    // }

    finishTransaction({
      purchase,
      isConsumable,
    })
      .then(res => {
        console.log("finishTransaction res", res);
      })
      .catch(err => console.log("finishTransaction err", err))
      .finally(() => {
        executedOnce = false;
      });

    // acknowledgePurchaseAndroid({token: purchase.purchaseToken})
    //   .then(res => {
    //     // console.log('acknowledgePurchaseAndroid res', res);
    //     finishTransaction({
    //       purchase,
    //       isConsumable: isConsumable,
    //     })
    //       .then(res => {
    //         console.log('finishTransaction res', res);
    //       })
    //       .catch(err => console.log('finishTransaction err', err));
    //   })
    //   .catch(err => console.log('acknowledgePurchaseAndroid err', err));
  };

  const handlePurchase = async productId => {
    setDisableBtn(true);

    await requestPurchase({
      sku: productId,
      skus: [productId],
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    })
      .then(res => {})
      .catch(err => console.log("requestPurchase err", err))
      .finally(() => setDisableBtn(false));
  };

  const handleRequestSubscription = async (
    productId,
    offerToken,
    purchaseToken = ""
  ) => {
    let obj = {};
    setDisableBtn(true);
    if (activeSubscription?.productId != productId && purchaseToken != "") {
      obj = {
        prorationModeAndroid:
          ProrationModesAndroid.IMMEDIATE_AND_CHARGE_PRORATED_PRICE,
        purchaseTokenAndroid: purchaseToken,
      };
    }

    await requestSubscription({
      sku: productId,
      ...obj,
      ...(offerToken && {
        subscriptionOffers: [
          {
            sku: productId,
            offerToken,
          },
        ],
      }),
    })
      .then(res => {})
      .catch(err => console.log("requestSubscription err", err))
      .finally(() => setDisableBtn(false));
  };

  const handleRequestSubscriptionIOS = async productId => {
    setDisableBtn(true);
    await requestSubscription({ sku: productId })
      .then(res => {
        "handleRequestSubscriptionIOS res", res;
      })
      .catch(err => console.log("handleRequestSubscriptionIOS err", err))
      .finally(() => setDisableBtn(false));
  };

  const handleSubscribe = async (productId, offerToken) => {
    if (activeSubscription != null) {
      handleRequestSubscription(
        productId,
        offerToken,
        activeSubscription.purchaseToken
      );
    } else {
      handleRequestSubscription(productId, offerToken);
    }
  };

  return {
    loading,
    proMember,
    disableBtn,
    productList,
    activeSubscription,
    subscriptionList,
    restorePurchases,
    handlePurchase,
    handleSubscribe,
    handleRequestSubscriptionIOS,
  };
};
