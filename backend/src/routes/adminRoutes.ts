import { Router, Request, Response } from 'express';
import queueService from '../models/queueService';

const router = Router();

// Get admin dashboard stats
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = queueService.getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all queue stats
router.get('/queues', (req: Request, res: Response) => {
  try {
    const queueStats = queueService.getAllQueueStats();
    res.json(queueStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queue stats' });
  }
});

// Get queue items for a specific service
router.get('/queue/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const queueItems = queueService.getQueueItems(serviceId);
    res.json(queueItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queue items' });
  }
});

// Call next person in queue
router.post('/call-next/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const nextItem = queueService.callNext(serviceId);

    if (!nextItem) {
      return res.status(400).json({ error: 'No one in queue' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('queueUpdate', { serviceId, action: 'callNext', nextItem });

    res.json({ success: true, nextItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to call next' });
  }
});

// Complete current service
router.post('/complete/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const success = queueService.completeCurrent(serviceId);

    if (!success) {
      return res.status(400).json({ error: 'No current service to complete' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('queueUpdate', { serviceId, action: 'complete' });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete service' });
  }
});

// Skip current token
router.post('/skip/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const success = queueService.skipToken(serviceId);

    if (!success) {
      return res.status(400).json({ error: 'Cannot skip token' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('queueUpdate', { serviceId, action: 'skip' });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to skip token' });
  }
});

// Set estimated wait time per person for a service
router.post('/set-wait-time/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const { minutes } = req.body;

    console.log('Setting overall wait time:', { serviceId, minutes });

    if (!minutes || minutes < 1) {
      return res.status(400).json({ error: 'Invalid minutes value (must be >= 1)' });
    }

    const success = queueService.setOverallWaitTime(serviceId, minutes);

    if (!success) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('waitTimeUpdate', { serviceId, overallWaitTime: minutes });

    res.json({ success: true, serviceId, overallWaitTime: minutes });
  } catch (error) {
    console.error('Error setting wait time:', error);
    res.status(500).json({ error: 'Failed to set wait time' });
  }
});

// Get estimated wait time per person for a service
router.get('/wait-time/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const overallWaitTime = queueService.getOverallWaitTime(serviceId);
    res.json({ serviceId, overallWaitTime });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wait time' });
  }
});

export default router;