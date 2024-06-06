import React, { useState, useRef } from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, calculatorOutline, trophyOutline, personOutline } from 'ionicons/icons';
import Home from './pages/Home';
import CO2Calculator from './pages/CO2Calculator';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider, useUser } from './contexts/UserContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const AppContent: React.FC = () => {
  const { user, logout } = useUser();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalDidDismissedRef = useRef(false);

  const handleShowToast = (message: string, color: string) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
    modalDidDismissedRef.current = false;
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleModalDidDismiss = () => {
    if (!modalDidDismissedRef.current) {
      modalDidDismissedRef.current = true;
      setShowLoginModal(false);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Grow your three</IonTitle>
          <IonButtons slot="end">
            {user ? (
              <>
                <IonLabel>{user.nickname}</IonLabel>
                <IonButton onClick={logout}>Cerrar Sesión</IonButton>
              </>
            ) : (
              <>
                <IonButton onClick={() => setShowLoginModal(true)} slot="end">Iniciar Sesión</IonButton>
                <LoginModal
                  onShowToast={handleShowToast}
                  showModal={showLoginModal}
                  setShowModal={setShowLoginModal}
                  onLoginSuccess={handleLoginSuccess}
                  onModalDidDismiss={handleModalDidDismiss}
                />
                <RegisterModal onShowToast={handleShowToast} />
              </>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact />
          <Route path="/calculator" component={CO2Calculator} exact />
          <PrivateRoute path="/achievements" component={Achievements} exact onShowToast={handleShowToast} />
          <PrivateRoute path="/profile" component={Profile} exact onShowToast={handleShowToast} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Inicio</IonLabel>
          </IonTabButton>
          <IonTabButton tab="calculator" href="/calculator">
            <IonIcon icon={calculatorOutline} />
            <IonLabel>Calculadora</IonLabel>
          </IonTabButton>
          <IonTabButton tab="achievements" href="/achievements">
            <IonIcon icon={trophyOutline} />
            <IonLabel>Logros</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personOutline} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        color={toastColor}
      />
    </>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
