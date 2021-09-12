import fetch from 'cross-fetch';
import SheetrockError from './error';

// There is an issue with new Sheets causing the string ")]}'" to be
// prepended to the JSON output when the X-DataSource-Auth is added.
// Until this is fixed, load as text and manually strip with regex. :(
// https://github.com/google/google-visualization-issues/issues/1928
export default function get(response, callback) {
  const transportOptions = {
    headers: {
      'X-DataSource-Auth': 'true',
    },
  };

  fetch(response.request.url, transportOptions)
    .then((resp) => {
      if (!resp.ok) {
        throw new SheetrockError('Request failed.', resp.status);
      }

      return resp.text();
    })
    .then((body) => {
      const data = JSON.parse(body.replace(/^\)]\}'\n/, ''));
      response.loadData(data, callback);
    })
    .catch((error) => {
      if (error instanceof SheetrockError) {
        return callback(error);
      }

      const errorMessage = error && error.message ? error.message : 'Request failed.';

      return callback(new SheetrockError(errorMessage, 500));
    });
}
