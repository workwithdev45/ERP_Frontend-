import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectWorkspaceFromHost } from './subdomain';

function setHostname(hostname: string) {
  vi.stubGlobal('location', { ...window.location, hostname });
}

describe('detectWorkspaceFromHost', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('extracts the workspace id from a subdomain of the portal domain', () => {
    setHostname('acme-traders.msmeerp.com');
    expect(detectWorkspaceFromHost()).toBe('acme-traders');
  });

  it('returns null for the bare portal domain (www)', () => {
    setHostname('www.msmeerp.com');
    expect(detectWorkspaceFromHost()).toBeNull();
  });

  it('returns null on localhost, so the manual field stays for local/dev (G6)', () => {
    setHostname('localhost');
    expect(detectWorkspaceFromHost()).toBeNull();
  });

  it('returns null for a nested subdomain', () => {
    setHostname('app.acme-traders.msmeerp.com');
    expect(detectWorkspaceFromHost()).toBeNull();
  });
});
