import { Request, Response, NextFunction } from 'express';
import { AuthContext } from '../types/index.js';

// Extend Express Request to include auth context
declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

/**
 * Auth Hook Middleware
 * 
 * This is a STUB for enterprise auth integration.
 * In production, replace this with your actual auth provider
 * (e.g., JWT validation, OAuth, SAML, enterprise SSO)
 * 
 * The middleware should:
 * 1. Validate the auth token/session
 * 2. Populate req.auth with user context
 * 3. Call next() if authenticated
 * 4. Return 401 if not authenticated
 */
export function authHook(req: Request, res: Response, next: NextFunction): void {
  // STUB: For development, check for a mock auth header
  const authHeader = req.headers.authorization;
  const mockUserId = req.headers['x-user-id'] as string;
  const mockEmail = req.headers['x-user-email'] as string;
  const mockDisplayName = req.headers['x-user-name'] as string;
  const mockDepartmentId = req.headers['x-department-id'] as string;

  if (mockUserId && mockEmail && mockDisplayName) {
    // Development mode: accept mock headers
    req.auth = {
      userId: mockUserId,
      email: mockEmail,
      displayName: mockDisplayName,
      departmentId: mockDepartmentId || undefined,
    };
    next();
    return;
  }

  // In production, validate actual auth token here
  // Example with JWT:
  // try {
  //   const token = authHeader?.replace('Bearer ', '');
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.auth = {
  //     userId: decoded.sub,
  //     email: decoded.email,
  //     displayName: decoded.name,
  //     departmentId: decoded.department_id,
  //   };
  //   next();
  // } catch (error) {
  //   res.status(401).json({ error: 'Unauthorized' });
  // }

  res.status(401).json({ 
    error: 'Unauthorized',
    message: 'Missing authentication. Provide X-User-Id, X-User-Email, and X-User-Name headers for development.',
  });
}

/**
 * Optional auth middleware - populates auth if present but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const mockUserId = req.headers['x-user-id'] as string;
  const mockEmail = req.headers['x-user-email'] as string;
  const mockDisplayName = req.headers['x-user-name'] as string;
  const mockDepartmentId = req.headers['x-department-id'] as string;

  if (mockUserId && mockEmail && mockDisplayName) {
    req.auth = {
      userId: mockUserId,
      email: mockEmail,
      displayName: mockDisplayName,
      departmentId: mockDepartmentId || undefined,
    };
  }

  next();
}
