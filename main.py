from flask import Flask, render_template, request, redirect, url_for, session
from google.cloud import datastore
from google.cloud import storage
from datetime import date
import json 
import requests
import os
import datetime

datastore_client = datastore.Client()

storage_client = storage.Client()

app = Flask(__name__)
app.secret_key = 'af2ea574685f5a205b976c9e4a'

counter = 0
user_flag = 0


### LOGIN PAGE ###
@app.route('/', methods=['GET', 'POST'])
def login():
	error_message = None
	error = None
	if request.method == 'POST':

		user_email = request.form['email']
		password = request.form['password']



		current_User = fetch_userData(user_email)
		if current_User:
			for user in  current_User:
				user_name = user['email']
				user_id = user['emp_id']
				user_password = user['password']
				if user_password == password:
					session['username'] = user_name
					session['counter'] = 0
					session['user_flag'] = 0
					session['emp_type'] = user['emp_type']
					return redirect(url_for('home'))
				else:
					error_message = "ID or password is Invalid"
		else:				
			error_message = "ID or password is Invalid"
	return render_template('login.html', error=error_message)

def fetch_userData(user_email):
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('email', '=', user_email).fetch()
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

		query = datastore_client.query(kind='users')

		current_user_id = check_userID(user_id, query)

		current_user_name = check_username(username)

		if current_user_id:
			error = 'UserID exists'
			return render_template('registration.html', error=error)

		elif current_user_name:
			error = 'Username exist'
			return render_template('registration.html', error=error)
		else:
			try:
				entity = datastore.Entity(key=datastore_client.key('users'))
				entity.update({
					'emp_id':user_id,
					'email':username,
					'password':password
					})
				datastore_client.put(entity)
				return redirect(url_for('login'))
			except Exception as ex:
				print("Exception: " + str(ex))

	return render_template('registration.html', error=error)


def check_userID(user_id, query):
	fetch_result = query.add_filter('id', '=', user_id).fetch()
	user_data = list(fetch_result)

	return user_data

def check_username(username):
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('user_name', '=', username).fetch()
	user_data = list(fetch_result)

	return user_data

@app.route('/home', methods=['GET', 'POST'])
def home():
	error = None
	current_user = session['username']
	all_staffs  = fetch_all_Staffs()
	return render_template('shifts.html', error=error, current_user=current_user, staffInfo = all_staffs)

def fetch_all_Staffs():
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('emp_type', '=', 'staff').fetch()
	staffDetails = list(fetch_result)
	return staffDetails

# Add shifts to users
@app.route('/add_shifts', methods=['GET', 'POST'])
def add_shifts():
	error = None
	error_message = None
	if request.method == 'POST':
		if session['emp_type']!= 'shiftManager':
			return redirect(url_for('login'))
		else:
			current_user = session['username']
			shift_start = request.form['startTime']
			shift_end = request.form['endTime']
			shift_location = request.form['location']
			shift_staff = request.form['staffInput']
			shift_date = request.form['startDate']
			shift_id = datetime.datetime.now()

			# isValidShift = shiftValidation(shift_start, shift_end, shift_staff, shift_date)

			isValidShiftDate = shiftDateValiation(shift_date, shift_staff)
			isValidTime = shiftTimeValidation(shift_start, shift_end)
			# isValidTime = shiftTimeValidation(shift_start, shift_end)
			if(isValidShiftDate!=None):
				error_message = isValidShiftDate
				return render_template('shifts.html', error=error_message)
			else:
				try:
					entity = datastore.Entity(key=datastore_client.key('shifts'))
					entity.update({
						'shift_id': shift_id.strftime("%Y%m%d%H%M%S"), 
						'assigned_staff':shift_staff,
						'start_time':shift_start,
						'end_time': shift_end,
						'location': shift_location,
						'date': shift_date
						})
					datastore_client.put(entity)

					return render_template('shifts.html', error=error_message)

				except Exception as ex:
				exception = ex		
	return render_template('shifts.html', error=error_message)

def shiftDateValiation(shift_date, shift_staff):
	currentDate = date.today().strftime("%Y-%m-%d")

	empShift = checkAllShifts(shift_date, shift_staff)

	if (shift_date < currentDate):	
		return "Invalid Date"
	elif(empShift!=None):
		return empShift	
	else:
		return None
		

def checkAllShifts(shift_date, shift_staff):
	query = datastore_client.query(kind='shifts')
	query.add_filter('assigned_staff', '=', shift_staff)
	query.add_filter('date', '=', shift_date)
	fetch_result = query.fetch()
	staffDetails = list(fetch_result)

	if staffDetails.size > 0 
		return shift_staff + " is already assigned a shift on the selected day!"
	return None

def shiftTimeValidation(shift_start, shift_end):
	if(shift_start > shift_end)


### LOGOUT PAGE ###
@app.route('/logout', methods=['GET', 'POST'])
def logout():
	session.pop('username', None)
	return redirect(url_for('login'))

### APP RUN ###
if __name__ == '__main__':	
	app.run(host='127.0.0.1', port=8000, debug=True)
