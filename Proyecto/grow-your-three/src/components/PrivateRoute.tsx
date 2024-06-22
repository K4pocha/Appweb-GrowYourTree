import React from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface PrivateRouteProps extends RouteProps {
  onShowToast: (message: string, color: string) => void;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, onShowToast, ...rest }) => {
  const { user } = useUser();

  React.useEffect(() => {
    if (!user) {
      onShowToast('Debes iniciar sesión para acceder a esta página', 'warning');
      window.location.href = '/home';  // Redirección usando window.location
    }
  }, [user, onShowToast, history]);

  if (!Component) return null;

  return (
    <Route
      {...rest}
      render={props => (user ? <Component {...props} /> : null)}
    />
  );
};

export default PrivateRoute;
