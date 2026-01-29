export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiEmptyResponse {
  statusCode: number;
  message: string;
  data?: null;
}
