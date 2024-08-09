import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns'; // Importa la función format de date-fns

const ExportView2 = ({ ordenPedido }) => {

  const exportToExcel = () => {
    if (!ordenPedido) {
      console.error('No hay datos para exportar.');
      return;
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileName = `OrdenPedido2_${ordenPedido.numero_ped}.xlsx`;

    // Filas fijas proporcionadas
    const ws_data = [
      ['DocNum', 'DocType', 'HandWritten', 'Printed', 'DocDate', 'DocDueDate', 'CardCode', 'CardName', 'Address', 'NumAtCard', 'DocCurrency', 'DocRate', 'DocTotal', 'Reference1', 'Reference2', 'Comments', 'JournalMemo', 'PaymentGroupCode', 'DocTime', 'SalesPersonCode', 'TransportationCode', 'Confirmed', 'ImportFileNum', 'SummeryType', 'ContactPersonCode', 'ShowSCN', 'Series', 'TaxDate', 'PartialSupply', 'DocObjectCode', 'ShipToCode', 'Indicator', 'FederalTaxID', 'DiscountPercent', 'PaymentReference', 'DocTotalFc', 'Form1099', 'Box1099', 'RevisionPo', 'RequriedDate', 'CancelDate', 'BlockDunning', 'Pick', 'PaymentMethod', 'PaymentBlock', 'PaymentBlockEntry', 'CentralBankIndicator', 'MaximumCashDiscount', 'Project', 'ExemptionValidityDateFrom', 'ExemptionValidityDateTo', 'WareHouseUpdateType', 'Rounding', 'ExternalCorrectedDocNum', 'InternalCorrectedDocNum', 'DeferredTax', 'TaxExemptionLetterNum', 'AgentCode', 'NumberOfInstallments', 'ApplyTaxOnFirstInstallment', 'VatDate', 'DocumentsOwner', 'FolioPrefixString', 'FolioNumber', 'DocumentSubType', 'BPChannelCode', 'BPChannelContact', 'Address2', 'PayToCode', 'ManualNumber', 'UseShpdGoodsAct', 'IsPayToBank', 'PayToBankCountry', 'PayToBankCode', 'PayToBankAccountNo', 'PayToBankBranch', 'BPL_IDAssignedToInvoice', 'DownPayment', 'ReserveInvoice', 'LanguageCode', 'TrackingNumber', 'PickRemark', 'ClosingDate', 'SequenceCode', 'SequenceSerial', 'SeriesString', 'SubSeriesString', 'SequenceModel', 'UseCorrectionVATGroup', 'DownPaymentAmount', 'DownPaymentPercentage', 'DownPaymentType', 'DownPaymentAmountSC', 'DownPaymentAmountFC', 'VatPercent', 'ServiceGrossProfitPercent', 'OpeningRemarks', 'ClosingRemarks', 'RoundingDiffAmount', 'ControlAccount', 'InsuranceOperation347', 'ArchiveNonremovableSalesQuotation'],
      ['DocNum', 'DocType', 'Handwrtten', 'Printed', 'DocDate', 'DocDueDate', 'CardCode', 'CardName', 'Address', 'NumAtCard', 'DocCur', 'DocRate', 'DocTotal', 'Ref1', 'Ref2', 'Comments', 'JrnlMemo', 'GroupNum', 'DocTime', 'SlpCode', 'TrnspCode', 'Confirmed', 'ImportEnt', 'SummryType', 'CntctCode', 'ShowSCN', 'Series', 'TaxDate', 'PartSupply', 'ObjType', 'ShipToCode', 'Indicator', 'LicTradNum', 'DiscPrcnt', 'PaymentRef', 'DocTotalFC', 'Form1099', 'Box1099', 'RevisionPo', 'ReqDate', 'CancelDate', 'BlockDunn', 'Pick', 'PeyMethod', 'PayBlock', 'PayBlckRef', 'CntrlBnk', 'MaxDscn', 'Project', 'FromDate', 'ToDate', 'UpdInvnt', 'Rounding', 'CorrExt', 'CorrInv', 'DeferrTax', 'LetterNum', 'AgentCode', 'Installmnt', 'VATFirst', 'VatDate', 'OwnerCode', 'FolioPref', 'FolioNum', 'DocSubType', 'BPChCode', 'BPChCntc', 'Address2', 'PayToCode', 'ManualNum', 'UseShpdGd', 'IsPaytoBnk', 'BnkCntry', 'BankCode', 'BnkAccount', 'BnkBranch', 'BPLId', 'DpmPrcnt', 'isIns', 'LangCode', 'TrackNo', 'PickRmrk', 'ClsDate', 'SeqCode', 'Serial', 'SeriesStr', 'SubStr', 'Model', 'UseCorrVat', 'DpmAmnt', 'DpmPrcnt', 'Posted', 'DpmAmntSC', 'DpmAmntFC', 'VatPercent', 'SrvGpPrcnt', 'Header', 'Footer', 'RoundDif', 'CtlAccount', 'InsurOp347', 'IgnRelDoc']
    ];

    // Función para formatear la fecha a YYYYMMDD
    const formatDate = (date) => {
      return format(date, 'yyyyMMdd');
    };
    const tipo = (ordenPedido) => {
      if (ordenPedido.tipo === 'P') {
        return 'Normal'; 
      }
      if (ordenPedido.tipo === 'N') {
        return 'Navidad';
    }
    };
    const comentario = (ordenPedido) => {
      switch (ordenPedido.descripcion) {
        case '1':
          return 'Alta Rotación';
        case '2':
          return 'Ventas al mayor';
        case '3':
          return 'Ventas de Clientes Especiales';
        default:
          return 'Descripción no disponible'; // Valor por defecto para casos no esperados
      }
    };
    // Agregar los datos debajo de las filas fijas
 
    ws_data.push([
      ordenPedido.numero_ped, // DocNum
      'dDocument_Items', // DocType
      'tNO', // HandWritten
      '', // Printed
      formatDate(ordenPedido.created), // DocDate
      formatDate(ordenPedido.created), // DocDueDate
      ordenPedido.users.sucursales.cliente, // CardCode (Cliente)
      '', // CardName
      '', // Address
      'CH2401024', // NumAtCard
      'BsS', // DocCurrency
      '', // DocRate
      '', // DocTotal
      '', // Reference1
      '', // Reference2
      comentario(ordenPedido), // Comments
      '', // JournalMemo
      '', // PaymentGroupCode
      '', // DocTime
      '', // SalesPersonCode
      '', // TransportationCode
      '', // Confirmed
      '', // ImportFileNum
      '', // SummeryType
      '', // ContactPersonCode
      '', // ShowSCN
      '', // Series
      '', // TaxDate
      '', // PartialSupply
      '', // DocObjectCode
      '', // ShipToCode
      '', // Indicator
      '', // FederalTaxID
      '', // DiscountPercent
      '', // PaymentReference
      '', // DocTotalFc
      '', // Form1099
      '', // Box1099
      '', // RevisionPo
      '', // RequriedDate
      '', // CancelDate
      '', // BlockDunning
      '', // Pick
      '', // PaymentMethod
      '', // PaymentBlock
      '', // PaymentBlockEntry
      '', // CentralBankIndicator
      '', // MaximumCashDiscount
      '', // Project
      '', // ExemptionValidityDateFrom
      '', // ExemptionValidityDateTo
      '', // WareHouseUpdateType
      '', // Rounding
      '', // ExternalCorrectedDocNum
      '', // InternalCorrectedDocNum
      '', // DeferredTax
      '', // TaxExemptionLetterNum
      '', // AgentCode
      '', // NumberOfInstallments
      '', // ApplyTaxOnFirstInstallment
      '', // VatDate
      '', // DocumentsOwner
      '', // FolioPrefixString
      '', // FolioNumber
      '', // DocumentSubType
      '', // BPChannelCode
      '', // BPChannelContact
      '', // Address2
      '', // PayToCode
      '', // ManualNumber
      '', // UseShpdGoodsAct
      '', // IsPayToBank
      '', // PayToBankCountry
      '', // PayToBankCode
      '', // PayToBankAccountNo
      '', // PayToBankBranch
      ordenPedido.users.sucursales.numero_id, // BPL_IDAssignedToInvoice (Número de sucursal)
      '', // DownPayment
      '', // ReserveInvoice
      '', // LanguageCode
      '', // TrackingNumber
      '', // PickRemark
      '', // ClosingDate
      '', // SequenceCode
      '', // SequenceSerial
      '', // SeriesString
      '', // SubSeriesString
      '', // SequenceModel
      '', // UseCorrectionVATGroup
      '', // DownPaymentAmount
      '', // DownPaymentPercentage
      '', // DownPaymentType
      '', // DownPaymentAmountSC
      '', // DownPaymentAmountFC
      '', // VatPercent
      '', // ServiceGrossProfitPercent
      '', // OpeningRemarks
      '', // ClosingRemarks
      '', // RoundingDiffAmount
      '', // ControlAccount
      '', // InsuranceOperation347
      ''  // ArchiveNonremovableSalesQuotation
    ]);
 

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
       <i class='bx bxs-file-txt bx-md'></i> 2
    </button>
  );
};

export default ExportView2;
