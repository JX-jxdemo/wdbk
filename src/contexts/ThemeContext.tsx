import { type ReactNode } from "react";

/** 主题已固定为深色，不再提供切换 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
