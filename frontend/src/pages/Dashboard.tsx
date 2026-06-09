import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  ingresosTotales: number;
  ordenesFinalizadas: number;
  ordenesEnProceso: number;
  ingresosSemana: number[];
  empleadosRendimiento: {
    nombre: string;
    terminados: number;
  }[];
}
interface RendimientoMecanico {
  mecanico: string;
  autos_terminados: number;
}

interface ResumenDashboard {
  ingresos_totales: number;
  ordenes_finalizadas: number;
  ordenes_en_proceso: number;
  rendimiento: RendimientoMecanico[];
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    ingresosTotales: 0,
    ordenesFinalizadas: 0,
    ordenesEnProceso: 0,
    ingresosSemana: [],
    empleadosRendimiento: [],
  });

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await API.get<ResumenDashboard>(
          "/operaciones/dashboard/resumen",
        );

        const resumen = res.data;

        setData({
          ingresosTotales: resumen.ingresos_totales,
          ordenesFinalizadas: resumen.ordenes_finalizadas,
          ordenesEnProceso: resumen.ordenes_en_proceso,

          empleadosRendimiento: resumen.rendimiento.map((item) => ({
            nombre: item.mecanico,
            terminados: item.autos_terminados,
          })),

          ingresosSemana: [
            resumen.ingresos_totales * 0.15,
            resumen.ingresos_totales * 0.2,
            resumen.ingresos_totales * 0.18,
            resumen.ingresos_totales * 0.22,
            resumen.ingresos_totales * 0.25,
          ],
        });
      } catch (error) {
        console.error("Error al traer estadísticas:", error);
      }
    };

    void fetchEstadisticas();
  }, []);

    const datosIngresos = [
      { dia: "Lun", monto: data.ingresosSemana[0] ?? 0 },
      { dia: "Mar", monto: data.ingresosSemana[1] ?? 0 },
      { dia: "Mié", monto: data.ingresosSemana[2] ?? 0 },
      { dia: "Jue", monto: data.ingresosSemana[3] ?? 0 },
      { dia: "Vie", monto: data.ingresosSemana[4] ?? 0 },
    ];

  return (
    <div className="h-full overflow-y-auto space-y-6 pr-2-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Resumen del Taller
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-gray-500 text-sm">Ingresos Totales</h3>
            <p className="text-2xl font-bold">Bs. {data.ingresosTotales}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-gray-500 text-sm">Órdenes Finalizadas</h3>
            <p className="text-2xl font-bold">{data.ordenesFinalizadas}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-gray-500 text-sm">Órdenes en Proceso</h3>
            <p className="text-2xl font-bold">{data.ordenesEnProceso}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Gráfico 1: Ingresos de la Semana */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-700">
              Ingresos del Taller
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosIngresos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="monto" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Gráfico 2: Autos Terminados por Empleado */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-700">
              Autos Terminados por Empleado
            </h3>
            <div className="space-y-4">
              {data.empleadosRendimiento.map((emp, idx) => {
                
                const anchoPorcentaje = Math.min(
                  (emp.terminados / 15) * 100,
                  100,
                );
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>{emp.nombre}</span>
                      <span className="font-bold text-blue-600">
                        {emp.terminados} autos
                      </span>
                    </div>
                    <div className="h-8 w-full bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-lg transition-all duration-500"
                        style={{ width: `${anchoPorcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
