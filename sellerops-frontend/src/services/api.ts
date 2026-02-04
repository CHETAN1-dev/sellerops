const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export  async function apiRequest<T>(
  path: string,
  options: RequestInit
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_BASE_URL}${path}`, {
   
headers: {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
},
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Something went wrong");
  }

  return res.json();
}