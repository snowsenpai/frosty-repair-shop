type DbErrorCause = {
  code?: string;
  constraint?: string;
};

type ConstraintMessageMap = Record<string, (value: string) => string>;

/**
 * Handles PostgreSQL unique constraint violations (code 23505)
 * and throws user-friendly error messages.
 *
 * @param error - The caught error from a database operation
 * @param constraintMessages - Map of constraint names to message functions
 * @param values - Map of field names to their values for the error message
 * @throws Always throws - either a user-friendly error or the original error
 */
export function handleUniqueConstraintError(
  error: unknown,
  constraintMessages: ConstraintMessageMap,
  values: Record<string, string>
): never {
  if (!(error instanceof Error) || !('cause' in error)) {
    throw error;
  }

  const cause = error.cause as DbErrorCause;

  if (cause?.code !== '23505') {
    throw error;
  }

  // Check for specific constraint match
  const constraint = cause.constraint;
  if (constraint && constraintMessages[constraint]) {
    // Extract field name from constraint (e.g., "customers_email_unique" -> "email")
    const fieldName = constraint.replace(/_unique$/, '').split('_').pop() ?? '';
    const value = values[fieldName] ?? '';
    throw new Error(constraintMessages[constraint](value));
  }

  throw new Error('A record with this information already exists.');
}
