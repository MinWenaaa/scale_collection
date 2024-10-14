const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-data', (req, res) => {

  let data = '';
  req.on('data', chunk => {
    data += chunk.toString();
  });

  req.on('end', () => {
    fs.appendFile('data.csv', data, err => {
      if (err) {
        res.status(500).send('Error writing file');
        return;
      }
      res.status(200).send('Data written successfully');
    });
  })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});