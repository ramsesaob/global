import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logo2 from '../assets/logo3.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { carritoContext } from "../contexts/carritoContext";
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://psyauluoyjvrscijcafn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU';
const supabase = createClient(supabaseUrl, supabaseKey);

const Formulario = () => {
  const location = useLocation();
  const { datosUsuario } = useContext(carritoContext);
  const [productosnav, setProductos] = useState(() => {
  const savedProducts = localStorage.getItem('productosnav');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [errorDescripcion, setErrorDescripcion] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [motivoSeleccionado, setMotivoSeleccionado] = useState('');
  const Api = 'https://psyauluoyjvrscijcafn.supabase.co/rest/v1/numped?select=*';
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setFechaCreacion(formattedDate);
  }, []);

  useEffect(() => {
    const storedProductos = JSON.parse(localStorage.getItem('productosnav')) || [];
    setProductos(storedProductos);
  }, []);

  useEffect(() => {
    localStorage.setItem('productosnav', JSON.stringify(productosnav));
  }, [productosnav]);

 
  const handleSearchSerial = async (index) => {
    try {
      const serial = productosnav[index].serial;
      const { id, descripcion, empaque } = await buscarDescripcion(serial);

      setProductos(prevProductos => {
        const updatedProductos = [...prevProductos];
        updatedProductos[index] = {
          ...updatedProductos[index],
          descripcion: descripcion,
          id: id,
          empaque: empaque,
        };
        return updatedProductos;
      });

      setErrorDescripcion('');

    } catch (error) {
      console.error("Error al buscar la descripción del producto:", error);
      setErrorDescripcion('Descripción no encontrada');
    }
  };
  const buscarDescripcion = async (serial) => {
    try {
      const response = await fetch(`https://psyauluoyjvrscijcafn.supabase.co/rest/v1/serialnav?codigo=eq.${serial}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU', // Reemplaza con tu clave pública de Supabase
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU', // Reemplaza con tu token de autorización
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
     // console.log('Datos recibidos:', data); // Imprime los datos para depuración
  
      if (!data || data.length === 0) {
        throw new Error("Descripción no encontrada");
      }
  
      const primerArticulo = data[0]; // Se espera un array de artículos, no un objeto con una propiedad 'articulos'
      return {
        id: primerArticulo.id,
        descripcion: primerArticulo.descripcion,
        empaque: primerArticulo.empaque,
      };
  
    } catch (error) {
      console.error('Error al obtener el total de registros:', error);
      throw error;
    }
  };
  



  const handleProductChange = (index, event, field) => {
    const updatedProducts = [...productosnav];
    let value = event.target.value;
  
    // Validar que no se ingresen puntos en lugar de comas
    if (value.includes('.')) {
      value = value.replace('.', ',');
    }
  
    // Reemplazar comas por puntos para uniformidad
    value = value.replace(',', '.');
  
    // Permitir que el usuario siga escribiendo decimales después de la coma
    updatedProducts[index][field] = value;
  
    setProductos(updatedProducts);
  };
  
 
  const agregarProducto = () => {
    const nuevoProducto = { serial: '', descripcion: '', cantidad: '' };
    setProductos([...productosnav, nuevoProducto]);
  };

  const eliminarProducto = (index) => {
    const updatedProducts = productosnav.filter((_, i) => i !== index);
    setProductos(updatedProducts);
  };

  const getNextNumeroPed = () => {
    if (datos.length > 0) {
      const maxNumeroPed = Math.max(...datos.map(item => parseInt(item.numero_ped)));
      return maxNumeroPed + 1;
    } else {
      return 1;
    }
  };

  const handleMotivoChange = (e) => {
    setMotivoSeleccionado(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const isValid = productosnav.every(producto => {
      const cantidad = parseFloat(producto.cantidad);
      const empaque = parseFloat(producto.empaque);
      if (!cantidad || cantidad < empaque) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `La cantidad mínima para "${producto.descripcion}" es ${empaque.toFixed(2)}`, 
        });
        return false;
      } else if (cantidad % empaque !== 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `La cantidad debe ser un múltiplo de ${empaque.toFixed(2)} para "${producto.descripcion}"`,
        });
        return false;
      }
      return true;
    });
  
    if (!isValid) return;
  
    Swal.fire({
      title: "¿Desea guardar los cambios?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Inserta una nueva orden de pedido
          const postResponse = await fetch('https://psyauluoyjvrscijcafn.supabase.co/rest/v1/orden_pedidos', {
            method: 'POST',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
              'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              user_id: datosUsuario.id,
              numero_ped: getNextNumeroPed(),
              descripcion: motivoSeleccionado,
              anulada: 1,
              tipo: 'N',
              status_aprobado: 'Pendiente' ,
              created: new Date().toISOString().slice(0, 19).replace('T', ' '),
            })
          });
  
          if (!postResponse.ok) {
            throw new Error(`HTTP error! Status: ${postResponse.status}`);
          }
  
          const postResponseText = await postResponse.text();
          const ordenPedido = postResponseText ? JSON.parse(postResponseText) : [];
  
          if (ordenPedido && ordenPedido.length > 0) {
            const ordenPedidoId = ordenPedido[0].id;
  
            // Inserta los artículos asociados
            const itemsResponse = await fetch('https://psyauluoyjvrscijcafn.supabase.co/rest/v1/orden_items', {
              method: 'POST',
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(productosnav.map(producto => ({
                orden_pedido_id: ordenPedidoId,
                articulo_id: producto.id,
                cantidad: producto.cantidad,
                comentario: producto.comentario || '',
                validado: '0'
              })))
            });
  
            if (!itemsResponse.ok) {
              throw new Error(`HTTP error! Status: ${itemsResponse.status}`);
            }
  
          //  console.log('Datos enviados correctamente');
            setProductos([]);
            localStorage.removeItem('productosnav');
            navigate('/IndexPage');
          } else {
            console.log('Datos de la respuesta POST no están completos.');
          }
        } catch (error) {
          console.error('Error al enviar o recuperar los datos:', error);
          if (error instanceof SyntaxError) {
            console.error('La respuesta no es un JSON válido');
          }
        }
      }
    });
  };
  
  
  const getDatos = async () => {
    try {
      const response = await fetch('https://psyauluoyjvrscijcafn.supabase.co/rest/v1/numped?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU',
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setDatos(data); // Ajusta esto según la estructura de datos que esperas
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    getDatos();
  }, [getNextNumeroPed]);
  
  const navidad = {
    background: '#BBD2C5',  /* fallback for old browsers */

}

  return (
    <form onSubmit={handleSubmit} style={navidad}>
      <div className='container' >
        <div className='py-1 col-12'>
          <div className="d-flex justify-content-between">
            <div>
              <img src={logo2} alt="garantia" width={50} className='rounded mx-1'/>
            </div>
            <div>
              <h3 className="py-2 text-center text-danger"> Solicitud de Reposición de Navidad </h3>
            </div>
            <div>
              <img src={logo2} alt="garantia" className='rounded mx-1' width={50} />
            </div>
          </div>
          <div className='row'>
            <h6>(*) Datos Requeridos</h6>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <label htmlFor="staticEmail" className="col-form-label text-center fw-bolder">Solicitante:</label>
              <input
                style={{ "width": "300px" }}
                className="form-control mx-2"
                type="text"
                defaultValue={`${datosUsuario.nombre} `}
                aria-label="Disabled input example"
                disabled
                readOnly
              />
            </div>
            {datos && datos.map((articulo, index) => (
              <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6' key={index}>
                <label htmlFor="staticEmail" className=" col-form-label text-center fw-bolder">Nº de Solicitud:</label>
                <input
                  style={{ "width": "300px" }}
                  className="form-control mx-2"
                  type="text"
                  value={parseInt(articulo.numero_ped) + 1} // Suma uno al valor de articulo.numero_ped
                  placeholder="Ingrese Numero de Solicitud"
                  disabled // Hacer el campo no editable
                />
              </div>
            ))}
          </div>
          <div className='row '>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <label htmlFor="created" className="col-form-label text-center fw-bolder">Fecha de Solicitud:</label>
              <input
                style={{ "width": "300px" }}
                className="form-control mx-2"
                type="text"
                value={fechaCreacion}
                readOnly // Hacer el campo no editable
                disabled
              />
            </div>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <label htmlFor="created" className="col-form-label text-center fw-bolder">Motivo de la Solicitud</label>
              <select
                className="form-select"
                aria-label="Default select example"
                style={{ "width": "300px" }}
                value={motivoSeleccionado}
                onChange={handleMotivoChange}
                required // Hacer el campo obligatorio
              >
                <option value="">(Seleccione)</option>
                <option value="1">Alta Rotación</option>
                <option value="2">Ventas al mayor</option>
                <option value="3">Ventas de Clientes Especiales</option>
              </select>
            </div>
          </div>
          <div className='row py-2'>
            <div className='col-12'>
              <h5 className='text-start py-1  text-center'>Agregue los Productos de la Orden</h5>
              <p className=' py-1'>"Si al buscar el serial los datos no coinciden, puede agregar los datos manualmente"</p>
            </div>
            <div >
              <button type="button" className="btn btn-success" onClick={agregarProducto}>Agregar Producto</button>
              <button type="button" className="btn btn-danger mx-1" onClick={() => eliminarProducto(productosnav.length - 1)}>Quitar Producto</button>
            </div>
            {productosnav.map((producto, index) => (
              <div key={index} className='row py-1 bor'>
                <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                  <label htmlFor="serial" className="col-sm-6 col-form-label text-center fw-bolder">(*) BUSCAR SERIAL:</label>
                  <div className="d-flex justify-content-end" role="search">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Ejemplo: 123456789"
                      value={producto.serial}
                      onChange={(e) => handleProductChange(index, e, 'serial')}
                    />
                    <button type="button" className="btn btn-success" onClick={() => handleSearchSerial(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor" fillRule="evenodd" d="m16.325 14.899l5.38 5.38a1.008 1.008 0 0 1-1.427 1.426l-5.38-5.38a8 8 0 1 1 1.426-1.426M10 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12"/>
                      </svg>
                    </button>
                  </div>
                  {errorDescripcion && (
                    <p className="text-danger">{errorDescripcion}</p>
                  )}
                  
                </div>
                <div className='col-sm-12 col-md-5 col-lg-5 col-xl-5'>
                  <label htmlFor="descripcion" className="col-form-label text-center fw-bolder">(*) DESCRIPCION DEL PRODUCTO:</label>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Ejemplo: Cortina"
                    value={producto.descripcion ? producto.descripcion : ''}
                    onChange={(e) => handleProductChange(index, e, 'descripcion')}
                  />
                </div>
                <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                  <label htmlFor="cantidad" className="col-form-label text-center fw-bolder">(*) Cantidad:</label>
                  <input
                    className="form-control form-control-md"
                    type="text"
                    placeholder="Unds"
                    value={producto.cantidad}
                    onChange={(e) => handleProductChange(index, e, 'cantidad')}
                  />
                  {producto.empaque && (
                    <p className="text-muted">Cantidad mínima: {parseFloat(producto.empaque).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  )}

                </div>
              </div>
            ))}
          </div>
          <div className='text-center py-3'>
            <p className='fw-bolder text-danger'>Cantidad de Artículos  Agregados en la Orden: "{productosnav.length}"</p>
            <input className="btn btn-primary text-center" type="submit" value="ENVIAR" />
            
          </div>
        </div>
      </div>
    </form>
  );
};

export default Formulario;
