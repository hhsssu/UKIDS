FROM node:20.15.0-alpine as builder
WORKDIR /app
COPY package.json package-lock.json .

RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
VOLUME ./nginx
RUN rm -rf /etc/nginx/conf.d
COPY ./nginx/conf /etc/nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]