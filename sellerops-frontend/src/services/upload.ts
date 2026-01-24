export async function uploadCsv(file: File) {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/uploads/csv", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ THIS WAS MISSING
    },
    body: formData, // ✅ no Content-Type
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

