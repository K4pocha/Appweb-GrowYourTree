import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonToast } from '@ionic/react';
import { thumbsUpOutline, thumbsDownOutline } from 'ionicons/icons';
import { useUser } from '../contexts/UserContext';
import { Post, Comment } from '../types';

const Posts: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  const handleCreatePost = async () => {
    if (!user) {
      setToastMessage('Debes iniciar sesión para crear una publicación');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    if (!newPostContent) {
      setToastMessage('El contenido de la publicación no puede estar vacío');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    const response = await fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: newPostContent, author: user.nickname })
    });

    if (response.ok) {
      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setNewPostContent('');
      setToastMessage('Publicación creada con éxito');
      setToastColor('success');
    } else {
      setToastMessage('Error al crear la publicación');
      setToastColor('danger');
    }
    setShowToast(true);
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      setToastMessage('Debes iniciar sesión para dar like');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user.id }) // Assuming user has an id property
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
    }
  };

  const handleDislike = async (postId: string) => {
    if (!user) {
      setToastMessage('Debes iniciar sesión para dar dislike');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    const response = await fetch(`http://localhost:5000/posts/${postId}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user.id }) // Assuming user has an id property
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
    }
  };

  const handleComment = async (postId: string) => {
    const commentContent = newCommentContent[postId];
    if (!commentContent) {
      setToastMessage('El contenido del comentario no puede estar vacío');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    if (!user) {
      setToastMessage('Debes iniciar sesión para comentar');
      setToastColor('warning');
      setShowToast(true);
      return;
    }

    const response = await fetch(`http://localhost:5000/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: commentContent, author: user.nickname })
    });

    if (response.ok) {
      const newComment: Comment = await response.json();
      setPosts(posts.map(post => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post)));
      setNewCommentContent({ ...newCommentContent, [postId]: '' });
    }
  };

  const handleCommentChange = (postId: string, content: string) => {
    setNewCommentContent({ ...newCommentContent, [postId]: content });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Foro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Nueva Publicación</IonLabel>
          <IonInput value={newPostContent} onIonChange={e => setNewPostContent(e.detail.value!)} placeholder="¿Qué estás pensando?" />
        </IonItem>
        <IonButton expand="block" onClick={handleCreatePost}>Publicar</IonButton>
        <IonList>
          {posts.sort((a, b) => b.likes - a.likes).map(post => (
            <IonCard key={post.id}>
              <IonCardHeader>
                <IonCardTitle>{post.author}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{post.content}</p>
                <IonButton onClick={() => handleLike(post.id)}>
                  <IonIcon icon={thumbsUpOutline} /> {post.likes}
                </IonButton>
                <IonButton onClick={() => handleDislike(post.id)}>
                  <IonIcon icon={thumbsDownOutline} /> {post.dislikes}
                </IonButton>
                <IonItem>
                  <IonLabel position="stacked">Comentario</IonLabel>
                  <IonInput value={newCommentContent[post.id] || ''} onIonChange={e => handleCommentChange(post.id, e.detail.value!)} placeholder="Escribe un comentario..." />
                  <IonButton onClick={() => handleComment(post.id)}>Enviar</IonButton>
                </IonItem>
                <IonList>
                  {post.comments.map(comment => (
                    <IonItem key={comment.id}>
                      <IonLabel>
                        <h2>{comment.author}</h2>
                        <p>{comment.content}</p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default Posts;
