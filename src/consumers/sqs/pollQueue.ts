import { ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import processMessages from './processMessage';

export default async function pollQueue(sqsClient: any, QUEUE_URL: string) {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10, // Process up to 10 messages at a time
      WaitTimeSeconds: 20, // Long polling (reduces cost, waits for messages)
    });

    const { Messages } = await sqsClient.send(command);

    if (Messages && Messages.length > 0) {
      console.log(`Received ${Messages.length} messages. Starting AI analysis...`);
      await processMessages(sqsClient, QUEUE_URL, Messages);
    } else {
      console.log('No messages in queue. Polling again...');
    }
  } catch (error) {
    console.error('Error receiving messages from SQS:', error);
  }

  // Loop: Poll again immediately or after a short delay
  setTimeout(pollQueue, 1000);
}
