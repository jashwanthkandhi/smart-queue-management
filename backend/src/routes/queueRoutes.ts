import { Router, Request, Response } from 'express';
import queueService from '../models/queueService';

const router = Router();

// Get all services with queue info
router.get('/services', (req: Request, res: Response) => {
  try {
    const services = queueService.getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Join a queue
router.post('/join/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const queueItem = queueService.joinQueue(serviceId);

    if (!queueItem) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('queueUpdate', { serviceId, action: 'join', queueItem });

    res.json({
      success: true,
      token: queueItem.token,
      position: queueItem.position,
      estimatedWaitTime: queueItem.estimatedWaitTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join queue' });
  }
});

// Get queue status for a service
router.get('/status/:serviceId', (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const status = queueService.getQueueStatus(serviceId);

    if (!status) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queue status' });
  }
});

// Get token status
router.get('/token/:token', (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const tokenStatus = queueService.getTokenStatus(token);

    if (!tokenStatus) {
      return res.status(404).json({ error: 'Token not found' });
    }

    res.json(tokenStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token status' });
  }
});

export default router;