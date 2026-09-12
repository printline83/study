import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 마이그레이션은 풀러(pooler)를 거치지 않는 직접 연결을 사용
    url: env("DIRECT_URL"),
  },
});
