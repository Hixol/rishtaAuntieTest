import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {windowWidth} from '../../utility/size';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import Button from '../buttons/Button';
import colors from '../../utility/colors';
import ProfileServices from '../../services/ProfileServices';
import Loader from '../../components/Loader';

const ProfilePropmtCard = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {Alerts, handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  let [loading, setLoading] = useState(false);
  const EditDelete = [
    {
      id: 1,
      title: 'Edit',
      btnIcon: require('../../assets/iconimages/edit-pen.png'),
    },
    {
      id: 2,
      title: 'Delete',
      btnIcon: require('../../assets/iconimages/delete-pink.png'),
    },
  ];

  const editPrompts = () => {
    navigation.navigate('AnswerPoolScreen', {
      id: props?.question?.id,
      quest: props?.question?.title,
      answer: props?.answer,
    });
  };

  const deletePrompts = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('profilePrompts[0][questionId]', props?.question?.id);
    formData.append('profilePrompts[0][answer]', props?.answer);
    formData.append('profilePrompts[0][operation]', 'delete');

    ProfileServices.updateProfile(formData, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: 'AUTH_USER',
            payload: res.data.data.user,
          });
          Alerts('success', res.data.message);
        }
      })
      .catch(err => console.log('err', err))
      .finally(() => setLoading(false));
  };

  const renderButton = Array => {
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            {Array.length > 0 &&
              Array.map(i => {
                return (
                  <Button
                    onPress={() => {
                      if (i.title == 'Edit') {
                        editPrompts();
                      } else {
                        deletePrompts();
                      }
                    }}
                    key={i.id}
                    OnBoadringBtn
                    YesNoBtnStyle={{width: '48%', marginBottom: 22}}
                    width={23}
                    height={23}
                    imgStyle={{marginRight: 7}}
                    btnTitleStyle={{fontSize: 16}}
                    btnIcon={i.btnIcon}
                    title={i.title}
                  />
                );
              })}
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questHeading}>{props?.question?.title}</Text>
      <Text style={styles.ansHeading}>{props?.answer}</Text>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        {renderButton(EditDelete)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: '5%',
    backgroundColor: colors.white,
    width: windowWidth * 0.91,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    padding: '5%',
    marginVertical: '2%',
  },
  questHeading: {
    fontFamily: 'Roboto-Bold',
    color: colors.primaryPink,
    fontSize: 20,
    marginVertical: '2%',
  },
  ansHeading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 28,
    color: colors.primaryBlue,
    textAlign: 'right',
    marginBottom: '2%',
    marginTop: '1%',
  },
  editDeleteView: {
    width: '100%',
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonView: {
    flexDirection: 'row',
    paddingVertical: '3%',
    width: windowWidth * 0.35,
    paddingHorizontal: '3%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.primaryPink,
    alignItems: 'center',
  },
  editDeleteIcon: {width: 25, height: 25, marginHorizontal: '10%'},
  editDeleteText: {
    marginHorizontal: '5%',
    fontSize: 17,
    fontFamily: 'Roboto-Medium',
    color: colors.primaryPink,
  },
});

export default ProfilePropmtCard;
