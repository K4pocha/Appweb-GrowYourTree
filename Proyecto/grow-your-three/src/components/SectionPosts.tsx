import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonToast } from '@ionic/react';
import CreatePostModal from './CreatePostModal';
import { useUser } from '../contexts/UserContext';
import { useParams, useHistory } from 'react-router-dom';

const SectionPosts: React.FC = () => {
    const { user } = useUser();
    const { section } = useParams<{ section: string }>();
    const history = useHistory();
    const [posts, setPosts] = useState<any[]>([]);
    const [showToast, setShowToast] = useState({ show: false, message: '', color: '' });
    const [showModal, setShowModal] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts?section=${section}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setShowToast({ show: true, message: 'Publicación eliminada', color: 'success' });
                fetchPosts(); // Fetch the updated list of posts
            } else {
                setShowToast({ show: true, message: 'Error al eliminar la publicación', color: 'danger' });
            }
        } catch (error) {
            setShowToast({ show: true, message: 'Error al eliminar la publicación', color: 'danger' });
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [section]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" onClick={() => history.goBack()}>Atrás</IonButton>
                    <IonTitle>Publicaciones de {section}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {user && (
                    <>
                        <IonButton onClick={() => setShowModal(true)}>Crear Publicación</IonButton>
                        <CreatePostModal section={section} isOpen={showModal} onDidDismiss={() => { setShowModal(false); fetchPosts(); }} />
                    </>
                )}
                {posts.map(post => (
                    <IonCard key={post.id} color={post.deleted ? 'light' : ''} onClick={() => history.push(`/posts/${section}/${post.id}`)}>
                        <IonCardHeader>
                            <IonCardTitle>{post.title}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <p>{post.content}</p>
                            {user?.role === 'admin' || user?.id === post.userId ? (
                                <IonButton color="danger" onClick={() => handleDelete(post.id)}>
                                    Eliminar
                                </IonButton>
                            ) : null}
                        </IonCardContent>
                    </IonCard>
                ))}
                <IonToast
                    isOpen={showToast.show}
                    onDidDismiss={() => setShowToast({ show: false, message: '', color: '' })}
                    message={showToast.message}
                    duration={2000}
                    color={showToast.color}
                />
            </IonContent>
        </IonPage>
    );
};

export default SectionPosts;
