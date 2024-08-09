import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportView1 = ({ ordenPedido, id }) => {
    
  const exportToExcel = () => {
    if (!ordenPedido) {
      console.error('No hay datos para exportar.');
      return;
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileName = `OrdenPedido_1${ordenPedido.numero_ped}.xlsx`;

    // Crear manualmente las filas fijas
    const ws_data = [
      ['ParentKey', 'LineNum', 'ItemCode', 'ItemDescription', 'Quantity', 'ShipDate', 'Price', 'PriceAfterVAT', 'Currency', 'Rate', 'DiscountPercent', 'VendorNum', 'SerialNum', 'WarehouseCode', 'SalesPersonCode', 'CommisionPercent', 'TreeType', 'AccountCode', 'UseBaseUnits', 'SupplierCatNum', 'CostingCode', 'ProjectCode', 'BarCode', 'VatGroup', 'Height1', 'Hight1Unit', 'Height2', 'Height2Unit', 'Lengh1', 'Lengh1Unit', 'Lengh2', 'Lengh2Unit', 'Weight1', 'Weight1Unit', 'Weight2', 'Weight2Unit', 'Factor1', 'Factor2', 'Factor3', 'Factor4', 'BaseType', 'BaseEntry', 'BaseLine', 'Volume', 'VolumeUnit', 'Width1', 'Width1Unit', 'Width2', 'Width2Unit', 'Address', 'TaxCode', 'TaxType', 'TaxLiable', 'BackOrder', 'FreeText', 'ShippingMethod', 'CorrectionInvoiceItem', 'CorrInvAmountToStock', 'CorrInvAmountToDiffAcct', 'WTLiable', 'DeferredTax', 'MeasureUnit', 'UnitsOfMeasurment', 'LineTotal', 'TaxPercentagePerRow', 'TaxTotal', 'ConsumerSalesForecast', 'ExciseAmount', 'CountryOrg', 'SWW', 'TransactionType', 'DistributeExpense', 'ShipToCode', 'RowTotalFC', 'CFOPCode', 'CSTCode', 'Usage', 'TaxOnly', 'UnitPrice', 'LineStatus', 'LineType', 'COGSCostingCode', 'COGSAccountCode', 'ChangeAssemlyBoMWarehouse', 'GrossBuyPrice', 'GrossBase', 'GrossProfitTotalBasePrice', 'CostingCode2', 'CostingCode3', 'CostingCode4', 'CostingCode5', 'ItemDetails', 'LocationCode', 'ActualDeliveryDate', 'ExLineNo', 'RequiredDate', 'RequiredQuantity', 'COGSCostingCode2', 'COGSCostingCode3', 'COGSCostingCode4', 'COGSCostingCode5', 'WithoutInventoryMovement', 'AgrementNo', 'AgreementRowNumber', 'ShipToDescription', 'U_COMENS'],
      ['DocNum', 'LineNum', 'ItemCode', 'Dscription', 'Quantity', 'ShipDate', 'Price', 'PriceAfVAT', 'Currency', 'Rate', 'DiscPrcnt', 'VendorNum', 'SerialNum', 'WhsCode', 'SlpCode', 'Commission', 'TreeType', 'AcctCode', 'UseBaseUn', 'SubCatNum', 'OcrCode', 'Project', 'CodeBars', 'VatGroup', 'Height1', 'Hght1Unit', 'Height2', 'Hght2Unit', 'Length1', 'Len1Unit', 'length2', 'Len2Unit', 'Weight1', 'Wght1Unit', 'Weight2', 'Wght2Unit', 'Factor1', 'Factor2', 'Factor3', 'Factor4', 'BaseType', 'BaseEntry', 'BaseLine', 'Volume', 'VolUnit', 'Width1', 'Wdth1Unit', 'Width2', 'Wdth2Unit', 'Address', 'TaxCode', 'TaxType', 'TaxStatus', 'BackOrdr', 'FreeTxt', 'TrnsCode', 'CEECFlag', 'ToStock', 'ToDiff', 'WtLiable', 'DeferrTax', 'unitMsr', 'NumPerMsr', 'LineTotal', 'VatPrcnt', 'VatSum', 'ConsumeFCT', 'ExciseAmt', 'CountryOrg', 'SWW', 'TranType', 'DistribExp', 'ShipToCode', 'TotalFrgn', 'CFOPCode', 'CSTCode', 'Usage', 'TaxOnly', 'PriceBefDi', 'LineStatus', 'LineType', 'CogsOcrCod', 'CogsAcct', 'ChgAsmBoMW', 'GrossBuyPr', 'GrossBase', 'GPTtlBasPr', 'OcrCode2', 'OcrCode3', 'OcrCode4', 'OcrCode5', 'Text', 'LocCode', 'ActDelDate', 'ExLineNo', 'PQTReqDate', 'PQTReqQty', 'CogsOcrCo2', 'CogsOcrCo3', 'CogsOcrCo4', 'CogsOcrCo5', 'NoInvtryMv', 'AgrNo', 'AgrLnNum', 'ShipToDesc', 'Comentarios']
    ];

    // Agregar los datos debajo de las filas fijas
    ordenPedido.orden_items.forEach((item, index) => {
      ws_data.push([
        ordenPedido.numero_ped, // ParentKey / DocNum
        '',        // LineNum
        item.articulos.codigo, // ItemCode
        '', // ItemDescription / Dscription
        item.cantidad,    // Quantity
        '', // ShipDate
        '', // Price
        '', // PriceAfterVAT / PriceAfVAT
        'USD', // Currency
        '', // Rate
        '', // DiscountPercent / DiscPrcnt
        '', // VendorNum
        '', // SerialNum
        '', // WarehouseCode / WhsCode
        '', // SalesPersonCode / SlpCode
        '', // CommisionPercent / Commission
        '', // TreeType
        '', // AccountCode / AcctCode
        '', // UseBaseUnits / UseBaseUn
        '', // SupplierCatNum / SubCatNum
        '', // CostingCode / OcrCode
        '', // ProjectCode / Project
        '', // BarCode / CodeBars
        '', // VatGroup
        '', // Height1
        '', // Hight1Unit / Hght1Unit
        '', // Height2
        '', // Height2Unit / Hght2Unit
        '', // Lengh1 / Length1
        '', // Lengh1Unit / Len1Unit
        '', // Lengh2 / length2
        '', // Lengh2Unit / Len2Unit
        '', // Weight1
        '', // Weight1Unit / Wght1Unit
        '', // Weight2
        '', // Weight2Unit / Wght2Unit
        '', // Factor1
        '', // Factor2
        '', // Factor3
        '', // Factor4
        '', // BaseType
        '', // BaseEntry
        '', // BaseLine
        '', // Volume
        '', // VolumeUnit / VolUnit
        '', // Width1
        '', // Width1Unit / Wdth1Unit
        '', // Width2
        '', // Width2Unit / Wdth2Unit
        '', // Address
        '', // TaxCode
        '', // TaxType
        '', // TaxLiable / TaxStatus
        '', // BackOrder / BackOrdr
        '', // FreeText / FreeTxt
        '', // ShippingMethod / TrnsCode
        '', // CorrectionInvoiceItem / CEECFlag
        '', // CorrInvAmountToStock / ToStock
        '', // CorrInvAmountToDiffAcct / ToDiff
        '', // WTLiable / WtLiable
        '', // DeferredTax / DeferrTax
        '', // MeasureUnit / unitMsr
        '', // UnitsOfMeasurment / NumPerMsr
        '', // LineTotal
        '', // TaxPercentagePerRow / VatPrcnt
        '', // TaxTotal / VatSum
        '', // ConsumerSalesForecast / ConsumeFCT
        '', // ExciseAmount / ExciseAmt
        '', // CountryOrg
        '', // SWW
        '', // TransactionType / TranType
        '', // DistributeExpense / DistribExp
        '', // ShipToCode
        '', // RowTotalFC / TotalFrgn
        '', // CFOPCode
        '', // CSTCode
        '', // Usage
        '', // TaxOnly
        '', // UnitPrice / PriceBefDi
        '', // LineStatus
        '', // LineType
        '', // COGSCostingCode / CogsOcrCod
        '', // COGSAccountCode / CogsAcct
        '', // ChangeAssemlyBoMWarehouse / ChgAsmBoMW
        '', // GrossBuyPrice / GrossBuyPr
        '', // GrossBase
        '', // GrossProfitTotalBasePrice / GPTtlBasPr
        '', // CostingCode2 / OcrCode2
        '', // CostingCode3 / OcrCode3
        '', // CostingCode4 / OcrCode4
        '', // CostingCode5 / OcrCode5
        '', // ItemDetails / Text
        '', // LocationCode / LocCode
        '', // ActualDeliveryDate / ActDelDate
        '', // ExLineNo
        '', // RequiredDate / PQTReqDate
        '', // RequiredQuantity / PQTReqQty
        '', // COGSCostingCode2 / CogsOcrCo2
        '', // COGSCostingCode3 / CogsOcrCo3
        '', // COGSCostingCode4 / CogsOcrCo4
        '', // COGSCostingCode5 / CogsOcrCo5
        '', // WithoutInventoryMovement / NoInvtryMv
        '', // AgrementNo / AgrNo
        '', // AgreementRowNumber / AgrLnNum
        '', // ShipToDescription / ShipToDesc
        `PEDIDOWEB${ordenPedido.numero_ped}`, // U_COMENS / Comentarios
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
    <button className="btn btn-success mx-2" onClick={exportToExcel}>
      <i className='bx bxs-file-txt bx-md'></i> 1
    </button>
  );
};

export default ExportView1;
