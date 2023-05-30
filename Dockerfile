# DEVELOPEMENT WITHOUT NPM INSTALL

FROM node:14.15.3-alpine3.10

WORKDIR /app

# ENV PATH /app/node_modules/.bin:$PATH 

RUN npm install -g @angular/cli@12.0.5 --unsafe

# COPY package.json /app/package.json
# RUN npm install

# START NG SERVE
# COPY . /app
# CMD npm run build-serve-local

# run command
# docker run -v ${PWD}:/app -v /app/node_modules -p 3201:3200 --rm sabbir006/ebon:v3