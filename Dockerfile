FROM node:10

ENV LC_ALL=C.UTF-8 \
    HOST=0.0.0.0

COPY . /opt/goldiba-site/client/

WORKDIR /opt/goldiba-site/client/

RUN npm ci \
    && npm run build

EXPOSE 4000

ENTRYPOINT ["npm", "run", "start"]
