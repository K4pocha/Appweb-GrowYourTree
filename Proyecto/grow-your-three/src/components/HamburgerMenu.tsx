import React, { useRef } from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonMenuToggle } from '@ionic/react';
import { useUser } from '../contexts/UserContext';

interface HamburgerMenuProps {
  onLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onLogout }) => {
  const { user } = useUser();
  const menuRef = useRef<HTMLIonMenuElement>(null);

  const handleLogout = async () => {
    if (menuRef.current) {
      await menuRef.current.close();
    }
    onLogout();
  };

  return (
    <>
      <IonMenu side="end" menuId="main-menu" contentId="main-content" ref={menuRef}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menú</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {user && (
              <>
                <IonMenuToggle auto-hide="false">
                  <IonItem routerLink="/achievements">
                    <IonLabel>Logros</IonLabel>
                  </IonItem>
                  <IonItem routerLink="/profile">
                    <IonLabel>Perfil</IonLabel>
                  </IonItem>
                  <IonItem routerLink="/posts">
                    <IonLabel>Foro</IonLabel>
                  </IonItem>
                  {user && user.role === 'admin' && (
                        <IonItem routerLink="/manage-users">
                            <IonLabel>Gestionar Usuarios</IonLabel>
                        </IonItem>
                    )}
                  <IonItem button onClick={handleLogout}>
                    <IonLabel>Cerrar Sesión</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </>
            )}
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
};

export default HamburgerMenu;
