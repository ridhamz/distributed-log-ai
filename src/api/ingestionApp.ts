import express from 'express';
import bodyParser from 'body-parser';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { LogMessage } from '../types';

const app = express();
app.use(bodyParser.json());

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL as string;

app.post('/api/v1/log', async (req, res) => {
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

    // Push to SQS
    const command = new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify(enrichedLog),
      // Use service as MessageGroupId for FIFO queues if needed
    });

    await sqsClient.send(command);

    console.log(`Log pushed to SQS: ${enrichedLog.id}`);
    res.status(202).send({ status: 'Accepted', logId: enrichedLog.id });
  } catch (error) {
    console.error('Error pushing log to SQS:', error);
    res.status(500).send({ error: 'Failed to process log ingestion.' });
  }
});

export default app;
