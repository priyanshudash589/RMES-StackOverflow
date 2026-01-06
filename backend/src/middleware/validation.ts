import { Request, Response, NextFunction } from 'express';

// Error handler middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Handle specific error types
  if (err.message.startsWith('Unauthorized:')) {
    res.status(403).json({
      error: 'Forbidden',
      message: err.message,
    });
    return;
  }

  if (err.message.includes('not found')) {
    res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
    return;
  }

  // Default to 500 internal server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
}

// Validation helper for required fields
export function validateRequired(
  body: Record<string, unknown>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Validation middleware factory
export function validateBody(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { valid, missing } = validateRequired(req.body, requiredFields);
    
    if (!valid) {
      res.status(400).json({
        error: 'Validation Error',
        message: `Missing required fields: ${missing.join(', ')}`,
      });
      return;
    }
    
    next();
  };
}

// UUID validation
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Validate UUID param middleware
export function validateUUIDParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id || !isValidUUID(id)) {
      res.status(400).json({
        error: 'Validation Error',
        message: `Invalid ${paramName}: must be a valid UUID`,
      });
      return;
    }
    
    next();
  };
}

// Parse pagination params
export function parsePagination(req: Request): { page: number; limit: number } {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  return { page, limit };
}
