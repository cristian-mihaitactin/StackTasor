var azure = require('azure-storage');
const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
    
    let pathname = url.parse(req.url).pathname;

    console.log(`Request for ${pathname} received`);
 
    if (pathname == '/') {
 
       pathname = '/index.html';
    }
 
    fs.readFile('public/' + pathname.substr(1), (err, data) => {
       if (err) {
 
          console.error(err);
 
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 - file not found');
 
       } else {
           var memetype = getMimeType(pathname.substr(1))
           console.log(memetype)
           res.writeHead(200, { 'Content-Type': memetype });
           res.write(data.toString());
       }
 
       res.end();
    });
 });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getMimeType(fileName) {
    switch(fileName.split(".").slice(-1).pop()) {
        case "html":
            // code block
            return "text/html"
            break;
        case "css":
            // code block
            return "text/css"
            break;
        case "png":
        // code block
            return "image/png"
            break;
        case "js":
        // code block
            return "application/javascript"
            break;
        default:
            return "text/plain"
          // code block
      }
}