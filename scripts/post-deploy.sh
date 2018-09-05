#/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

git checkout $1
git pull -v

git fetch --tags

rm -rf node_modules
npm install --no-save --production
npm run build
npm run db:migrate
npm run prod
