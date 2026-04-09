import mongoose from "mongoose"
import styles from "./page.module.css"
import { connectDB } from "@/lib/db"
import { posts } from "@/models/post"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Navbar from "@/components/navbar"
import fs from "fs";
import path from "path";
import QRCode from "qrcode";


async function generateQR(text,file) {
  try {
    // create unique filename
    const fileName = `qr-${Date.now()}-${file.name}`;

    // path to public/uploads
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // generate QR and save
    await QRCode.toFile(filePath, text);

    // return public URL
    return `/uploads/${fileName}`;
  } catch (err) {
    console.error(err);
    throw new Error("QR generation failed");
  }
}



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
                            console.log("huiu",session.user)
                            const name = session.user.upi_name;
                            const namee = encodeURIComponent(name);
                            console.log(namee);
                            const id = session.user.upi_id;
                            const amount = formData.get("amount");
                            const qr_text = `upi://pay?pa=${id}&pn=${namee}&am=${amount}&cu=INR`;
                            console.log(qr_text);
                            const qr_addr = await generateQR(qr_text,file);
                            const newPost = new posts({
                                title: formData.get("title"),
                                name: session.user.name,
                                email: session.user.email,
                                post: formData.get("post"),
                                image: imagePath,
                                qr:qr_addr
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
                        {/* <br></br> */}
                        <label>
                            Amount
                        </label>
                        <input type="number" name="amount"></input>
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
