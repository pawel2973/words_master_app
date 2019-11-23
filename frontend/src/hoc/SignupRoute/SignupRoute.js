import React from 'react';
import { Redirect, Route } from 'react-router-dom'


const SignupRoute = ({ component: Component, sign_in, ...rest}) => {
  return (
  <Route
    {...rest}
    render={props =>      
      (!sign_in ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      ))
    }
  />
  );
};

export default SignupRoute;
