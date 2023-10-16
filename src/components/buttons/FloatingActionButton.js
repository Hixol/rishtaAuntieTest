import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {windowHeight} from '../../utility/size';

import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';
export default class ActionButton extends Component {
  state = {
    animation: new Animated.Value(0),
    modal: false,
  };

  handleModal = () => this.setState({modal: true});

  toggleOpen = () => {
    if (this._open) {
      Animated.timing(this.state.animation, {
        useNativeDriver: true,

        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(this.state.animation, {
        useNativeDriver: true,
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    this._open = !this._open;
  };

  render() {
    const heartIconInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 205],
    });
    const commentIconInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 80, 145],
    });
    const microphoneIconInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 20, 85],
    });

    const heartIconStyle = {
      transform: [
        {
          translateY: heartIconInterpolate,
        },
      ],
    };
    const commentIconStyle = {
      transform: [
        {
          translateY: commentIconInterpolate,
        },
      ],
    };

    const microphoneIconStyle = {
      transform: [
        {
          translateY: microphoneIconInterpolate,
        },
      ],
    };

    return (
      <Animated.View style={[styles.background]}>
        <Animated.View style={[styles.button, heartIconStyle]}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={this.props.onPressLikeInteraction}>
            <FastImage
              source={require('../../assets/iconimages/heart.png')}
              style={{height: '54%', width: '54%'}}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.button, commentIconStyle]}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={this.props.onPressCommentInteraction}>
            <FastImage
              source={require('../../assets/iconimages/chat.png')}
              style={{height: '54%', width: '54%'}}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.button, microphoneIconStyle]}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={this.props.onPressVoiceInteraction}>
            <FastImage
              source={require('../../assets/iconimages/mic.png')}
              style={{height: '76%', width: '76%'}}
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableWithoutFeedback onPress={() => this.toggleOpen()}>
          <Animated.View style={[styles.button]}>
            <FastImage
              style={styles.roundText}
              source={require('../../assets/images/roundTxt.png')}
            />
            <View style={styles.circularImg}>
              <FastImage
                source={{uri: this.props.imageRound}}
                style={styles.roundTextImg}
              />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    height: windowHeight * 0.12,
    width: windowHeight * 0.12,
  },
  button: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 4,
    shadowOpacity: 1,
    borderRadius: 70 / 2,
    width: '100%',
    height: '100%',
  },
  iconStyle: {
    width: 60,
    height: 60,
  },
  circularImg: {
    position: 'absolute',
    backgroundColor: 'white',
    height: windowHeight * 0.075,
    width: windowHeight * 0.075,
    borderRadius: 50,
    borderWidth: 1.3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    height: windowHeight * 0.06,
    width: windowHeight * 0.06,
    borderRadius: 50,
    backgroundColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundText: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  roundTextImg: {width: '100%', height: '100%', borderRadius: 50},
});
