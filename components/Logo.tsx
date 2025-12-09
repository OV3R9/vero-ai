import Image from "next/image";

import logo from "@/assets/icon.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src={logo} alt="VeroAI" width={32} height={32} />
      <span className="text-xl font-bold text-primary">VeroAI</span>
    </div>
  );
}
