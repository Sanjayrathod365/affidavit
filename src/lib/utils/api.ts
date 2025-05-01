import logger from './logger';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data: any = null
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse<T>(
  promise: Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    logger.error(errorMessage, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : errorMessage
    };
  }
}

export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError;
}

export function createApiError(
  message: string,
  statusCode: number = 500,
  data: any = null
): ApiError {
  return new ApiError(message, statusCode, data);
} 