FROM node:17.3-alpine3.15
RUN addgroup admin && adduser -S -G admin admin
USER admin
WORKDIR /app
COPY . . 
RUN npm install
ENV port : 80
EXPOSE 80
CMD npm start