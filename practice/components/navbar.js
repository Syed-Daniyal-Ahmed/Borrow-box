//import React from 'react'
//"use server"
import { auth } from "@/auth.js";
import {SO} from "./sign-out";
import Link from "next/link";

const navbar = async() => {
    const session = await auth();
    const user = session?.user;
    console.log("Navbar user:", user);
    return (
        <div>
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
                                MyPost
                            </span>
                        </div>

                        <div className="hidden md:flex space-x-8 items-center">
                            <Link href="/writepost" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Write a Post</Link>
                            <Link href="/post" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Posts</Link>
                            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Dashboard</Link>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">{user?.name}</a>
                            <a href="#" className="bg-red-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                                <SO/>
                            </a>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </nav>
            
        </div>
    )
}

export default navbar