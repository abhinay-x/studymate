// Minimal test server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server working' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
