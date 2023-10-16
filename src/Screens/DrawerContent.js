import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import Icons from '../utility/icons';

const DrawerContent = props => {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          margintop: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 75,
        }}>
        <Text style={{fontSize: 20, color: 'white'}}>Graphics Daniel</Text>
        <Text style={{color: 'white'}}>@Graphics Daniel</Text>
      </View>

      <View style={(styles.iconcontainer, {margin: 20, flexDirection: 'row'})}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
          <View style={styles.iconbox}>
            <Text style={styles.textview}>Home</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
          <View style={styles.iconbox}>
            <Icons.AntDesign name="shoppingcart" size={20} color={'white'} />
            <Text style={styles.textview}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={(styles.iconcontainer, {marginTop: -10, flexDirection: 'row'})}>
        <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
          <View style={styles.iconbox}>
            <Text style={styles.textview}>SignUp</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <View style={styles.iconbox}>
            <Icons.AntDesign name="shoppingcart" size={20} color={'white'} />
            <Text style={styles.textview}>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FF9D00',
  },
  iconcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 75,
  },
  textview: {
    color: 'white',
    fontSize: 20,
  },
  iconbox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#FFAB31',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roundedImages: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
  },
});
