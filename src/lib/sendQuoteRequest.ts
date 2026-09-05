import { contact } from '../data/contact';
import { formatUSD, unitLabel, type MenuUnit } from '../data/quoteMenu';
import { Platform } from 'react-native';

export type QuotePayload = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  serviceType: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    lineTotal: number;
    meats?: string[];
    sides?: string[];
    packageTier?: 'small' | 'large' | null;
  }[];
  estimatedTotal: number;
  specialRequests: string;
  captchaToken: string;
};

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

export async function sendQuoteRequest(payload: QuotePayload): Promise<void> {
  const accessKey = process.env.EXPO_PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      'Quote email isn’t set up yet. Add a Web3Forms access key to .env.local and reload the site.'
    );
  }
  if (Platform.OS === 'web' && !payload.captchaToken) {
    throw new Error('Please complete the captcha before sending.');
  }

  const itemLines =
    payload.items.length > 0
      ? payload.items
          .map((item) => {
            const unit = item.unit as MenuUnit;
            const extra = unitLabel(unit, item.quantity);
            const qty =
              item.quantity > 0
                ? extra
                  ? `${item.quantity} ${extra}`
                  : `× ${item.quantity}`
                : 'guest count needed';
            const rate =
              item.packageTier === 'large'
                ? '25+ guest rate'
                : item.packageTier === 'small'
                  ? '10–24 guest rate'
                  : '';
            const details = [
              item.meats?.length ? `meats: ${item.meats.join(', ')}` : '',
              item.sides?.length ? `sides: ${item.sides.join(', ')}` : '',
              rate,
            ]
              .filter(Boolean)
              .join('; ');
            return `• ${item.name} (${qty}) — ${formatUSD(item.lineTotal)}${
              details ? `\n  ${details}` : ''
            }`;
          })
          .join('\n')
      : 'None selected';

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: contact.brand,
      subject: `Quote request from ${payload.name}`,
      replyto: payload.email,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      eventDate: payload.eventDate,
      guestCount: payload.guestCount || 'Not provided',
      serviceType: payload.serviceType || 'Not specified',
      estimatedTotal: formatUSD(payload.estimatedTotal),
      specialRequests: payload.specialRequests || 'None',
      botcheck: false,
      'h-captcha-response': payload.captchaToken,
      message: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Event Date: ${payload.eventDate}`,
        `Guest Count: ${payload.guestCount || 'Not provided'}`,
        `Service Type: ${payload.serviceType || 'Not specified'}`,
        '',
        'Menu selections:',
        itemLines,
        '',
        `Estimated total: ${formatUSD(payload.estimatedTotal)}`,
        `Special requests: ${payload.specialRequests || 'None'}`,
      ].join('\n'),
    }),
  });

  const data = (await response.json().catch(() => null)) as Web3FormsResponse | null;

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message?.trim() ||
        'Could not send your quote request. Please try again, call 713-377-6483, or email walkertexaschefllc@gmail.com.'
    );
  }
}
