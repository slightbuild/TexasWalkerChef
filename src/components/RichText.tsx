import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
} & Omit<TextProps, 'children' | 'style'>;

/** Renders multi-paragraph copy with blank-line breaks. */
export function RichText({ children, style, ...rest }: Props) {
  const paragraphs = children.split(/\n\s*\n/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <Text key={i} style={[style, i > 0 ? { marginTop: 16 } : null]} {...rest}>
          {p.trim()}
        </Text>
      ))}
    </>
  );
}
