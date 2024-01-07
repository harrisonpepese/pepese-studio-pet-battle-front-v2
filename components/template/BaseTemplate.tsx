import { AuthContextProvider } from "@/context/authContext";
import AppHeader from "../common/AppHeader";
import { usePathname } from "next/navigation";
import { ChildrenProp } from "@/types/childrenProp";

export default function BaseTemplate({ children }: ChildrenProp) {
  const pageWithOutHeader = ["login", "singup"];
  const path = usePathname();
  const canRenderHeader = !pageWithOutHeader.some((x) => path.includes(x));
  return (
    <main>
      <AuthContextProvider>
        {canRenderHeader && <AppHeader />}
        <div style={{ padding: "30px 20px", height: "100vh" }}>{children}</div>
      </AuthContextProvider>
    </main>
  );
}
