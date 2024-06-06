import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import './CO2Calculator.css';

const CO2Calculator: React.FC = () => {
  const calculateCO2 = () => {
    // Lógica para calcular la huella de CO2
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calculadora de Huella de CO2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          <IonItem>
            <IonLabel>Distancia recorrida (km)</IonLabel>
            <IonInput type="number"></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={calculateCO2}>Calcular</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CO2Calculator;
