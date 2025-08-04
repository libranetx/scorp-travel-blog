export interface ApiError {
  error: string;
  details?: any;
  status: number;
}

export function createApiError(message: string, status: number = 500, details?: any): ApiError {
  return {
    error: message,
    details: process.env.NODE_ENV === 'development' ? details : undefined,
    status
  };
}

export function handlePrismaError(error: any): ApiError {
  console.error('Prisma error:', error);
  
  // Handle specific Prisma errors
  if (error?.code === 'P2002') {
    return createApiError('Duplicate entry found', 400, error);
  }
  
  if (error?.code === 'P2025') {
    return createApiError('Record not found', 404, error);
  }
  
  if (error?.code === 'P2003') {
    return createApiError('Foreign key constraint failed', 400, error);
  }
  
  // Generic database error
  return createApiError('Database operation failed', 500, error);
} 