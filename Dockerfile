FROM node:12-alpine

RUN mkdir /usr/cep-address

WORKDIR /usr/cep-address

COPY package.json ./
COPY package-lock.json ./

COPY . .

RUN npm i

EXPOSE 3333

CMD ["npm", "run", "dev"]