import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SocketContext} from '../../context/SocketContext';

import HeaderContainer from '../../components/containers/headerContainer';
import ChatServices from '../../services/ChatServices';
import FavListItem from '../../components/FavListItem';
import styles from './styles';
import colors from '../../utility/colors';
import Icons from '../../utility/icons';
import {useHelper} from '../../hooks/useHelper';

const FavouriteMessages = props => {
  const el = props.route.params;
  const socket = useContext(SocketContext);
  const {handleStatusCode} = useHelper();
  const {token, userData} = useSelector(store => store.userReducer);
  const [favMessages, setFavMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);

  useEffect(() => {
    ChatServices.chatFavouriteMessage(el?.id, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setFavMessages(res.data.data);
        }
      })
      .catch(err => console.log('chatFavouriteMessage err:', err));
  }, []);

  const unstarCallback = () => {
    let obj = {
      messageId: selectedMsg?.Chat?.id,
      userId: userData?.id,
    };
    socket.emit('message-unfavourite', obj, res => {
      if (res.event == 'message-unfavourite') {
        setFavMessages(prevState =>
          prevState.filter(el => el.Chat.id != res.messageId),
        );
        setSelectedMsg(null);
      }
    });
  };

  const renderItem = ({item, index}) => (
    <>
      {selectedMsg?.id === item.id && (
        <View
          style={[
            styles.highlight,
            index == favMessages.length - 1 && {height: '110%'},
          ]}
        />
      )}
      <FavListItem item={item} onLongPress={() => setSelectedMsg(item)} />
      {index == favMessages.length - 1 ? null : <View style={styles.bar} />}
    </>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderContainer
        gobackButtonPress={() =>
          selectedMsg ? setSelectedMsg(null) : props.navigation.goBack()
        }
        goback={'arrow-back'}
        screenTitle="Favourite messages"
        btnWithTitle
        selectedMsg={selectedMsg}
        unstarCallback={unstarCallback}
      />
      {favMessages.length > 0 ? (
        <FlatList
          data={favMessages}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.noFavContainer}>
          <View style={styles.starContainer}>
            <Icons.Ionicons name="star" size={38} color={colors.softGrey} />
          </View>
          <Text style={styles.favHeading}>No Favourite Messages</Text>
          <Text style={styles.favMsg}>
            Tap and hold on any message to favourite it, so you can easily find
            it later.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FavouriteMessages;
