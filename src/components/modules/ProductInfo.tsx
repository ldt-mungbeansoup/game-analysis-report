"use client";

import { ProductInfoData } from "@/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: ProductInfoData;
}

const lifecycleColors: Record<string, string> = {
  "上升期": "bg-green-500/20 text-green-400 border-green-500/30",
  "稳定期": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "衰退期": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function ProductInfo({ data }: Props) {
  return (
    <section id="productInfo" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">① 产品信息层</h2>
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
        <InfoCard label="支持平台" value={data.platforms.join(" / ")} />
        <InfoCard label="IP 背景" value={data.ipBackground} />
      </div>
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">开发团队背景</h3>
        <p className="text-sm leading-relaxed text-foreground/80">{data.teamBackground}</p>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
