import { auth } from "@/lib/auth";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { FaCodeBranch, FaSignOutAlt } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { handleSignOut } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "./button";
import HamburgerButton from "./hamburger-button";
import prisma from "@/lib/prisma";


export default async function Navbar() {
    const session = await auth();
    if (!session?.user) redirect("/");

    const workspace = await prisma.workSpace.findUnique({
        where: { userId: session.user.id },
    })
    if (!workspace) redirect("/")

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-20 border-b border-neutral-700 bg-zinc-900">
            <div className="flex items-center gap-6">
                <HamburgerButton />

                <div className="flex w-9 h-9 rounded-xl bg-purple-700 items-center justify-center
                                transition-transform duration-200 hover:-translate-y-1 hover:translate-x-1
                                hover:shadow-lg hover:shadow-purple-900/30">
                    <FaCodeBranch size={18} className="text-white/70" />
                </div>
                <Link
                    href="/dashboard"
                    className="px-3 py-1.5 text-sm font-bold text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors"
                >
                    Dashboard
                </Link>
                <Link
                    href={`/${workspace.slug}/changelog`}
                    className="px-3 py-1.5 text-sm font-bold text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors"
                >
                    Changelog
                </Link>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full cursor-pointer"
                    >
                        <Avatar className="w-8 h-8" size="lg">
                            <AvatarImage
                                src={session?.user?.image || undefined}
                                alt={session?.user?.name || "User"}
                            />

                            <AvatarFallback>
                                {session?.user?.name?.[0] ?? "?"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild variant="destructive">
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="flex items-center gap-3 w-full text-left text-bold cursor-pointer"
                            >
                            <FaSignOutAlt />
                            Log out
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
}