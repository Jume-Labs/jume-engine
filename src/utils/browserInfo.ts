export type BrowserType = 'Chrome' | 'Firefox' | 'Internet Explorer' | 'Safari' | 'Unknown';

export function getBrowser(): BrowserType {
  const agent = navigator.userAgent;
  if (agent.includes('Safari') && agent.includes('Chrome')) {
    return 'Safari';
  } else if (agent.includes('Chrome')) {
    return 'Chrome';
  } else if (agent.includes('Firefox')) {
    return 'Firefox';
  } else if (agent.includes('MSIE') || agent.includes('Trident/')) {
    return 'Internet Explorer';
  }

  return 'Unknown';
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
