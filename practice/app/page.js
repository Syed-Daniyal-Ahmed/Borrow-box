import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16">
        <Image
          src="/Logo.png"
          width={180}
          height={180}
          alt="Logo"
        />

        <h1 className="text-4xl md:text-5xl font-bold mt-6 text-gray-800">
          Borrow. Share. Repeat.
        </h1>

        <p className="mt-4 text-gray-600 max-w-xl">
          A simple and smart platform where students can borrow and lend
          books, gadgets, and essentials easily.
        </p>

        <div className="mt-6 flex gap-4">
          <Link
            href="/signin"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Browse Items
          </Link>

          {/* <Link
            href="/post"
            className="px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            List an Item
          </Link> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-8 py-16 max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Safe Borrowing</h3>
          <p className="text-gray-600">
            Connect with verified users and borrow items securely.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Save Money</h3>
          <p className="text-gray-600">
            Why buy when you can borrow? Reduce unnecessary expenses.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
          <p className="text-gray-600">
            Post or request items in seconds with a clean interface.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 border-t">
        © 2026 BorrowHub. All rights reserved.
      </footer>
    </div>
  );
}