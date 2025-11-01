// src/components/CardInnerWrapper.tsx
import { ReactNode } from "react";

type Props = {
  header: ReactNode | string;
  body: ReactNode;
  footer?: ReactNode;
};

export default function CardInnerWrapper({ header, body, footer }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{header}</h3>
      </div>

      {/* Body - Scrollable */}
      <div className="flex-1 overflow-hidden">{body}</div>

      {/* Footer (optional) */}
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          {footer}
        </div>
      )}
    </div>
  );
}
