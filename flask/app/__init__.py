import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, request, abort
from pymongo import MongoClient
import jwt
from flask import make_response
from flask import request, jsonify, Blueprint, render_template
from flask_login import current_user


def configure_logging():
    logger = logging.getLogger(__name__)
    logging.getLogger('flask_cors').level = logging.DEBUG
    logger.setLevel(logging.INFO)
    handler = RotatingFileHandler('info.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger


client = MongoClient('mongodb', 27017)
db = client['mydb']
app = Flask(__name__, static_folder='./static/', template_folder='./templates/')
logger = configure_logging()


# login = LoginManager(app)


@app.route('/', methods=['GET'])
def index():
    return render_template('details.html', user=current_user)


@app.route('/foo', methods=['POST'])
def foo():
    if not request.json:
        abort(400)
    req = request.get_json()
    print(req)
    logger.info(req)
    res = make_response(jsonify({"message": "OK"}), 200)
    return res
    # logger.info("worked")
    # if not request.json:
    #     abort(400)
    # print(request.json)
    # logger.info(request.json)
    # return json.dumps(request.json)
