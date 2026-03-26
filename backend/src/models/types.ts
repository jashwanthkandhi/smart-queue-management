export interface Service {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  prefix: string;
}

export interface QueueItem {
  id: string;
  token: string;
  serviceId: string;
  serviceName: string;
  timestamp: Date;
  status: 'waiting' | 'serving' | 'completed';
  estimatedWaitTime: number;
  position: number;
}

export interface QueueStats {
  serviceId: string;
  queueLength: number;
  averageWaitTime: number;
  currentServing?: string;
}

export interface AdminStats {
  totalQueues: number;
  totalServed: number;
  averageWaitTime: number;
  peakHour: string;
}