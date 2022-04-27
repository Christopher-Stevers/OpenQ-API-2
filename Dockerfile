FROM node:lts-alpine
WORKDIR /app
RUN apk update && apk upgrade 
RUN apk install openssl -y
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
RUN npx prisma generate
ENV NODE_ENV="production"
COPY . .
CMD [ "npm", "start" ]
