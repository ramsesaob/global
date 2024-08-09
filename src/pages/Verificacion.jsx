import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useContext } from "react";
import { carritoContext } from "../contexts/carritoContext";
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://psyauluoyjvrscijcafn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU';
const supabase = createClient(supabaseUrl, supabaseKey);

const Verificacion = () => {
  const { datosUsuario } = useContext(carritoContext);
  const [ordenPedido, setOrdenPedido] = useState(null);
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const getDatos = async () => {
      try {
        const response = await fetch(`https://psyauluoyjvrscijcafn.supabase.co/rest/v1/orden_pedidos?id=eq.${id}&select=id,numero_ped,user_id,descripcion,enviada,status_aprobado,aprobada,created,modified,anulada,fecha_anulada,tipo,users(id,username,role,status,nombre,departamento,cargo,cedula,created,modified,sucursale_id,sucursales(id,codigo,descripcion,nombre,ciudad,cliente,numero_id,direccion)),orden_items(id,articulo_id,created,modified,orden_pedido_id,comentario,cantidad,validado,fecha_validado,user_validado,articulos(id,departamento,categoria,codigo,descripcion,cantidad,cod_departamento,unidad_compra,empaque))`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
          },
        });
        const data = await response.json();
        setOrdenPedido(data[0]);

        // Inicializar DataTable después de obtener los datos
        if (!$.fn.DataTable.isDataTable('#table_id')) {
          $('#table_id').DataTable({
            responsive: true,
            paging: false,
            info: false,
            searching: false,
            ordering: false,
          });
        }

      } catch (error) {  
      //  console.error('Error fetching data:', error);  
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
  const updateValidation = async (data) => {
    const fechaActual = new Date().toISOString();
  
    const { orden_items, id } = data;
  
    let validada = true;
    let semivalidada = false;
  
    try {
      // Actualizar los artículos
      for (const item of orden_items) {
        const { error: updateItemError } = await supabase
          .from('orden_items')
          .update({
            validado: item.validado,
            fecha_validado: item.validado ? fechaActual : null,
            user_validado: item.user_validado,
          })
          .eq('id', item.id);
  
        if (updateItemError) throw updateItemError;
  
        if (!item.validado) {
          validada = false;
        } else {
          semivalidada = true;
        }
      }
  
      // Determinar el estado general
      let statusAprobada = 'Pendiente';
      if (validada) {
        statusAprobada = 'Procesada';
      } else if (semivalidada) {
        statusAprobada = 'Parcialmente';
      }
  
      // Actualizar la orden
      const { error: updateOrderError } = await supabase
        .from('orden_pedidos')
        .update({ status_aprobado: statusAprobada })
        .eq('id', id);
  
      if (updateOrderError) throw updateOrderError;
  
      return { message: 'Cambios guardados correctamente' };
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  };
  const saveValidationChanges = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Está seguro de que desea actualizar los estados de validación de los ítems?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar"
    });
  
    if (isConfirmed) {
      try {
        const data = {
          id: ordenPedido.id,
          orden_items: ordenPedido.orden_items.map(item => ({
            id: item.id,
            validado: item.validado,
            user_validado: datosUsuario.id
          }))
        };
  
        const response = await updateValidation(data);
  
        if (response.message === 'Cambios guardados correctamente') {
          Swal.fire('¡Actualizado!', 'Los cambios han sido actualizados correctamente.', 'success');
          navigate('/IndexPage');
        } else {
          Swal.fire('¡Error!', 'Ha ocurrido un error al actualizar los cambios.', 'error');
        }
      } catch (error) {
        Swal.fire('¡Error!', 'Ha ocurrido un error al enviar la solicitud.', 'error');
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
      <p className="card-text  mx-2"><strong>Motivo:</strong> 
                          {ordenPedido.descripcion === '1' ? 'Alta Rotación' :
                          ordenPedido.descripcion === '2' ? 'Ventas al por mayor' :
                          ordenPedido.descripcion === '3' ? 'Ventas de Clientes Especiales' :
                          'Descripción desconocida'} {/* Opcional */}
                        </p>
    </div>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Solicitante:</strong> {ordenPedido.users.nombre}</p>
    </div>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Creado:</strong> {new Date(ordenPedido.created).toLocaleString()}</p>
    </div>
    <div className='col-md-3 col-lg-3'>
      <p className="card-text  mx-2"><strong>Status:</strong> {ordenPedido.status_aprobado}</p>
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
                    <td>{item.articulos.codigo}</td>
                    <td>{item.articulos.descripcion}</td>
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
