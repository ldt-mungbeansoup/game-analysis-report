"use client";

import { MonetizationData } from "@/types";
import { motion } from "framer-motion";

interface Props {
  data: MonetizationData;
}

export default function Monetization({ data }: Props) {
  const items: [string, string][] = [
    ["付费模式", (data.paymentModel||[]).join(" / ")],
    ["定价策略", data.pricingStrategy],
    ["Battle Pass", data.battlePass],
    ["抽卡机制", data.gacha],
    ["活动节奏", data.eventCadence],
    ["订阅制", data.subscription],
    ["广告变现", data.ads],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <section id="monetization" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-[#1d1d1f]">④ 商业系统层</h2>
        <div className="rounded-2xl border border-[#e5e5ea] bg-white">
          {items.map(([label, value], i) => (
            <div
              key={label}
              className={`flex items-start gap-4 p-4 ${i < items.length - 1 ? "border-b border-[#e5e5ea]" : ""}`}
            >
              <dt className="w-24 shrink-0 text-sm font-medium text-[#86868b]">
                {label}
              </dt>
              <dd className="text-sm leading-relaxed text-[#1d1d1f]">{value}</dd>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
