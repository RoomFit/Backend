const express = require('express');
const app = express();
app.use(express.json());

const initPassport = require('./config/initPassport');
initPassport(app);

//import routers
const workout = require('./routes/workout_routes');
const record = require('./routes/record_routes');
const account = require('./routes/account_routes');
const set = require('./routes/set_routes');
const motion = require('./routes/motion_routes');
const routine = require('./routes/routine_routes');
const community = require('./routes/community_routes');
const packet = require('./routes/packet_routes');

//router settings
app.use('/workout', workout);
app.use('/record', record);
app.use('/set', set);
app.use('/account', account);
app.use('/motion', motion);
app.use('/routine', routine);
app.use('/community', community);
app.use('/packet', packet);

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
