import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const nombreUsuario = localStorage.getItem("user_name") || "Admin del Taller";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const rol = localStorage.getItem("user_rol");

  const menuItems = [
    { name: "Panel de Control", path: "/dashboard", icon: "" },

    { name: "Órdenes de Trabajo", path: "/vehicles", icon: "" },

    { name: "Registrar Clientes", path: "/clientes", icon: "" },

    { name: "Registrar Vehículos", path: "/vehiculos", icon: "" },

    ...(rol === "admin"
      ? [
          {
            name: "Historial de Accesos",
            path: "/logs",
            icon: "",
          },
          {
            name: "Registrar Personal",
            path: "/register",
            icon: "",
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 h-full bg-slate-900 text-white flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2 pb-6 border-b border-slate-800 mb-6">
            <span className="text-2xl">🚗</span>
            <div>
              <h1 className="text-sm font-black tracking-wider uppercase">
                Gestión Chapería
              </h1>
              <p className="text-[10px] text-slate-400 font-bold">
                CHAPERÍA & PINTURA
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                    isActive
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* USER */}
        <div className="space-y-4 border-t border-slate-800 pt-4">
          <div className="bg-slate-800/40 p-3 rounded-lg text-xs">
            <span className="block text-[9px] font-bold text-slate-500 uppercase">
              Sesión Activa
            </span>
            <span className="font-semibold text-slate-300 block truncate">
              {nombreUsuario}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-2 text-sm text-red-400 hover:text-red-300 px-2 py-1 font-semibold transition"
          >
            
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        {/* HEADER FIJO */}
        <header className="h-16 flex-shrink-0 bg-slate-900 shadow-sm border-b border-gray-100 flex items-center justify-end px-8">
          <span className="text-xs font-semibold text-white">
            Bienvenido,{""}
            <strong className="text-white-900">{nombreUsuario}</strong>
          </span>
        </header>

        {/* CONTENIDO CON SCROLL ÚNICO */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
