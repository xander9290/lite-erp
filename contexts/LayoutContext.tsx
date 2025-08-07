"use client";

import LoadingPage from "@/app/LoadingPage";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, Suspense, useContext } from "react";

interface LayoutContextType {
  viewMode: string | null;
  skip: number;
  search: string | null;
  filter: string | null;
  id: string | null;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const viewMode = searchParams.get("view_mode");
  const skip = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "name";
  const id = searchParams.get("id") || "";

  return (
    <LayoutContext.Provider
      value={{ viewMode, skip: parseInt(skip), search, filter, id }}
    >
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </LayoutContext.Provider>
  );
}

export function useAppLayout() {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("useAppLayout se tiene que usar dentro de LayoutProvider");
  return context;
}
