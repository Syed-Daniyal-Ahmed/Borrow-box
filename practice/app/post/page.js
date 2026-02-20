import Navbar from "@/components/navbar"
import styles from "./page.module.css"
import mongoose from "mongoose"
import { posts } from "@/models/post"
import { connectDB } from "@/lib/db"

const page = async () => {
    await connectDB();
    const postss = await posts.find({}).sort({createdAt: -1});
    console.log(postss);
    return (
        <div>
            <Navbar />

            <div className={styles.container}>

            {postss.map(post => (
                <div key={post._id} className="max-w-sm bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
                    <div className="relative overflow-hidden">

                        <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                New Post
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {
                            new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'})
                        }
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {post.post}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="ml-2 text-sm font-medium text-gray-700">{post.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}


            </div>
        </div>
    )
}

export default page
