FROM node:14-alpine as react-build
COPY ./front ./app
WORKDIR /app
RUN yarn install --network-timeout 600000
RUN yarn build

FROM nginx:latest
ENV TZ=Asia/Tokyo
COPY --from=react-build /app/build /front
COPY ./default.conf /etc/nginx/conf.d/default.conf