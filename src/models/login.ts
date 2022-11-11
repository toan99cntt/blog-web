export interface Login {
  username: string,
  password: string,
}

export interface LoginRO {
  token_type: string,
  access_token: string,
  refresh_token: string,
}
