import mongoose from "mongoose"
import styles from "./page.module.css"
import { connectDB } from "@/lib/db"
import { posts } from "@/models/post"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Navbar from "@/components/navbar"

const page = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.backgroundContainer}>
                <div className={styles.container}>
            <form
                action={async (formData) => {
                    "use server"
                    let conn = await connectDB();
                    let session = await auth();
                    const newPost = new posts({
                        title: formData.get("title"),
                        name: session.user.name,
                        email: session.user.email,
                        post: formData.get("post"),
                    });
                    await newPost.save();
                    redirect('/post');
                }}
            >
                <label>
                    Post Title
                </label>
                <input type="text" name="title"></input>
                <label>
                    Write your post
                    <textarea name="post" type="text" />
                </label>
                <br></br>
                <label>
                    Reference Image
                    <input type="file" className="bg-gray-400"/>
                </label>
                <br></br>
                <button>Post</button>
                
            </form>
            </div>
            </div>
        </div>
    )
}

export default page
