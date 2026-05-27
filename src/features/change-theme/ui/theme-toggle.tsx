"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/features/change-theme";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui";

const themeOptions = [
  { value: "system", label: "System", icon: MonitorIcon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
] as const;

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => {
        if (value === "system" || value === "light" || value === "dark") {
          setMode(value);
        }
      }}
      variant="outline"
      spacing={0}
      aria-label="Theme"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon data-icon="inline-start" />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
