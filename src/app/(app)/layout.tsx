import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";
import SidebarContentShift from "@/components/ui/sidebar-content-shift";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default function AppLayout({ children }: {children: ReactNode}) {

    return (
        <div>
        <Navbar />
        <Sidebar />
        <SidebarContentShift>
            {children}
        </SidebarContentShift>
        <Toaster richColors position="top-right" />
        </div>
    );
}
