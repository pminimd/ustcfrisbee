git pull
npm run build
pm2 delete jersey-landing
pm2 start ecosystem.config.cjs
