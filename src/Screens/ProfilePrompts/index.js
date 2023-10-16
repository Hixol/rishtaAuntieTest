import React from 'react';
import {Alert, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import colors from '../../utility/colors';
import styles from './style';
import ProfilePromptCard from '../../components/Cards/ProfilePropmtCard';
import Icons from '../../utility/icons';

const ProfilePrompts = props => {
  const {Alerts} = useHelper();
  const {userData} = useSelector(store => store.userReducer);

  let QuestionAnswers = userData?.ProfilePrompts;

  props.navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Icons.FontAwesome
          name="long-arrow-left"
          color={colors.primaryBlue}
          size={22}
        />
      </TouchableOpacity>
    ),
  });

  const handleAddPrompt = () => {
    if (userData.UserSetting?.isSubscribed) {
      props.navigation.navigate('QuestionPoolScreen');
    } else {
      Alerts('error', 'Available for subscribed members only!');
    }
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View style={styles.headingSec}>
          <Text style={[styles.promptHeading, {fontSize: 24}]}>
            Fill out your profile prompts
          </Text>
          <Text
            style={[styles.promptHeading, {fontSize: 16, textAlign: 'center'}]}>
            Be sure to write something interesting or funny, and most
            importantly, be yourself!
          </Text>
        </View>
        {QuestionAnswers.map(item => {
          return (
            <ProfilePromptCard question={item.Question} answer={item.answer} />
          );
        })}
        <View style={styles.addPromptView}>
          <TouchableOpacity
            onPress={handleAddPrompt}
            style={styles.addPromptButton}>
            <Text style={styles.addPromptText}>Add a new profile prompt</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('ProfilePrompt')}>
          <Text style={styles.upgradePrompt}>
            Upgrade for more profile prompt
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePrompts;
