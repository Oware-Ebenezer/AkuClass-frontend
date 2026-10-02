import { NavLink } from 'react-router-dom';
import { SCHOOL_ADMIN_NAV } from '../../constants/navigation';
import { Icon } from '../ui/Icon';

interface SidebarProps { open: boolean; onClose: () => void; }

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-teal transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-6 pt-6 pb-4">
          <span className="text-[28px] leading-9 font-bold tracking-tight text-white">AkuClass</span>
        </div>
        <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {SCHOOL_ADMIN_NAV.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                  isActive ? 'bg-teal-pale font-semibold text-teal-dark shadow-sm' : 'font-semibold text-teal-pale/80 hover:bg-teal-dark hover:text-white'
                }`
              }
            >
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
