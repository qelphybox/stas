# Youtube stas bot

Telegram bot manages youtube playlist from chat

## Run

Requires node v16.0.0

```bash
npm install
cp .env.sample .env
# please fill configuration manually in .env

# run postrges
docker run \
  -p 0.0.0.0:5432:5432 \
  -v `pwd`/tmp/db_data:/var/lib/postgresql/data/pgdata \
  --env PGDATA=/var/lib/postgresql/data/pgdata \
  --env POSTGRES_PASSWORD=password \
  --env POSTGRES_USER=stas \
  --env POSTGRES_DB=stas_development \
  --name stas-postgres \
  -d \
  postgres:13.2-alpine

npm start
```

## Deploy

Push main to deploy

```bash
git push origin main
```
