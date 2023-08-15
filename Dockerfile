FROM node:16

COPY . /code

WORKDIR /code

CMD ["sh","-c", "yarn install && yarn start"]
