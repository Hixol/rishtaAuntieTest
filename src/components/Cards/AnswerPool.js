import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {windowWidth} from '../../utility/size';
import {useDispatch, useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import colors from '../../utility/colors';
import Button from '../buttons/Button';
import ProfileServices from '../../services/ProfileServices';
import Icons from '../../utility/icons';
import Loader from '../Loader';

const AnswerPool = ({navigation, route}) => {
  let {id, quest, answer} = route?.params;

  const dispatch = useDispatch();
  const {Alerts, handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  let [loading, setLoading] = useState(false);
  let [val, setVal] = useState(answer ? answer : '');

  const onSave = () => {
    let letterRegExp = /[^a-zA-z\/\.' ]+$/;
    if (val == '') {
      Alerts('error', 'Please enter value.');
    } else if (val == answer) {
      Alerts('error', 'Please enter new value.');
    } else if (letterRegExp.test(val)) {
      Alerts('error', 'Please enter alphabets only.');
    } else if (token != null) {
      setLoading(true);
      let formData = new FormData();
      if (answer) {
        formData.append('profilePrompts[0][questionId]', id);
        formData.append('profilePrompts[0][answer]', val);
        formData.append('profilePrompts[0][operation]', 'update');
      } else {
        formData.append('profilePrompts[0][questionId]', id);
        formData.append('profilePrompts[0][answer]', val);
        formData.append('profilePrompts[0][operation]', 'add');
      }

      ProfileServices.updateProfile(formData, token)
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            dispatch({
              type: 'AUTH_USER',
              payload: res.data.data.user,
            });
            Alerts('success', res.data.message);
            navigation.goBack();
          }
        })
        .catch(err => {
          if (err?.message.includes('Network')) {
            Alerts('error', err.message);
          } else {
            console.log('err', err);
          }
        })
        .finally(() => setLoading(false));
    } else {
      Alerts('error', 'Please login again.');
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.container}>
            <Icons.FontAwesome5
              name="question"
              color={colors.darkBlue}
              size={24}
            />
            <Text style={styles.title}>{quest}</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                autoCapitalize="sentences"
                style={styles.textInput}
                placeholder="Write here..."
                placeholderTextColor={colors.textGrey}
                value={val}
                onChangeText={setVal}
              />
              <Icons.Feather
                name="edit"
                color={colors.primaryPink}
                size={24}
                style={{marginRight: 7}}
              />
            </View>
          </View>
          <Button title="Save" YesNoBtn onPress={onSave} />
        </>
      )}
    </>
  );
};

export default AnswerPool;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: windowWidth * 0.92,
    alignSelf: 'center',
    padding: '5%',
    borderRadius: 10,
    marginTop: '4%',
    marginBottom: '10%',
  },
  title: {
    marginTop: '4%',
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
    fontSize: 20,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greyWhite,
    borderRadius: 10,
    marginTop: '7%',
  },
  textInput: {
    padding: '4%',
    flex: 1,
    color: colors.black,
  },
});
