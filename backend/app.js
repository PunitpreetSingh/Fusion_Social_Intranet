const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const usersRouter = require('./routes/users');
const spacesRouter = require('./routes/spaces');
const contentRouter = require('./routes/content');
const adminRouter = require('./routes/admin');
const uploadsRouter = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/spaces', spacesRouter);
app.use('/api/content', contentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Social Intranet API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
