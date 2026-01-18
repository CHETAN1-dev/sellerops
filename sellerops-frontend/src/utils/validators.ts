export const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordStrong = (password: string) =>
  password.length >= 8;
export const validateRegister = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!isEmailValid(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!isPasswordStrong(data.password)) {
    errors.password = "Password must be at least 8 characters";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
