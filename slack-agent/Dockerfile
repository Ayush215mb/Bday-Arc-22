FROM node:22-slim
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --filter "slack..."
WORKDIR /app/apps/slack
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./node_modules/.bin/tsx", "src/server.ts"]
