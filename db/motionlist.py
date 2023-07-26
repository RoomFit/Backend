import sqlite3

conn = sqlite3.connect('roomfit.sqlite')
if(conn.is_connected()):
    print("connect")
cursor = conn.cursor()

cursor.execute('SELECT * FROM motion')

result = cursor.fetchall()

for row in result:
    print(row)
    
conn.close()