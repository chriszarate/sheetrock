import SheetrockError from './error';

/* global window */

let callbackIndex = 0;

export default function get(response, callback) {
  const headElement = window.document.getElementsByTagName('head')[0];
  const scriptElement = window.document.createElement('script');
  const callbackName = `_sheetrock_callback_${callbackIndex}`;
  callbackIndex += 1;

  function always() {
    headElement.removeChild(scriptElement);
    delete window[callbackName];
  }

  function success(data) {
    always();
    response.loadData(data, callback);
  }

  function error() {
    always();
    callback(new SheetrockError('Request failed.'));
  }

  window[callbackName] = success;

  if (scriptElement.addEventListener) {
    scriptElement.addEventListener('error', error, false);
    scriptElement.addEventListener('abort', error, false);
  }

  scriptElement.type = 'text/javascript';
  scriptElement.src = `${response.request.url}&tqx=responseHandler:${callbackName}`;
  headElement.appendChild(scriptElement);
}
