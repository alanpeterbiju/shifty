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

#add redirect to instead of return
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
				print(user_name)
				if user_password == password:
					session['username'] = user_name
					session['counter'] = 0
					session['user_flag'] = 0
					session['emp_type'] = user['emp_type']
					if session['emp_type'] == 'staff':
						return redirect(url_for('staff_availablity'))
					else:	
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
	all_staffs  = fetch_allStaffs()
	print("In home")
	# all_Shifts = fetch_allShifts()
	staff_notifications = fetch_assignedShiftInfo()
	add_shifts()

	# if request.method == 'POST' and 'reassign-btn' in request.form:
	# 	shiftID = request.form['shift_id']
	# 	try:
	# 		da
	# 	except Exception as ex:
	# 		exception = ex	
	return render_template('shifts.html', error=error, current_user=current_user, staffInfo = all_staffs, staff_notifications = staff_notifications)

def fetch_allStaffs():
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('emp_type', '=', 'staff').fetch()
	staffDetails = list(fetch_result)
	return staffDetails

def fetch_assignedShiftInfo():
	current_user = session['username']
	managerID = fetch_managerDetails(current_user)

	query = datastore_client.query(kind='shifts')
	fetch_result = query.add_filter('assigned_by', '=', managerID).fetch()
	all_Shifts = list(fetch_result)

	return all_Shifts

def fetch_managerDetails(manager):
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('email', '=', manager).fetch()
	managerDetails = list(fetch_result)

	for manger in managerDetails:
		managerID = manger['emp_id']

	return managerID

@app.route('/shifts_allocated', methods=['GET', 'POST'])
def shifts_allocated():
	error = None
	current_user = session['username']
	query = datastore_client.query(kind='shifts')
	fetch_result = query.fetch()
	shiftDetails = list(fetch_result)

	print(shiftDetails)
	return render_template('shifts_allocated.html', error=error, current_user=current_user, all_Shifts = shiftDetails)

@app.route('/staff_shifts', methods=['GET', 'POST'])
def staff_shifts():
	error = None
	current_user = session['username']
	staffID = fetch_staffDetails(current_user)
	allocated_shifts = all_staffShifts(staffID)
	print(allocated_shifts)
	if request.method == 'POST' and 'emergency-btn' in request.form:
		shiftID = request.form['shift_id']
		decline_Shift(shiftID)
		return redirect(url_for('staff_shifts'))

	return render_template('staff_shifts.html', error=error, current_user=current_user, all_Shifts = allocated_shifts)

# Add shifts to users
def add_shifts():
	error = None
	error_message = None
	current_user = session['username']
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
			shift_assigned_by = fetch_managerDetails(current_user)

			isValidShiftDate = shiftDateValiation(shift_date, shift_staff)
			isValidTime = shiftTimeValidation(shift_start, shift_end)

			if((isValidShiftDate!=None) and (isValidTime!=None)):
				if isValidShiftDate!=None:
					error_message = isValidShiftDate
				elif isValidTime!=None:
					error_message = isValidTime
				return redirect(url_for('home'))
			else:
				try:
					entity = datastore.Entity(key=datastore_client.key('shifts'))
					entity.update({
						'shift_id': shift_id.strftime("%Y%m%d%H%M%S"), 
						'assigned_staff':shift_staff,
						'start_time':shift_start,
						'end_time': shift_end,
						'location': shift_location,
						'date': shift_date,
						'status': 'Not Accepted',
						'assigned_by': shift_assigned_by
						})
					datastore_client.put(entity)

					return redirect(url_for('home'))

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

	if len(staffDetails) > 0: 
		return shift_staff + " is already assigned a shift on the selected day!"
	return None

def shiftTimeValidation(shift_start, shift_end):
	if(shift_start <= shift_end):
		return None
	else: 
		return "Shift start time cannot be more than shift end time!"	

@app.route('/managers', methods=['GET', 'POST'])
def managers():
	error_message = None
	current_user = session['username']

	managerInfo = fetch_all_managerDetails()
	print(managerInfo)
	total_managerCount = fetch_total_managerCount()
	total_staffCount = fetch_total_staffCount()

	print("Helooooooooo")
	if request.method == 'POST':
		if session['emp_type']!= 'shiftManager':
			return redirect(url_for('login'))
		else:
			managerName = request.form['managerName']
			managerEmail = request.form['managerEmail']
			managerAddress =  request.form['managerAddress']
			managerPassword = request.form['managerPassword']
			managerPhone = request.form['managerPhone']
			# managerDOB = request.form['managerDOB']
			managerPosition = request.form['managerPosition']
			# managerDepartment = request.form['managerDepartment']
			managerHourlyRate = request.form['managerHourlyRate']
			managerMaxHours = request.form['managerMaxHours']
			# managerHolidayLeave = request.form['managerHolidayLeave']
			# managerSickLeave = request.form['managerSickLeave']

			print("managers page")
			print(request.form)
			try:
				entity = datastore.Entity(key=datastore_client.key('users'))
				entity.update({
					'name': managerName, 
					'email':managerEmail,
					'emp_id': managerName + managerPhone,
					'emp_type': 'shiftManager',
					'location':managerAddress,
					'password': managerPassword,
					'mobile': managerPhone,
					# 'dob': managerDOB,
					'position': managerPosition,
					'hourly_rate': managerHourlyRate,
					'max_hours': managerMaxHours
					})
				datastore_client.put(entity)
				print("success")

				return redirect(url_for('managers'))
			except Exception as ex:
				exception = ex	
				print(ex)
				print("fail")
	return render_template('managers.html', error=error_message, current_user = current_user,
		managerInfo = managerInfo, managerCount = total_managerCount, staffCount = total_staffCount)

def fetch_all_managerDetails():
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('emp_type', '=', 'shiftManager').fetch()
	all_managerInfo = list(fetch_result)

	return all_managerInfo

def fetch_total_managerCount():
	total_managers = fetch_all_managerDetails()
	counter = 0
	for s in total_managers:
		counter = counter + 1

	return counter

@app.route('/staff', methods=['GET', 'POST'])
def staff():
	error_message = None
	current_user = session['username']

	staffInfo = fetch_all_staffDetails()
	total_staffCount = fetch_total_staffCount()

	if request.method == 'POST':
		if session['emp_type']!= 'shiftManager':
			return redirect(url_for('login'))
		else:
			staffName = request.form['staffName']
			staffEmail = request.form['staffEmail']
			staffAddress =  request.form['staffAddress']
			staffPassword = request.form['staffPassword']
			staffPhone = request.form['staffPhone']
			staffDOB = request.form['staffDOB']
			staffPosition = request.form['staffPosition']
			# staffDepartment = request.form['staffDepartment']
			staffHourlyRate = request.form['staffHourlyRate']
			staffMaxHours = request.form['staffMaxHours']
			# managerHolidayLeave = request.form['managerHolidayLeave']
			# managerSickLeave = request.form['managerSickLeave']

			print("staff page")
			print(request.form)
			try:
				entity = datastore.Entity(key=datastore_client.key('users'))
				entity.update({
					'name': staffName, 
					'email':staffEmail,
					'emp_id': staffName + staffPhone,
					'emp_type': 'staff',
					'location':staffAddress,
					'password': staffPassword,
					'mobile': staffPhone,
					# 'dob': staffDOB,
					'position': staffPosition,
					'hourly_rate': staffHourlyRate,
					'max_hours': staffMaxHours
					})
				datastore_client.put(entity)
				print("success")

				return redirect(url_for('staff'))	
			except Exception as ex:
				exception = ex	
				print(ex)
				print("fail")
		print("In post")
		print(request.form)
	return render_template('staff.html', error=error_message, current_user = current_user, 
		staffInfo=staffInfo, staffCount = total_staffCount)

def fetch_all_staffDetails():
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('emp_type', '=', 'staff').fetch()
	all_staffInfo = list(fetch_result)

	return all_staffInfo

def fetch_total_staffCount():
	total_staff = fetch_all_staffDetails()
	counter = 0
	for s in total_staff:
		counter = counter + 1

	return counter


@app.route('/staff_availablity', methods=['GET', 'POST'])
def staff_availablity():
	error_message = None
	current_user = session['username']

	staffID = fetch_staffDetails(current_user)
	print(staffID)
	allocated_shifts = fetch_AllocatedShifts(staffID)
	print(allocated_shifts)
	if request.method == 'POST' and 'availabilityForm' in request.form:
		print("in post form")
		print(request.form)
		shift_available_date = request.form['startDate']
		shift_available_startTime = request.form['startTime']
		shift_available_endTime = request.form['endTime']

		staff_id = fetch_staffDetails(current_user)
		try:
			print("before")
			entity = datastore.Entity(key=datastore_client.key('staff_shifts'))
			entity.update({
				'available_staff': current_user,
				'available_date':  shift_available_date,
				'available_startTime': shift_available_startTime,
				'available_endTime': shift_available_endTime
				})
			datastore_client.put(entity)
			print("after")
			redirect(url_for('staff_availablity'))
		except Exception as ex:
			exception = ex

	if request.method == 'POST' and 'accept-btn' in request.form:
		print(" in success")
		print(request.form)
		shiftID = request.form['shift_id']
		accept_Shift(shiftID)

	if request.method == 'POST' and 'decline-btn' in request.form:
		print("in decline-btn")
		shiftID = request.form['shift_id']
		decline_Shift(shiftID) 
	return render_template('staff-dashboard.html', error=error_message, current_user = current_user, new_shifts = allocated_shifts)

def accept_Shift(shiftID):
	error_message = None
	current_user = session['username']
	staffID = fetch_staffDetails(current_user)
	print(staffID)
	allocated_shifts = fetch_AllocatedShifts(staffID)
	query = datastore_client.query(kind='shifts')
	fetch_result = query.add_filter('shift_id', '=', shiftID).fetch()

	for staff in fetch_result:
		staff['status'] = 'Accepted'
		datastore_client.put(staff)

	return redirect(url_for('staff_availablity'))

def decline_Shift(shiftID):
	error_message = None
	current_user = session['username']
	staffID = fetch_staffDetails(current_user)
	allocated_shifts = fetch_AllocatedShifts(staffID)
	query = datastore_client.query(kind='shifts')
	fetch_result = query.add_filter('shift_id', '=', shiftID).fetch()

	for staff in fetch_result:
		staff['status'] = 'Declined'
		datastore_client.put(staff)

	return redirect(url_for('staff_availablity'))


def fetch_AllocatedShifts(staffID):
	query = datastore_client.query(kind='shifts')
	query.add_filter('assigned_staff', '=', staffID)
	query.add_filter('status', '=', 'Not Accepted')
	allocated_shifts = list(query.fetch())

	return allocated_shifts

def all_staffShifts(staffID):
	query = datastore_client.query(kind='shifts')
	query.add_filter('assigned_staff', '=', staffID)
	allocated_shifts = list(query.fetch())

	return allocated_shifts


def fetch_staffDetails(staff):
	query = datastore_client.query(kind='users')
	fetch_result = query.add_filter('email', '=', staff).fetch()
	staffDetails = list(fetch_result)

	for staff in staffDetails:
		staffID = staff['emp_id']

	return staffID


# Add shifts to users
# @app.route('/remove_shifts', methods=['GET', 'POST'])
# def remove_shifts():
# 	error = None
# 	error_message = None
# 	print("In remove shifts")

### LOGOUT PAGE ###
@app.route('/logout', methods=['GET', 'POST'])
def logout():
	session.pop('username', None)
	return redirect(url_for('login'))

### APP RUN ###
if __name__ == '__main__':	
	app.run(host='127.0.0.1', port=8080, debug=True)
