import { Blog } from './blog';
import { User } from 'src/models/user';

export interface Notification {
  id: number,
  content: string,
  sender: User,
  receiver: User,
  member_id: User,
  created_at: string,
}
