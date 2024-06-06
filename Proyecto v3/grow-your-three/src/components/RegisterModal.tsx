import React, { useState } from 'react';
import { IonModal, IonButton, IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import './RegisterModal.css';

interface RegisterModalProps {
  onShowToast: (message: string, color: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onShowToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!name || !nickname || !email || !password || !confirmPassword) {
      onShowToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      onShowToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      onShowToast('Correo electrónico no válido', 'warning');
      return;
    }

    const newUser = { name, nickname, email, password };
    const response = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    if (response.ok) {
      onShowToast('Registro exitoso', 'success');
      setShowModal(false);
    } else {
      onShowToast('Error al registrar usuario', 'danger');
    }
  };

  return (
    <>
      <IonButton onClick={() => setShowModal(true)} slot="end">Registrarse</IonButton>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Registrarse</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput value={name} onIonChange={e => setName(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Apodo</IonLabel>
            <IonInput value={nickname} onIonChange={e => setNickname(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Correo</IonLabel>
            <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)} type="email"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput value={password} onIonChange={e => setPassword(e.detail.value!)} type="password"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
            <IonInput value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} type="password"></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={handleRegister}>Registrarse</IonButton>
          <IonButton expand="block" color="light" onClick={() => setShowModal(false)}>Cerrar</IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default RegisterModal;
