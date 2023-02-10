
FROM node:14-alpine AS build
WORKDIR /usr/src/app
COPY src/package*.json .
RUN npm install
COPY src/. .
# RUN tsc
RUN npx tsc -p ./tsconfig.json

# This file is a template, and might need editing before it works on your project.
FROM node:14-alpine 
LABEL MAINTAINER "yumao"

# Copy files as a non-root user. The `node` user is built in the Node image.
WORKDIR /usr/src/app
RUN chown node:node ./
USER node

ENV PORT=3000 \
    NODE_ENV=production

COPY src/package.json .
RUN npm install --production
COPY --from=build /usr/src/app/dist .

#CMD [ "npm", "start" ]
# ENTRYPOINT ["node"]
# CMD ["app.js"]
CMD [ "node", "app.js"]
