import { User } from 'src/models/user';

export interface Message {
  id: number,
  content: string,
  type: string,
  sender: User,
  receiver: User,
  attachments: {url: string}[],
  created_at: string,
  has_seen: number
}
