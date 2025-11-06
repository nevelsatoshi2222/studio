// index.js
const express = require('express');
const app = express();
const port = 3000;

// Import your function
const functionHandler = require('./function/index.js').handler;

app.use(express.json());

// Route to test your function
app.get('/api/test', async (req, res) => {
  try {
    const result = await functionHandler({
      httpMethod: 'GET',
      queryStringParameters: req.query
    }, {});
    
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});