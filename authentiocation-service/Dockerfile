FROM node:14.15.5-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --save --production
COPY ./build ./src
COPY ./.env .
ENV PORT=5003
EXPOSE 5003
CMD ["node", "./src/index.js"]
