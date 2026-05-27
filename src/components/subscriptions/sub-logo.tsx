"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SubLogo({
  name,
  logo,
  color,
  size = 40,
  className
}: {
  name: string;
  logo?: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const src = logo ? `https://cdn.simpleicons.org/${logo}/ffffff` : undefined;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl overflow-hidden border border-white/10 shrink-0",
        className
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}26, ${color}0d)`,
        boxShadow: `inset 0 0 0 1px ${color}33`
      }}
    >
      {src && !errored ? (
        <Image
          src={src}
          alt={name}
          width={size * 0.55}
          height={size * 0.55}
          unoptimized
          onError={() => setErrored(true)}
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
        />
      ) : (
        <span
          className="font-semibold text-sm"
          style={{ color }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
