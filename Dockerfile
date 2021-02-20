FROM m.docker-registry.ir/node:12.3.1

ENV LC_ALL=C.UTF-8 \
    HOST=0.0.0.0

COPY . /opt/goldiba/front/

WORKDIR /opt/goldiba/front/

RUN npm ci \
    && npm run build

EXPOSE 4000

ENTRYPOINT ["npm", "run", "start"]
