export const getAnonymousId = () => {
  const match = document.cookie.match(/(?:^|;\s*)anonymousId=([^;]+)/);

  if (match) {
    return decodeURIComponent(match[1]);
  }

  const anonymousId = crypto.randomUUID();

  document.cookie = `anonymousId=${encodeURIComponent(
    anonymousId,
  )}; Path=/; SameSite=Lax`;

  return anonymousId;
};
