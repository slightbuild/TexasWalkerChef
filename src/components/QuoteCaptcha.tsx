import type { QuoteCaptchaProps } from '../lib/formSecurity';

/** Native builds skip hCaptcha; the web file handles the widget. */
export function QuoteCaptcha(_props: QuoteCaptchaProps) {
  return null;
}
