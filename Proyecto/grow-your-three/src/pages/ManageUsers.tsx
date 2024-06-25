import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonInput, IonModal } from '@ionic/react';
import { useUser } from '../contexts/UserContext';


interface User {
    id: string;
    name: string;
    nickname: string;
    email: string;
    role: string;
    achievements: string[];
}

interface Achievement {
    category: string;
    achievements: {
        level: string;
        description: string;
        criteria: string;
        points: number;
        image: string;
    }[];
}

const ManageUsers: React.FC = () => {
    const { user } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedAchievement, setSelectedAchievement] = useState<string>('');
    const [showAchievementModal, setShowAchievementModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:5000/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Error fetching users');
            }
        };

        const fetchAchievements = async () => {
            const response = await fetch('http://localhost:5000/achievements');
            if (response.ok) {
                const data = await response.json();
                setAchievements(data);
            } else {
                console.error('Error fetching achievements');
            }
        };

        if (user?.role === 'admin') {
            fetchUsers();
            fetchAchievements();
        }
    }, [user]);

    const handleRoleChange = async (id: string, newRole: string) => {
        const response = await fetch(`http://localhost:5000/users/${id}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ role: newRole })
        });
        if (response.ok) {
            setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));
        } else {
            console.error('Error updating user role');
        }
    };

    const handleAssignAchievement = async () => {
        if (selectedUser && selectedAchievement) {
            const response = await fetch(`http://localhost:5000/users/${selectedUser.id}/achievements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ criteria: selectedAchievement })
            });
            if (response.ok) {
                setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, achievements: [...user.achievements, selectedAchievement] } : user)));
                setShowAchievementModal(false);
                setSelectedAchievement('');
            } else {
                console.error('Error assigning achievement');
            }
        }
    };

    const handleRemoveAchievement = async (userId: string, achievement: string) => {
        const response = await fetch(`http://localhost:5000/users/${userId}/achievements`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ criteria: achievement })
        });
        if (response.ok) {
            setUsers(users.map(user => (user.id === userId ? { ...user, achievements: user.achievements.filter(a => a !== achievement) } : user)));
        } else {
            console.error('Error removing achievement');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Manage Users</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {users.map(user => (
                        <IonItem key={user.id}>
                            <IonLabel>
                                <h2>{user.name}</h2>
                                <p>{user.nickname}</p>
                                <p>{user.email}</p>
                            </IonLabel>
                            <IonSelect
                                value={user.role}
                                placeholder="Select Role"
                                onIonChange={e => handleRoleChange(user.id, e.detail.value)}
                            >
                                <IonSelectOption value="user">User</IonSelectOption>
                                <IonSelectOption value="admin">Admin</IonSelectOption>
                            </IonSelect>
                            <IonButton onClick={() => { setSelectedUser(user); setShowAchievementModal(true); }}>Manage Achievements</IonButton>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>

            <IonModal isOpen={showAchievementModal} onDidDismiss={() => setShowAchievementModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Manage Achievements for {selectedUser?.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        {selectedUser?.achievements.map(achievement => (
                            <IonItem key={achievement}>
                                <IonLabel>{achievement}</IonLabel>
                                <IonButton color="danger" onClick={() => handleRemoveAchievement(selectedUser.id, achievement)}>Remove</IonButton>
                            </IonItem>
                        ))}
                    </IonList>
                    <IonItem>
                        <IonLabel>Add Achievement</IonLabel>
                        <IonSelect
                            value={selectedAchievement}
                            placeholder="Select Achievement"
                            onIonChange={e => setSelectedAchievement(e.detail.value)}
                        >
                            {achievements.map(category =>
                                category.achievements.map(a => (
                                    <IonSelectOption key={a.criteria} value={a.criteria}>
                                        {a.description}
                                    </IonSelectOption>
                                ))
                            )}
                        </IonSelect>
                    </IonItem>
                    <IonButton expand="block" onClick={handleAssignAchievement}>Assign Achievement</IonButton>
                    <IonButton expand="block" color="light" onClick={() => setShowAchievementModal(false)}>Close</IonButton>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default ManageUsers;
