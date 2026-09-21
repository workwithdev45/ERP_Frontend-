export interface ApiResponse<T> {
  error: boolean;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
