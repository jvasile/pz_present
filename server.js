var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(3050, function(){
    console.log('Server running on 3050...');
});
