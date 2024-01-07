import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function AppHeader() {
  return (
    <div className="flex flex-row justify-between items-center border-b p-2">
      <Link href="/">Pet Battle</Link>
      <div className="flex gap-4">
        <Link href="pet">My pets</Link>
        <Link href="item">Items</Link>
        <Link href="battle">Battle</Link>
      </div>
      <Popover>
        <PopoverTrigger className="w-10 h-10">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>P1</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            <Link href="profile">Profile</Link>
            <Link href="logout">Logout</Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
