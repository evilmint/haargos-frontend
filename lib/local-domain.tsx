import * as ip from 'ip';

export function isLocalDomain(url: URL): boolean {
  if (ip.isV4Format(url.hostname) || ip.isV6Format(url.hostname)) {
    return ip.isPrivate(url.hostname);
  }

  if (
    url.hostname.endsWith('.local') ||
    url.hostname.endsWith('.lan') ||
    url.hostname.endsWith('.internal') ||
    url.hostname.endsWith('.home')
  ) {
    return true;
  }

  return false;
}
