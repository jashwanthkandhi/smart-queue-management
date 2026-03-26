export interface AdminStats {
  totalQueues: number;
  totalServed: number;
  averageWaitTime: number;
  peakHour: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export interface Service {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  queueLength: number;
  averageWaitTime: number;
  prefix?: string;
}

export interface JoinQueueResponse {
  success: boolean;
  token: string;
  position: number;
  estimatedWaitTime: number;
}

export interface TokenStatus {
  id: string;
  token: string;
  serviceId: string;
  serviceName: string;
  timestamp: string;
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

export interface QueueItem {
  id: string;
  token: string;
  serviceId: string;
  serviceName: string;
  timestamp: string;
  status: 'waiting' | 'serving' | 'completed';
  estimatedWaitTime: number;
  position: number;
}

class ApiService {
  async getServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/queue/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  }

  async joinQueue(serviceId: string): Promise<JoinQueueResponse> {
    const response = await fetch(`${API_BASE_URL}/queue/join/${serviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to join queue');
    }
    return response.json();
  }

  async getTokenStatus(token: string): Promise<TokenStatus> {
    const response = await fetch(`${API_BASE_URL}/queue/token/${token}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token status');
    }
    return response.json();
  }

  // Admin API methods
  async getAdminStats(): Promise<AdminStats> {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }
    return response.json();
  }

  async getAllQueueStats(): Promise<QueueStats[]> {
    const response = await fetch(`${API_BASE_URL}/admin/queues`);
    if (!response.ok) {
      throw new Error('Failed to fetch queue stats');
    }
    return response.json();
  }

  async getQueueItems(serviceId: string): Promise<QueueItem[]> {
    const response = await fetch(`${API_BASE_URL}/admin/queue/${serviceId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch queue items');
    }
    return response.json();
  }

  async callNext(serviceId: string): Promise<{ success: boolean; nextItem?: QueueItem }> {
    const response = await fetch(`${API_BASE_URL}/admin/call-next/${serviceId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to call next');
    }
    return response.json();
  }

  async completeService(serviceId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/admin/complete/${serviceId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to complete service');
    }
    return response.json();
  }

  async skipToken(serviceId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/admin/skip/${serviceId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to skip token');
    }
    return response.json();
  }

  async setEstimatedWaitTime(serviceId: string, minutes: number): Promise<{ success: boolean; overallWaitTime: number }> {
    const response = await fetch(`${API_BASE_URL}/admin/set-wait-time/${serviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ minutes }),
    });
    if (!response.ok) {
      throw new Error('Failed to set wait time');
    }
    return response.json();
  }

  async getEstimatedWaitTime(serviceId: string): Promise<{ serviceId: string; overallWaitTime: number }> {
    const response = await fetch(`${API_BASE_URL}/admin/wait-time/${serviceId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch wait time');
    }
    return response.json();
  }
}

export default new ApiService();