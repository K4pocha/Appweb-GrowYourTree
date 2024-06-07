import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonToast, IonList } from '@ionic/react';
import { useUser } from '../contexts/UserContext';
import { User, Achievement } from '../types';

const Profile: React.FC = () => {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/users/${user.email}`)
        .then(response => response.json())
        .then(data => {
          setName(data.name);
          setNickname(data.nickname);
          setEmail(data.email);
          setAchievements(data.achievements || []);
        });
    }
  }, [user]);

  const handlePasswordChange = async () => {
    if (!user) return;

    if (newPassword !== confirmNewPassword) {
      setToastMessage('Las contraseñas no coinciden');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    const response = await fetch(`http://localhost:5000/users/${user.email}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    if (response.ok) {
      setToastMessage('Contraseña actualizada correctamente');
      setToastColor('success');
    } else {
      const errorMessage = await response.text();
      setToastMessage(errorMessage);
      setToastColor('danger');
    }
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={name} readonly />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Apodo</IonLabel>
          <IonInput value={nickname} readonly />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Correo</IonLabel>
          <IonInput value={email} readonly />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Contraseña Antigua</IonLabel>
          <IonInput value={oldPassword} type="password" onIonChange={e => setOldPassword(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Nueva Contraseña</IonLabel>
          <IonInput value={newPassword} type="password" onIonChange={e => setNewPassword(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Confirmar Nueva Contraseña</IonLabel>
          <IonInput value={confirmNewPassword} type="password" onIonChange={e => setConfirmNewPassword(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handlePasswordChange}>Cambiar Contraseña</IonButton>
        <IonList>
          <IonTitle>Logros</IonTitle>
          {achievements.map(achievement => (
            <IonItem key={achievement.id}>
              <IonLabel>
                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>
                <p>{achievement.completed ? 'Completado' : 'Por completar'}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
