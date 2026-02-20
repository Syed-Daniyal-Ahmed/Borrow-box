import mongoose from "mongoose"
import styles from "./page.module.css"
import { connectDB } from "@/lib/db"
import { posts } from "@/models/post"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Navbar from "@/components/navbar"
import fs from "fs";
import path from "path";

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
                            const file = formData.get("image");
                            let imagePath = "";

                            if (file && file.size > 0) {
                                const bytes = await file.arrayBuffer();
                                const buffer = Buffer.from(bytes);

                                const uploadDir = path.join(process.cwd(), "public/uploads");

                                // Create folder if not exists
                                if (!fs.existsSync(uploadDir)) {
                                    fs.mkdirSync(uploadDir, { recursive: true });
                                }

                                const fileName = `${Date.now()}-${file.name}`;
                                const filePath = path.join(uploadDir, fileName);

                                fs.writeFileSync(filePath, buffer);

                                imagePath = `/uploads/${fileName}`;
                            }

                            const newPost = new posts({
                                title: formData.get("title"),
                                name: session.user.name,
                                email: session.user.email,
                                post: formData.get("post"),
                                image: imagePath,
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
                            <input type="file" className="bg-gray-400" name="image" />
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
