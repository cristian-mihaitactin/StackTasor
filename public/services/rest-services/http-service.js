const http = require('http');
// https.globalAgent.options.ca = require('ssl-root-cas/latest').create();

const rest_api_url = process.env.RESTAPI_URL;
const rest_api_port = process.env.RESTAPI_PORT;

exports.restapi_get = function (path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: rest_api_url,
            port: rest_api_port,
            path: path,
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Content-Length': data.length
            // },
            agent: new http.Agent({
                rejectUnauthorized: false,
            }),
        }

        const req = http.request(options, (res) => {
            console.log(`Http-service GET: StatusCode: ${res.statusCode}`);

            var postResponseString = '';
            res.on('data', (d) => {
                console.log('Http-service Post: Data received: ' + d);
                // resolve(JSON.parse(d))
                postResponseString += d;
            });

            res.on('end', () => {
                console.log('Http-service GET end: Data received: ' + postResponseString);
                resolve(JSON.parse(postResponseString));
            });
        });

        req.on('error', (error) => {
            console.log("Http-service GET: Error: " + error.message);
            reject(error);
        })

        // req.write(data)
        req.end()
    });
}

exports.restapi_post = function (path, bodyObject) {
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
            },
            agent: new http.Agent({
                rejectUnauthorized: false,
            }),
        }
        const req = http.request(options, (res) => {
            console.log(`Http-service Post: StatusCode: ${res.statusCode}`);

            var postResponseString = '';
            res.on('data', (d) => {
                postResponseString += d;
            });

            res.on('end', () => {
                console.log('Http-service Post end: Data received: ' + postResponseString);
                if (typeof (postResponseString) != 'undefined' && postResponseString !== null && postResponseString != '' && postResponseString.undefined != 1) {
                    resolve(JSON.parse(postResponseString));
                } else {
                    resolve();
                }
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

exports.restapi_delete = function (path) {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: rest_api_url,
            port: rest_api_port,
            path: path,
            method: 'DELETE',
            agent: new http.Agent({
                rejectUnauthorized: false,
            }),
        }

        const req = http.request(options, (res) => {
            console.log(`Http-service Delete: StatusCode: ${res.statusCode}`);

            var postResponseString = '';
            res.on('data', (d) => {
                postResponseString += d;
            });

            res.on('end', () => {
                console.log('Http-service Delete end: Data received: ' + postResponseString);
                if (typeof (postResponseString) != 'undefined' && postResponseString !== null && postResponseString != '' && postResponseString.undefined != 1) {
                    resolve(JSON.parse(postResponseString));
                } else {
                    console.log('before simple');
                    resolve(postResponseString);
                    console.log('after simple');
                }
            });
        });

        req.on('error', (error) => {
            console.log("Http-service Delete: Error: " + error.message);
            reject(error);
        })

        // req.write(data)
        req.end()
    });
}

exports.restapi_query = function (path, bodyObject) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bodyObject);

        const options = {
            hostname: rest_api_url,
            port: rest_api_port,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            agent: new http.Agent({
                rejectUnauthorized: false,
            }),
        }

        const req = http.request(options, (res) => {
            console.log(`Http-service Post: StatusCode: ${res.statusCode}`);

            var postResponseString = '';
            res.on('data', (d) => {
                postResponseString += d;
            });

            res.on('end', () => {
                console.log('Http-service Post end: Data received: ' + postResponseString);
                resolve(JSON.parse(postResponseString));
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