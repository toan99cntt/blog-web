export interface MetaRouter {
  meta: {
    auth?: boolean,
    guess?: boolean,
    permissions?: string|string[]|{[n:string]: string|string[]}
  }
}
