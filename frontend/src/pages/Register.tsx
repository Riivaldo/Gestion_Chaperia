import React, { useState } from "react";
import API from "../services/api";

export const Register: React.FC = () => {
  // Estados para todos los campos
  const [nombre, setNombre] = useState("");
  const [appaterno, setAppaterno] = useState("");
  const [apmaterno, setApmaterno] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ci, setCi] = useState("");
  const [rol, setRol] = useState("mecanico_chaperia");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validaciones en tiempo real
  const [errors, setErrors] = useState({
    ci: "",
    username: "",
    password: "",
  });

  const validateCI = (ciValue: string) => {
    if (!/^\d+$/.test(ciValue)) {
      setErrors((prev) => ({
        ...prev,
        ci: "El CI solo debe contener números",
      }));
      return false;
    }
    if (ciValue.length > 20) {
      setErrors((prev) => ({
        ...prev,
        ci: "El CI no puede tener más de 20 dígitos",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, ci: "" }));
    return true;
  };

  const validateUsername = (usernameValue: string) => {
    if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
      setErrors((prev) => ({
        ...prev,
        username: "Solo letras, números y guión bajo",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, username: "" }));
    return true;
  };

  const validatePassword = (passwordValue: string) => {
    if (passwordValue.length > 0 && passwordValue.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Mínimo 6 caracteres" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    // Validaciones completas
    if (!nombre || !appaterno || !username || !password || !ci) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (!/^\d+$/.test(ci)) {
      setError("El CI solo debe contener números");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/registrar", {
        nombre,
        appaterno,
        apmaterno: apmaterno || null,
        username,
        password,
        ci,
        rol,
      });

      console.log("Usuario registrado:", response.data);
      setSuccess("¡Usuario registrado exitosamente!");

      // Limpiar formulario
      setNombre("");
      setAppaterno("");
      setApmaterno("");
      setUsername("");
      setPassword("");
      setCi("");
      setRol("mecanico_chaperia");
    } catch (error: unknown) {
      console.error("Error completo:", error);

      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      // Mostrar mensajes específicos del backend
      if (apiError.response?.data?.message) {
        const mensaje = apiError.response.data.message;
        if (mensaje.includes("username")) {
          setError("El nombre de usuario ya está registrado");
        } else if (mensaje.includes("CI")) {
          setError("El CI ya está registrado en el sistema");
        } else {
          setError(mensaje);
        }
      } else {
        setError("Error al registrar usuario. Intente nuevamente");
      }
    } finally {
      setLoading(false);
    }
  };

  const seguridadPassword = () => {
    if (!password) return { texto: "", color: "bg-gray-200", ancho: "w-0" };
    if (password.length < 6)
      return { texto: "Muy débil", color: "bg-red-500", ancho: "w-1/3" };
    if (password.length < 10)
      return { texto: "Media", color: "bg-yellow-500", ancho: "w-2/3" };
    return { texto: "Segura", color: "bg-emerald-500", ancho: "w-full" };
  };

  const seguridad = seguridadPassword();

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-gray-100 shadow-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Registrar Nuevo Usuario
        </h3>

        {success && (
          <div className="mb-4 bg-emerald-50 text-emerald-600 text-sm p-3 rounded border border-emerald-100">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded border border-red-100">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Fila 1: Nombre y Apellido Paterno */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Nombre *
              </label>
              <input
                type="text"
                placeholder="Ej: Juan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Apellido Paterno *
              </label>
              <input
                type="text"
                placeholder="Ej: Pérez"
                value={appaterno}
                onChange={(e) => setAppaterno(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Fila 2: Apellido Materno */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Apellido Materno (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: González"
              value={apmaterno}
              onChange={(e) => setApmaterno(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Fila 3: Username y CI */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Username *
              </label>
              <input
                type="text"
                placeholder="Ej: juan_perez"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                className={`w-full border rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                CI *
              </label>
              <input
                type="text"
                placeholder="Ej: 1234567"
                value={ci}
                onChange={(e) => {
                  setCi(e.target.value);
                  validateCI(e.target.value);
                }}
                className={`w-full border rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.ci ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.ci && (
                <p className="text-red-500 text-xs mt-1">{errors.ci}</p>
              )}
            </div>
          </div>

          {/* Fila 4: Contraseña y Rol */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className={`w-full border rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Seguridad:</span>
                    <span className="text-slate-600">{seguridad.texto}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${seguridad.color} ${seguridad.ancho}`}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Rol *
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:border-blue-500"
                required
              >
                <option value="mecanico_chaperia">Mecánico - Chapería</option>
                <option value="mecanico_pintura">Mecánico - Pintura</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrar Usuario"}
            </button>
            <button
              type="button"
              onClick={() => {
                setNombre("");
                setAppaterno("");
                setApmaterno("");
                setUsername("");
                setPassword("");
                setCi("");
                setRol("mecanico_chaperia");
                setError("");
                setSuccess("");
              }}
              className="w-full bg-gray-600 text-white font-bold py-2.5 rounded-lg hover:bg-gray-700 shadow-sm transition"
            >
              Limpiar Formulario
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">* Campos obligatorios</p>
        </form>
      </div>
    </div>
  );
};
