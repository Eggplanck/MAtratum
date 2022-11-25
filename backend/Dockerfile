FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1
ENV TZ=Asia/Tokyo
COPY ./matratum ./matratum
WORKDIR /matratum
RUN pip install --no-cache-dir -r requirements.txt