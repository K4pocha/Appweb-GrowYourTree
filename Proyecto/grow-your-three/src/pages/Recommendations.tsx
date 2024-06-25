import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:5000/recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations', error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recomendaciones Diarias</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {recommendations.map((recommendation, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardTitle>{recommendation.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{recommendation.content}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Recommendations;
