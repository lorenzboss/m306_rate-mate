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

echo "Führe Prisma Migrationen aus..."
npx prisma migrate deploy
npx prisma generate

echo "Stoppe laufenden Prozess (falls vorhanden)..."
pm2 stop $APP_NAME || true
pm2 delete $APP_NAME || true

echo "Starte Anwendung mit PM2..."
pm2 start npm --name $APP_NAME -- start

echo "Speichere PM2 Prozessliste..."
pm2 save

echo "Sorge für PM2 Autostart beim Systemstart..."
STARTUP_CMD=$(sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME | grep sudo)
if [ -n "$STARTUP_CMD" ]; then
  echo "Führe PM2 Autostart Befehl aus:"
  echo "$STARTUP_CMD"
  eval "$STARTUP_CMD"
fi

echo "Deployment erfolgreich abgeschlossen."
