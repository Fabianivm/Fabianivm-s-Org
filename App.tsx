import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, FolderOpen, RefreshCw, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { MOCK_EXCEL_DATA, SHAREPOINT_CONFIG } from './constants';
import { DepartmentGroup, DeptStatus, Employee, ProcessStatus } from './types';
import { DepartmentCard } from './components/DepartmentCard';
import { PdfPreviewModal } from './components/PdfPreviewModal';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [groups, setGroups] = useState<DepartmentGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<DepartmentGroup | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Grouping Logic
  const processExcelData = () => {
    setStatus(ProcessStatus.LOADING);
    
    // Simulate Network/Parsing Delay
    setTimeout(() => {
      const groupedData = new Map<string, DepartmentGroup>();

      // Use a deep copy of mock data to ensure we reset state cleanly on re-process
      const freshData: Employee[] = JSON.parse(JSON.stringify(MOCK_EXCEL_DATA));

      freshData.forEach((emp) => {
        // Key by Dept + Manager to ensure unique groups
        const key = `${emp.department}-${emp.managerEmail}`;
        
        if (!groupedData.has(key)) {
          groupedData.set(key, {
            departmentName: emp.department,
            managerEmail: emp.managerEmail,
            employees: [],
            totalHours: 0,
            status: DeptStatus.PENDING
          });
        }
        
        const group = groupedData.get(key)!;
        group.employees.push(emp);
        group.totalHours += (emp.hours.cttNormal + emp.hours.cttRecargo + emp.hours.compNormal + emp.hours.compRecargo);
      });

      setGroups(Array.from(groupedData.values()));
      setStatus(ProcessStatus.REVIEW);
    }, 1500);
  };

  const handleUpdateEmployee = (deptName: string, empId: string, field: keyof Employee['effectiveHours'], value: string) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.departmentName !== deptName) return group;

      const updatedEmployees = group.employees.map(emp => {
        if (emp.id !== empId) return emp;
        return {
          ...emp,
          effectiveHours: {
            ...emp.effectiveHours,
            [field]: value
          }
        };
      });

      return { ...group, employees: updatedEmployees };
    }));
  };

  // Handle "Send" action from Modal
  const handleSendAuthorization = () => {
    if (!selectedGroup) return;
    
    setIsSending(true);

    // Simulate PDF Generation and Email Sending time
    setTimeout(() => {
      setGroups(prev => prev.map(g => {
        if (g.departmentName === selectedGroup.departmentName) {
          return { ...g, status: DeptStatus.SENT };
        }
        return g;
      }));

      setIsSending(false);
      setSelectedGroup(null);
      setNotification(`Documento enviado a ${selectedGroup.managerEmail} exitosamente.`);

      // Simulate "Signed Document Received" event after a delay (e.g., 5 seconds for demo purposes)
      setTimeout(() => {
        setGroups(prev => prev.map(g => {
          if (g.departmentName === selectedGroup.departmentName) {
            return { 
              ...g, 
              status: DeptStatus.SIGNED, 
              signedDate: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) 
            };
          }
          return g;
        }));
        setNotification(`¡Notificación! Documento firmado recibido de ${selectedGroup.departmentName}`);
      }, 5000);

    }, 2000);
  };

  // Keep selectedGroup in sync with groups state for live preview updates
  useEffect(() => {
    if (selectedGroup) {
      const currentGroup = groups.find(g => g.departmentName === selectedGroup.departmentName);
      if (currentGroup) {
        setSelectedGroup(currentGroup);
      }
    }
  }, [groups]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation / SharePoint Status */}
      <header className="bg-slate-900 text-white shadow-lg z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Gestión Horas Extras</h1>
              <p className="text-xs text-slate-400">Región IX - Prototipo Automatizado</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-800 rounded px-3 py-1 text-xs gap-2 border border-slate-700">
            <FolderOpen className="w-3 h-3 text-green-400" />
            <span className="text-slate-300">Fuente:</span>
            <span className="font-mono text-slate-200 truncate max-w-xs" title={SHAREPOINT_CONFIG.path}>
              .../{SHAREPOINT_CONFIG.filename}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        
        {/* State 0: Initial */}
        {status === ProcessStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Procesar Archivo SharePoint</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              El sistema importará automáticamente el archivo <strong>{SHAREPOINT_CONFIG.filename}</strong> desde la ruta regional configurada.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={processExcelData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Importar y Procesar
              </button>
            </div>
            
            {/* Mock Dropzone Visual */}
            <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-xl bg-white">
              <p className="text-sm text-gray-400">O arrastre un archivo Excel local aquí (Deshabilitado en Demo)</p>
            </div>
          </div>
        )}

        {/* State 1: Loading */}
        {status === ProcessStatus.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-700">Leyendo Excel desde SharePoint...</h3>
            <p className="text-gray-500 mt-2">Agrupando funcionarios por departamento y jefatura...</p>
          </div>
        )}

        {/* State 2: Review & Action */}
        {status === ProcessStatus.REVIEW && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Resumen por Jefatura</h2>
                <p className="text-gray-500">Revise e ingrese las horas efectivas antes de enviar.</p>
              </div>
              <button 
                onClick={() => setStatus(ProcessStatus.IDLE)} 
                className="text-sm text-gray-500 hover:text-blue-600 underline"
              >
                Reiniciar proceso
              </button>
            </div>

            <div className="grid gap-6">
              {groups.map((group, idx) => (
                <DepartmentCard 
                  key={idx} 
                  group={group} 
                  onPreview={setSelectedGroup} 
                  onUpdateEmployee={handleUpdateEmployee}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Notifications Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50 max-w-md border-l-4 border-green-500">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <p className="text-sm font-medium">{notification}</p>
        </div>
      )}

      {/* Modals */}
      <PdfPreviewModal 
        group={selectedGroup} 
        onClose={() => setSelectedGroup(null)} 
        onSend={handleSendAuthorization}
        isSending={isSending}
      />

    </div>
  );
};

export default App;