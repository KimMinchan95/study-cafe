# Study Cafe

스터디 카페 관리 시스템

## 개발 환경 실행

### 권장 방법: 하이브리드 실행

**Web (Next.js)**: 로컬 실행 (더 빠른 핫 리로드)  
**API (NestJS)**: Docker 또는 로컬 실행  
**DB (PostgreSQL)**: Docker  
**Redis**: Docker

### 1. 인프라 실행 (Docker)

```bash
# DB와 Redis만 실행
docker-compose up db redis -d

# 또는 API도 함께 실행
docker-compose up db redis api -d
```

### 2. Web 로컬 실행

```bash
# 루트에서 실행 (모든 앱 실행)
pnpm dev

# 또는 Web만 실행
cd apps/web
pnpm dev
```

### 3. API 로컬 실행 (선택사항)

```bash
# Docker 대신 로컬에서 실행하려면
cd apps/api
pnpm dev
```

## 접속 주소

- **Web (Next.js)**: http://localhost:3000
- **API (NestJS)**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Docker로 Web 실행하기

필요시 `docker-compose.yml`에서 web 서비스 주석을 해제하여 Docker로 실행할 수 있습니다.
