import { prisma } from '@/lib/prisma';
import { AuditActionType } from '@prisma/client';
import { Prisma } from '@prisma/client'; // Import Prisma namespace for JsonValue
import logger from '@/lib/utils/logger';

interface CreateAuditLogParams {
  userId?: string | null;
  userEmail?: string | null;
  action: AuditActionType;
  targetEntityType?: string | null;
  targetEntityId?: string | null;
  details?: Prisma.JsonValue | null; // Use Prisma.JsonValue for type safety
}

/**
 * Creates an audit log entry in the database.
 * Handles errors gracefully by logging them without crashing the primary operation.
 */
export async function createAuditLog({
  userId,
  userEmail,
  action,
  targetEntityType,
  targetEntityId,
  details,
}: CreateAuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        userEmail: userEmail ?? null,
        action,
        targetEntityType: targetEntityType ?? null,
        targetEntityId: targetEntityId ?? null,
        details: details ?? Prisma.JsonNull, // Use Prisma.JsonNull for null JSON
      },
    });
    logger.info(`Audit log created: User ${userId || 'System'} performed ${action} on ${targetEntityType || 'N/A'}:${targetEntityId || 'N/A'}`);
  } catch (error) {
    // Log the error but don't let it crash the main operation
    logger.error('Failed to create audit log:', {
      error,
      userId,
      action,
      targetEntityId,
    });
  }
} 