#/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

git checkout $1
git pull -v

git fetch --tags

source /home/admin/.bashrc

npm install --no-save --production
npm run build
sudo -E npm run db:migrate
npm run prod
