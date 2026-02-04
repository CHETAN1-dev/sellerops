import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



type Props = {
  onRegister: () => void;
};

export default function LoginForm({ onRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    alert("Invalid credentials");
    return;
  }

  const data = await res.json();

  // ✅ SAVE TOKEN
  localStorage.setItem("access_token", data.access_token);

  // ✅ REDIRECT
  navigate("/home");
};

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />

      <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-2 rounded">
        Login
      </button>

      <p onClick={onRegister} className="text-sm text-indigo-600 cursor-pointer text-center">
        Create an account
      </p>
    </motion.div>
  );
}

