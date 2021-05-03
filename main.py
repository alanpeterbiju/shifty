from flask import Flask, render_template, request, redirect, url_for, session
from google.cloud import datastore
from google.cloud import storage
import json 
import requests
import os
import datetime

datastore_client = datastore.Client()

storage_client = storage.Client()

app = Flask(__name__)
app.secret_key = ''

counter = 0
user_flag = 0


### LOGIN PAGE ###
@app.route('/', methods=['GET', 'POST'])
def login():
	error_message = None
	error = None
	if request.method == 'POST':
		user_id = request.form['user_id']
		password = request.form['password']


		current_User = fetch_userData(user_id)
		if current_User:
			for username in  current_User:
				user_name = username['user_name']
				user_id = username['id']
				user_password = username['password']
				if user_password == password:
					session['username'] = user_name
					session['counter'] = 0
					session['user_flag'] = 0
					return redirect(url_for('forum'))
				else:
					error_message = "ID or password is Invalid"
		else:				
			error_message = "ID or password is Invalid"
	return render_template('index.html', error=error_message)

def fetch_userData(user_id):
	query = datastore_client.query(kind='user')
	fetch_result = query.add_filter('id', '=', user_id).fetch()
	user_data = list(fetch_result)

	return user_data

###REGISTRATION PAGE###	
@app.route('/registration', methods=['GET', 'POST'])
def registration():
	useID_error = None
	error = None
	if request.method == 'POST':
		user_id = request.form['id']
		username = request.form['username']
		password = request.form['password']
		image = request.files['image']

		query = datastore_client.query(kind='user')

		current_user_id = check_userID(user_id, query)

		current_user_name = check_username(username)

		if current_user_id:
			error = 'UserID exists'
			return render_template('registration.html', error=error)

		elif current_user_name:
			error = 'Username exist'
			return render_template('registration.html', error=error)
		else:
			entity = datastore.Entity(key=datastore_client.key('user'))
			entity.update({
				'id':user_id,
				'user_name':username,
				'password':password
				})
			datastore_client.put(entity)
			return redirect(url_for('login'))

	return render_template('registration.html', error=error)


def check_userID(user_id, query):
	fetch_result = query.add_filter('id', '=', user_id).fetch()
	user_data = list(fetch_result)

	return user_data

def check_username(username):
	query = datastore_client.query(kind='user')
	fetch_result = query.add_filter('user_name', '=', username).fetch()
	user_data = list(fetch_result)

	return user_data

### LOGOUT PAGE ###
@app.route('/logout', methods=['GET', 'POST'])
def logout():
	session.pop('username', None)
	return redirect(url_for('login'))

### APP RUN ###
if __name__ == '__main__':	
	app.run(host='127.0.0.1', port=8080, debug=True)
