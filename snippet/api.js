'use strict';
/* global XMLHttpRequest */

const API_URL = 'https://vote.wdgt.io/api/v1';

function api(path, body, callback) {
  const req = new XMLHttpRequest();

  if (typeof body !== 'function') {
    req.open('PUT', API_URL + path, true);

    body = JSON.stringify(body);
    req.setRequestHeader('content-type', 'application/json');
  } else {
    req.open('GET', API_URL + path, true);

    callback = body;
    body = false;
  }

  req.onreadystatechange = () => {
    if (req.readyState !== XMLHttpRequest.DONE)
      return;

    let json;
    try {
      json = JSON.parse(req.responseText);
    } catch (e) {
      return callback(e);
    }

    const err = (req.status < 200 || req.status >= 400) ?
      new Error('Bad HTTP status: ' + req.status) : null;
    callback(err, json);
  };

  if (body)
    req.send(body);
  else
    req.send();
}
module.exports = api;
