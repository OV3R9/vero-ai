import Image from "next/image";

import logo from "@/assets/icon.png";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2`}>
      <Image src={logo} alt="VeroAI" width={32} height={32} />
      <span className={cn("text-xl font-bold text-black", className)}>
        VeroAI
      </span>
    </div>
  );
}
