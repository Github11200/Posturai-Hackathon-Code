"use client";

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

export default function Header({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div className="fixed left-4 top-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open profile menu"
            className="rounded-full focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={8}>
          <DropdownMenuItem asChild>
            <PortalLink>Manage billing</PortalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LogoutLink>Sign out</LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
