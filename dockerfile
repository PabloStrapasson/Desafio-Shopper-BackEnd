FROM node:latest

WORKDIR /usr/api
COPY . /usr/api

RUN npm install --quiet --no-optional --no-fund --loglevel=error
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "start:prod"]