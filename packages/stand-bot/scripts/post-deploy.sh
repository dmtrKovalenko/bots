#/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

git checkout $1
git pull -v

git fetch --tags

. ~/.profile
. ~/.bashrc

npm install
npx lerna bootstrap
npx lerna run build

cd packages/stand-bot

npm run db:migrate
npm run prod
