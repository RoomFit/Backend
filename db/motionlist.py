import sqlite3
import os
import random

# 절대 경로로 데이터베이스 파일 생성
conn = sqlite3.connect('./db/roomfit.sqlite')
# 데이터베이스 연결

# 커서 생성
cursor = conn.cursor()


cursor.execute('INSERT INTO motion (motion_name, motion_english_name, body_region, sub_muscle, grip, description) VALUES (?, ?,?,?,?,?)', ('바벨 벤치 프레스', 'Barbell Bench Press', '가슴', 'minor target text', 'Barbell', 'Barbell Bench Press Description'))
motion = "벤치"
body_regions = ["가슴", "등", "이두", "삼두", "어깨", "하체"]
grips = ["바벨", "핸들", "Y로프"] 
for i in range(1,300) :
    random_body_region = random.choice(body_regions)
    random_grip = random.choice(grips)
    cursor.execute('INSERT INTO motion (motion_name, motion_english_name, body_region, sub_muscle, grip, description) VALUES (?, ?,?,?,?,?)', (motion+str(i), 'Barbell Bench Press', random_body_region, 'minor target text', random_grip, 'Barbell Bench Press Description'))
    print(i)
    

# 커밋 (변경 사항 저장)
conn.commit()

# 연결 종료
conn.close()