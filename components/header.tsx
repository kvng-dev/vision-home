import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";
const Header = () => {
  return (
    <div className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              height={300}
              width={300}
              alt="logo"
              className="size-10"
            />
            <h1 className="font-semibold text-sm sm:text-xl flex flex-wrap text-black">
              <span>Vision</span>{" "}
              <span className="text-purple-700 inline-flex ml-1">Homes</span>
            </h1>
          </div>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button className="text-slate-600">
            <Search />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link href="/">
            <Button variant="link" className="hidden sm:inline">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="link" className="hidden sm:inline">
              About
            </Button>
          </Link>
          <SignedIn>
            <UserButton />
            <Button asChild variant="link" className="hidden sm:inline">
              <SignOutButton />
            </Button>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="link" className="hidden sm:inline">
                Sign In
              </Button>
            </Link>
          </SignedOut>
        </ul>
      </div>
    </div>
  );
};
export default Header;
