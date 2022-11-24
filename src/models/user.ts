export interface User {
  id: number,
  name: string,
  email: string,
  phone_number: string,
  dob: string,
  password: string,
  status: number,
  gender: number,
  avatar: {url: string}[]
  _name: string,
  _email: string,
  _phone_number: string,
  _dob: string,
  _password: string,
  _gender: number,
  _avatar: File|null
}
