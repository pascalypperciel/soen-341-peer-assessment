from dotenv import load_dotenv
import os
import pyodbc

load_dotenv()
server = os.getenv('DB_SERVER')
database = os.getenv('DB_DATABASE')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
driver = os.getenv('DB_DRIVER')

print("Server:", server)
print("Database:", database)
print("Username:", username)
print("Password:", password)
print("Driver:", driver)

if None in [server, database, username, password, driver]:
    raise ValueError("One or more required environment variables are missing")

conn = pyodbc.connect(
    'DRIVER=' + driver + ';SERVER=' + server + ';PORT=1433;DATABASE=' + database + ';UID=' + username + ';PWD=' + password
)