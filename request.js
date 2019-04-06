
let requestUrl = 'https://gateway.marvel.com:443/v1/public/characters?';
function makeRequest(params) {
    let httpRequest;
    return new Promise((resolve, reject) => {
        let queryParams = buildRequestParams(params);
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(httpRequest.response);
                } else {
                    reject('There was a problem with the request.');
                }
            }
        };
        httpRequest.open('GET', requestUrl + queryParams);
        httpRequest.send();
    });
}

function buildRequestParams(params) {
    let keys = Object.keys(params);
    let str = '' + keys[0] + '=' + params[keys[0]];
    for (let i = 1; i < keys.length; i++) {
        str += "&" + keys[i] + '=' + params[keys[i]];
    }
    return str;
}