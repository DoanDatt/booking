import Image from "next/image";

type PlaneProps = {
  className?: string;
};

// Máy bay nghiêng dùng ở Hero và Services: khung 118×153, hình bên trong được xoay + kéo xiên như Figma
export function Plane({ className = "" }: PlaneProps) {
  return (
    <div className={`flex h-[153px] w-[118px] items-center justify-center ${className}`} aria-hidden>
      <div className="flex-none rotate-[-43.89deg] scale-y-93 skew-x-[-22.04deg]">
        <Image src="/landing/plane.svg" alt="" width={128} height={70} className="h-[69.561px] w-[128.042px]" />
      </div>
    </div>
  );
}
