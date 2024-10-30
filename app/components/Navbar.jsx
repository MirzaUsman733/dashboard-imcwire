import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
const Navbar = () => {
  const { data: session, status: sessionStatus } = useSession();
  return (
    <nav className="bg-white text-black py-4 shadow-md fixed top-0 w-full z-10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="https://imcwire.com/">
              <Image
                src="/cropped-IMC.webp"
                alt="Logo"
                height={100}
                width={100}
                className="h-16 mr-4"
              />
            </Link>
          </div>
          <div className="flex items-center gap-7">
            <Link
              href="/press-dashboard/pr-balance"
              className="text-black hover:text-gray-600 hover:underline transition-colors duration-300"
            >
              Dashboard
            </Link>
            <Link
              href="https://imcwire.com/pricing"
              className="text-black hover:text-gray-600 hover:underline transition-colors duration-300"
            >
              Pricing
            </Link>
            <Link
              href="https://imcwire.com/about/"
              className="text-black hover:text-gray-600 hover:underline transition-colors duration-300"
            >
              About
            </Link>
            <Link
              href="https://imcwire.com/contact/"
              className="text-black hover:text-gray-600 hover:underline transition-colors duration-300"
            >
              Contact
            </Link>
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="text-black hover:text-gray-600 hover:underline transition-colors duration-300"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="p-2 px-5 -mt-1 bg-blue-800 text-white rounded-full"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
