import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import API from "../services/api"; // Nuestro puente conectado a NestJS

// 1. INTERFACE PARA ELIMINAR EL "ANY" Y CONFIGURAR LOS TIPOS STRICTOS
interface OrdenTrabajo {
  id_orden: number;
  id_vehiculo: number;
  id_mecanico: number;
  descripcion_falla: string;
  monto_total: number;
  estado: string;
  fecha_ingreso: string;
  vehiculo?: {
    placa: string;
    marca: string;
    modelo: string;
  };
}
interface Mecanico {
  id_usuario: number;
  nombre: string;
  appaterno: string;
}
const VehiclesPage = () => {
  // Estados de datos reales del backend
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);


  // Campos extendidos para cumplir con los requerimientos del Backend
  const [formData, setFormData] = useState({
    plate: "",
    description: "",
    id_mecanico: 1, // Por defecto asignado al primer mecánico de tu DB
    monto_total: 150, // Monto base de prueba en Bolivianos
  });
    

  const [errors, setErrors] = useState({ plate: "", description: "" });

  // 2. EFECTO PARA CARGAR LAS ÓRDENES REALES DESDE EL BACKEND AL ENTRAR A LA PÁGINA
  // ... (Tus estados de arriba se quedan igual)

  // 1. PRIMERO DECLARAMOS LA FUNCIÓN (Así evitamos el error de acceso antes de declarar)
  const cargarOrdenes = async () => {
    try {
      const respuesta = await API.get("/operaciones/ordenes");
      setOrdenes(respuesta.data as OrdenTrabajo[]);
    } catch (error) {
      // Usamos 'error' para que el linter no proteste que está sin usar
      console.error("Error cargando órdenes del taller:", error);
    }
  };

  // 2. SEGUNDO PONEMOS EL EFECTO QUE LA LLAMA
  // 2. SEGUNDO PONEMOS EL EFECTO ADAPTADO PARA LINTERS ULTRA ESTRICTOS
  useEffect(() => {
    let activo = true;

    const inicializarCargar = async () => {
      try {
        const respuesta = await API.get("/operaciones/ordenes");

        if (activo) {
          setOrdenes(respuesta.data as OrdenTrabajo[]);
        }

        const resMecanicos = await API.get<Mecanico[]>("/auth/mecanicos");

        if (activo) {
          setMecanicos(resMecanicos.data);
        }
      } catch (error) {
        console.error("Error cargando órdenes del taller:", error);
      }
    };

    void inicializarCargar();

    // Función de limpieza para asegurar que no haya fugas de memoria
    return () => {
      activo = false;
    };
  }, []);

  // 3. CAMBIAMOS 'let' POR 'const' PARA EVITAR EL REGANIO DEL LINTER
  const validate = () => {
    const tempErrors = { plate: "", description: "" }; // <-- Cambiado a const
    let isValid = true;

    if (!formData.plate.trim()) {
      tempErrors.plate = "La placa es obligatoria";
      isValid = false;
    } else if (formData.plate.length < 6) {
      tempErrors.plate = "Mínimo 6 caracteres";
      isValid = false;
    }

    if (formData.description.length < 10) {
      tempErrors.description = "Descripción demasiado corta (mín. 10)";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // 4. EL REPORTE PDF SE QUEDA IGUAL, SEGURO Y TIPADO
  const generatePDF = (orden: OrdenTrabajo) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("GESTION CHAPERIA - Orden de Servicio", 20, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 20, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Campo", "Detalle"]],
      body: [
        ["Nro Orden", String(orden.id_orden)],
        ["Placa", orden.vehiculo?.placa || "S/P"],
        [
          "Vehículo",
          `${orden.vehiculo?.marca || ""} ${orden.vehiculo?.modelo || ""}`,
        ],
        ["Descripción del Daño", orden.descripcion_falla],
        ["Costo (BS)", `${orden.monto_total} B$.`],
        ["Estado", orden.estado === "en_proceso" ? "En Proceso" : "Terminado"],
        ["Taller", "Central de Chapería y Pintura"],
      ],
    });

    doc.text("Firma del Cliente: ________________________", 20, 150);
    doc.save(`orden_${orden.vehiculo?.placa || "taller"}.pdf`);
  };
    // btn finalizar
const finalizarOrden = async (id: number) => {
  try {
    await API.put(`/operaciones/ordenes/${id}/finalizar`);

    // Recargar la tabla
    await cargarOrdenes();
  } catch (error) {
    console.error("Error finalizando orden:", error);
  }
};

  // 5. ENVÍO REAL ACTUALIZADO USANDO EL ERROR CORRECTAMENTE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorServidor("");

    if (validate()) {
      try {
        const resVehiculo = await API.get(
          `/taller/vehiculos/buscar/${formData.plate}`,
        );
        const id_vehiculo = Number(resVehiculo.data.id_vehiculo);

        await API.post("/operaciones/ordenes", {
          id_vehiculo: id_vehiculo,
          id_mecanico: formData.id_mecanico,
          descripcion_falla: formData.description,
          monto_total: Number(formData.monto_total),
        });

        setIsModalOpen(false);
        setFormData({
          plate: "",
          description: "",
          id_mecanico: 1,
          monto_total: 150,
        });
        void cargarOrdenes();
      } catch (error) {
        // Imprimimos el error en consola para que el linter esté feliz
        console.error("Detalle del error en el servidor:", error);
        setErrorServidor(
          "La placa no está registrada en el sistema. Registre al cliente primero.",
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Órdenes de Trabajo</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
        >
          + Nueva Orden
        </button>
      </div>

      {/* Tabla de Vehículos / Órdenes Dinámica */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Placa</th>
              <th className="p-4 font-semibold text-gray-600">Descripción</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-400 text-sm"
                >
                  No hay órdenes de trabajo activas en este momento.
                </td>
              </tr>
            ) : (
              ordenes.map((orden) => (
                <tr
                  key={orden.id_orden}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-mono font-bold text-blue-600">
                    {orden.vehiculo?.placa}
                  </td>
                  <td className="p-4 text-gray-700 text-sm">
                    {orden.descripcion_falla}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        orden.estado === "en_proceso"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {orden.estado === "en_proceso"
                        ? "En Proceso"
                        : "Terminado"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center space-x-4">
                      {/* Botón PDF Dinámico */}
                      <button
                        onClick={() => generatePDF(orden)}
                        className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center bg-green-50 px-2 py-1 rounded transition"
                      >
                        <Download size={16} className="mr-1" /> PDF
                      </button>
                      {orden.estado === "en_proceso" && (
                        <button
                          onClick={() => finalizarOrden(orden.id_orden)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold transition"
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Inserción */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Registrar Ingreso de Vehículo
            </h2>

            {errorServidor && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-xs mb-3 text-center font-medium">
                {errorServidor}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Placa / Matrícula
                </label>
                <input
                  type="text"
                  className={`w-full border rounded-lg p-2 mt-1 outline-none transition ${
                    errors.plate
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plate: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Ej: 1234-ABC"
                />
                {errors.plate && (
                  <p className="text-red-500 text-xs mt-1">{errors.plate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto del Servicio (B$)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 mt-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  value={formData.monto_total}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto_total: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mecánico Responsable
                </label>

                <select
                  className="w-full border rounded-lg p-2 mt-1 border-gray-300"
                  value={formData.id_mecanico}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_mecanico: Number(e.target.value),
                    })
                  }
                >
                  {mecanicos.map((mec) => (
                    <option key={mec.id_usuario} value={mec.id_usuario}>
                      {mec.nombre} {mec.appaterno}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Daño Detectado
                </label>
                <textarea
                  rows={3}
                  className={`w-full border rounded-lg p-2 mt-1 outline-none transition ${
                    errors.description
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describa el trabajo de chapa o pintura..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                >
                  Guardar Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
