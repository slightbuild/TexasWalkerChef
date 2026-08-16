const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const sizes = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  let failed = false;

  for (const vp of sizes) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(2500);

    const result = await page.evaluate(() => {
      const nav = document.querySelector('[data-testid="nav-slot"]');
      const gapEl = document.querySelector('[data-testid="home-hero-gap"]');
      const hero = document.querySelector('[data-testid="home-hero"]');

      const brandLogos = Array.from(
        document.querySelectorAll('img[alt="Walker Texas Chef logo"]'),
      );
      // Hero brand mark = largest alt logo (nav one is smaller)
      const heroLogo = brandLogos.sort(
        (a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width,
      )[0];
      const navLogo = brandLogos.sort(
        (a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width,
      )[0];

      const title = hero
        ? Array.from(hero.querySelectorAll('div,span,p,h1')).find(
            (el) =>
              el.textContent?.trim() === 'Walker Texas Chef' && el.children.length === 0,
          )
        : null;

      const navBox = nav?.getBoundingClientRect();
      const gapBox = gapEl?.getBoundingClientRect();
      const logoBox = heroLogo?.getBoundingClientRect();
      const titleBox = title?.getBoundingClientRect();
      const navLogoBox = navLogo?.getBoundingClientRect();

      const spaceNavToHeroLogo = navBox && logoBox ? logoBox.top - navBox.bottom : null;
      const spaceNavToTitle = navBox && titleBox ? titleBox.top - navBox.bottom : null;

      return {
        navBottom: navBox?.bottom ?? null,
        gapHeight: gapBox?.height ?? null,
        heroLogoTop: logoBox?.top ?? null,
        heroLogoWidth: logoBox ? Math.round(logoBox.width) : null,
        navLogoWidth: navLogoBox ? Math.round(navLogoBox.width) : null,
        titleTop: titleBox?.top ?? null,
        spaceNavToHeroLogo,
        spaceNavToTitle,
        okLogo: spaceNavToHeroLogo != null && spaceNavToHeroLogo >= 24,
        okTitle: spaceNavToTitle != null && spaceNavToTitle >= 24,
      };
    });

    console.log(vp.name, JSON.stringify(result, null, 2));
    if (!result.okLogo || !result.okTitle) {
      console.error('FAIL', vp.name);
      failed = true;
    } else {
      console.log('PASS', vp.name);
    }
    await page.close();
  }

  await browser.close();
  process.exit(failed ? 2 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
