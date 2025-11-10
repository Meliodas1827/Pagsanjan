// utils/fetcher.js
export const fetcher = (url : string) =>
  fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  }).then(res => res.json());
