FROM node:lts-alpine
WORKDIR /usr/src/app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git && \
	apk add openssl
COPY package.json .
RUN yarn
COPY . .
RUN npx prisma generate
ENV NODE_ENV="production"
EXPOSE 4000
ENTRYPOINT yarn start
