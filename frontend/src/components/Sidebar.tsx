import { Icon } from "@iconify/react/dist/iconify.js";

export function Sidebar() {
  return (
    <aside className="w-64 bg-secondary p-6 flex flex-col space-y-6">
      <nav className="space-y-4">
        <a href="/Dashboard" className="flex items-center space-x-2">
          <Icon icon="siemens:home" className="w-5 h-5" />
          <span>Dashboard</span>
        </a>
        <a href="/HelpTechnicianPage" className="flex items-center space-x-2">
          <Icon icon="siemens:call" className="w-5 h-5" />
          <span>Help Technicians</span>
        </a>
      </nav>
    </aside>
  );
}
