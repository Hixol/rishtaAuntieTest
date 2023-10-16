import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import {windowHeight, windowWidth} from '../../utility/size';

import CardFlip from 'react-native-card-flip';
import BeforeFlip from './BeforeFlip';
import AfterFlip from './AfterFlip';

const FlipCard = props => {
  const [play, setPlay] = useState(props.play);
  const [showWaves, setShowWaves] = useState(props.showWaves);
  const card = useRef();

  return (
    <Pressable>
      <CardFlip flipDirection="x" style={styles.cardContainer} ref={card}>
        <TouchableOpacity
          onPress2={props.onPress2}
          // onPress={() => card.current.flip()}
          BeforeFlip={props.BeforeFlip}
          AfterFlip={props.AfterFlip}>
          <BeforeFlip
            selectedItems={props.selectedItems}
            beforeFlipPress={props.beforeFlipPress}
            onPress1={() => {
              card.current.flip();
              setPlay(true);
              setShowWaves(false);
            }}
            item={props.item}
            userMediaType={props.userMediaType}
            showWaves={showWaves}
            createdAt={props.createdAt}
            play={play}
            Image={props.Image}
            resourceType={props.resourceType}
            promptImage={props.promptImage}
            Bname={props.Bname}
            Blocation={props.Blocation}
            BdaysAgo={props.BdaysAgo}
            age={props.age}
          />
        </TouchableOpacity>
        <View activeOpacity={0.9}>
          <AfterFlip
            userMediaType={props.userMediaType}
            AfterFlipPress={props.afterFlipFlipPress}
            theirMoves={props.theirMoves}
            myMoves={props.myMoves}
            question={props.question}
            interactionComment={props.interactionComment}
            type={props.type}
            onPress1={() => {
              setPlay(false);
              setShowWaves(false);
              card.current.flip();
            }}
            createdAt={props.createdAt}
            voiceNoteUrl={props.voiceNoteUrl}
            answer={props.answer}
            resourceType={props.resourceType}
            play={play}
            showWaves={showWaves}
            Image={props.Image}
            voiceNote={props.voiceNote}
            liked={props.liked}
            commented={props.commented}
            commentLikeButton={props.commentLikeButton}
            commentButton={props.commentButton}
            usersProfileName={props.Bname}
            crossBtn={props.crossBtn}
            commen
            iconName={props.iconName}
            crossIconName={props.crossIconName}
            circularIconStyle={props.circularIconStyle}
            age={props.age}
            Bname={props.Bname}
          />
        </View>
      </CardFlip>
    </Pressable>
  );
};

export default FlipCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cardContainer: {
    width: windowWidth * 0.46,
    height: windowHeight * 0.34,
    marginVertical: '5%',
  },
  card: {},
  card1: {
    backgroundColor: '#FFFFFF',
  },
  card2: {
    backgroundColor: 'grey',
  },
  label: {
    lineHeight: 470,
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
