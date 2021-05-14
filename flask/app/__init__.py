import logging
from logging.handlers import RotatingFileHandler

import flask_login
from flask import Flask, abort
from flask import flash, redirect, url_for
from flask import make_response
from flask import request, jsonify, render_template
from flask_login import LoginManager
from flask_login import current_user, login_required
from flask_login import logout_user, login_user
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash


def configure_logging():
    logger = logging.getLogger(__name__)
    logging.getLogger('flask_cors').level = logging.DEBUG
    logger.setLevel(logging.INFO)
    handler = RotatingFileHandler('info.log', maxBytes=100000000, backupCount=1)
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger


app = Flask(__name__, static_folder='./static/', template_folder='./templates/')
app.secret_key = 'c0M`e~t_C1O}d'

client = MongoClient('mongodb', 27017)
db = client['mydb']
users = db.users

logger = configure_logging()

login = LoginManager(app)
login.login_view = 'login'


@login.user_loader
def load_user(username):
    return User.getuser(username, db)


class User(flask_login.UserMixin):
    def __init__(self, user):
        self.id = str(user['username'])
        self.user = user

    def get_id(self):
        username = self.user['username']
        return str(username)

    @classmethod
    def getuser(cls, username, db):
        user = db.users.find_one({"username": username})
        if user:
            return User(user)
        else:
            return None


@app.route('/', methods=['GET'])
def index():
    try:
        if current_user.is_authenticated():
            return redirect(url_for("details"))
        else:
            redirect(url_for("login"))
    except:
        return redirect(url_for("login"))


@app.route('/details', methods=['GET'])
@login_required
def details():
    # db.users.insert_one({"name": "Ivan"})
    return render_template('index.html', user=current_user)


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


# REGISRTATION


@app.route('/login', methods=['GET'])
def login():
    try:
        current_user.is_authenticated()
        return redirect(url_for("index"))
    except:
        return render_template('login.html', error="")


@app.route('/register', methods=['GET'])
def register():
    try:
        current_user.is_authenticated()
        return redirect(url_for("index"))
    except:
        return render_template('register.html')


@app.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')
    user = db.users.find_one({"username": username})
    if user:
        if check_password_hash(str(user['password']), password):
            login_user(User(user))
            flash("Successfully logged in")
            return redirect(url_for('details'))
    else:
        return redirect(url_for('login'))


@app.route('/register', methods=['POST'])
def signup_post():
    username = request.form.get('username')
    password = request.form.get('password')
    user = db.users.find_one({"username": username})
    if user:
        return redirect(url_for('login'))
    try:
        db.users.insert_one({"username": username, "password": generate_password_hash(password, method='sha256')})
    except Exception as ex:
        logger.info(ex)
    return redirect(url_for('login'))


@app.route('/logout')
@login_required
def logout():
    user = current_user
    user.authenticated = False
    logout_user()
    return redirect(url_for('index'))
