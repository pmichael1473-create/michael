export interface PointPackage {
  id: string;
  tonPrice: number;
  points: number;
  name: string;
  popular?: boolean;
}

export interface UserState {
  points: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
