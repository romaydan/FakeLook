FROM node:14.15.5-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --save --production
COPY ./src ./src
COPY ./.env .
ENV PORT=5002
EXPOSE 5002
CMD ["node", "./src/index.js"]
