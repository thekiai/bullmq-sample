import { Worker } from "bullmq";
import * as dotenv from "dotenv";

dotenv.config();

// 環境変数から Redis の設定を取得
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const queueName = "sampleQueue";

// Redis 設定
const worker = new Worker(
  queueName,
  async (job) => {
    console.log(`処理中: ${job.id}`);
    // エラーハンドリング
    if (job.id !== undefined && Number(job.id) % 2 === 0) {
      throw new Error(`エラーが発生しました: ${job.id}`);
    }
    return `ジョブ成功: ${job.id}`;
  },
  {
    connection: {
      host: redisHost,
      port: parseInt(redisPort as string),
    },
  }
);

worker.on("completed", (job) => {
  console.log(`ジョブ成功: ${job.id}`);
});

worker.on("failed", (job, err) => {
  if (job) {
    console.log(`ジョブ失敗: ${job.id}, エラー: ${err.message}`);
  } else {
    console.log(`ジョブ失敗: 不明なジョブ, エラー: ${err.message}`);
  }
});
