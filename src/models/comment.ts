import { Blog } from './blog';
import { User } from 'src/models/user';

export interface Comment {
  id: number,
  content: string,
  like_count: string,
  blog: Blog,
  member: User,
  created_at: string,
}