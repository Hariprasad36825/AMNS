FROM node:16

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 8080

RUN node --version

CMD [ "npm", "run", "dev" ]