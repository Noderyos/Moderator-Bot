FROM node:latest
WORKDIR /usr/local/moderator

COPY package.json ./
RUN npm install

COPY . .

RUN useradd bot
USER bot

CMD ["npm", "start"]
