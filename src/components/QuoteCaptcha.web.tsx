import { createElement, useEffect, useRef } from 'react';
import { hcaptchaSiteKey, type QuoteCaptchaProps } from '../lib/formSecurity';

const SCRIPT_ID = 'hcaptcha-api';

type HCaptchaApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }
  ) => string | number;
  reset: (widgetId?: string | number) => void;
};

function getHCaptcha(): HCaptchaApi | undefined {
  return (globalThis as { hcaptcha?: HCaptchaApi }).hcaptcha;
}

export function QuoteCaptcha({ onVerify, onExpire, resetKey }: QuoteCaptchaProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const verifyRef = useRef(onVerify);
  const expireRef = useRef(onExpire);
  verifyRef.current = onVerify;
  expireRef.current = onExpire;

  useEffect(() => {
    const renderWidget = () => {
      const hcaptcha = getHCaptcha();
      if (!hcaptcha || !hostRef.current || widgetIdRef.current != null) return;
      widgetIdRef.current = hcaptcha.render(hostRef.current, {
        sitekey: hcaptchaSiteKey,
        theme: 'dark',
        callback: (token: string) => verifyRef.current(token),
        'expired-callback': () => expireRef.current(),
        'error-callback': () => expireRef.current(),
      });
    };

    (globalThis as { onHCaptchaReady?: () => void }).onHCaptchaReady = renderWidget;

    if (getHCaptcha()) {
      renderWidget();
      return;
    }

    if (typeof document !== 'undefined' && !document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src =
        'https://js.hcaptcha.com/1/api.js?render=explicit&onload=onHCaptchaReady';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (resetKey < 1) return;
    const hcaptcha = getHCaptcha();
    if (hcaptcha && widgetIdRef.current != null) {
      hcaptcha.reset(widgetIdRef.current);
      expireRef.current();
    }
  }, [resetKey]);

  return createElement('div', {
    ref: (node: HTMLDivElement | null) => {
      hostRef.current = node;
    },
  });
}
