const express = require('express');
const router = express.Router();

const workout_controller = require('../controllers/workout_controller');
const record_controller = require('../controllers/record_controller');
const set_controller = require('../controllers/set_controller');

//운동 시작
router.post('/', workout_controller.create_workout);
//운동 중
router.post('/record', record_controller.create_record);
router.post('/', set_controller.create_set);
//운동 종료
router.put('/done', workout_controller.update_workout);

//기록
router.post('/brief', workout_controller.workout_brief);
router.post('/brief/recent', workout_controller.workout_brief_recent);
router.post('/recent', workout_controller.recent_workouts);
router.post('/calander/:date', workout_controller.get_specific_date_workouts);
router.get('/detail/:workout_id', workout_controller.workout_detail);

//기록 삭제
router.delete('/delete/:workout_id', workout_controller.delete_workout);
router.delete('/delete/record/:record_id', record_controller.delete_record);

//통계
router.post('/stat/:period', workout_controller.get_stat);

module.exports = router;
