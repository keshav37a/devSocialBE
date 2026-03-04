FROM node:24-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["node", "src/app.js"]