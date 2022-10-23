export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  description: string;
  mainImage: {
    assests: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
  comments: Comment[]
}


export interface Comment {
  post: {
    _ref: string
    _type: string
  }
  _id: string
  _type: string
  _rev: string
  _createdAt: string
  _updatedAt: string
  name: string
  email: string
  comment: string
  approved: boolean
}