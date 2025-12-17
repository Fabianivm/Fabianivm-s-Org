export enum ProcessStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  REVIEW = 'REVIEW',
}

export enum DeptStatus {
  PENDING = 'PENDING',
  SENDING = 'SENDING',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
}

export interface Employee {
  id: string;
  name: string; // Col A
  department: string; // Col D
  managerEmail: string; // Col F
  hours: {
    cttNormal: number; // Col H
    cttRecargo: number; // Col I
    compNormal: number; // Col J
    compRecargo: number; // Col K
  };
  effectiveHours: {
    cttNormal: string;
    cttRecargo: string;
    compNormal: string;
    compRecargo: string;
  };
}

export interface DepartmentGroup {
  departmentName: string;
  managerEmail: string;
  employees: Employee[];
  totalHours: number;
  status: DeptStatus;
  signedDate?: string;
}