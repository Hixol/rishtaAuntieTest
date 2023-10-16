import {StyleSheet} from 'react-native';
import colors from '../../utility/colors';
import {ios} from '../../utility/size';

export default StyleSheet.create({
  imgMsgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '3%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '2%',
    marginVertical: '2%',
  },
  textInput: {
    flex: 1,
    paddingVertical: ios ? 16 : 12,
    paddingHorizontal: 16,
    color: colors.black,
    fontSize: 15,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: colors.darkBlue,
    backgroundColor: colors.white,
  },
  btnContainer: {
    width: 53,
    height: 53,
    borderRadius: 53 / 2,
    marginLeft: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkBlue,
  },
  reviewContainer: {
    backgroundColor: 'white',
    maxWidth: '82%',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: '5%',
    paddingHorizontal: '3%',
    marginVertical: 4,
    marginLeft: '2%',
    justifyContent: 'space-between',
    height: 200,
  },
  reviewBtmTxt: {
    fontSize: 14,
    color: colors.darkBlue,
  },
  bottomModalWrapper: {
    width: '95%',
    alignSelf: 'center',
    position: 'absolute',
    height: '100%',
    bottom: 0,
    zIndex: -1,
  },
  // video
  video: {
    alignSelf: 'flex-end',
    marginRight: '2%',
    marginVertical: '1%',
    width: 110,
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  btnPosition: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: '2%',
    marginVertical: '1%',
    width: 105,
    height: 173,
  },
  playBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
