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
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Linkedin, Mail, X } from "lucide-react";

function Profile({ avatarUrl }: { avatarUrl: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-4">
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <p>Contact</p>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="px-0"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hey 👋! We'd love to talk to you, feel free to reach out to us
              using any of the contact methods below:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex">
            {" "}
            <Button asChild variant={"outline"} className="w-full flex-1">
              <a href={"jinayunity22@gmail.com"} aria-label="Email us">
                <Mail className="mr-2 size-4" /> Email
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full flex-1">
              <a
                // TODO: add url
                href={""}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on LinkedIn"
              >
                <Linkedin className="mr-2 size-4" /> LinkedIn
              </a>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="text-center"
          sideOffset={8}
        >
          <DropdownMenuItem className="hover:cursor-pointer">
            <PortalLink>Manage billing</PortalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer">
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>{" "}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="hover:cursor-pointer"
          >
            Contact
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer">
            <LogoutLink>Sign out</LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutLink className="w-full">
        <Button
          variant="destructive"
          className="flex-1 hover:cursor-pointer w-full"
        >
          Log out
        </Button>
      </LogoutLink>
    </div>
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
  {
    title: "Previous sessions",
    url: "/dashboard/sessions",
    variant: "secondary",
  },
  {
    title: "How Posturai works",
    url: "/dashboard/posturai",
    variant: "secondary",
  },
  {
    title: "Why is posture important?",
    url: "/dashboard/posture",
    variant: "secondary",
  },
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
