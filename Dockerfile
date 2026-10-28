FROM node:24-alpine3.23 as builder

WORKDIR /app
RUN npm i -g npm@latest
COPY package*.json .
COPY .npmrc .
RUN --mount=type=secret,id=github_token,env=NODE_AUTH_TOKEN,required=true npm ci
COPY . .
RUN npm run build

FROM node:24-alpine3.23

WORKDIR /app
RUN npm i -g pm2 npm@latest
RUN apk add --no-cache curl
COPY package*.json .
COPY .npmrc .
RUN --mount=type=secret,id=github_token,env=NODE_AUTH_TOKEN,required=true npm ci --omit=dev
COPY --from=builder /app/build ./build

EXPOSE 4001
CMD ["node"]