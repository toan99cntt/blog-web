export interface ApiResponse {
  status: number,
  msg: string,
  data: any,
  error_messages: string
}

export interface ApiResponseList<T = object[]> extends ApiResponse{
  data: {
    results: T,
    per_page?: number,
    current_page?: number,
    last_page?: number,
    from?: number,
    to?: number,
    total?: number,
    quantity?: object[],
    total_money?: object[]
  }
}

export interface Params { [n: string]: string|number }
