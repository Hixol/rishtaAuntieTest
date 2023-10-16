import React from 'react';
import LoginSignup from '../../components/LoginSignup';

const Signup = props => {
  return (
  <LoginSignup loginSignupText="SignUp" props={props} login={false} />);
};

export default Signup;
