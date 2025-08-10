export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Point {
  _id: string;
  category: string;
  name: string;
  author: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt?: Date;
  updatedAt?: Date;
}
