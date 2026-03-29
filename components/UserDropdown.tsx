"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import NavItems from "./NavItems";
import UserAvatar from "./UserAvatar";

const UserDropdown = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    router.push("/sign-in");
  };

  const mockUser = {
    img: "https://github.com/shadcn.png",
    name: "John",
    email: "fake@mail.com",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-3 bg-transparent outline-none">
          <UserAvatar img={mockUser.img} name={mockUser.name} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-3xs">
        <DropdownMenuLabel>
          <div className="relative flex items-center gap-3 py-2">
            <UserAvatar
              img={mockUser.img}
              name={mockUser.name}
              email={mockUser.email}
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className={cn(
            "text-md transition:colors cursor-pointer font-medium",
            "text-gray-100 focus:bg-transparent focus:text-yellow-500",
          )}
        >
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden bg-gray-600 sm:block" />
        <nav className="sm:hidden">
          <NavItems />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
