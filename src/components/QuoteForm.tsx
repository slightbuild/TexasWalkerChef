import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, layout, radii, spacing } from '../theme/colors';
import { fonts, typography } from '../theme';
import { contact } from '../data/contact';
import { sendQuoteRequest } from '../lib/sendQuoteRequest';
import {
  earliestEventDate,
  formatDateInput,
  formatMMDDYYYY,
  validateEventDate,
} from '../lib/eventDate';
import { QuoteMenuSelect, selectionsToLines, type QuoteSelection } from './QuoteMenuSelect';
import { packageChoicesComplete, PACKAGE_SMALL_MIN, quoteMenuItems } from '../data/quoteMenu';
import { CTAButton } from './CTAButton';

const serviceTypes = ['Pickup', 'Drop-Off Catering', 'Full-Service Catering'] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  serviceType: (typeof serviceTypes)[number] | '';
  specialRequests: string;
};

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  guestCount: '',
  serviceType: '',
  specialRequests: '',
};

export function QuoteForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [selections, setSelections] = useState<QuoteSelection[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill in your name, email, and phone.');
      return;
    }
    if (!emailPattern.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    const dateError = validateEventDate(form.eventDate);
    if (dateError) {
      setError(dateError);
      return;
    }
    if (selections.length === 0) {
      setError('Please add at least one menu item.');
      return;
    }
    const incompletePackage = selections.find((selection) => {
      const item = quoteMenuItems.find((entry) => entry.id === selection.id);
      return item
        ? !packageChoicesComplete(item, selection.meats, selection.sides)
        : false;
    });
    if (incompletePackage) {
      const item = quoteMenuItems.find((entry) => entry.id === incompletePackage.id);
      setError(
        `Choose all meats and sides for ${item?.name ?? 'your catering package'}.`
      );
      return;
    }
    const hasPackage = selections.some((selection) =>
      quoteMenuItems.find((entry) => entry.id === selection.id)?.packageCounts
    );
    const guests = Number.parseInt(form.guestCount, 10) || 0;
    if (hasPackage && guests < PACKAGE_SMALL_MIN) {
      setError(
        `Catering packages require a guest count of at least ${PACKAGE_SMALL_MIN}.`
      );
      return;
    }

    const lines = selectionsToLines(selections, form.guestCount);
    const estimatedTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

    setError('');
    setSending(true);
    try {
      await sendQuoteRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        eventDate: form.eventDate.trim(),
        guestCount: form.guestCount.trim(),
        serviceType: form.serviceType,
        items: lines.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          unit: line.unit,
          lineTotal: line.lineTotal,
          meats: line.meats.filter(Boolean),
          sides: line.sides.filter(Boolean),
          packageTier: line.packageTier,
        })),
        estimatedTotal,
        specialRequests: form.specialRequests.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not send your quote request. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.success}>
        <Text style={typography.h3}>Thanks — we got your request.</Text>
        <Text style={[typography.body, styles.successBody]}>
          Your quote details were emailed to us. We’ll follow up soon to build
          the right option for your event. For a faster reply, call{' '}
          <Text style={styles.accent}>{contact.phone}</Text> or email{' '}
          <Text style={styles.accent}>{contact.email}</Text>.
        </Text>
        <CTAButton
          label="Submit Another Request"
          variant="secondary"
          onPress={() => {
            setForm(empty);
            setSelections([]);
            setSubmitted(false);
          }}
          style={{ marginTop: spacing.lg, alignSelf: 'flex-start' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Field label="Name *" value={form.name} onChangeText={(v) => update('name', v)} />
      <View style={styles.row}>
        <Field
          label="Email *"
          value={form.email}
          onChangeText={(v) => update('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.half}
        />
        <Field
          label="Phone *"
          value={form.phone}
          onChangeText={(v) => update('phone', v)}
          keyboardType="phone-pad"
          style={styles.half}
        />
      </View>
      <View style={styles.row}>
        <Field
          label="Event Date *"
          value={form.eventDate}
          onChangeText={(v) => update('eventDate', formatDateInput(v))}
          placeholder="MM/DD/YYYY"
          keyboardType="number-pad"
          hint={`Must be at least 2 weeks out. Earliest: ${formatMMDDYYYY(earliestEventDate())}`}
          maxLength={10}
          style={styles.half}
        />
        <Field
          label="Guest Count *"
          value={form.guestCount}
          onChangeText={(v) => update('guestCount', v.replace(/\D/g, ''))}
          keyboardType="number-pad"
          hint="Required for catering packages. 10–24 guests use the higher per-person rate; 25+ guests use volume pricing."
          style={styles.half}
        />
      </View>

      <Text style={styles.label}>Service Type</Text>
      <View style={styles.chips}>
        {serviceTypes.map((type) => {
          const active = form.serviceType === type;
          return (
            <Pressable
              key={type}
              onPress={() => update('serviceType', type)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <QuoteMenuSelect
        selections={selections}
        guestCount={form.guestCount}
        onChange={setSelections}
      />

      <Field
        label="Special Requests"
        value={form.specialRequests}
        onChangeText={(v) => update('specialRequests', v)}
        multiline
        placeholder="Allergies, substitutions, setup notes, or anything else we should know..."
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CTAButton
        label={sending ? 'Sending…' : 'Submit Quote Request'}
        onPress={onSubmit}
        disabled={sending}
        style={{ alignSelf: 'flex-start', marginTop: spacing.md }}
      />
      <Text style={styles.disclaimer}>
        We’ll email you back using the details you provide. No account signup
        required.
      </Text>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  hint?: string;
  maxLength?: number;
  style?: object;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType = 'default',
  autoCapitalize,
  hint,
  maxLength,
  style,
}: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={keyboardType !== 'email-address'}
        maxLength={maxLength}
        style={[styles.input, multiline && styles.textarea]}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 900,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  half: {
    flex: 1,
    minWidth: 240,
  },
  field: {
    width: '100%',
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: colors.orange,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    borderRadius: radii.sm,
  },
  textarea: {
    minHeight: 150,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.sm,
  },
  chipActive: {
    borderColor: colors.orange,
    backgroundColor: 'rgba(255,92,0,0.14)',
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.orange,
  },
  error: {
    fontFamily: fonts.bodyMedium,
    color: '#FF6B6B',
    fontSize: 16,
  },
  hint: {
    ...typography.caption,
  },
  disclaimer: {
    ...typography.caption,
    marginTop: spacing.sm,
    maxWidth: layout.maxWidth,
  },
  success: {
    maxWidth: 720,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
    gap: spacing.md,
  },
  successBody: {
    marginTop: spacing.sm,
  },
  accent: {
    color: colors.orange,
    fontFamily: fonts.bodyBold,
  },
});
