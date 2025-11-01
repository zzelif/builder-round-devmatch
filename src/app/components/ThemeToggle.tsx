"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import AnimatedBackground from "@/components/animated-background";

const THEMES_OPTIONS = [
  {
    label: "Light",
    id: "light",
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: "Dark",
    id: "dark",
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: "System",
    id: "system",
    icon: <MonitorIcon className="h-4 w-4" />,
  },
];

export default function ThemeSwitch() {
  // Initialize with false to match server render
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Use useEffect with setMounted is the canonical pattern for hydration
  // This is not a performance issue - it's the recommended approach

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!mounted) {
    return (
      <div className="inline-flex h-7 rounded-lg bg-accent p-0.5">
        <div className="h-7 w-[84px]" />{" "}
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-accent"
      defaultValue={theme}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        setTheme(id as string);
      }}
    >
      {THEMES_OPTIONS.map((themeOption) => (
        <button
          key={themeOption.id}
          className="inline-flex h-7 w-7 items-center justify-center text-secondary-foreground transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-secondary-foreground"
          type="button"
          aria-label={`Switch to ${themeOption.label} theme`}
          data-id={themeOption.id}
        >
          {themeOption.icon}
        </button>
      ))}
    </AnimatedBackground>
  );
}
