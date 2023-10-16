import Colors from '../constants/Colors';
import {CARDWIDTH} from '../constants/Constants';

const BUTTON_WIDTH = (CARDWIDTH - 50) / 2;

export const Font = {
  LARGE: 24,
  MEDIUM: 16,
  SMALL: 12,
};
export const btnSelectedButtonStyle = {
  flexDirection: 'row',
  height: 41,
  width: BUTTON_WIDTH,
  borderRadius: 40,
  backgroundColor: Colors.accentColor,
  borderWidth: 0,
  borderColor: Colors.primaryColor,
};
export const btnUnselectedStyle = {
  flexDirection: 'row',
  width: BUTTON_WIDTH,
  height: 40,
  borderRadius: 40,
  backgroundColor: 'transparent',
  borderWidth: 1.5,
  borderColor: Colors.primaryColor,
};
export const SelectedTitleStyle = {
  fontSize: 14,
  // color: Colors.accentColor,
  color: 'white',
  marginTop: 5,
  marginLeft: 8,
};
export const UnSelectedTitleStyle = {
  fontSize: 14,
  color: Colors.primaryColor,
  marginTop: 5,
  marginLeft: 8,
};
