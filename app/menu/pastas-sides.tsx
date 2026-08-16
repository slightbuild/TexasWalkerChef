import { SiteShell } from '../../src/components/SiteShell';
import { PageHeader } from '../../src/components/PageHeader';
import { Section } from '../../src/components/Section';
import { PanPriceTable } from '../../src/components/PriceTable';
import { pastasSidesContent } from '../../src/data/pastasSides';
import { colors } from '../../src/theme/colors';

export default function PastasSidesScreen() {
  const { pastas, sides } = pastasSidesContent;

  return (
    <SiteShell>
      <PageHeader
        title={pastasSidesContent.pageTitle}
        lead={pastasSidesContent.pageLead}
        support={pastasSidesContent.pageSupport}
      />
      <Section title={pastas.title}>
        <PanPriceTable rows={[...pastas.rows]} />
      </Section>
      <Section
        title={sides.title}
        style={{ backgroundColor: colors.charcoal }}
        delay={80}
      >
        <PanPriceTable rows={[...sides.rows]} />
      </Section>
    </SiteShell>
  );
}
