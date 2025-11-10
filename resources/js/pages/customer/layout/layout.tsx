import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import PublicNavBar from "@/pages/landing-page/components/public-nav-bar";
import { useEffect } from "react";

interface pageProps {
    children: React.ReactNode
}

export default function CustomerLayout({children} : pageProps) {
      const { auth } = usePage<SharedData>().props;
      const user = auth?.user?.role_id ?? 0;

      // Add smooth scroll behavior
      useEffect(() => {
          document.documentElement.style.scrollBehavior = 'smooth';
          return () => {
              document.documentElement.style.scrollBehavior = '';
          };
      }, []);

    return (
        <>
          <PublicNavBar role={user} />
          {children}
        </>
    )

}