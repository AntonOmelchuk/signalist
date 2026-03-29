'use client';

import {useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import NavItems from "./NavItems";

const UserDropdown = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        router.push("/sign-in");
    };

    const mockUser = { img: "https://github.com/shadcn.png", name: "John", email: "fake@mail.com" };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-3 bg-transparent outline-none">
                   <UserAvatar img={mockUser.img} name={mockUser.name} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-3xs">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <UserAvatar img={mockUser.img} name={mockUser.name} email={mockUser.email} />
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition:colors cursor-pointer"
                >
                    Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
                <nav className="sm:hidden">
                    <NavItems />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
