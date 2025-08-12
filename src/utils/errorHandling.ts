// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'خطای غیرمنتظره‌ای رخ داده است';
};

export const logError = (error: unknown, context?: string) => {
  console.error(`[${context || 'App'}] Error:`, error);
};