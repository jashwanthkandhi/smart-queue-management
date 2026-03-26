import { v4 as uuidv4 } from 'uuid';
import { QueueItem, Service, QueueStats } from './types';

class QueueService {
  private queues: Map<string, QueueItem[]> = new Map();
  private currentServing: Map<string, string> = new Map();
  private tokenCounters: Map<string, number> = new Map();
  private totalServed: number = 0;
  private overallWaitTimes: Map<string, number> = new Map(); // Admin-set overall wait time per service

  private services: Service[] = [
    { id: 'hospital', name: 'Healthcare', icon: 'Heart', color: 'text-red-500', bgColor: 'bg-red-500/10', prefix: 'H' },
    { id: 'bank', name: 'Banking', icon: 'Landmark', color: 'text-blue-500', bgColor: 'bg-blue-500/10', prefix: 'B' },
    { id: 'government', name: 'Government', icon: 'Building2', color: 'text-purple-500', bgColor: 'bg-purple-500/10', prefix: 'G' },
  ];

  constructor() {
    // Initialize queues for each service
    this.services.forEach(service => {
      this.queues.set(service.id, []);
      this.tokenCounters.set(service.id, 1);
      this.currentServing.set(service.id, '---');
      this.overallWaitTimes.set(service.id, 30); // Default 30 minutes overall wait time
    });
  }

  getServices(): Service[] {
    return this.services.map(service => ({
      ...service,
      queueLength: this.queues.get(service.id)?.length || 0,
      averageWaitTime: this.calculateAverageWaitTime(service.id)
    })) as any; // Temporary type assertion
  }

  joinQueue(serviceId: string): QueueItem | null {
    const service = this.services.find(s => s.id === serviceId);
    if (!service) return null;

    const queue = this.queues.get(serviceId) || [];
    const tokenNumber = this.tokenCounters.get(serviceId) || 1;
    const token = `${service.prefix}${tokenNumber.toString().padStart(2, '0')}`;

    const queueItem: QueueItem = {
      id: uuidv4(),
      token,
      serviceId,
      serviceName: service.name,
      timestamp: new Date(),
      status: 'waiting',
      estimatedWaitTime: this.calculateEstimatedWaitTime(serviceId),
      position: queue.length + 1
    };

    queue.push(queueItem);
    this.queues.set(serviceId, queue);
    this.tokenCounters.set(serviceId, tokenNumber + 1);

    return queueItem;
  }

  getQueueStatus(serviceId: string): QueueStats | null {
    const service = this.services.find(s => s.id === serviceId);
    if (!service) return null;

    const queue = this.queues.get(serviceId) || [];
    return {
      serviceId,
      queueLength: queue.length,
      averageWaitTime: this.calculateAverageWaitTime(serviceId),
      currentServing: this.currentServing.get(serviceId)
    };
  }

  getAllQueueStats(): QueueStats[] {
    return this.services.map(service => ({
      serviceId: service.id,
      queueLength: this.queues.get(service.id)?.length || 0,
      averageWaitTime: this.calculateAverageWaitTime(service.id),
      currentServing: this.currentServing.get(service.id)
    }));
  }

  getQueueItems(serviceId: string): QueueItem[] {
    return this.queues.get(serviceId) || [];
  }

  callNext(serviceId: string): QueueItem | null {
    const queue = this.queues.get(serviceId) || [];
    if (queue.length === 0) return null;

    const nextItem = queue.shift();
    if (nextItem) {
      nextItem.status = 'serving';
      this.currentServing.set(serviceId, nextItem.token);
      this.totalServed++;

      // Update positions for remaining items
      queue.forEach((item, index) => {
        item.position = index + 1;
      });
    }

    return nextItem || null;
  }

  completeCurrent(serviceId: string): boolean {
    const currentToken = this.currentServing.get(serviceId);
    if (!currentToken) return false;

    // Mark as completed (could store in history if needed)
    this.currentServing.set(serviceId, '---');
    return true;
  }

  skipToken(serviceId: string): boolean {
    const queue = this.queues.get(serviceId) || [];
    if (queue.length < 2) return false;

    const skipped = queue.shift();
    if (skipped) {
      queue.push(skipped);
      // Update positions
      queue.forEach((item, index) => {
        item.position = index + 1;
      });
    }
    return true;
  }

  getTokenStatus(token: string): QueueItem | null {
    for (const [serviceId, queue] of this.queues) {
      const item = queue.find(item => item.token === token);
      if (item) {
        const currentServing = this.currentServing.get(serviceId);
        if (currentServing === token) {
          item.status = 'serving';
        }
        return item;
      }
    }
    return null;
  }

  getAdminStats() {
    const activeQueues = this.services.filter(s => (this.queues.get(s.id)?.length || 0) > 0).length;
    const avgWaitTime = this.services.reduce((sum, s) => sum + this.calculateAverageWaitTime(s.id), 0) / this.services.length;

    return {
      totalQueues: activeQueues,
      totalServed: this.totalServed,
      averageWaitTime: Math.round(avgWaitTime),
      peakHour: '3 PM' // Could be calculated from historical data
    };
  }

  setOverallWaitTime(serviceId: string, minutes: number): boolean {
    if (!this.services.find(s => s.id === serviceId)) return false;
    this.overallWaitTimes.set(serviceId, Math.max(1, minutes));
    return true;
  }

  getOverallWaitTime(serviceId: string): number {
    return this.overallWaitTimes.get(serviceId) || 30;
  }

  private calculateEstimatedWaitTime(serviceId: string): number {
    // Return the admin-set overall wait time directly
    return this.overallWaitTimes.get(serviceId) || 30;
  }

  private calculateAverageWaitTime(serviceId: string): number {
    const queue = this.queues.get(serviceId) || [];
    if (queue.length === 0) return 0;

    const totalWaitTime = queue.reduce((sum, item) => {
      const waitTime = Date.now() - item.timestamp.getTime();
      return sum + (waitTime / (1000 * 60)); // Convert to minutes
    }, 0);

    return Math.round(totalWaitTime / queue.length);
  }
}

export default new QueueService();