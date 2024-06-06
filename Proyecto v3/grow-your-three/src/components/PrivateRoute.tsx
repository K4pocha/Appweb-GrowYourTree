import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  onShowToast: (message: string, color: string) => void;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, onShowToast, ...rest }) => {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <>
            <Redirect to="/home" />
            {onShowToast('Debes iniciar sesión para acceder a esta página', 'warning')}
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
