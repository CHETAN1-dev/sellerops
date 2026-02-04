import { apiRequest } from "./api";

/* -------- REGISTER -------- */
export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<{ message: string }>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* -------- VERIFY OTP -------- */
export function verifyOtp(data: {
  email: string;
  otp: string;
}) {
  return apiRequest<{ message: string }>(`/auth/verify-otp`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* -------- LOGIN -------- */
export function loginUser(data: {
  email: string;
  password: string;
}) {
  return apiRequest<{
    access_token: string;
    refresh_token: string;
  }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
