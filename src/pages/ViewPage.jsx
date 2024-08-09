import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'datatables.net-responsive-dt';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportView1 from '../components/ExportView1';
import ExportView2 from '../components/ExportView2';
import { carritoContext } from "../contexts/carritoContext";
import ExportView3 from '../components/ExportView3';
const ViewPage = () => {
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
    return <div className="text-center">Loading...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  const exportToPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const getMotivoDescripcion = (descripcion) => {
      if (descripcion === '1') {
        return 'Alta Rotación';
      } else if (descripcion === '2') {
        return 'Ventas al mayor';
      } else if (descripcion === '3') {
        return 'Ventas de Clientes Especiales';
      } else {
        return 'Descripción desconocida';
      }
    };
    doc.setFontSize(15);
    const title = `Orden Pedido #${ordenPedido.numero_ped}`;
    const motivo = `Motivo: ${getMotivoDescripcion(ordenPedido.descripcion)}`;
    const solicitud = `Fecha de Solicitud: ${ordenPedido.created ? new Date(ordenPedido.created).toLocaleString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }) : 'No disponible'}`;
    const solicitante = `Solicitante: ${ordenPedido.users.nombre}`;
    const status_aprobado = `Status: ${ordenPedido.status_aprobado}`;
  
    const headers = [['ID', 'Departamento', 'Categoría', 'Código', 'Descripción', 'Cantidad']];
    const data = ordenPedido.orden_items.map(item => [
      item.articulos?.id || 'No disponible',
      item.articulos?.departamento || 'No disponible',
      item.articulos?.categoria || 'No disponible',
      item.articulos?.codigo || 'No disponible',
      item.articulos?.descripcion || 'No disponible',
      item.cantidad || 'No disponible'
    ]);
  
    let content = {
      startY: 140,
      head: headers,
      body: data
    };
  
    const marginTop = 40; // Margin space above the text
  
    doc.text(title, doc.internal.pageSize.getWidth() / 2, marginTop, { align: 'center' });
    doc.text(motivo, marginLeft, marginTop + 20, { align: 'left' });
    doc.text(solicitud, marginLeft, marginTop + 40, { align: 'left' });
    doc.text(solicitante, marginLeft, marginTop + 60, { align: 'left' });
    doc.text(status_aprobado, marginLeft, marginTop + 80, { align: 'left' });
    doc.autoTable(content);
    doc.save(`OrdenPedido_${ordenPedido.numero_ped}.pdf`);
  };
  
       

  const printTable = () => {
    window.print();
  };
  const handleBack = () => {
    navigate(-1); // Navega hacia atrás usando navigate con el valor -1
  };

  return (
    <div className="container py-4">
    <div className="row ">
      <div className="col-lg-2">
      <button className="btn btn-light active border-success text-success mb-3" onClick={handleBack}>
          <i className="bx bx-arrow-back"></i> Regresar
        </button>
      </div>
      <div className="col-lg-8">
        
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h3 className="card-title mb-0 text-center">Orden Pedido #{ordenPedido.numero_ped}</h3>
          </div>
          <div className="card-body">
            {ordenPedido.anulada === 0 ? (
              <h2>
                <div className="alert alert-danger text-center" role="alert">
                  ANULADA
                </div>
              </h2>
            ) : (
              ''
            )}
            <div className='row '>
            <div className='col-lg-6'>
              <p className="card-text"><strong>Creado:</strong> {new Date(ordenPedido.created).toLocaleString()}</p>
              </div>
              <div className='col-lg-6'>
              <p className="card-text"><strong>Motivo: </strong>
                          {ordenPedido.descripcion === '1' ? 'Alta Rotación' :
                          ordenPedido.descripcion === '2' ? 'Ventas al por mayor' :
                          ordenPedido.descripcion === '3' ? 'Ventas de Clientes Especiales' :
                          'Descripción desconocida'} {/* Opcional */}
                        </p>
              </div>
              <div className='col-lg-6 py-1'>
              <p className="card-text"><strong>Solicitante:</strong> {ordenPedido.users.nombre}</p>
              </div>
             
              <div className='col-lg-6 py-1'>
              <p className="card-text"><strong>Status:</strong> {ordenPedido.status_aprobado}</p>
              </div>
              <div className='col-lg-6'>
              <p className="card-text"><strong>Tipo: </strong>{ordenPedido.tipo === 'P' ? ('Estándar') : ('Navidad')} </p> 
              </div>
              
            </div>
           
            <div className="mt-1">
              <h5 className="mb-3 text-center">Artículos de la Orden</h5>
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered table-condensed table-responsive text-center" id="table_id">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenPedido.orden_items && ordenPedido.orden_items.map(item => (
                      item.articulos ? (
                        <tr key={item.id} className={item.validado === 1 ? 'table-success' : 'table-danger'}>
                          <td>{item.articulos.codigo}</td>
                          <td>{item.articulos.descripcion}</td>
                          <td>{item.cantidad}</td>
                        </tr>
                      ) : null
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
  
            <div className="text-center mt-4">
              <button className="btn btn-danger mx-2" onClick={exportToPDF}>
                <i className=' bx bxs-file-pdf bx-md'></i> 
              </button>
              {datosUsuario.role == 'admin' &&(
                <>
                <ExportView1 ordenPedido={ordenPedido} id={id} />
                <ExportView2 ordenPedido={ordenPedido} id={id} />
                <ExportView3 ordenPedido={ordenPedido} id={id} />
                </>
                
              )}
              {datosUsuario.role == 'user2' &&(
                <>
                <ExportView1 ordenPedido={ordenPedido} id={id} />
                <ExportView2 ordenPedido={ordenPedido} id={id} />
                <ExportView3 ordenPedido={ordenPedido} id={id} />
                </>
                
              )}
              
               
              <button className="btn btn-secondary mx-2" onClick={printTable}>
                <i className='bx bxs-printer bx-md'></i> 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default ViewPage;
