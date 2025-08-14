FROM node:20

WORKDIR /usr/src/app

EXPOSE 3000

CMD ["npm", "run", "start:dev"]