import express from "express";
import { Queue, Worker } from "bullmq";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import * as dotenv from "dotenv";

dotenv.config();

// 環境変数から Redis の設定を取得
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const queueName = "sampleQueue";

// キューを作成
const queue = new Queue(queueName, {
  connection: {
    host: redisHost,
    port: parseInt(redisPort as string),
  },
});

// Express アプリを作成
const app = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin");

// BullMQ のダッシュボードを設定
createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter,
});

app.use("/admin", serverAdapter.getRouter());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Bull-Board is running on http://localhost:${PORT}/admin`);
});
