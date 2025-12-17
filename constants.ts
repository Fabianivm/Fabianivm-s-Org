import { Employee } from './types';

export const SHAREPOINT_CONFIG = {
  path: "DR-09Temuco – Procesos regionales IX > PR IX_ADMINISTRACION > Capacitación",
  filename: "horas extras prototipo 2.xlsx"
};

// Simulated data as if read from the Excel file
export const MOCK_EXCEL_DATA: Employee[] = [
  {
    id: '1',
    name: 'Juan Pérez González',
    department: 'Administración y Finanzas',
    managerEmail: 'jefe.admin@region9.gob.cl',
    hours: { cttNormal: 10, cttRecargo: 2, compNormal: 0, compRecargo: 0 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  {
    id: '2',
    name: 'María Rodríguez Soto',
    department: 'Administración y Finanzas',
    managerEmail: 'jefe.admin@region9.gob.cl',
    hours: { cttNormal: 5, cttRecargo: 0, compNormal: 2, compRecargo: 0 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  {
    id: '3',
    name: 'Carlos Muñoz Tapia',
    department: 'Operaciones en Terreno',
    managerEmail: 'coord.ops@region9.gob.cl',
    hours: { cttNormal: 0, cttRecargo: 8, compNormal: 0, compRecargo: 5 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  {
    id: '4',
    name: 'Ana López Vera',
    department: 'Operaciones en Terreno',
    managerEmail: 'coord.ops@region9.gob.cl',
    hours: { cttNormal: 12, cttRecargo: 4, compNormal: 0, compRecargo: 0 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  {
    id: '5',
    name: 'Roberto Díaz M.',
    department: 'Tecnologías de Información',
    managerEmail: 'jefe.ti@region9.gob.cl',
    hours: { cttNormal: 0, cttRecargo: 0, compNormal: 8, compRecargo: 8 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  // Nuevos datos para Juan Daniel Trujillo
  {
    id: '6',
    name: 'Camila Estefanía Lagos',
    department: 'Departamento de Compras',
    managerEmail: 'juan.trujillo@sii.cl',
    hours: { cttNormal: 8, cttRecargo: 2, compNormal: 0, compRecargo: 0 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  {
    id: '7',
    name: 'Felipe Andrés Toloza',
    department: 'Departamento de Compras',
    managerEmail: 'juan.trujillo@sii.cl',
    hours: { cttNormal: 0, cttRecargo: 5, compNormal: 4, compRecargo: 0 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  },
  {
    id: '8',
    name: 'Sofía Ignacia Garrido',
    department: 'Departamento de Compras',
    managerEmail: 'juan.trujillo@sii.cl',
    hours: { cttNormal: 2, cttRecargo: 0, compNormal: 0, compRecargo: 0 },
    effectiveHours: { cttNormal: '', cttRecargo: '', compNormal: '', compRecargo: '' }
  }
];