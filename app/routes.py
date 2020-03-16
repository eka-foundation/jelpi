from flask import render_template, request

from app import app

@app.route('/', methods=['GET','POST'])
@app.route('/index', methods=['GET','POST'])
def application():
    region = 'Dharamsala'

    if request.method == 'GET':
        return render_template('need-help.html', region=region)
    elif request.method == 'POST':
        print(request.form)
        return render_template('need-help.html', region=region)
    else:
        print('NOT A VALID SUBMISSION')
        return render_template('need-help.html', region=region)

@app.route('/need', methods=['GET','POST'])
def need():
    region = 'Dharamsala'
    return render_template('meta.html', region=region)
    