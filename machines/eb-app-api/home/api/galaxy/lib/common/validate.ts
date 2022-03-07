export function isValidUrl(url: string): boolean {
  const regex = "^https?://[a-zA-Z0-9.-]*(?::[0-9]+)?(?:/[0-9a-zA-Z./-]*)?$";

  return url.match(regex);
}
