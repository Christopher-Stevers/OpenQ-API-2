FROM node:18.14.0-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git
RUN apk add --update --no-cache openssl1.1-compat
COPY package.json .
RUN yarn
COPY . .
ENV NODE_ENV="production"
RUN npx prisma generate
EXPOSE 4000
ENTRYPOINT yarn start