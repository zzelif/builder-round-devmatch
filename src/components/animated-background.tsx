// src/components/animated-background.tsx
"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, Transition, motion } from "framer-motion";
import {
  Children,
  cloneElement,
  ReactElement,
  useState,
  useId,
  ReactNode,
} from "react";

export type AnimatedBackgroundProps = {
  children:
    | ReactElement<{ "data-id": string }>[]
    | ReactElement<{ "data-id": string }>;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultValue ?? null);
  const uniqueId = useId();

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);

    if (onValueChange) {
      onValueChange(id);
    }
  };

  return Children.map(children, (child, index) => {
    // Type assertion for child element
    const childElement = child as ReactElement<{
      "data-id": string;
      className?: string;
      children?: ReactNode;
    }>;

    const id = childElement.props["data-id"];

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {
          onClick: () => handleSetActiveId(id),
        };

    return cloneElement(
      childElement,
      {
        key: index,
        className: cn("relative inline-flex", childElement.props.className),
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any, // Required for custom data attributes in React.cloneElement
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <span className="z-10">{childElement.props.children}</span>
      </>
    );
  });
}
