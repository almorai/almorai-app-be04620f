import { NavLink } from "react-router-dom";
import { brand } from "../../lib/brand";
import { navItems } from "../../lib/nav";
import { cn } from "../../lib/utils";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-border px-5">
        <div>
          <p className="text-sm font-semibold text-text">{brand.name}</p>
          <p className="text-xs text-muted">{brand.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-text"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
