CREATE TABLE IF NOT EXISTS user (
    user_id TEXT PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    is_api INTEGER NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30),
    birthday TEXT,
    gender INTEGER,
    height INTEGER,
    weight INTEGER,
    experience INTEGER,
    body_fat INTEGER
);

CREATE TABLE IF NOT EXISTS motion (
    motion_id INTEGER PRIMARY KEY,
    motion_name VARCHAR(60) NOT NULL,
    major_target VARCHAR(30) NOT NULL,
    minor_target VARCHAR(30) NOT NULL,
    equipment VARCHAR(30) NOT NULL,
    imageUrl VARCHAR(150) DEFAULT NULL,
    description TEXT NOT NULL,
    count INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS workout (
    workout_id INTEGER PRIMARY KEY,
    user_id TEXT REFERENCES user(user_id) ON DELETE CASCADE NOT NULL,
    start_time TEXT DEFAULT (datetime('now','localtime')),
    end_time TEXT,
    tut TEXT,
    title TEXT DEFAULT "새로운 운동기록",
    memo TEXT DEFAULT ""
);

CREATE TABLE IF NOT EXISTS record (
    record_id INTEGER PRIMARY KEY,
    workout_id INTEGER NOT NULL,
    motion_id INTEGER NOT NULL,

    FOREIGN KEY(workout_id) REFERENCES workout(workout_id) ON DELETE CASCADE
    FOREIGN KEY(motion_id) REFERENCES motion(motion_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS routine (
    routine_id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    routine_name VARCHAR(30) DEFAULT "새로운 루틴",

    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS routine_motion (
    routine_motion_id INTEGER PRIMARY KEY,
    routine_id INTEGER NOT NULL,
    motion_id INTEGER NOT NULL,
    set_order INTEGER NOT NULL,

    FOREIGN KEY(routine_id) REFERENCES routine(routine_id) ON DELETE CASCADE
    FOREIGN KEY(motion_id) REFERENCES motion(motion_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS set_info (
    set_id INTEGER PRIMARY KEY,
    routine_motion_id INTEGER NULL,
    record_id INTEGER NULL,
    set_no INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    rep INTEGER NOT NULL,
    mode INTEGER DEFAULT "기본모드",

    FOREIGN KEY(routine_motion_id) REFERENCES routine_motion(routine_motion_id) ON DELETE CASCADE
    FOREIGN KEY(record_id) REFERENCES record(record_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorite (
    user_id TEXT NOT NULL,
    motion_id INTEGER NOT NULL,

    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE
    FOREIGN KEY(motion_id) REFERENCES motion(motion_id) ON DELETE CASCADE
);