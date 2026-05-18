const path = require('path');
const { initDatabase } = require('../src/js/services/db');
initDatabase(path.join(__dirname, '../database/pettycash.db')).then(()=>console.log('Database initialized'));
