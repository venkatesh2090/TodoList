# TODO List server

This is a server made in nodejs for managing tasks using TODO Lists

## Pre-build requirements
- nodeJS
- npm

Before running the scripts, please install the dependencies using 
``` bash
npm i # or
npm install
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
