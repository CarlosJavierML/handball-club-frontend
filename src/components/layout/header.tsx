'use client';

import { useAuth } from '@/providers/auth-provider';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Club Balonmano</h2>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

