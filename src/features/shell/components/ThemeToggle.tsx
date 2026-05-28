import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

const DARK = "oneclick";
const LIGHT = "oneclick-light";
const STORAGE_KEY = "theme";

function getInitialTheme(): string {
  return localStorage.getItem(STORAGE_KEY) ?? DARK;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === DARK;

  return (
    <button
      onClick={() => setTheme(isDark ? LIGHT : DARK)}
      className="btn btn-ghost btn-sm btn-square text-primary hover:opacity-80"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
