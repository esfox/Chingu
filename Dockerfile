FROM node

WORKDIR /usr/src/chingu

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN touch data/data.json
RUN echo "{ \"daily_words\": [], \"weekly_lessons\": [] }" > data/data.json
RUN touch data/wotd.json
RUN echo "[]" > data/wotd.json

EXPOSE 8000
CMD [ "npm",  "start" ]
