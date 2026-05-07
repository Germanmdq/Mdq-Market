"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
}

export default function LogoutButton({ className, showIcon = true }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left",
        className
      )}
    >
      {showIcon && <LogOut className="w-5 h-5" />}
      Cerrar sesión
    </button>
  );
}
