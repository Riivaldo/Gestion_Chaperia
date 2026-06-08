import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

interface LoginResponse {
  token: string;
  user: {
    id_usuario: number;
    nombre: string;
    rol: string;
    username: string;
  };
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // CAPTCHA
  const [captchaA] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [captchaB] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [captchaRespuesta, setCaptchaRespuesta] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !captchaRespuesta) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    // Validación CAPTCHA
    if (Number(captchaRespuesta) !== captchaA + captchaB) {
      setError("Captcha incorrecto.");
      return;
    }

    try {
      const response = await API.post<LoginResponse>("/auth/login", {
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user_rol", user.rol);
      localStorage.setItem("user_name", user.nombre);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Nombre de usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-wide text-blue-600">
          GESTIÓN CHAPERÍA
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* CAPTCHA */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ¿Cuánto es {captchaA} + {captchaB}?
            </label>

            <input
              type="number"
              placeholder="Respuesta"
              value={captchaRespuesta}
              onChange={(e) => setCaptchaRespuesta(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-slate-400 p-3 font-semibold text-white transition hover:bg-slate-500"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};
