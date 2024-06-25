import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonToast } from '@ionic/react';
import { useUser } from '../contexts/UserContext';

const CreatePostModal: React.FC<{ section: string, isOpen: boolean, onDidDismiss: () => void }> = ({ section, isOpen, onDidDismiss }) => {
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showToast, setShowToast] = useState({ show: false, message: '', color: '' });

    const handleSubmit = async () => {
        if (!title || !content) {
            setShowToast({ show: true, message: 'Todos los campos son obligatorios', color: 'warning' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content, section, userId: user?.id })
            });

            if (response.ok) {
                setShowToast({ show: true, message: 'Publicación creada exitosamente', color: 'success' });
                setTitle('');
                setContent('');
                onDidDismiss();
            } else {
                setShowToast({ show: true, message: 'Error al crear la publicación', color: 'danger' });
            }
        } catch (error) {
            setShowToast({ show: true, message: 'Error al crear la publicación', color: 'danger' });
        }
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Crear Publicación</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="stacked">Título</IonLabel>
                    <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Contenido</IonLabel>
                    <IonInput value={content} onIonChange={e => setContent(e.detail.value!)}></IonInput>
                </IonItem>
                <IonButton expand="block" onClick={handleSubmit}>Crear Publicación</IonButton>
                <IonButton expand="block" color="light" onClick={onDidDismiss}>Cerrar</IonButton>
                <IonToast
                    isOpen={showToast.show}
                    onDidDismiss={() => setShowToast({ show: false, message: '', color: '' })}
                    message={showToast.message}
                    duration={2000}
                    color={showToast.color}
                />
            </IonContent>
        </IonModal>
    );
};

export default CreatePostModal;
