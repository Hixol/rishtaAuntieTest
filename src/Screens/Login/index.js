import React from 'react';
import LoginSignup from '../../components/LoginSignup';

const Login = props => {
  return <LoginSignup loginSignupText="Sign In" login={true} props={props} />;
};

export default Login;
