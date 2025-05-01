import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createApiError } from '../utils/api';

export type AuthorizedRoles = 'ADMIN' | 'PROVIDER' | 'STAFF' | '*';

type RouteHandler = (
  request: NextRequest,
  context: { params: { [key: string]: string } }
) => Promise<NextResponse>;

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export const withAuth = (handler: RouteHandler, allowedRoles: string[] = ['*']) => {
  return async (request: NextRequest, context: { params: { [key: string]: string } }) => {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (allowedRoles[0] !== '*' && !allowedRoles.includes(token.role as string)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      return handler(request, context);
    } catch (err) {
      console.error('Auth middleware error:', isError(err) ? err.message : 'Unknown error');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
};

export function validateRequestBody<T>(
  data: unknown,
  validator: (data: unknown) => T
): T {
  try {
    return validator(data);
  } catch (error) {
    throw createApiError(`Invalid request body: ${error.message}`, 400);
  }
} 