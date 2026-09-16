const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sanitizeInput(input: string, maxLength = 5000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, "");
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters." };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password must be under 128 characters." };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain a lowercase letter.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain an uppercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain a number." };
  }
  return { valid: true };
}

export function validateName(name: string): boolean {
  return name.length >= 1 && name.length <= 200;
}

export function validateRating(rating: number | null): boolean {
  if (rating === null) return true;
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function validateStatus(
  status: string,
  allowed: readonly string[],
): boolean {
  return (allowed as readonly string[]).includes(status);
}
