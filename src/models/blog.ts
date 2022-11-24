import { User } from 'src/models/user';

export interface Blog {
  id: number,
  title: string,
  content: string,
  like_count: number,
  member_id: number,
  created_at: string,
  member: User,
  status: number
  _image: File|null,
  _title: string,
  _content: string,
  image: { url: string}[]
}
