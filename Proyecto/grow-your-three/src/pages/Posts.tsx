import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Posts: React.FC = () => {
    const history = useHistory();

    const sections = ['Movilidad Sostenible', 'Consumo Responsable', 'Ahorro de Energía'];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Foros</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {sections.map(section => (
                        <IonItem button key={section} onClick={() => history.push(`/posts/${section.toLowerCase().replace(/ /g, '-')}`)}>
                            <IonLabel>{section}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Posts;
