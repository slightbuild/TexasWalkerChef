/** Web3Forms free-plan hCaptcha site key. Override with EXPO_PUBLIC_HCAPTCHA_SITEKEY on a paid plan. */
export const hcaptchaSiteKey =
  process.env.EXPO_PUBLIC_HCAPTCHA_SITEKEY ||
  '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

export type QuoteCaptchaProps = {
  onVerify: (token: string) => void;
  onExpire: () => void;
  resetKey: number;
};
