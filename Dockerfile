FROM node:14.4.0-alpine3.10
WORKDIR /code
COPY package.json package.json
RUN npm i
COPY . .
ENV PORT 8080
CMD ["npm", "run", "start"]
