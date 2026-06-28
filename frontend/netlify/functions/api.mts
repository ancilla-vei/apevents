// @ts-nocheck

const DEFAULT_BACKEND_API_URL = 'https://apbackend-t2xo.onrender.com/api';

const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

const getBackendApiUrl = () => {
  const configuredUrl =
    process.env.BACKEND_API_URL ||
    process.env.REACT_APP_API_URL ||
    DEFAULT_BACKEND_API_URL;

  return stripTrailingSlash(configuredUrl);
};

const getProxyPath = (pathname) => {
  if (pathname.startsWith('/.netlify/functions/api')) {
    return pathname.replace('/.netlify/functions/api', '') || '/';
  }

  if (pathname.startsWith('/api')) {
    return pathname.replace('/api', '') || '/';
  }

  return pathname;
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const requestUrl = new URL(request.url);
  const targetUrl = new URL(
    `${getBackendApiUrl()}${getProxyPath(requestUrl.pathname)}${requestUrl.search}`
  );

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    duplex: 'half',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};

export const config = {
  path: '/api/*',
};
