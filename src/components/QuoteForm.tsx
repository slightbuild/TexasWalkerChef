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
import { CTAButton } from './CTAButton';

const serviceTypes = ['Pickup', 'Drop-Off Catering', 'Full-Service Catering'] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  serviceType: (typeof serviceTypes)[number] | '';
  notes: string;
};

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  guestCount: '',
  serviceType: '',
  notes: '',
};

export function QuoteForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill in your name, email, and phone.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.success}>
        <Text style={typography.h3}>Thanks — we got your request.</Text>
        <Text style={[typography.body, styles.successBody]}>
          Your quote details are ready on this page. We’ll follow up soon to
          build the right option for your event. For a faster reply, call{' '}
          <Text style={styles.accent}>713-377-6483</Text> or email{' '}
          <Text style={styles.accent}>walkertexaschefllc@gmail.com</Text>.
        </Text>
        <CTAButton
          label="Submit Another Request"
          variant="secondary"
          onPress={() => {
            setForm(empty);
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
          label="Event Date"
          value={form.eventDate}
          onChangeText={(v) => update('eventDate', v)}
          placeholder="MM/DD/YYYY"
          style={styles.half}
        />
        <Field
          label="Guest Count"
          value={form.guestCount}
          onChangeText={(v) => update('guestCount', v)}
          keyboardType="number-pad"
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

      <Field
        label="Notes / Menu Preferences"
        value={form.notes}
        onChangeText={(v) => update('notes', v)}
        multiline
        placeholder="Tell us about your event..."
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CTAButton
        label="Submit Quote Request"
        onPress={onSubmit}
        style={{ alignSelf: 'flex-start', marginTop: spacing.md }}
      />
      <Text style={styles.disclaimer}>
        Submissions stay on this page for now — no account signup required. We’ll
        contact you using the details you provide.
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
  style?: object;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType = 'default',
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
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 820,
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
