FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy; npx prisma db push && npx tsx src/server.ts"
