import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useContext } from "react";
import { carritoContext } from "../contexts/carritoContext";

const Verificacion = () => {
  const { datosUsuario } = useContext(carritoContext);
  const [ordenPedido, setOrdenPedido] = useState(null);
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const getDatos = async () => {
      try {
        const response = await fetch(`http://192.168.0.107/ped2/OrdenPedidos/view/${id}.json`);
        const data = await response.json();
        setOrdenPedido(data.ordenPedido);
      } catch (error) {
        console.error(error);
      }
    };

    getDatos();
  }, [id]);

  if (!ordenPedido) {
    return <div className="text-center">Loading...</div>;
  }

  const handleValidateItem = (itemId, newValue) => {
    // Actualizar el estado de validación del artículo en el estado local
    const updatedItems = ordenPedido.orden_items.map(item =>
      item.id === itemId ? { ...item, validado: parseInt(newValue) } : item
    );
    setOrdenPedido({ ...ordenPedido, orden_items: updatedItems });
  };
  const saveValidationChanges = async () => {
    // Mostrar SweetAlert para confirmar guardar cambios
    const { isConfirmed } = await Swal.fire({
      title: "¿Esta seguro de que desea Actualizar los Status de Validacion de los Items?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar"
    });

    if (isConfirmed) {
      try {
        const fecha = new Date().toISOString(); // Obtener la fecha actual en formato ISO 8601

        const data = {
          id: ordenPedido.id,
          orden_items: ordenPedido.orden_items.map(item => ({
            id: item.id,
            validado: item.validado,
           // fecha_validado: item.validado ? fecha : null,
            user_validado: datosUsuario.id
          }))
        };

        const response = await fetch(`http://192.168.0.107/ped2/OrdenPedidos/updateValidation`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          Swal.fire('¡Actualizado!', 'Los cambios han sido actualizados correctamente.', 'success');
          //console.log('Cambios guardados correctamente.');
          navigate('/IndexPage');
        } else {
          Swal.fire('¡Error!', 'Ha ocurrido un error al actualizar los cambios.', 'error');
          //console.error('Error al guardar los cambios.');
        }
      } catch (error) {
        Swal.fire('¡Error!', 'Ha ocurrido un error al enviar la solicitud.', 'error');
       // console.error('Error al enviar la solicitud:', error);
      }
    }
  };
  const handleBack = () => {
    navigate(-1); // Navega hacia atrás usando navigate con el valor -1
  };
  return (
    <div className="container py-4 " style={{ width: '80%' }}>
           <div className="d-flex justify-content-between align-items-center ">
            <button className="btn btn-light active border-success text-success" onClick={handleBack}>
              <i className="bx bx-arrow-back"></i> Regresar
            </button>
          </div>
    <div className='card border-success mt-1'  >
    <div className="card  text-center bg-success ">
    <h2 className="card-title text-center mb-0 py-1 text-white">Verificación de la Orden N° {ordenPedido.numero_ped}</h2>
    <div style={{ width: '120px' }}></div> {/* Espacio para ajuste */}
  </div>

  <div className="card-body">
  <div className='row py-2'>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Motivo:</strong> {ordenPedido.descripcion}</p>
    </div>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Solicitante:</strong> {ordenPedido.nombre}</p>
    </div>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Creado:</strong> {new Date(ordenPedido.created).toLocaleString()}</p>
    </div>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Status:</strong> {ordenPedido.Status_aprobada}</p>
    </div>
    <div className='col-md-3 col-lg-3 py-1'>
      <p className="card-text  mx-2"><strong>Tipo:</strong> {ordenPedido.tipo === 'P' ? ('Normal') : ('Navidad')}</p>
    </div>
  </div>
      <h4 className='text-center text-danger'>Articulos Pendientes de Verificar</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered table-condensed table-responsive text-center">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Vericacion</th>
            </tr>
          </thead>
          <tbody>
          {ordenPedido.orden_items
                .filter(item => item.validado == 0) // Filtrar solo los items con validado igual a 0 es decir los no validados
                .map(item => (
                    <tr key={item.id}>
                    <td>{item.articulo.codigo}</td>
                    <td>{item.articulo.descripcion}</td>
                    <td>{item.cantidad}</td>
                    <td>
                        <select
                        value={item.validado} // Valor actual de validado
                        onChange={(e) => handleValidateItem(item.id, e.target.value)} // Actualizar el estado al cambiar
                        >
                        <option value={0}>No verificado</option>
                        <option value={1}>Verificado</option>
                        </select>
                    </td>
                    </tr>
                ))}
          </tbody>
        </table>
      </div>
      </div>   

      <div className="card-footer text-center mt-4">
        <button className="btn btn-success mx-2" onClick={saveValidationChanges}>
          Actualizar
        </button>
        {/* Aquí podrías agregar los botones para exportar e imprimir si es necesario */}
      </div>
    </div>
    </div>
  );
};

export default Verificacion;
