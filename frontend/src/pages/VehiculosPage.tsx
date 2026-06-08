import React, { useEffect, useState } from "react";
import API from "../services/api";


interface Cliente {
  id_cliente: number;
  nombre: string;
  appaterno: string;
}

interface Vehiculo {
  id_vehiculo: number;
  id_cliente: number;

  placa: string;
  marca: string;
  modelo: string;
  color: string;

  cliente?: {
    nombre: string;
    appaterno: string;
  };
}

export const VehiculosPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    id_cliente: 0,
    placa: "",
    marca: "",
    modelo: "",
    color: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [vehiculoEditando, setVehiculoEditando] = useState({
    id_vehiculo: 0,
    id_cliente: 0,
    placa: "",
    marca: "",
    modelo: "",
    color: "",
  });
  const [busquedaVehiculo, setBusquedaVehiculo] = useState("");
  const cargarClientes = async () => {
    try {
      const res = await API.get<Cliente[]>("/taller/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const cargarVehiculos = async () => {
    try {
      const res = await API.get<Vehiculo[]>("/taller/vehiculos");
      setVehiculos(res.data);
    } catch (error) {
      console.error("Error cargando vehículos:", error);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarClientes();
      await cargarVehiculos();
    };

    void cargarDatos();
  }, []);

  const crearVehiculo = async () => {
    try {
      if (nuevoVehiculo.id_cliente === 0) {
        alert("Seleccione un cliente");
        return;
      }

      await API.post("/taller/vehiculos", nuevoVehiculo);

      setNuevoVehiculo({
        id_cliente: 0,
        placa: "",
        marca: "",
        modelo: "",
        color: "",
      });

      await cargarVehiculos();
    } catch (error) {
      console.error("Error creando vehículo:", error);
    }
  };

  const eliminarVehiculo = async (id: number) => {
    try {
      await API.delete(`/taller/vehiculos/${id}`);

      setVehiculos((prev) => prev.filter((v) => v.id_vehiculo !== id));
    } catch (error) {
      console.error("Error eliminando vehículo:", error);
    }
  };
  const abrirModalEditar = (vehiculo: Vehiculo) => {
    setVehiculoEditando({
      id_vehiculo: vehiculo.id_vehiculo,
      id_cliente: vehiculo.id_cliente,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
    });

    setMostrarModal(true);
  };
  const actualizarVehiculo = async () => {
    try {
      await API.patch(`/taller/vehiculos/${vehiculoEditando.id_vehiculo}`, {
        id_cliente: vehiculoEditando.id_cliente,
        placa: vehiculoEditando.placa,
        marca: vehiculoEditando.marca,
        modelo: vehiculoEditando.modelo,
        color: vehiculoEditando.color,
      });

      await cargarVehiculos();

      setMostrarModal(false);
    } catch (error) {
      console.error("Error actualizando vehículo:", error);
    }
  };
  const vehiculosFiltrados = vehiculos.filter(
    (vehiculo) =>
      vehiculo.placa.toLowerCase().includes(busquedaVehiculo.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(busquedaVehiculo.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(busquedaVehiculo.toLowerCase()) ||
      vehiculo.color.toLowerCase().includes(busquedaVehiculo.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Gestión de Vehículos
      </h1>

      {/* FORMULARIO */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Registrar Vehículo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="border p-2 rounded"
            value={nuevoVehiculo.id_cliente}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                id_cliente: Number(e.target.value),
              })
            }
          >
            <option value={0}>Seleccione un cliente</option>

            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre} {cliente.appaterno}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Placa"
            className="border p-2 rounded"
            value={nuevoVehiculo.placa}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                placa: e.target.value.toUpperCase(),
              })
            }
          />

          <input
            type="text"
            placeholder="Marca"
            className="border p-2 rounded"
            value={nuevoVehiculo.marca}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                marca: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Modelo"
            className="border p-2 rounded"
            value={nuevoVehiculo.modelo}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                modelo: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Color"
            className="border p-2 rounded"
            value={nuevoVehiculo.color}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                color: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={() => void crearVehiculo()}
          className="mt-4 px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700"
        >
          Registrar Vehículo
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="🔍 Buscar por placa, marca o modelo..."
          className="w-full md:w-80 border rounded-lg p-2"
          value={busquedaVehiculo}
          onChange={(e) => setBusquedaVehiculo(e.target.value)}
        />
      </div>
      {/* TABLA */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Placa</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-left">Modelo</th>
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Propietario</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {vehiculosFiltrados.map((vehiculo) => (
              <tr
                key={vehiculo.id_vehiculo}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3">{vehiculo.placa}</td>

                <td className="p-3">{vehiculo.marca}</td>

                <td className="p-3">{vehiculo.modelo}</td>

                <td className="p-3">{vehiculo.color}</td>

                <td className="p-3">
                  {vehiculo.cliente?.nombre} {vehiculo.cliente?.appaterno}
                </td>

                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => abrirModalEditar(vehiculo)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => void eliminarVehiculo(vehiculo.id_vehiculo)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No existen vehículos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Editar Vehículo</h2>

            <div className="grid gap-3">
              <select
                className="border p-2 rounded"
                value={vehiculoEditando.id_cliente}
                onChange={(e) =>
                  setVehiculoEditando({
                    ...vehiculoEditando,
                    id_cliente: Number(e.target.value),
                  })
                }
              >
                {clientes.map((cliente) => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre} {cliente.appaterno}
                  </option>
                ))}
              </select>

              <input
                className="border p-2 rounded"
                value={vehiculoEditando.placa}
                onChange={(e) =>
                  setVehiculoEditando({
                    ...vehiculoEditando,
                    placa: e.target.value.toUpperCase(),
                  })
                }
              />

              <input
                className="border p-2 rounded"
                value={vehiculoEditando.marca}
                onChange={(e) =>
                  setVehiculoEditando({
                    ...vehiculoEditando,
                    marca: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                value={vehiculoEditando.modelo}
                onChange={(e) =>
                  setVehiculoEditando({
                    ...vehiculoEditando,
                    modelo: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                value={vehiculoEditando.color}
                onChange={(e) =>
                  setVehiculoEditando({
                    ...vehiculoEditando,
                    color: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={() => void actualizarVehiculo()}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
