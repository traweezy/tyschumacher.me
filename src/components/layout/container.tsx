import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const Container = ({ className, children, ...props }: ContainerProps) => (
  <div
    className={cn("mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12", className)}
    {...props}
  >
    {children}
  </div>
);
