import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import Card from './Card';
import Stories from '../components/Info/Stories';

export default function CardCarousel({user}) {
  const [state, setState] = useState({
    myindex: 0,
    images: [1, 2, 3, 4, 5],
  });

  const [card, setcard] = useState(
    [1, 2, 3, 4, 5, 6]
      .map((im, i) => {
        if (im !== '') {
          return {
            id: im,
            type: 'image',
            duration: 6,
            isSeen: false,
            isReadMore: true,
            isPaused: true,
          };
        }
      })
      .filter(a => a),
  );

  return (
    <Card style={styles.container}>
      <Stories images={card} user={user} />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:'5%',
    alignSelf: 'center',
    justifyContent: 'center',
    // marginBottom: 25,
    // backgroundColor: 'blue',
  },
});
