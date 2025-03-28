import { Queue } from "bullmq";
import * as dotenv from "dotenv";

dotenv.config();

// 環境変数から Redis の設定を取得
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const queueName = "sampleQueue";

// Redis 設定
const queue = new Queue(queueName, {
  connection: {
    host: redisHost,
    port: parseInt(redisPort as string),
  },
});

async function addJobs() {
  for (let i = 1; i <= 5; i++) {
    await queue.add("sampleJob", { jobData: `ジョブデータ-${i}` });
    console.log(`ジョブ追加: ${i}`);
  }
}

addJobs()
  .then(() => {
    console.log("ジョブ追加完了");
    process.exit(0); // プロセスを正常終了
  })
  .catch((err) => {
    console.error("エラーが発生しました:", err);
    process.exit(1); // エラー終了
  });
