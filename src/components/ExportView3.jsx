import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportView3 = ({ ordenPedido, id }) => {
    
  const exportToExcel = () => {
    if (!ordenPedido) {
      console.error('No hay datos para exportar.');
      return;
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileName = `OrdenPed${ordenPedido.numero_ped}.xlsx`;

    // Crear manualmente las filas fijas
    const ws_data = [
        ['Orden de Pedido', ordenPedido.numero_ped],
        ['Sucursal', ordenPedido.users.sucursales ? ordenPedido.users.sucursales.descripcion : 'Sin sucursal especificada'],
        ['Code', 'Description', 'Quantity']
      ];
      
      // Agregar los datos debajo de las filas fijas
      ordenPedido.orden_items.forEach((item, index) => {
        ws_data.push([
          item.articulos.codigo,
          item.articulos.descripcion,
          item.cantidad
        ]);
      });

    // Crear una nueva hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Configurar la propiedad de congelación para congelar las primeras dos filas
    ws['!freeze'] = { xSplit: 0, ySplit: 2 };

    // Crear un nuevo libro de trabajo y agregar la hoja de cálculo
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    // Escribir el libro de trabajo a un buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Crear un Blob a partir del buffer y guardarlo como archivo
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, fileName);
  };

  return (
    <button className="btn btn-info mx-2" onClick={exportToExcel}>
      <i className='bx bxs-file-export bx-md'></i>
    </button>
  );
};

export default ExportView3;
