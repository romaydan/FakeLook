FROM node:14.15.5-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --save --production
COPY ./src ./src
COPY ./.env .
ENV PORT=5000
EXPOSE 5000
CMD ["node", "./src/index.js"]
