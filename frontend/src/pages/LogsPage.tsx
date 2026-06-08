import React, { useEffect, useState } from "react";
import API from "../services/api";

interface LogAcceso {
  id_log: number;
  ip: string;
  evento: string;
  browser: string;
  fecha_hora: string;

  usuario?: {
    username: string;
    nombre: string;
    appaterno: string;
  };
}

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogAcceso[]>([]);

  useEffect(() => {
    const cargarLogs = async () => {
      try {
        const res = await API.get<LogAcceso[]>("/auth/logs-accesos");
        setLogs(res.data);
      } catch (error) {
        console.error("Error al cargar logs:", error);
        // Fallback idéntico a tu captura
        // setLogs([
        //   {
        //     id_log: 1,
        //     username: "admin_chaperia",
        //     fecha: "2026-04-15 a las 08:30:12",
        //     ip: "192.168.1.45",
        //     navegador: "Chrome / Windows 11",
        //     tipo: "INGRESO",
        //   },
        //   {
        //     id_log: 2,
        //     username: "juan_perez",
        //     fecha: "2026-04-15 a las 10:15:45",
        //     ip: "181.120.45.10",
        //     navegador: "Safari / iPhone 15",
        //     tipo: "SALIDA",
        //   },
        //   {
        //     id_log: 3,
        //     username: "Ribaldo",
        //     fecha: "2026-03-15 a las 10:15:45",
        //     ip: "181.120.45.10",
        //     navegador: "chrome / Poco X5 pro",
        //     tipo: "SALIDA",
        //   },
        // ]);
      }
    };
    void cargarLogs();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Historial de Accesos
      </h2>

      {/* SOLO ESTA PARTE SCROLLEA */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
          {logs.map((log) => (
            <div
              key={log.id_log}
              className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
            >
              {/* Nodo de la línea de tiempo */}
              <div
                className={`absolute -left-[31px] top-6 w-3 h-3 rounded-full border-2 border-white shadow ${
                  log.evento === "INGRESO" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    Usuario: {log.usuario?.nombre} {log.usuario?.appaterno}
                  </h4>
                  <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                    {log.fecha_hora}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    log.evento === "INGRESO"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {log.evento.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <span>🌐</span>
                  <span>
                    <strong>IP:</strong> {log.ip}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span>💻</span>
                  <span className="truncate">
                    <strong>Navegador:</strong> {log.browser}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
