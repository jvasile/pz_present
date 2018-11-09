var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var jsonBody = require('body/json');

var app = connect().use(serveStatic(__dirname));

app.use('/save-views', (req, res) => {
  req.on('error', err => {
    console.error(err);
    res.statusCode = 400;
    return res.end();
  });
  res.on('error', err => {
    return console.error(err);
  });

  jsonBody(req, res, (err, body) => {
    // err is probably an invalid json error
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.end('Error: invalid JSON?');
    }

    fs.writeFile('views.json', JSON.stringify(body, undefined, 2), () => {
      res.setHeader('Content-Type', 'text/plain');
      res.end('Successfully saved preset views.');
    });
  });
});

app.listen(3050, function() {
  console.log('Server running on 3050...');
});
