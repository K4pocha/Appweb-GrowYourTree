import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonImg, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useUser } from '../contexts/UserContext';
import './Achievements.css';

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

const Achievements: React.FC = () => {
    const { user } = useUser();
    const [categories, setCategories] = useState<Category[]>([]);
    const [userAchievements, setUserAchievements] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/achievements')
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

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Logros</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {categories.map(category => (
                    <IonList key={category.category}>
                        <IonItem>
                            <IonLabel>
                                <h2>{category.category}</h2>
                            </IonLabel>
                        </IonItem>
                        {category.achievements.map(achievement => (
                            <IonItem key={achievement.criteria}>
                                <IonImg
                                    src={`/achievements/${achievement.image}`}
                                    className={`achievement-img ${userAchievements.includes(achievement.criteria) ? '' : 'locked'}`}
                                    alt={achievement.description}
                                />
                                <IonLabel>
                                    <h3>{achievement.level}</h3>
                                    <p>{achievement.description}</p>
                                    <p>{achievement.points} puntos</p>
                                </IonLabel>
                                {userAchievements.includes(achievement.criteria) && (
                                    <IonIcon icon={checkmarkCircleOutline} slot="end" />
                                )}
                            </IonItem>
                        ))}
                    </IonList>
                ))}
            </IonContent>
        </IonPage>
    );
};

export default Achievements;
