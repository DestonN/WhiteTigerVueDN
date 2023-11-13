const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/checkAdminPassword', (req, res) => {
  const { adminPassword } = req.body;
  const envAdminPassword = process.env.ADMIN_PASSWORD;
  
  console.log('Received admin password:', adminPassword);
  console.log('Env admin password:', envAdminPassword);

  if (adminPassword === envAdminPassword) {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
