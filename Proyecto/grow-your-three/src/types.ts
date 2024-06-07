export interface Comment {
    id: string;
    author: string;
    content: string;
  }
  
  export interface Post {
    id: string;
    author: string;
    content: string;
    likes: number;
    dislikes: number;
    comments: Comment[];
    likedBy?: string[];
    dislikedBy?: string[];
  }
  
  export interface User {
    id: string;
    name: string;
    nickname: string;
    email: string;
    password: string;
    achievements?: Achievement[];
  }
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }
  