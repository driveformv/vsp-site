'use client';

import { AccordionGroup } from '@/components/ui';

interface FAQItem {
  question: string;
  answer: string;
}

export default function PlanYourVisitFAQ({ items }: { items: FAQItem[] }) {
  const accordionItems = items.map((item) => ({
    title: item.question,
    content: <p>{item.answer}</p>,
  }));

  return <AccordionGroup items={accordionItems} />;
}
