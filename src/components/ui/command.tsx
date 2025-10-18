import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

export const CommandDialog = ({
  children,
  ...props
}: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root {...props}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-200 data-[state=open]:opacity-100 motion-reduce:transition-none" />
      <DialogPrimitive.Content className="paper fixed left-1/2 top-20 z-50 w-[min(600px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-[var(--border)] p-0 text-[var(--foreground)] shadow-2xl focus:outline-none transition-all duration-200 motion-reduce:transition-none data-[state=closed]:pointer-events-none data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
        <DialogPrimitive.Title className="visually-hidden">
          Command palette
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="visually-hidden">
          Use arrow keys to navigate suggestions and enter to activate a link
        </DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

CommandDialog.displayName = "CommandDialog";

export const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex w-full flex-col gap-1 rounded-3xl bg-transparent p-4 text-sm",
      className,
    )}
    {...props}
  />
));

Command.displayName = CommandPrimitive.displayName;

export const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-3 rounded-2xl bg-[var(--background-muted)] px-3 py-2 text-[var(--foreground)]">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "w-full bg-transparent text-sm outline-none placeholder:text-[var(--foreground)]/60",
        className,
      )}
      {...props}
    />
    <kbd className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground)]/60">
      ⏎
    </kbd>
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[420px] overflow-y-auto overflow-x-hidden pt-2 text-sm",
      className,
    )}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-6 text-center text-[var(--foreground)]/60", className)}
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "flex flex-col gap-1 rounded-2xl p-2 text-[var(--foreground)]/80",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-[var(--foreground)] transition-colors duration-150 aria-selected:bg-[var(--accent-soft)] aria-selected:text-[var(--accent)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

export const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("my-2 h-px bg-[var(--border)]", className)}
    {...props}
  />
));

CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
