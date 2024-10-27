const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())

var key = process.env.GAODE_API_KEY;

function my_get(url, params, callback) {
  if (params) {
      let paramsArray = [];
      Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
      if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
      } else {
          url += '&' + paramsArray.join('&')
      }
  }
  console.log(url);
  fetch(url,{
      method: 'GET',
  }).then((response) => response.json())
  .then((json) => {
      callback(json);
  }).catch((error) => {
      alert(error)
  })
}

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-data', (req, res) => {

  const receivedData = JSON.stringify(req.body);

  fs.appendFile('./data', receivedData+'\n', err => {
      if (err) {
        res.status(500).send('Error writing file');
        return;
      }
      res.status(200).send('Data written successfully');
    });
})

app.get('/inputtips', (req, res) => {

  var keywords = req.query.keywords;

  my_get('https://restapi.amap.com/v3/assistant/inputtips', {
    'key': key,
    'keywords': keywords,
  }, (json) => {
      tips = json['tips'];
      res.json({
        'tips': tips
      })
  });
})

app.get('/around', (req, res) => {

  var location = req.query.location;

  my_get('https://restapi.amap.com/v5/place/around', {
    'key': key,
    'location': location
  }, (json) => {
    tips = json['pois'];
    res.json({
      'pois': tips
    })
  })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});