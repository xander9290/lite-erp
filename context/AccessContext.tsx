"use client";

import { fetchAccess } from "@/app/(auth)/app/groups/actions";
import { GroupLine } from "@/generate/prisma";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface AccessContextProps {
  access: GroupLine[];
}

const AccessContext = createContext<AccessContextProps | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [access, setAccess] = useState<GroupLine[]>([]);

  const handleFetchAccess = async () => {
    const res = await fetchAccess({ userId: session?.user.id });
    if (!res.success) {
      toast.error(res.message, { position: "top-right" });
      return;
    }
    setAccess(res.data || []);
  };

  useEffect(() => {
    if (session?.user) {
      handleFetchAccess();
    }
  }, [session?.user]);

  return (
    <AccessContext.Provider value={{ access }}>
      {children}
    </AccessContext.Provider>
  );
}

/**
 * Hook para obtener access filtrado por entityName
 * @param entityName string opcional
 */
export const useAccess = (entityName?: string): GroupLine[] => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error("useAccess debe usarse dentro de AccessProvider");
  }

  if (entityName) {
    return context.access.filter(
      (item) => item.entityName?.toLowerCase() === entityName.toLowerCase()
    );
  }

  return context.access;
};
