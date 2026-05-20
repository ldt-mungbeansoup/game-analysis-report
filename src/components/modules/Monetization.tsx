"use client";

import { MonetizationData } from "@/types";

interface Props {
  data: MonetizationData;
}

export default function Monetization({ data }: Props) {
  const items: [string, string][] = [
    ["付费模式", data.paymentModel.join(" / ")],
    ["定价策略", data.pricingStrategy],
    ["Battle Pass", data.battlePass],
    ["抽卡机制", data.gacha],
    ["活动节奏", data.eventCadence],
    ["订阅制", data.subscription],
    ["广告变现", data.ads],
  ];

  return (
    <section id="monetization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">④ 商业系统层</h2>
      <div className="rounded-lg border border-border bg-card">
        {items.map(([label, value], i) => (
          <div
            key={label}
            className={`flex items-start gap-4 p-4 ${i < items.length - 1 ? "border-b border-border" : ""}`}
          >
            <dt className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm leading-relaxed text-foreground/80">{value}</dd>
          </div>
        ))}
      </div>
    </section>
  );
}
