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

export interface PageResponse<T> {
  content: T[];
  size: number;
  hasNext: boolean;
}
