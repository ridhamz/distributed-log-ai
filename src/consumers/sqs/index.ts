import { SQSClient } from '@aws-sdk/client-sqs';
import pollQueue from './pollQueue';

// Initialize SQS Client
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const QUEUE_URL = process.env.SQS_QUEUE_URL as string;

export function startSQSConsumer() {
  console.log('Starting distributed log consumer...');
  pollQueue(sqsClient, QUEUE_URL);
}
