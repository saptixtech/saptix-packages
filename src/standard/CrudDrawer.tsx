"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2Icon } from "lucide-react";

interface CrudDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export function CrudDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  saving = false,
  saveLabel = "Save Changes",
  side = "right",
  className,
}: CrudDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn("sm:max-w-lg w-full flex flex-col", className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {children}
        </div>
        <SheetFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          {onSave && (
            <Button onClick={onSave} disabled={saving}>
              {saving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              {saveLabel}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}