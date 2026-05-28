import { Link } from "react-router";
import { GearSix } from "@phosphor-icons/react";
import { AppLogo } from "./AppLogo";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-5 py-3">
      <Link
        to="/"
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <AppLogo size={24} />
        <span className="text-sm font-semibold font-mono tracking-tight">
          <span className="text-primary">1</span>ClickProject
        </span>
      </Link>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link
          to="/settings"
          className="btn btn-ghost btn-sm btn-square text-primary hover:opacity-80"
        >
          <GearSix size={18} />
        </Link>
      </div>
    </header>
  );
}
