import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { useUser } from '../contexts/UserContext';

const Posts: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:5000/posts');
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const createPost = async () => {
    const response = await fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newPost)
    });
    if (response.ok) {
      const post = await response.json();
      setPosts([...posts, post]);
      setNewPost({ title: '', content: '', category: '' });
    }
  };

  const updatePost = async (id: string, updatedData: any) => {
    const response = await fetch(`http://localhost:5000/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData)
    });
    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map(post => (post.id === id ? updatedPost : post)));
    }
  };

  const deletePost = async (id: string) => {
    const response = await fetch(`http://localhost:5000/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Publicaciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {user && (
          <>
            <IonItem>
              <IonLabel>Título</IonLabel>
              <IonInput name="title" value={newPost.title} onIonChange={handleInputChange} />
            </IonItem>
            <IonItem>
              <IonLabel>Contenido</IonLabel>
              <IonInput name="content" value={newPost.content} onIonChange={handleInputChange} />
            </IonItem>
            <IonItem>
              <IonLabel>Categoría</IonLabel>
              <IonSelect name="category" value={newPost.category} onIonChange={handleInputChange}>
                <IonSelectOption value="general">General</IonSelectOption>
                <IonSelectOption value="preguntas">Preguntas</IonSelectOption>
                <IonSelectOption value="sugerencias">Sugerencias</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton onClick={createPost}>Crear Publicación</IonButton>
          </>
        )}
        <IonList>
          {posts.map(post => (
            <IonItem key={post.id}>
              <IonLabel>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p>Categoría: {post.category}</p>
                {post.deletedBy && <p>Eliminado por usuario ID: {post.deletedBy}</p>}
              </IonLabel>
              {(user?.id === post.userId || user?.role === 'admin') && !post.deletedBy && (
                <>
                  <IonButton onClick={() => updatePost(post.id, { ...post, content: 'Contenido actualizado' })}>Editar</IonButton>
                  <IonButton onClick={() => deletePost(post.id)}>Eliminar</IonButton>
                </>
              )}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Posts;
