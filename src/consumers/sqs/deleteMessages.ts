import { DeleteMessageBatchCommand } from '@aws-sdk/client-sqs';

export default async function deleteMessages(
  sqsClient: any,
  QUEUE_URL: string,
  entries: { Id: string; ReceiptHandle: string }[]
) {
  const command = new DeleteMessageBatchCommand({
    QueueUrl: QUEUE_URL,
    Entries: entries,
  });
  await sqsClient.send(command);
  console.log(`Successfully deleted ${entries.length} messages.`);
}
