import React, { useMemo } from 'react';
import { DepartmentGroup, DeptStatus, Employee } from '../types';
import { 
  Send, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Users,
  FileSignature,
  Mail
} from 'lucide-react';

interface DepartmentCardProps {
  group: DepartmentGroup;
  onPreview: (group: DepartmentGroup) => void;
  onUpdateEmployee?: (deptName: string, empId: string, field: keyof Employee['effectiveHours'], value: string) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ group, onPreview, onUpdateEmployee }) => {
  const [expanded, setExpanded] = React.useState(false);

  const statusColor = useMemo(() => {
    switch (group.status) {
      case DeptStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case DeptStatus.SENDING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case DeptStatus.SENT: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case DeptStatus.SIGNED: return 'bg-green-100 text-green-800 border-green-200';
    }
  }, [group.status]);

  const statusIcon = useMemo(() => {
    switch (group.status) {
      case DeptStatus.PENDING: return <Clock className="w-4 h-4" />;
      case DeptStatus.SENDING: return <Send className="w-4 h-4 animate-pulse" />;
      case DeptStatus.SENT: return <Mail className="w-4 h-4" />;
      case DeptStatus.SIGNED: return <FileSignature className="w-4 h-4" />;
    }
  }, [group.status]);

  const statusText = useMemo(() => {
    switch (group.status) {
      case DeptStatus.PENDING: return 'Pendiente de Envío';
      case DeptStatus.SENDING: return 'Generando PDF...';
      case DeptStatus.SENT: return 'Enviado a Jefatura';
      case DeptStatus.SIGNED: return `Firmado: ${group.signedDate}`;
    }
  }, [group.status, group.signedDate]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg mb-4">
      
      {/* Card Header */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{group.departmentName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="font-semibold">Jefatura:</span> {group.managerEmail}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${statusColor}`}>
              {statusIcon}
              {statusText}
            </div>

            {/* Action Button */}
            {group.status === DeptStatus.PENDING && (
              <button
                onClick={() => onPreview(group)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Enviar a Jefatura
              </button>
            )}
            
            {/* Toggle Details */}
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* Expanded Content: Employee Table with Inputs */}
      {expanded && (
        <div className="bg-gray-50 border-t border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-3 py-3 rounded-l-md w-48">Funcionario</th>
                
                <th scope="col" className="px-1 py-3 text-center border-l border-gray-200" colSpan={2}>CTT Normal (H)</th>
                <th scope="col" className="px-1 py-3 text-center border-l border-gray-200" colSpan={2}>CTT Recargo (I)</th>
                <th scope="col" className="px-1 py-3 text-center border-l border-gray-200" colSpan={2}>Comp Normal (J)</th>
                <th scope="col" className="px-1 py-3 text-center border-l border-gray-200 rounded-r-md" colSpan={2}>Comp Recargo (K)</th>
              </tr>
              <tr className="bg-gray-200 text-[10px] text-gray-500">
                <th></th>
                <th className="text-center py-1">Rep.</th>
                <th className="text-center py-1 text-blue-700">Efec.</th>
                <th className="text-center py-1 border-l border-gray-300">Rep.</th>
                <th className="text-center py-1 text-blue-700">Efec.</th>
                <th className="text-center py-1 border-l border-gray-300">Rep.</th>
                <th className="text-center py-1 text-blue-700">Efec.</th>
                <th className="text-center py-1 border-l border-gray-300">Rep.</th>
                <th className="text-center py-1 text-blue-700">Efec.</th>
              </tr>
            </thead>
            <tbody>
              {group.employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                  <td className="px-3 py-2 font-medium text-gray-900 truncate max-w-[12rem]">{emp.name}</td>

                  {/* CTT Normal */}
                  <td className="px-1 py-2 text-center w-12 text-gray-400">{emp.hours.cttNormal || '-'}</td>
                  <td className="px-1 py-2 text-center w-16 bg-blue-50/30">
                     <input 
                      type="number" 
                      className="w-full border border-blue-200 rounded px-1 py-0.5 text-center text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      placeholder=""
                      value={emp.effectiveHours.cttNormal}
                      onChange={(e) => onUpdateEmployee?.(group.departmentName, emp.id, 'cttNormal', e.target.value)}
                    />
                  </td>

                  {/* CTT Recargo */}
                  <td className="px-1 py-2 text-center w-12 text-gray-400 border-l border-gray-100">{emp.hours.cttRecargo || '-'}</td>
                  <td className="px-1 py-2 text-center w-16 bg-blue-50/30">
                     <input 
                      type="number" 
                      className="w-full border border-blue-200 rounded px-1 py-0.5 text-center text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      placeholder=""
                      value={emp.effectiveHours.cttRecargo}
                      onChange={(e) => onUpdateEmployee?.(group.departmentName, emp.id, 'cttRecargo', e.target.value)}
                    />
                  </td>

                  {/* Comp Normal */}
                  <td className="px-1 py-2 text-center w-12 text-gray-400 border-l border-gray-100">{emp.hours.compNormal || '-'}</td>
                  <td className="px-1 py-2 text-center w-16 bg-blue-50/30">
                     <input 
                      type="number" 
                      className="w-full border border-blue-200 rounded px-1 py-0.5 text-center text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      placeholder=""
                      value={emp.effectiveHours.compNormal}
                      onChange={(e) => onUpdateEmployee?.(group.departmentName, emp.id, 'compNormal', e.target.value)}
                    />
                  </td>

                  {/* Comp Recargo */}
                  <td className="px-1 py-2 text-center w-12 text-gray-400 border-l border-gray-100">{emp.hours.compRecargo || '-'}</td>
                  <td className="px-1 py-2 text-center w-16 bg-blue-50/30">
                     <input 
                      type="number" 
                      className="w-full border border-blue-200 rounded px-1 py-0.5 text-center text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      placeholder=""
                      value={emp.effectiveHours.compRecargo}
                      onChange={(e) => onUpdateEmployee?.(group.departmentName, emp.id, 'compRecargo', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end items-center gap-2 text-sm">
             <span className="w-3 h-3 bg-blue-50 border border-blue-200 inline-block rounded"></span>
             <span className="text-gray-500">Espacios en blanco para ingreso manual de horas efectivas</span>
          </div>
        </div>
      )}
    </div>
  );
};