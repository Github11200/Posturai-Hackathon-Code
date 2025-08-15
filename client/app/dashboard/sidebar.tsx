"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import { useEffect, useRef } from "react";

function Profile({ avatarUrl }: { avatarUrl: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="rounded-full focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-2 ml-2 flex gap-4"
      >
        <div
          aria-label="Open profile menu"
          className="rounded-full focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-2 ml-2 flex gap-4"
        >
          <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-[var(--secondary)]">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <Button variant="destructive" className="flex-1 hover:cursor-pointer">
            <LogoutLink>Log out</LogoutLink>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8}>
        <DropdownMenuItem>
          <PortalLink>Manage billing</PortalLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink>Settings</LogoutLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink>Sign out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface MenuItem {
  title: string;
  url: string;
  variant:
    | "default"
    | "secondary"
    | "link"
    | "destructive"
    | "outline"
    | "ghost";
}

const menuItems: MenuItem[] = [
  { title: "New Session", url: "/dashboard/session", variant: "default" },
  { title: "How Posturai works", url: "#", variant: "secondary" },
  { title: "Why is posture important?", url: "#", variant: "secondary" },
];

export function DashboardSidebar({ avatarUrl }: { avatarUrl: string }) {
  return (
    <>
      <Sidebar collapsible="offcanvas">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2 p-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Button className="w-full" variant={item.variant} asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <span>{item.title}</span>
                      </Link>
                    </Button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex justify-center p-2">
          <Profile avatarUrl={avatarUrl} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
