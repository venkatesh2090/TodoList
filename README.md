# TODO List server

This is a server made in nodejs for managing tasks using TODO Lists

## Pre-build requirements
- nodeJS
- npm
- docker

Before running the scripts, please install the dependencies using 
``` bash
npm i # or
npm install
```
## Setup Database
- ``` bash
  docker run -e POSTGRES_PASSWORD=trust -p 5432:5432 -d --name todo_list postgres
  ```
- ```bash
  docker start todo_list
  ```
- ```bash
  docker exec todo_list psql -U postgres "CREATE DATABASE todo_llist;"
  ```
## Run production build

- ``` bash
  npm run start
  ```
- This would first clean the build files if present
- Then it would transpile the ES6 compaible code using babel
- Then run the server using express

## Run development build

- ``` bash
  npx nodemon
  ```
- Using nodemon enables the server to restart every time a change is detected in the code
