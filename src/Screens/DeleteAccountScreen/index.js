import React, {useState} from 'react';
import {
  Text,
  View,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useHelper} from '../../hooks/useHelper';

import axios from 'axios';
import styles from './styles';
import colors from '../../utility/colors';
import HeaderContainer from '../../components/containers/headerContainer';

const DeleteAccountScreen = props => {
  const {Alerts, handleStatusCode} = useHelper();
  const [status, setStatus] = useState();
  const id = 50;

  const deleteAccount = () => {
    axios
      .delete(
        `https://rishtaauntie-app.herokuapp.com/dev/rishta_auntie/api/v1/user/${id}`,
      )
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts('success', res.data.message);
          props.navigation.navigate('Login');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const radio_prop = [
    {label: 'I met someone on rishta auntie', value: 0},
    {label: 'I met someone elsewhere', value: 1},
    {label: 'I decided to go through an actual rishta auntie', value: 2},
    {label: 'I did not like rishta auntie', value: 3},
    {label: 'I wanted to take a break', value: 4},
    {label: 'Other', value: 5},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer
        goback={'arrow-back'}
        backButton
        Icon
        name={'setting'}
        gobackButtonPress={() => props.navigation.goBack()}
      />
      <ScrollView paddingHorizontal={5}>
        <Text style={styles.deleteText}>Account Deletion</Text>
        <View>
          <View style={[styles.ViewContainer, {paddingVertical: '5%'}]}>
            <Text style={styles.feedbackText}>
              Your feed back is very important to us and our community, please
              let us know why you have decided to delete.
            </Text>
          </View>
          <View style={[styles.ViewContainer, {padding: '5%'}]}>
            <View>
              {radio_prop.map(i => {
                return (
                  <View>
                    <View key={i.value} style={styles.container1}>
                      <TouchableOpacity
                        style={[
                          styles.radioCircle,

                          {
                            backgroundColor:
                              i.value === status
                                ? colors.primaryPink
                                : '#A9A9A9',
                          },
                        ]}
                        onPress={() => {
                          setStatus(i.value);
                        }}></TouchableOpacity>
                      <Text style={styles.radioText}>{i.label}</Text>
                    </View>
                    <View style={styles.horizontalLine} />
                  </View>
                );
              })}
            </View>
          </View>
          <View style={[styles.ViewContainer, {paddingVertical: '5%'}]}>
            <Text style={styles.pleaseExplainText}>Please Explain</Text>
            <TextInput
              style={{padding: 12}}
              placeholder="Write Here"
              multiline={true}
              backgroundColor={colors.defaultColor}
              borderRadius={10}
              height={180}
              textAlignVertical={'top'}
            />
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => Alert.alert('Account Paused')}>
              <Text style={styles.btnTitle}>Pause Account </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAccount()}>
              <Text style={styles.deleteAccountText}> Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default DeleteAccountScreen;
