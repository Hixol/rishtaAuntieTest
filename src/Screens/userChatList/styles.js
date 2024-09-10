import {StyleSheet} from 'react-native';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    // padding: 10, // Use padding instead of margin
    // flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    top: 20,
  },
  demoChatContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 10,
  },
  messageBox: {
    fontSize: 16,
    color: colors.black,
    backgroundColor: "#ffff",
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 8,
    textAlign: "left",
    padding: 7,
    width: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  defaultMessage: {
    fontSize: 16,
    color: colors.black,
    backgroundColor: "#ffff",
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 8,
    textAlign: "left",
    padding: 9,
    width: "80%",
    marginLeft: 45,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonContainer: {
    width: "100%",
    top: "40%",
    justifyContent: "flex-end",
    // marginTop: 20,
    flexDirection: "column",
  },
  centerContainer: {
    flex: 1, // This will allow the container to take up the full height of the screen
    justifyContent: "space-between", // Space out the content, pushing the buttons to the bottom
    padding: 16,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center", // Center the buttons horizontally
    alignItems: "center",
    marginBottom: 20, // Add some space at the bottom of the screen
  },
  buttonContainer2: {
    width: "100%",
    justifyContent: "center", // Center the buttons horizontally
    alignItems: "center",
  },
  button: {
    backgroundColor: "#D90368",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "80%",
    marginBottom: 10, // Add space between buttons
  },
  button1: {
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBECEF",
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
  },
  buttonText2: {
    color: "#D90368",
    fontSize: 16,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    // alignContent: "space-between",
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#ABABAB",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.black,
  },
  sendIcon: {
    height: 45,
    width: 45,
    // tintColor: "#D90368", // Optional: Add tint color to the icon
    // marginLeft: 60, // Add margin to separate from the input
    left: 60,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the logo and back button horizontally
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white, // Ensure background color consistency
  },
  backButton: {
    position: "absolute",
    left: 10,
    padding: 15,
    zIndex: 1, // Ensure it's above other elements
  },
  backIcon: {
    width: 24,
    height: 20,
    left:10,
    top:10,
    tintColor: colors.black, // Optional: Set the icon color
  },
  logo: {
    width: 100,
    height: 40,
  },
  chatListContainer: {
    // top: 50,
    borderRadius: 16,
    overflow: "hidden",
  },
  logo: {
    top:'1%',
    width: 40,
    height: 40,
  },
});
