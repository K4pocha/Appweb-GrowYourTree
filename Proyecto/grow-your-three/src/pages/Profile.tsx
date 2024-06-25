import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonImg, IonToast } from '@ionic/react';
import { useUser } from '../contexts/UserContext';
import './Profile.css'; // Importa el archivo CSS

interface Achievement {
    level: string;
    description: string;
    criteria: string;
    points: number;
    image: string;
}

interface Category {
    category: string;
    achievements: Achievement[];
}

const Profile: React.FC = () => {
    const { user, logout } = useUser();
    const [categories, setCategories] = useState<Category[]>([]);
    const [userAchievements, setUserAchievements] = useState<string[]>([]);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastColor, setToastColor] = useState('success');

    useEffect(() => {
        fetch('/data/achievements.json')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching achievements:', error));
    }, []);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/users/${user.id}/achievements`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => setUserAchievements(data))
            .catch(error => console.error('Error fetching user achievements:', error));
        }
    }, [user]);

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            setToastMessage('Las contraseñas no coinciden.');
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        fetch(`http://localhost:5000/users/${user?.id}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ password: newPassword })
        })
        .then(response => {
            if (response.ok) {
                setToastMessage('Contraseña actualizada exitosamente.');
                setToastColor('success');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setToastMessage('Error al actualizar la contraseña.');
                setToastColor('danger');
            }
            setShowToast(true);
        })
        .catch(error => {
            setToastMessage('Error al actualizar la contraseña.');
            setToastColor('danger');
            setShowToast(true);
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Perfil</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {user && (
                    <>
                        <IonList>
                            <IonItem>
                                <IonLabel>
                                    <h2>{user.name}</h2>
                                    <p>{user.email}</p>
                                    <p>{user.nickname}</p>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                        <IonButton onClick={logout}>Cerrar Sesión</IonButton>

                        <h2>Cambiar Contraseña</h2>
                        <IonItem>
                            <IonLabel position="stacked">Nueva Contraseña</IonLabel>
                            <IonInput
                                value={newPassword}
                                type="password"
                                onIonChange={(e) => setNewPassword(e.detail.value!)}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Confirmar Nueva Contraseña</IonLabel>
                            <IonInput
                                value={confirmPassword}
                                type="password"
                                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                            />
                        </IonItem>
                        <IonButton onClick={handlePasswordChange}>Actualizar Contraseña</IonButton>

                        <h2>Logros</h2>
                        <div className="achievements-container">
                            {categories.map(category => (
                                <IonList key={category.category}>
                                    <IonItem>
                                        <IonLabel>
                                            <h2>{category.category}</h2>
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {category.achievements.map(achievement => (
                                                <IonImg
                                                    key={achievement.criteria}
                                                    src={`/achievements/${achievement.image}`}
                                                    className={`achievement-img ${userAchievements.includes(achievement.criteria) ? '' : 'locked'}`}
                                                    alt={achievement.description}
                                                />
                                            ))}
                                        </div>
                                    </IonItem>
                                </IonList>
                            ))}
                        </div>
                    </>
                )}
            </IonContent>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                color={toastColor}
                position="top"
            />
        </IonPage>
    );
};

export default Profile;
