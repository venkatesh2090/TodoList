FROM node:12.18.2-alpine3.9
WORKDIR /code
COPY package.json package.json
RUN npm i
COPY . .
ENV PORT 8080
CMD ["npm", "run", "start"]
