FROM node:10.13.0-alpine
WORKDIR /app
COPY package*.json .
COPY tsconfig*.json .
RUN npm install --save --production
COPY ./build ./src
COPY ./.env .
ENV PORT=5003
EXPOSE 5003
CMD ["node", "./src/index.js"]
