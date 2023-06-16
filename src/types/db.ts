
interface PB {
  id: string;
  created: string;
  updated: string;
}

export interface ComputeNode extends PB {
  model: string;
  serial: string;
  status: string;
  manufacturer: string;
  job: string;
}

export interface Job extends PB {
  name:string;
  files:string;
}