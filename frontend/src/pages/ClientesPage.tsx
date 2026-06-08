import React, { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

interface Cliente {
  id_cliente: number;
  nombre: string;
  appaterno: string;
  apmaterno?: string;
  ci: string;
  telefono: string;
  zona: string;
}

export const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    appaterno: "",
    apmaterno: "",
    ci: "",
    telefono: "",
    zona: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [clienteEditando, setClienteEditando] = useState({
    id_cliente: 0,
    nombre: "",
    appaterno: "",
    apmaterno: "",
    ci: "",
    telefono: "",
    zona: "",
  });
  const [busqueda, setBusqueda] = useState("");
  const cargarClientes = async () => {
    try {
      const res = await API.get<Cliente[]>("/taller/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await API.get<Cliente[]>("/taller/clientes");
        setClientes(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    void cargarClientes();
  }, []);

  const crearCliente = async () => {
    try {
      await API.post("/taller/clientes", nuevoCliente);

      setNuevoCliente({
        nombre: "",
        appaterno: "",
        apmaterno: "",
        ci: "",
        telefono: "",
        zona: "",
      });

      await cargarClientes();
    } catch (error) {
      console.error("Error creando cliente:", error);
    }
  };

  const eliminarCliente = async (id: number) => {
    
    try {
      await API.delete(`/taller/clientes/${id}`);
      await cargarClientes();
    } catch (error) {
      console.error(error);
    }
  };
const confirmarEliminarCliente = async (id: number) => {
  const result = await Swal.fire({
    title: "¿Eliminar cliente?",
    text: "El cliente será dado de baja del sistema.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    await eliminarCliente(id);

    await Swal.fire({
      title: "Cliente eliminado",
      text: "El cliente fue dado de baja correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};
  const abrirModalEditar = (cliente: Cliente) => {
    setClienteEditando({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      appaterno: cliente.appaterno,
      apmaterno: cliente.apmaterno || "",
      ci: cliente.ci,
      telefono: cliente.telefono,
      zona: cliente.zona,
    });

    setMostrarModal(true);
  };

  const actualizarCliente = async () => {
    try {
      await API.patch(
        `/taller/clientes/${clienteEditando.id_cliente}`,
        clienteEditando,
      );

      await cargarClientes();

      setMostrarModal(false);
    } catch (error) {
      console.error("Error actualizando cliente:", error);
    }
  };
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      `${cliente.nombre} ${cliente.appaterno} ${cliente.apmaterno || ""}`
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      cliente.ci.toLowerCase().includes(busqueda.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Registrar Cliente</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nombre"
            className="border p-2 rounded"
            value={nuevoCliente.nombre}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                nombre: e.target.value,
              })
            }
          />

          <input
            placeholder="Apellido Paterno"
            className="border p-2 rounded"
            value={nuevoCliente.appaterno}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                appaterno: e.target.value,
              })
            }
          />

          <input
            placeholder="Apellido Materno"
            className="border p-2 rounded"
            value={nuevoCliente.apmaterno}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                apmaterno: e.target.value,
              })
            }
          />

          <input
            placeholder="CI"
            className="border p-2 rounded"
            value={nuevoCliente.ci}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                ci: e.target.value,
              })
            }
          />

          <input
            placeholder="Teléfono"
            className="border p-2 rounded"
            value={nuevoCliente.telefono}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                telefono: e.target.value,
              })
            }
          />

          <input
            placeholder="Zona"
            className="border p-2 rounded"
            value={nuevoCliente.zona}
            onChange={(e) =>
              setNuevoCliente({
                ...nuevoCliente,
                zona: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={() => void crearCliente()}
          className="mt-4 px-4 py-2 rounded bg-slate-800 text-white"
        >
          Registrar Cliente
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o CI..."
          className="w-full md:w-80 border rounded-lg p-2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">CI</th>
              <th className="p-3 text-left">Teléfono</th>
              <th className="p-3 text-left">Zona</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id_cliente} className="border-t">
                <td className="p-3">
                  {cliente.nombre} {cliente.appaterno}
                </td>

                <td className="p-3">{cliente.ci}</td>

                <td className="p-3">{cliente.telefono}</td>

                <td className="p-3">{cliente.zona}</td>

                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => abrirModalEditar(cliente)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      void confirmarEliminarCliente(cliente.id_cliente)
                    }
                    className="px-3 py-1 rounded bg-red-500 text-white"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>

            <div className="grid grid-cols-1 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Nombre"
                value={clienteEditando.nombre}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    nombre: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Apellido Paterno"
                value={clienteEditando.appaterno}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    appaterno: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Apellido Materno"
                value={clienteEditando.apmaterno}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    apmaterno: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="CI"
                value={clienteEditando.ci}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    ci: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Teléfono"
                value={clienteEditando.telefono}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    telefono: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Zona"
                value={clienteEditando.zona}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    zona: e.target.value,
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
                onClick={() => void actualizarCliente()}
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
