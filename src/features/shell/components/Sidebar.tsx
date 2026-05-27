import { House, GearSix } from "@phosphor-icons/react";
import { SidebarIcon } from "./SidebarIcon";

export function Sidebar() {
  return (
    <aside className="flex flex-col items-center w-12 bg-base-200 border-r border-base-300 py-4 gap-2">
      <SidebarIcon to="/" icon={<House size={20} />} tooltip="Accueil" />
      <SidebarIcon
        to="/settings"
        icon={<GearSix size={20} />}
        tooltip="Paramètres"
      />
    </aside>
  );
}
