export interface Post {
    id: string;
    title: string;
    description: string;
    image_url: string;
    colors: number[][];
    css: string;
    author: string;
    created_at: string;
    likes: number;
    isFeatured?: boolean;
  }
  
  export interface User {
    email: string;
    username?: string;
    id?: string;
    token?: string;
  }