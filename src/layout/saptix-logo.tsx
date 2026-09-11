import React from 'react';
import Link from 'next/link';

export function SaptixLogo({
  stakeName = 'ENTERPRISE',
  appName,
  badge,
  href = '/',
  collapsed = false,
}: {
  stakeName?: string;
  appName?: string;
  badge?: string;
  href?: string;
  collapsed?: boolean;
}) {
  const displayBadge = badge || stakeName;
  const displayName = appName ? appName : 'SAPTIX';

  return (
    <Link href={href} className="flex items-center gap-2.5 group select-none">
      <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
        S
      </div>
      {!collapsed && (
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="font-bold text-sm tracking-tight text-foreground font-sans truncate">
            {displayName}
          </span>
          {displayBadge && (
            <span className="text-[10px] uppercase tracking-wider font-semibold font-mono px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
              {displayBadge}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
