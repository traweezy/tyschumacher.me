import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { cn } from "@/lib/utils";

export const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-40 flex w-full items-center justify-center", className)}
    {...props}
  />
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

export const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-100)]/90 px-4 py-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger;
export const NavigationMenuLink = NavigationMenuPrimitive.Link;
