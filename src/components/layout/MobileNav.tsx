import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { brand } from "../../lib/brand";
import { navItems } from "../../lib/nav";
import { cn } from "../../lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border bg-surface md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <p className="text-sm font-semibold">{brand.name}</p>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-text"
          onClick={() => setOpen((value) => !value)}
          aria-label="Menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-border p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg px-3 py-2 text-sm",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-text"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
