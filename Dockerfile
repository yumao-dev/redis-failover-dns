
FROM node:12-alpine AS build
WORKDIR /usr/src/app
COPY src/package*.json .
RUN npm install
COPY src/. .
# RUN tsc
RUN npx tsc -p ./tsconfig.json

# This file is a template, and might need editing before it works on your project.
FROM node:12-alpine 

LABEL MAINTAINER "yumao"
# Uncomment if use of `process.dlopen` is necessary
# apk add --no-cache libc6-compat

ENV PORT=3000 \
    NODE_ENV=production

WORKDIR /usr/src/app
COPY src/package.json .
RUN npm install --production
COPY --from=build /usr/src/app/dist .

#CMD [ "npm", "start" ]
# ENTRYPOINT ["node"]
# CMD ["app.js"]
CMD [ "node", "app.js"]
