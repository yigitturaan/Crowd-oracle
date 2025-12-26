'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function MiniAppReady() {
  useEffect(() => {
    // Call ready() as soon as possible to hide loading splash screen
    sdk.actions.ready();
  }, []);

  return null;
}

