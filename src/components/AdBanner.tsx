'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner() {
  const insRef = useRef<HTMLModElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let adFailed = false;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      adFailed = true;
    }

    // If the ad script threw or didn't render after a delay, hide the empty space
    const timer = setTimeout(() => {
      if (adFailed || (insRef.current && insRef.current.offsetHeight === 0)) {
        setHidden(true);
      }
    }, adFailed ? 0 : 3000);

    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <ins
      ref={insRef}
      className="adsbygoogle w-full max-w-250 mx-auto my-6 px-4"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-1462786245330262"
      data-ad-slot="XXXXXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
