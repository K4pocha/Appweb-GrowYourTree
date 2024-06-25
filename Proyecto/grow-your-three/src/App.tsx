import React, { useState, useRef, useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { 
    IonApp, IonHeader, IonToolbar, IonButtons, IonTitle, 
    IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, 
    IonIcon, IonLabel, IonToast, IonMenuButton, IonContent, IonButton 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, calculatorOutline, iceCream, leaf } from 'ionicons/icons';
import Home from './pages/Home';
import CO2Calculator from './pages/CO2Calculator';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import Recommendations from './pages/Recommendations';
import SectionPosts from './components/SectionPosts';
import PostComments from './components/PostComments';


import ManageUsers from './pages/ManageUsers';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider, useUser } from './contexts/UserContext';
import HamburgerMenu from './components/HamburgerMenu';

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
    const history = useHistory();

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

    const handleLogout = () => {
        logout();
        history.push('/home');
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <>
            <HamburgerMenu onLogout={handleLogout}/>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Grow your three</IonTitle>
                    <IonButtons slot="end">
                        {user ? (
                            <>
                                <IonLabel>{user.nickname}</IonLabel>
                                <IonMenuButton menu="main-menu" />
                            </>
                        ) : (
                            <>
                                <IonButton onClick={handleShowLoginModal} slot="end">Iniciar Sesión</IonButton>
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
            <IonContent id="main-content">
                <IonRouterOutlet>
                    <Route path="/home" component={Home} exact={true} />
                    <Route path="/calculator" component={CO2Calculator} exact={true} />
                    <Route path="/recommendations" component={Recommendations} exact={true} />
                    <PrivateRoute path="/achievements" component={Achievements} exact onShowToast={handleShowToast} />
                    <PrivateRoute path="/profile" component={Profile} exact onShowToast={handleShowToast} />
                    <PrivateRoute path="/posts" component={Posts} exact onShowToast={handleShowToast} />
                    <PrivateRoute path="/posts/:section" component={SectionPosts} exact onShowToast={handleShowToast} />
                    <PrivateRoute path="/posts/:section/:id" component={PostComments} exact onShowToast={handleShowToast} />
                    <PrivateRoute path="/manage-users" component={ManageUsers} exact onShowToast={handleShowToast} />
                    <Redirect exact from="/" to="/home" />
                </IonRouterOutlet>
            </IonContent>
            <IonTabBar slot="bottom">
                <IonTabButton tab="Inicio" href="/home">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Inicio</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Calculadora" href="/calculator">
                    <IonIcon icon={calculatorOutline} />
                    <IonLabel>Calculadora</IonLabel>
                </IonTabButton>
                <IonTabButton tab="recommendations" href="/recommendations">
            <IonIcon icon={leaf} />
            <IonLabel>Recomendaciones</IonLabel>
          </IonTabButton>
            </IonTabBar>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                color={toastColor}
                position="top"
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
