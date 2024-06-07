import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonToast } from '@ionic/react';
import { useUser } from '../contexts/UserContext';
import { Achievement } from '../types';

const Achievements: React.FC = () => {
  const { user } = useUser();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/users/${user.email}/achievements`)
        .then(response => response.json())
        .then(data => setAchievements(data));
    }
  }, [user]);

  const handleCompleteAchievement = async (achievementId: string) => {
    if (!user) return;

    const updatedAchievements = achievements.map(a => 
      a.id === achievementId ? { ...a, completed: true } : a
    );

    const response = await fetch(`http://localhost:5000/users/${user.email}/achievements`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ achievements: updatedAchievements })
    });

    if (response.ok) {
      setAchievements(updatedAchievements);
      setToastMessage('Logro completado');
      setToastColor('success');
    } else {
      setToastMessage('Error al actualizar el logro');
      setToastColor('danger');
    }
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Logros</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {achievements.map(achievement => (
            <IonItem key={achievement.id}>
              <IonLabel>
                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>
                <p>{achievement.completed ? 'Completado' : 'Por completar'}</p>
              </IonLabel>
              {!achievement.completed && (
                <IonButton onClick={() => handleCompleteAchievement(achievement.id)}>
                  Completar
                </IonButton>
              )}
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

export default Achievements;
