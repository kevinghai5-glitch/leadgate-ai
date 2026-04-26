"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface HeroCTAProps {
  authedHref?: string;
  unauthedHref?: string;
  className?: string;
  children: React.ReactNode;
}

export function HeroCTA({
  authedHref = "/dashboard",
  unauthedHref = "/signup",
  className,
  children,
}: HeroCTAProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push(authedHref);
    } else {
      router.push(unauthedHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}
