import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onLogin: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  errors: Record<string, string>;
};

export default function RegisterForm({
  onLogin,
  onSubmit,
  errors,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <motion.form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(formData);
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Create account</h2>

      <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full border p-2 rounded" />
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

      <button className="w-full bg-indigo-600 text-white py-2 rounded">
        Continue
      </button>

      <p onClick={onLogin} className="text-sm text-indigo-600 cursor-pointer text-center">
        Already have an account? Login
      </p>
    </motion.form>
  );
}
