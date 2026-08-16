import { useRef, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Link, usePathname } from 'expo-router';
import { colors, layout, spacing } from '../theme/colors';
import { fonts } from '../theme';
import { contact, cateringMenuLinks, navLinks } from '../data/contact';
import { Logo } from './Logo';
import { CTAButton } from './CTAButton';

export function Nav() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 980;
  const [open, setOpen] = useState(false);
  const [cateringOpen, setCateringOpen] = useState(false);
  const [hoveredChild, setHoveredChild] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cateringActive =
    pathname.startsWith('/catering') || pathname.startsWith('/menu/');

  const openCatering = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setCateringOpen(true);
  };

  const scheduleCloseCatering = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setCateringOpen(false);
      closeTimer.current = null;
    }, 280);
  };

  return (
    <View style={[styles.nav, Platform.OS === 'web' && styles.navWeb]}>
      <View style={styles.inner}>
        <Link href="/" asChild>
          <Pressable style={styles.brand} accessibilityRole="link">
            <Text style={styles.brandName} numberOfLines={1}>
              {contact.brand}
            </Text>
          </Pressable>
        </Link>

        {!isMobile ? (
          <View style={styles.links}>
            {navLinks.map((link) => {
              const hasChildren = 'children' in link && link.children;
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : link.href === '/catering'
                    ? cateringActive
                    : pathname.startsWith(link.href);

              if (hasChildren) {
                return (
                  <View
                    key={link.href}
                    style={styles.dropdownWrap}
                    {...({
                      onMouseEnter: openCatering,
                      onMouseLeave: scheduleCloseCatering,
                    } as object)}
                  >
                    <Link href={link.href as any} asChild>
                      <Pressable style={styles.linkHit}>
                        <Text
                          style={StyleSheet.flatten([
                            styles.link,
                            active && styles.linkActive,
                          ])}
                        >
                          {link.label} ▾
                        </Text>
                        {active ? <View style={styles.linkUnderline} /> : null}
                      </Pressable>
                    </Link>
                    {cateringOpen ? (
                      <View style={styles.dropdown}>
                        <View style={styles.dropdownPanel}>
                          {cateringMenuLinks.map((child) => {
                            const childActive = pathname.startsWith(child.href);
                            const childHovered = hoveredChild === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href as any}
                                asChild
                              >
                                <Pressable
                                  style={StyleSheet.flatten([
                                    styles.dropdownItem,
                                    childHovered && styles.dropdownItemHover,
                                    childActive && styles.dropdownItemActive,
                                  ])}
                                  onPress={() => {
                                    setCateringOpen(false);
                                    setHoveredChild(null);
                                  }}
                                  {...({
                                    onMouseEnter: () => {
                                      openCatering();
                                      setHoveredChild(child.href);
                                    },
                                    onMouseLeave: () => setHoveredChild(null),
                                  } as object)}
                                >
                                  <Text
                                    style={StyleSheet.flatten([
                                      styles.dropdownText,
                                      (childHovered || childActive) &&
                                        styles.dropdownTextHover,
                                    ])}
                                  >
                                    {child.label}
                                  </Text>
                                </Pressable>
                              </Link>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              }

              return (
                <Link key={link.href} href={link.href as any} asChild>
                  <Pressable style={styles.linkHit}>
                    <Text
                      style={StyleSheet.flatten([
                        styles.link,
                        active && styles.linkActive,
                      ])}
                    >
                      {link.label}
                    </Text>
                    {active ? <View style={styles.linkUnderline} /> : null}
                  </Pressable>
                </Link>
              );
            })}
            <CTAButton href="/quote" label="Quote" style={styles.quoteBtn} />
          </View>
        ) : (
          <Pressable
            onPress={() => setOpen((v) => !v)}
            style={styles.menuBtn}
            accessibilityLabel="Toggle menu"
          >
            <Text style={styles.menuBtnText}>{open ? 'Close' : 'Menu'}</Text>
          </Pressable>
        )}
      </View>

      {isMobile && open ? (
        <View style={styles.mobileMenu}>
          {navLinks.map((link) => {
            const hasChildren = 'children' in link && link.children;
            return (
              <View key={link.href}>
                <Link href={link.href as any} asChild>
                  <Pressable
                    onPress={() => setOpen(false)}
                    style={styles.mobileLink}
                  >
                    <Text style={styles.mobileLinkText}>{link.label}</Text>
                  </Pressable>
                </Link>
                {hasChildren
                  ? cateringMenuLinks.map((child) => (
                      <Link key={child.href} href={child.href as any} asChild>
                        <Pressable
                          onPress={() => setOpen(false)}
                          style={styles.mobileSubLink}
                        >
                          <Text style={styles.mobileSubLinkText}>
                            {child.label}
                          </Text>
                        </Pressable>
                      </Link>
                    ))
                  : null}
              </View>
            );
          })}
          <CTAButton
            href="/quote"
            label="Request a Quote"
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : null}
    </View>
  );
}

export function Footer() {
  const open = (url: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerBrand}>
          <Logo size={140} />
          <Text style={styles.footerTagline}>{contact.tagline}</Text>
          <Text style={styles.footerSupport}>{contact.supportLine}</Text>
        </View>

        <View style={styles.footerCol}>
          <Text style={styles.footerHeading}>Contact</Text>
          <Pressable onPress={() => open(contact.phoneTel)}>
            <Text style={styles.footerLink}>{contact.phone}</Text>
          </Pressable>
          <Pressable onPress={() => open(contact.emailMailto)}>
            <Text style={styles.footerLink}>{contact.email}</Text>
          </Pressable>
        </View>

        <View style={styles.footerCol}>
          <Text style={styles.footerHeading}>Social</Text>
          <Pressable onPress={() => open(contact.facebook.url)}>
            <Text style={styles.footerLink}>Facebook</Text>
          </Pressable>
          <Pressable onPress={() => open(contact.instagram.url)}>
            <Text style={styles.footerLink}>{contact.instagram.label}</Text>
          </Pressable>
          <Pressable onPress={() => open(contact.tiktok.url)}>
            <Text style={styles.footerLink}>{contact.tiktok.label}</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} Walker Texas Chef. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: '100%',
    backgroundColor: 'rgba(5,5,5,0.98)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 100,
    position: 'relative',
  },
  navWeb: {
    position: 'relative' as any,
    backdropFilter: 'blur(12px)',
  } as any,
  inner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    minHeight: layout.navHeight,
    paddingLeft: layout.contentPadding + 20,
    paddingRight: layout.contentPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    paddingRight: spacing.lg,
  },
  brandName: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 18,
    letterSpacing: 1,
    color: colors.cream,
    textTransform: 'uppercase',
  } as any,
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: 'nowrap',
    gap: 22,
    marginLeft: spacing.md,
    zIndex: 30,
  },
  dropdownWrap: {
    position: 'relative',
    zIndex: 40,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: 220,
    // Invisible bridge so the pointer can travel into the panel
    paddingTop: 14,
    zIndex: 50,
  },
  dropdownPanel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 2,
    borderTopColor: colors.orange,
    paddingVertical: spacing.sm,
    boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
  } as any,
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dropdownItemHover: {
    backgroundColor: 'rgba(255,92,0,0.18)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(255,92,0,0.12)',
  },
  dropdownText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  dropdownTextHover: {
    color: colors.orange,
  },
  linkHit: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  linkActive: {
    color: colors.orange,
  },
  linkUnderline: {
    marginTop: 6,
    height: 2,
    backgroundColor: colors.orange,
    width: '100%',
  },
  quoteBtn: {
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.orange,
  },
  menuBtnText: {
    fontFamily: fonts.bodyBold,
    color: colors.orange,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 14,
  },
  mobileMenu: {
    paddingHorizontal: layout.contentPadding,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mobileLink: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mobileLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 20,
    color: colors.text,
  },
  mobileSubLink: {
    paddingVertical: 12,
    paddingLeft: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mobileSubLinkText: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textMuted,
  },
  footer: {
    backgroundColor: colors.charcoal,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.xxl,
    paddingHorizontal: layout.contentPadding,
  },
  footerInner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxl,
  },
  footerBrand: {
    flex: 1.4,
    minWidth: 260,
    gap: spacing.sm,
  },
  footerTagline: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.textMuted,
    marginTop: spacing.sm,
    maxWidth: 340,
    lineHeight: 28,
  },
  footerSupport: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.orange,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footerCol: {
    minWidth: 180,
    gap: spacing.md,
  },
  footerHeading: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 22,
    letterSpacing: 2,
    color: colors.text,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  footerLink: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textMuted,
    lineHeight: 28,
  },
  copyright: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textDim,
  },
});
