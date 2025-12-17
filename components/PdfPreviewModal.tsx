import React from 'react';
import { DepartmentGroup } from '../types';
import { X, Printer } from 'lucide-react';

interface PdfPreviewModalProps {
  group: DepartmentGroup | null;
  onClose: () => void;
  onSend: () => void;
  isSending: boolean;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ group, onClose, onSend, isSending }) => {
  if (!group) return null;

  const currentDate = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

  // Helper to parse string input to number for totals
  const parseHour = (val: string) => parseFloat(val) || 0;

  const totalEffective = {
    cttNormal: group.employees.reduce((acc, e) => acc + parseHour(e.effectiveHours.cttNormal), 0),
    cttRecargo: group.employees.reduce((acc, e) => acc + parseHour(e.effectiveHours.cttRecargo), 0),
    compNormal: group.employees.reduce((acc, e) => acc + parseHour(e.effectiveHours.compNormal), 0),
    compRecargo: group.employees.reduce((acc, e) => acc + parseHour(e.effectiveHours.compRecargo), 0),
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Printer className="w-5 h-5 text-gray-500" />
            Vista Previa de Documento
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content - The "PDF" */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white border border-gray-300 shadow-sm p-10 min-h-[600px] text-sm text-gray-800 mx-auto max-w-[210mm]">
            
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
              <h1 className="font-bold text-xl uppercase tracking-wider">Solicitud de Autorización</h1>
              <h2 className="font-semibold text-lg text-gray-600">Pago y Compensación de Horas Extraordinarias</h2>
            </div>

            {/* Metadata */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold block text-gray-500 text-xs uppercase">Departamento</span>
                <span className="text-lg">{group.departmentName}</span>
              </div>
              <div className="text-right">
                <span className="font-bold block text-gray-500 text-xs uppercase">Fecha Emisión</span>
                <span>{currentDate}</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="font-bold block text-gray-500 text-xs uppercase">Dirigido a Jefatura</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{group.managerEmail}</span>
            </div>

            <div className="mb-4 text-xs text-gray-500 italic">
               * Los valores en esta tabla corresponden a las Horas Efectivas ingresadas para autorización.
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                  <th className="border border-gray-300 p-2 text-left">Funcionario</th>
                  <th className="border border-gray-300 p-2 text-right">Pago Normal</th>
                  <th className="border border-gray-300 p-2 text-right">Pago Recargo</th>
                  <th className="border border-gray-300 p-2 text-right">Comp. Normal</th>
                  <th className="border border-gray-300 p-2 text-right">Comp. Recargo</th>
                </tr>
              </thead>
              <tbody>
                {group.employees.map((emp) => (
                  <tr key={emp.id} className="text-gray-600">
                    <td className="border border-gray-300 p-2 font-medium">{emp.name}</td>
                    <td className="border border-gray-300 p-2 text-right">{emp.effectiveHours.cttNormal || '-'}</td>
                    <td className="border border-gray-300 p-2 text-right">{emp.effectiveHours.cttRecargo || '-'}</td>
                    <td className="border border-gray-300 p-2 text-right">{emp.effectiveHours.compNormal || '-'}</td>
                    <td className="border border-gray-300 p-2 text-right">{emp.effectiveHours.compRecargo || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  <td className="border border-gray-300 p-2">TOTALES (Efectivos)</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {totalEffective.cttNormal}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {totalEffective.cttRecargo}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {totalEffective.compNormal}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {totalEffective.compRecargo}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Signature Block */}
            <div className="mt-20 pt-8 border-t border-gray-300 flex justify-between items-end">
              <div className="text-center">
                 <div className="w-64 border-b border-black mb-2"></div>
                 <p className="font-bold">Firma Jefatura Directa</p>
                 <p className="text-sm text-gray-500">Autorización Pago/Compensación</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Generado automáticamente por Sistema Gestión HE</p>
                <p>ID Transacción: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isSending}
          >
            Cancelar
          </button>
          <button 
            onClick={onSend}
            disabled={isSending}
            className={`px-6 py-2 rounded-md text-white font-semibold shadow-md transition-all 
              ${isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}
            `}
          >
            {isSending ? 'Enviando Correo...' : 'Confirmar y Enviar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};