import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface PrivateRouteProps extends RouteProps {
  onShowToast: (message: string, color: string) => void;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, onShowToast, ...rest }) => {
  const { user } = useUser();

  if (!Component) return null;

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <>
            {onShowToast('Debes iniciar sesión para acceder a esta página', 'warning')}
            <Redirect to="/home" />
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
