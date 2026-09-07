import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const Container = ({ className, children, ...props }: ContainerProps) => (
  <div
    className={cn("mx-auto w-full max-w-[78rem] px-4 sm:px-6 lg:px-8", className)}
    {...props}
  >
    {children}
  </div>
);
