// export const uploadCsv = async (chatId: string, file: File) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch(
//     `http://localhost:8000/uploads/csv?chat_id=${chatId}`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//       },
//       body: formData,
//     }
//   );

//   if (!res.ok) {
//     throw new Error(await res.text());
//   }

//   return res.json();
// };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadCsv = async (chatId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE_URL}/uploads/csv?chat_id=${chatId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};
