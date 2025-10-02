import { Router } from 'express';
import { LogMessage } from '../../types';
import { pushLogToSQS } from '../services/sqsService';

const router = Router();

router.post('/v1/log', async (req, res) => {
  const log = req.body as Partial<LogMessage>;

  if (!log.message || !log.service) {
    return res.status(400).send({ error: 'Missing required fields: message and service.' });
  }

  try {
    // Standardize and enrich the log object
    const enrichedLog: LogMessage = {
      id: log.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      service: log.service,
      environment: log.environment || 'production',
      level: log.level || 'INFO',
      message: log.message,
      metadata: log.metadata || {},
    };

    // Push to SQS via service
    await pushLogToSQS(enrichedLog);

    res.status(202).send({ status: 'Accepted', logId: enrichedLog.id });
  } catch (error) {
    console.error('Error pushing log to SQS:', error);
    res.status(500).send({ error: 'Failed to process log ingestion.' });
  }
});

export default router;
