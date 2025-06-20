#!/bin/bash
set -e

APP_DIR="/var/www/m306_rate-mate"
BRANCH="production"
APP_NAME="ratemate"

echo "Starte Deployment..."

cd "$APP_DIR"

if [ ! -f ".env" ]; then
  echo "ERROR: .env Datei fehlt im $APP_DIR. Deployment abgebrochen."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "ERROR: Aktueller Branch ist '$CURRENT_BRANCH', aber '$BRANCH' wird erwartet."
  exit 1
fi

echo "Hole neueste Änderungen vom Git-Branch $BRANCH..."
git pull origin $BRANCH

echo "Installiere Dependencies..."
npm install

echo "Führe Build durch..."
npm run build

echo "Führe Prisma Migrationen aus..."
npx prisma migrate deploy
npx prisma generate

echo "Starte oder restart Anwendung mit PM2..."
pm2 restart $APP_NAME || pm2 start npm --name $APP_NAME -- start

echo "Speichere PM2 Prozessliste..."
pm2 save

echo "Deployment erfolgreich abgeschlossen!"
