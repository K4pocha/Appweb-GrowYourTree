import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonInput, IonItem, IonLabel, IonToast } from '@ionic/react';
import { useUser } from '../contexts/UserContext';

const PostComments: React.FC = () => {
    const { user } = useUser();
    const { id, section } = useParams<{ id: string, section: string }>();
    const [post, setPost] = useState<any>(null);
    const [comment, setComment] = useState('');
    const [showToast, setShowToast] = useState({ show: false, message: '', color: '' });
    const history = useHistory();

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('Error fetching post', error);
        }
    };

    const handleAddComment = async () => {
        if (!comment) {
            setShowToast({ show: true, message: 'El comentario no puede estar vacío', color: 'warning' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: comment })
            });

            if (response.ok) {
                setShowToast({ show: true, message: 'Comentario agregado', color: 'success' });
                setComment('');
                fetchPost(); // Refresh post to show new comment
            } else {
                setShowToast({ show: true, message: 'Error al agregar comentario', color: 'danger' });
            }
        } catch (error) {
            setShowToast({ show: true, message: 'Error al agregar comentario', color: 'danger' });
        }
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setShowToast({ show: true, message: 'Like agregado', color: 'success' });
                fetchPost(); // Refresh post to show new like
            } else {
                setShowToast({ show: true, message: 'Error al agregar like', color: 'danger' });
            }
        } catch (error) {
            setShowToast({ show: true, message: 'Error al agregar like', color: 'danger' });
        }
    };

    const handleDislike = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}/dislike`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setShowToast({ show: true, message: 'Dislike agregado', color: 'success' });
                fetchPost(); // Refresh post to show new dislike
            } else {
                setShowToast({ show: true, message: 'Error al agregar dislike', color: 'danger' });
            }
        } catch (error) {
            setShowToast({ show: true, message: 'Error al agregar dislike', color: 'danger' });
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" onClick={() => history.goBack()}>Atrás</IonButton>
                    <IonTitle>Detalles de la Publicación</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {post && (
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>{post.title}</IonCardTitle>
                            <p>Publicado por: {post.nickname}</p>
                        </IonCardHeader>
                        <IonCardContent>
                            <p>{post.content}</p>
                            <IonButton onClick={handleLike}>Like ({post.likes.length})</IonButton>
                            <IonButton onClick={handleDislike}>Dislike ({post.dislikes.length})</IonButton>
                            <IonItem>
                                <IonLabel position="stacked">Nuevo Comentario</IonLabel>
                                <IonInput value={comment} onIonChange={e => setComment(e.detail.value!)}></IonInput>
                            </IonItem>
                            <IonButton expand="block" onClick={handleAddComment}>Agregar Comentario</IonButton>
                            {post.comments && post.comments.map((comment: any) => (
                                <div key={comment.id}>
                                    <p><strong>{comment.nickname}:</strong> {comment.content}</p>
                                </div>
                            ))}
                        </IonCardContent>
                    </IonCard>
                )}
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

export default PostComments;
