import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import SidebarContentShift from "@/components/ui/sidebar-content-shift";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function AppLayout({ children }: {children: ReactNode}) {

    return (
        <div className="min-h-screen dark:bg-[radial-gradient(ellipse_at_30%_50%,rgba(120,60,255,0.25),transparent)]">
        <Navbar />
        <Sidebar />
        <SidebarContentShift>
            {children}
        </SidebarContentShift>
        <Toaster richColors position="top-right" />
        </div>
    );
}
