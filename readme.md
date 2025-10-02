# Distributed Log Processing with AI Agents

## 📖 Overview

This project is a **Distributed Log Processing System** built with **Node.js (TypeScript)**, **AWS**, and **AI Agents (Claude)**.  
It is designed to handle large volumes of log data in **real time**, detect anomalies using AI, and store insights in a **scalable distributed architecture**.

### 🎯 Key Features

- **Log Ingestion Service** → Accepts logs from distributed clients.
- **Queue & Stream Processing** → Uses **AWS SQS / Kinesis** for scalable log streaming.
- **AI Anomaly Detection** → Sends logs to **Claude API** for anomaly detection.
- **Storage & Metadata** → Stores raw logs in **S3** and metadata in **DynamoDB**.
- **Distributed Workers** → Multiple worker nodes can consume logs concurrently.
- **Dashboard-ready** → Exposes APIs for monitoring & future integration with Grafana/React dashboards.

---

## 🏗 Architecture

```mermaid
flowchart LR
    A[Log Source: Apps/Servers] -->|Send logs| B[Log Ingestion API (Express + TypeScript)]
    B -->|Push| C[SQS / Kinesis Queue]
    C --> D[Worker Service (Node.js Consumers)]
    D -->|Raw Logs| E[S3 Bucket]
    D -->|Metadata| F[DynamoDB]
    D -->|Send log snippet| G[Claude AI API]
    G -->|Anomaly Detection| D
    D --> H[Monitoring / API Layer]
    H --> I[Dashboard / Grafana / React Frontend]
```

---

## ⚙️ Tech Stack

- **Backend Runtime** → Node.js + TypeScript
- **Queue & Stream** → AWS SQS / Kinesis
- **Storage** → AWS S3 (logs), DynamoDB (metadata)
- **AI Integration** → Claude (Anthropic API) for anomaly detection
- **Config & Secrets** → dotenv + `.env`
- **Monitoring Ready** → Exposes REST APIs for dashboards

---

## 🚀 Setup & Run

### 1️⃣ Clone Repo

```bash
git clone https://github.com/ridhamz/distributed-log-ai.git
cd distributed-log-ai
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file in root:

```env
AWS_REGION=us-east-1
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/log-queue
S3_BUCKET_NAME=distributed-logs-bucket
DYNAMO_TABLE=LogsMetadata
CLAUDE_API_KEY=your-claude-api-key
CLAUDE_MODEL=claude-3-opus-20240229
PORT=4000
```

### 4️⃣ Run in Dev Mode

```bash
npm run dev
```

### 5️⃣ Run in Prod Mode (compiled)

```bash
npm run build
npm start
```

---

## 🔌 AWS + AI Integration

- **Logs ingestion** → API receives logs and pushes them to **SQS queue**.
- **Workers** → Consume messages from SQS, save raw logs in **S3**, and insert metadata into **DynamoDB**.
- **AI (Claude)** → Selected logs are passed to **Claude** for anomaly detection.
- **Insights** → Results are tagged in DynamoDB and exposed via REST APIs.

---

## 📊 Future Improvements

- Add **Grafana dashboard** for real-time visualization.
- Support **multi-region replication** for HA.
- Add **Kafka** support as alternative to SQS.
- Introduce **stream-based training** for AI models (self-learning).
