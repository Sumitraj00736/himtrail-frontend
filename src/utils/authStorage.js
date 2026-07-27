const TOKEN_COOKIE = 'himtrail_token';
const USER_KEY = 'himtrail_user';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

const isBrowser = () => typeof document !== 'undefined' && typeof window !== 'undefined';

const safeJsonParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getCookie = (name) => {
  if (!isBrowser()) return null;

  const match = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${encodeURIComponent(name)}=`));

  if (!match) return null;

  const value = match.slice(match.indexOf('=') + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const setCookie = (name, value, maxAge = TOKEN_MAX_AGE) => {
  if (!isBrowser()) return;

  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=/`,
    `max-age=${maxAge}`,
    'samesite=lax',
  ].join('; ');
};

export const removeCookie = (name) => {
  if (!isBrowser()) return;
  document.cookie = [
    `${encodeURIComponent(name)}=`,
    'path=/',
    'max-age=0',
    'samesite=lax',
  ].join('; ');
};

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    setCookie(TOKEN_COOKIE, token);
    localStorage.setItem(TOKEN_COOKIE, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  removeCookie(TOKEN_COOKIE);
  localStorage.removeItem(TOKEN_COOKIE);
  localStorage.removeItem(USER_KEY);
};

export const getStoredToken = () => {
  return getCookie(TOKEN_COOKIE) || localStorage.getItem(TOKEN_COOKIE);
};

export const getStoredUser = () => {
  return safeJsonParse(localStorage.getItem(USER_KEY));
};

export const getStoredAuth = () => ({
  token: getStoredToken(),
  user: getStoredUser(),
});
