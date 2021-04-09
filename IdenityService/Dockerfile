FROM node:14.15.5-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --save --production
COPY ./build ./src
COPY ./.env .
ENV PORT=5004
EXPOSE 5004
CMD ["node", "./src/index.js"]
