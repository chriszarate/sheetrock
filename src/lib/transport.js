import request from 'request';
import SheetrockError from './error';

function getErrorMessage(error, resp) {
  if (resp && resp.statusCode) {
    return resp.statusCode;
  }

  return error.code;
}

// There is an issue with new Sheets causing the string ")]}'" to be
// prepended to the JSON output when the X-DataSource-Auth is added.
// Until this is fixed, load as text and manually strip with regex. :(
// https://github.com/google/google-visualization-issues/issues/1928
function get(response, callback) {
  const transportOptions = {
    headers: {
      'X-DataSource-Auth': 'true',
    },
    timeout: 5000,
    url: response.request.url,
  };

  request(transportOptions, (error, resp, body) => {
    if (!error && resp.statusCode === 200) {
      const data = JSON.parse(body.replace(/^\)\]\}'\n/, ''));
      response.loadData(data, callback);
      return;
    }

    callback(new SheetrockError('Request failed.', getErrorMessage(error, resp)));
  });
}

export default get;
