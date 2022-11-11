export interface User {
  id: number,
  name: string,
  email: string,
  phone_number: string,
  dob: string,
  password: string,
  status: number,
  gender: number,
  avatar: string | File
}
