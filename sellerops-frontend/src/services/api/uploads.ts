const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UploadResponse = {
  message: string;
  upload_id: number;
  chat_id: string;
};

export type ProcessUploadResponse = {
  message: string;
  upload_id: number;
  task_id: string;
};

export type UploadStatusResponse = {
  upload_id: number;
  status: "pending" | "processing" | "completed" | "failed";
};

export const uploadCsv = async (chatId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/uploads/csv?chat_id=${chatId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as UploadResponse;
};

export const processUpload = async (uploadId: number) => {
  const res = await fetch(`${API_BASE_URL}/uploads/${uploadId}/process`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as ProcessUploadResponse;
};

export const getUploadStatus = async (uploadId: number) => {
  const res = await fetch(`${API_BASE_URL}/uploads/${uploadId}/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as UploadStatusResponse;
};
