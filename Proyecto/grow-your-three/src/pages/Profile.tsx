import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonToast } from '@ionic/react';
import { useUser } from '../contexts/UserContext';

const Profile: React.FC = () => {
    const { user, setUser } = useUser();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showToast, setShowToast] = useState({ show: false, message: '', color: '' });

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setShowToast({ show: true, message: 'Las contraseñas no coinciden', color: 'danger' });
            return;
        }

        if (user) {
            try {
                const response = await fetch(`http://localhost:5000/users/${user.id}/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ password: newPassword })
                });

                if (response.ok) {
                    setShowToast({ show: true, message: 'Contraseña actualizada correctamente', color: 'success' });
                } else {
                    setShowToast({ show: true, message: 'Error al actualizar la contraseña', color: 'danger' });
                }
            } catch (error) {
                setShowToast({ show: true, message: 'Error al actualizar la contraseña', color: 'danger' });
            }
        } else {
            setShowToast({ show: true, message: 'Usuario no autenticado', color: 'danger' });
        }
    };

    if (!user) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Perfil</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonItem>
                        <IonLabel>No has iniciado sesión</IonLabel>
                    </IonItem>
                </IonContent>
            </IonPage>
        );
    }

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
                    <IonInput value={user.name} readonly></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Apodo</IonLabel>
                    <IonInput value={user.nickname} readonly></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Correo</IonLabel>
                    <IonInput value={user.email} readonly></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Contraseña Actual</IonLabel>
                    <IonInput type="password" value={currentPassword} onIonChange={e => setCurrentPassword(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Nueva Contraseña</IonLabel>
                    <IonInput type="password" value={newPassword} onIonChange={e => setNewPassword(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Confirmar Nueva Contraseña</IonLabel>
                    <IonInput type="password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)}></IonInput>
                </IonItem>
                <IonButton expand="block" onClick={handlePasswordChange}>Cambiar Contraseña</IonButton>
                <IonToast
                    isOpen={showToast.show}
                    onDidDismiss={() => setShowToast({ show: false, message: '', color: '' })}
                    message={showToast.message}
                    duration={2000}
                    color={showToast.color}
                />
        

                
            </IonContent>
        </IonPage>
    );
};

export default Profile;
