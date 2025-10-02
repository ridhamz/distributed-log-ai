import ingestionApp from './api/ingestionApp';
import * as dotenv from 'dotenv';
import { startSQSConsumer } from './consumers';

dotenv.config();

const PORT = process.env.PORT || 4000;

function main() {
  // Start the SQS Consumer Workers in the background
  startSQSConsumer();

  // Start the Express Ingestion API
  ingestionApp.listen(PORT, () => {
    console.log(`Log Ingestion API running on port ${PORT}`);
  });
}

main();
