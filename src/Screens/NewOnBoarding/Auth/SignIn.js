import React from 'react';
import LoginSignupNew from '../../../components/LoginSignupNew';

const SignInNew = props => {
  return <LoginSignupNew loginSignupText="Sign In" login={true} props={props} />;
};

export default SignInNew;
