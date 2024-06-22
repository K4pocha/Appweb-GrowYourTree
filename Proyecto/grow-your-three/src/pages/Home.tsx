import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          <h1>Bienvenido a Grow your three</h1>
          <p>Objetivos de desarrollo sostenible planteados por la ONU en la agenda 2030.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
