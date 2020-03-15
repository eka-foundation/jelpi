from flask import Flask
app = Flask(__name__)

from app import routes

app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True