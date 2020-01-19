const https = require('https');

const rest_api_url = process.env.RESTAPI_URL;
const rest_api_port = process.env.RESTAPI_PORT;

exports.restapi_get = function(path) {
    return new Promise((resolve, reject) => {
        var url = rest_api_url + ':' + rest_api_port + path;
        https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log('Http-service Get: Data received: ' + data);
            resolve(JSON.parse(data));
        });

        }).on("error", (err) => {
            console.log("Http-service Get: Error: " + err.message);
            reject(err);
        });
    });
}

exports.restapi_post = function(path, bodyObject) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bodyObject);

        const options = {
            hostname: rest_api_url,
            port: rest_api_port,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, (res) => {
            console.log(`Http-service Post: StatusCode: ${res.statusCode}`);

            var postResponseString = '';
            res.on('data', (d) => {
                // console.log('Http-service Post: Data received: ' + d);
                // resolve(JSON.parse(d))
                postResponseString += d;
            });

            res.on('end', () => {
                console.log('Http-service Post end: Data received: ' + postResponseString);
                resolve(JSON.parse(d));
            });
        });

        req.on('error', (error) => {
            console.log("Http-service Post: Error: " + error.message);
            reject(error);
        })

        req.write(data)
        req.end()
    });
}

exports.restapi_delete = function(path) {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: rest_api_url,
            port: rest_api_port,
            path: path,
            method: 'DELETE'
        }

        const req = https.request(options, (res) => {
            console.log(`Http-service Delete: StatusCode: ${res.statusCode}`);

            var postResponseString = '';
            res.on('data', (d) => {
                // console.log('Http-service Post: Data received: ' + d);
                // resolve(JSON.parse(d))
                postResponseString += d;
            });

            res.on('end', () => {
                console.log('Http-service Delete end: Data received: ' + postResponseString);
                resolve(JSON.parse(d));
            });
        });

        req.on('error', (error) => {
            console.log("Http-service Delete: Error: " + error.message);
            reject(error);
        })

        req.write(data)
        req.end()
    });
}