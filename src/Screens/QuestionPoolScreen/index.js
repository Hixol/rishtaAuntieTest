import React, {useState, useEffect, useRef} from 'react';
import {View, FlatList, Animated, ActivityIndicator} from 'react-native';
import {useHelper} from '../../hooks/useHelper';

import colors from '../../utility/colors';
import styles from './styles';
import QuestionPool from '../../components/Cards/QuestionPool';
import CardPaginator from '../../components/paginators/CardPaginator';
import UserService from '../../services/UserService';

const QuestionPoolScreen = () => {
  const {handleStatusCode} = useHelper();

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});
  const cardScrollX = useRef(new Animated.Value(0)).current;

  const ref = React.useRef(null);
  let [loading, setLoading] = useState(false);
  let [cardDetailsData, setCardDetailsData] = useState([]);

  useEffect(() => {
    setLoading(true);
    UserService.getQuestions()
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          for (let i = 0; i < res?.data?.data.length; i += 7) {
            let chunks = res?.data?.data.slice(i, i + 7);
            setCardDetailsData(prevState => [
              ...prevState,
              {id: i + 1, views: chunks},
            ]);
          }
        }
      })
      .catch(err => console.log('Questions err', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator
          color={colors.primaryPink}
          style={{alignSelf: 'center', flex: 1}}
          size={'large'}
        />
      ) : cardDetailsData.length > 0 ? (
        <View style={styles.cardSection}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={32}
            horizontal
            pagingEnabled
            ref={ref}
            viewabilityConfig={viewConfigRef.current}
            bounces={false}
            data={cardDetailsData}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: cardScrollX}}}],
              {
                useNativeDriver: false,
              },
            )}
            renderItem={({item, index}) => {
              return <QuestionPool item={item} />;
            }}
          />
          <View style={styles.cardPaginatorView}>
            <CardPaginator
              data={cardDetailsData}
              scrollX={cardScrollX}
              type="dot"
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};
export default QuestionPoolScreen;
