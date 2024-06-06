import React, { useState } from 'react';
import { IonModal, IonButton, IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useUser } from '../contexts/UserContext';
import './LoginModal.css';

interface LoginModalProps {
  onShowToast: (message: string, color: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onLoginSuccess: () => void;
  onModalDidDismiss: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onShowToast, showModal, setShowModal, onLoginSuccess, onModalDidDismiss }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();

  const handleLogin = async () => {
    if (!identifier || !password) {
      onShowToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });
      if (response.ok) {
        const user = await response.json();
        login(user); // Pasar el objeto de usuario completo
        onShowToast('Inicio de sesión exitoso', 'success');
        onLoginSuccess();
      } else {
        const errorMessage = await response.text();
        onShowToast(errorMessage, 'danger');
      }
    } catch (error) {
      onShowToast('Error al intentar iniciar sesión. Por favor, intenta nuevamente.', 'danger');
    }
  };

  return (
    <>
      <IonModal isOpen={showModal} onDidDismiss={onModalDidDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Iniciar Sesión</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel position="stacked">Correo o Apodo</IonLabel>
            <IonInput value={identifier} onIonChange={e => setIdentifier(e.detail.value!)} type="text"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput value={password} onIonChange={e => setPassword(e.detail.value!)} type="password"></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={handleLogin}>Iniciar Sesión</IonButton>
          <IonButton expand="block" color="light" onClick={() => setShowModal(false)}>Cerrar</IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default LoginModal;
