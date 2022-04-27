FROM node:lts-alpine
RUN apk update && apk upgrade && \
		apk add --no-cache bash git && \
		apk add openssl -y
WORKDIR /app
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY .env ./
RUN yarn
RUN npx prisma generate
ENV NODE_ENV="production"
COPY . .
CMD [ "yarn", "start" ]
