FROM node:20-alpine3.16

WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV HOST=0.0.0.0
ENV PORT=5173

CMD ["npm", "run", "dev"]