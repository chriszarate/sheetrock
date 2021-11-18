import fetch from 'cross-fetch';
import Debug from './debug';
import {
  throwInvalidUrl,
  throwRequestFailed,
  throwRequestTimedOut,
} from './error';

function getMatch(input: string, pattern: string): string | null {
  const regExp = new RegExp(pattern, 'i');
  const match = input.match(regExp);
  if (match) {
    return match[1];
  }

  return null;
}

function getEndpoint(url: string): string {
  const key2010 = getMatch(url, 'key=([^&#]+)');
  const gid = getMatch(url, 'gid=([^/&#]+)') || 0;

  if (key2010) {
    return [
      'https://spreadsheets.google.com/tq',
      `?key=${encodeURIComponent(key2010)}`,
      `&gid=${encodeURIComponent(gid)}`,
    ].join('');
  }

  const key2014 = getMatch(url, 'spreadsheets/d/([^/#]+)');

  if (key2014) {
    return [
      `https://docs.google.com/spreadsheets/d/${key2014}/gviz/tq`,
      `?gid=${encodeURIComponent(gid)}`,
    ].join('');
  }

  return throwInvalidUrl();
}

export default class Transport {
  debug: Debug;

  endpoint: string;

  isBrowser: boolean;

  constructor(url: string, debug: boolean) {
    this.isBrowser = typeof window !== 'undefined';
    this.debug = new Debug(debug);
    this.endpoint = getEndpoint(url);
  }

  fetch(query: string) {
    if (query) {
      this.debug.logQuery(query);
    }

    if (this.isBrowser) {
      return this.fetchBrowser(query);
    }

    return this.fetchServer(query);
  }

  async fetchBrowser(query: string): Promise<GoogleDataTableResponse> {
    const reqId = `${Math.round(Math.random() * 10000)}_${Date.now()}`;
    const callbackName = `__SHEETROCK_CALLBACK_${reqId}`;
    const tqx = `out:json;reqId:${reqId};responseHandler:${callbackName}`;
    const queryUrl = [
      `${this.endpoint}&tq=${encodeURIComponent(query)}`,
      `&tqx=${encodeURIComponent(tqx)}`,
    ].join('');

    this.debug.logRequestUrl(queryUrl);

    // Requests time out after ten seconds.
    const wait = 10000;
    const timeout = setTimeout(() => {
      delete window[callbackName];
      throwRequestTimedOut(wait);
    }, wait);

    // Clear timeout and delete global callback.
    const cleanup = () => {
      clearTimeout(timeout);
      delete window[callbackName];
    };

    return new Promise<GoogleDataTableResponse>((resolve) => {
      window[callbackName] = (data: GoogleDataTableResponse) => {
        this.debug.logRawResponseDescription(data);
        cleanup();

        return resolve(data);
      };

      window
        .fetch(queryUrl)
        .then((response) => {
          if (!response.ok) {
            cleanup();
            return throwRequestFailed(response.status);
          }

          // eslint-disable-next-line no-eval
          return response.text().then(eval);
        })
        .catch((err) => {
          cleanup();
          throw err;
        });
    });
  }

  async fetchServer(query: string): Promise<GoogleDataTableResponse> {
    const transportOptions = {
      headers: {
        'X-DataSource-Auth': 'true',
      },
    };

    const queryUrl = `${this.endpoint}&tq=${encodeURIComponent(query)}`;
    this.debug.logRequestUrl(queryUrl);

    const response = await fetch(queryUrl, transportOptions);

    if (!response.ok) {
      return throwRequestFailed(response.status);
    }

    // There is an issue with 2014 Sheets causing the string ")]}'" to be
    // prepended to the JSON output when the X-DataSource-Auth is added.
    // Until this is fixed, load as text and manually strip with regex. :(
    // https://github.com/google/google-visualization-issues/issues/1928
    const body = await response.text();
    const rawResponse = JSON.parse(body.replace(/^\)]\}'\n/, ''));

    this.debug.logRawResponseDescription(rawResponse);

    return rawResponse;
  }
}
