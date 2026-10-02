import { useSession } from "../../context/SessionContext";
import { Icon } from "../ui/Icon";
import { Avatar } from "../ui/Avatar";

export const Header = ({ OnMenu }: { OnMenu: () => void }) => {
  const { user, schoolName, academicYear, termName } = useSession();
  const roleLabel = user.role === "SCHOOL_ADMIN" ? "School Admin" : user.role;

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between gap-4 bg-white px-4 shadow-sm md:px-8 lg:left-64">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open Navigation Menu"
          className="rounded-lg text-charcoal-muted lg:hidden"
          onClick={OnMenu}
        >
          <Icon name="menu" size={24} />
        </button>

        <div className="flex items-center gap-1 rounded-lg bg-warm-100 px-3 py-1 text-xs font-semibold">
          <Icon name="apartment" size={20} className="text-teal" />
          <span>{schoolName}</span>
        </div>

        <div className="hidden items-center gap-1 rounded-lg bg-teal-pale px-3 py-1 text-xs font-semibold text-teal-dark sm:flex">
          <Icon name="calendar_today" size={18} />
          <span>{academicYear} - {termName}</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="relative hidden items-center md:flex">
            <Icon name="search" className="absolute left-2 text-charcoal-muted" />
            <input type="search" placeholder="Quick search, e.g. class, student" className="h-10 w-56 rounded-lg bg-warm-100 pr-3 pl-9 text-xs placeholder:text-charcoal-muted focus:bg-white focus:outline-2 focus:outline-teal" />
          </label>
          <button type="button" aria-label="Notifications" className="relative rounded-lg p-1 text-charcoal-muted hover:text-charcoal">
            <Icon name="notifications" size={24} />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-orange" />
          </button>
          <div className="flex items-center gap-2">
            <Avatar name={user.fullName} src={user.avatarUrl} />
            <div className="hidden flex-col leading-tight md:flex">
              <span className="text-xs font-semibold">{user.fullName}</span>
              <span className="text-[11px] text-charcoal-muted">{roleLabel}</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
