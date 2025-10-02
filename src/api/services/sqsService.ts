import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { LogMessage } from '../../types';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL as string;

export async function pushLogToSQS(log: LogMessage) {
  const command = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(log),
    // Use service as MessageGroupId for FIFO queues if needed
  });

  await sqsClient.send(command);
  console.log(`Log pushed to SQS: ${log.id}`);
}
