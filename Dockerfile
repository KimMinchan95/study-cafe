FROM node:24.12.0-alpine

WORKDIR /usr/src/app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 복사
COPY . .

# API 빌드
RUN pnpm --filter api build

WORKDIR /usr/src/app/apps/api

CMD ["pnpm", "start:prod"]