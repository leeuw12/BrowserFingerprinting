FROM python:3.9.4-slim-buster

# set work directory
WORKDIR /usr/src/flask

# install dependencies
RUN python -m pip install -U pip
COPY ./requirements.txt /usr/src/flask/requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
