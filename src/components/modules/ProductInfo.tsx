"use client";

import { ProductInfoData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Props {
  data: ProductInfoData;
}

const lifecycleColors: Record<string, string> = {
  "上升期": "bg-green-500/10 text-green-600 border-green-500/20",
  "稳定期": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "衰退期": "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ProductInfo({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <section id="productInfo" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-[#1d1d1f]">① 产品信息层</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard label="开发商" value={data.developer} />
          <InfoCard label="发行商" value={data.publisher} />
          <InfoCard label="上线时间" value={data.releaseDate} />
          <InfoCard
            label="生命周期"
            value={
              <Badge variant="outline" className={lifecycleColors[data.lifecycle] || ""}>
                {data.lifecycle}
              </Badge>
            }
          />
          <InfoCard label="支持平台" value={(data.platforms||[]).join(" / ")} />
          <InfoCard label="IP 背景" value={data.ipBackground} />
        </div>
        <div className="mt-4 rounded-2xl border border-[#e5e5ea] bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-[#86868b]">开发团队背景</h3>
          <p className="text-sm leading-relaxed text-[#1d1d1f]">{data.teamBackground}</p>
        </div>
      </section>
    </motion.div>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4">
      <p className="mb-1 text-xs font-medium text-[#86868b]">{label}</p>
      <div className="text-sm font-medium text-[#1d1d1f]">{value}</div>
    </div>
  );
}
