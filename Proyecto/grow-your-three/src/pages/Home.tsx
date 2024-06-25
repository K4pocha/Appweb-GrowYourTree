import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="home-content">
        <div className="intro-section">
          <h1>Bienvenido a Grow your Three</h1>
          <p>Ayudándote a vivir de manera más sostenible y reducir tu huella de carbono.</p>
        </div>

        <div className="features-section">
          <h2>Características Principales</h2>
          <div className="features-cards">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Calculadora de Huella de Carbono</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Calcula tu huella de carbono y descubre cómo puedes reducirla.
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Logros Ecológicos</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Gana logros por tus acciones sostenibles y compite con amigos.
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Foros de Discusión</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Únete a la comunidad y comparte tus experiencias y consejos.
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        <div className="benefits-section">
          <h2>Beneficios de Usar Grow your Three</h2>
          <IonCard>
            <ul className="benefits-text">
              <li>Reduce tu impacto ambiental.</li>
              <li>Aprende nuevas formas de vivir de manera sostenible.</li>
              <li>Conéctate con una comunidad de personas con ideas afines.</li>
            </ul>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
