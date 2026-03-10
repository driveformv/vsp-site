'use client';

import { AccordionGroup } from '@/components/ui';

interface RaceClass {
  _id: string;
  className: string;
  sponsorName?: string;
  rulesPdf?: { asset: { url: string } };
}

export default function DriversRulesAccordion({ classes }: { classes: RaceClass[] }) {
  const items = classes.length > 0
    ? classes.map((cls) => ({
        title: cls.sponsorName ? `${cls.sponsorName} ${cls.className}` : cls.className,
        content: (
          <div className="space-y-2 text-sm">
            <p>Full {cls.className} rules apply. Contact the competition director for the latest rulebook.</p>
            {cls.rulesPdf?.asset?.url && (
              <a
                href={cls.rulesPdf.asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-red-700"
              >
                Download Rules PDF
              </a>
            )}
          </div>
        ),
      }))
    : [
        { title: 'USRA Modifieds', content: <p className="text-sm">Full USRA Modified rules apply. All competitors must hold a valid USRA license.</p> },
        { title: 'USRA Stock Cars', content: <p className="text-sm">Full USRA Stock Car rules apply.</p> },
        { title: 'USRA Hobby Stocks', content: <p className="text-sm">Full USRA Hobby Stock rules apply.</p> },
        { title: 'Sport Mods', content: <p className="text-sm">Sport Mod rules follow VSP-specific guidelines.</p> },
        { title: 'Mini Stocks', content: <p className="text-sm">Mini Stock rules follow VSP-specific guidelines.</p> },
      ];

  return <AccordionGroup items={items} />;
}
