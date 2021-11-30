FROM node:14-alpine as react-build
COPY ./front ./app
WORKDIR /app
RUN yarn
RUN yarn build

FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Tokyo
RUN apt-get update && apt-get -y upgrade && apt-get install -y tzdata && apt-get install nginx gettext-base -y && mkdir front
COPY --from=react-build /app/build front/build
COPY ./custom.conf /etc/nginx/conf.d/custom.template
COPY ./matratum ./matratum
WORKDIR /matratum
RUN pip install --no-cache-dir -r requirements.txt
COPY ./entry.sh /entry.sh
RUN chmod 755 /entry.sh
CMD /entry.sh
