import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonInput, IonButton, IonSelect, IonSelectOption, IonList, IonText } from '@ionic/react';

const CO2Calculator: React.FC = () => {
  const [mobility, setMobility] = useState('');
  const [flights, setFlights] = useState(0);
  const [flightDuration, setFlightDuration] = useState('');
  const [diet, setDiet] = useState('');
  const [location, setLocation] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [co2Emission, setCo2Emission] = useState<number | null>(null);

  const calculateCO2 = () => {
    let totalCO2 = 0;

    // Movilidad
    switch (mobility) {
      case 'car':
        totalCO2 += 2.31; // kg CO2 per liter of gasoline
        break;
      case 'bus':
        totalCO2 += 0.089; // kg CO2 per kilometer
        break;
      case 'bike':
      case 'walk':
        totalCO2 += 0; // kg CO2
        break;
    }

    // Vuelos
    switch (flightDuration) {
      case 'short':
        totalCO2 += flights * 0.15; // toneladas CO2 por vuelo corto
        break;
      case 'medium':
        totalCO2 += flights * 0.3; // toneladas CO2 por vuelo medio
        break;
      case 'long':
        totalCO2 += flights * 0.6; // toneladas CO2 por vuelo largo
        break;
    }

    // Dieta
    switch (diet) {
      case 'meat':
        totalCO2 += 3.3; // toneladas CO2 por año para dieta carnívora
        break;
      case 'vegetarian':
        totalCO2 += 1.7; // toneladas CO2 por año para dieta vegetariana
        break;
      case 'vegan':
        totalCO2 += 1.5; // toneladas CO2 por año para dieta vegana
        break;
    }

    // Ajustar por periodo de cálculo
    switch (timePeriod) {
      case 'daily':
        totalCO2 /= 365;
        break;
      case 'weekly':
        totalCO2 /= 52;
        break;
      case 'monthly':
        totalCO2 /= 12;
        break;
      case 'yearly':
        break;
    }

    setCo2Emission(totalCO2);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cálculo de CO2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>¿Cómo te movilizas?</IonLabel>
            <IonSelect value={mobility} placeholder="Selecciona uno" onIonChange={e => setMobility(e.detail.value)}>
              <IonSelectOption value="car">Coche</IonSelectOption>
              <IonSelectOption value="bus">Autobús</IonSelectOption>
              <IonSelectOption value="bike">Bicicleta</IonSelectOption>
              <IonSelectOption value="walk">Caminando</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>¿Cuántos vuelos has tomado en el último año?</IonLabel>
            <IonInput type="number" value={flights} onIonChange={e => setFlights(parseInt(e.detail.value!, 10))}></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Duración de los vuelos</IonLabel>
            <IonSelect value={flightDuration} placeholder="Selecciona una" onIonChange={e => setFlightDuration(e.detail.value)}>
              <IonSelectOption value="short">Corto (menos de 3 horas)</IonSelectOption>
              <IonSelectOption value="medium">Medio (3-6 horas)</IonSelectOption>
              <IonSelectOption value="long">Largo (más de 6 horas)</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>¿Qué tipo de dieta tienes?</IonLabel>
            <IonSelect value={diet} placeholder="Selecciona una" onIonChange={e => setDiet(e.detail.value)}>
              <IonSelectOption value="meat">Carnívora</IonSelectOption>
              <IonSelectOption value="vegetarian">Vegetariana</IonSelectOption>
              <IonSelectOption value="vegan">Vegana</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>¿Dónde vives?</IonLabel>
            <IonSelect value={location} placeholder="Selecciona una" onIonChange={e => setLocation(e.detail.value)}>
              <IonSelectOption value="urban">Urbano</IonSelectOption>
              <IonSelectOption value="suburban">Suburbano</IonSelectOption>
              <IonSelectOption value="rural">Rural</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Período de cálculo</IonLabel>
            <IonSelect value={timePeriod} placeholder="Selecciona uno" onIonChange={e => setTimePeriod(e.detail.value)}>
              <IonSelectOption value="daily">Diario</IonSelectOption>
              <IonSelectOption value="weekly">Semanal</IonSelectOption>
              <IonSelectOption value="monthly">Mensual</IonSelectOption>
              <IonSelectOption value="yearly">Anual</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonButton expand="full" onClick={calculateCO2}>Calcular Emisiones de CO2</IonButton>
        </IonList>

        {co2Emission !== null && (
          <IonItem>
            <IonText>Emisiones totales de CO2: {co2Emission.toFixed(2)} toneladas</IonText>
          </IonItem>
        )}

        {co2Emission !== null && (
          <IonList>
            <IonItem>
              <IonLabel>Compensación de carbono:</IonLabel>
            </IonItem>
            <IonItem>
              <IonText>Para compensar tus emisiones de CO2, considera plantar árboles, apoyar proyectos de energía renovable, o reducir tu consumo energético.</IonText>
            </IonItem>
          </IonList>
        )}

        {co2Emission !== null && (
          <IonList>
            <IonItem>
              <IonLabel>Conciencia Ambiental:</IonLabel>
            </IonItem>
            <IonItem>
              <IonText>Las emisiones de CO2 afectan al medio ambiente causando el cambio climático. Reducir tus emisiones puede ayudar a preservar nuestro planeta.</IonText>
            </IonItem>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CO2Calculator;
