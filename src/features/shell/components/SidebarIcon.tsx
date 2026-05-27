import type { ReactNode } from "react";
import { NavLink } from "react-router";

interface SidebarIconProps {
  to: string;
  icon: ReactNode;
  tooltip: string;
}

export function SidebarIcon({ to, icon, tooltip }: SidebarIconProps) {
  return (
    <div className="tooltip tooltip-right" data-tip={tooltip}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `btn btn-ghost btn-sm btn-square text-lg ${isActive ? "bg-base-300" : ""}`
        }
      >
        {icon}
      </NavLink>
    </div>
  );
}
