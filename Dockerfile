FROM node:12.18.2-alpine3.9
WORKDIR /code
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i
COPY . .
ENV PORT 8080
ENV DATABASE_URL postgresql://postgres:trust@postgres:5432
CMD ["npm", "run", "start"]
