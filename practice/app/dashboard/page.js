import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import styles from './page.module.css';
import { connectDB } from "@/lib/db";
import { posts } from "@/models/post";
import Status from "./status";

const page = async () => {
  "use server"
  const session = await auth();
  await connectDB();
  
  const postss = await posts.find({ email: session.user.email }).sort({ createdAt: -1 });
  return (
    <div>
      <Navbar />
      {!postss ?
        <div className={styles.container}>
          Hi User! {session.user.name}
        </div>
        :
        <div className="flex flex-col items-center">
          {postss.map((post) => {
            return (
              <div key={post._id} className="max-w-md rounded-xl overflow-hidden shadow-lg bg-white p-4 m-3 border border-gray-200 w-600 flex flex-col items-center">

                {/* Title */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {post.title}
                  </h2>
                </div>

                <Status id={post._id.toString()} currentStatus={post.status || "Open"} />

                {/* <select>
                  <option value = "Open">Open</option>
                  <option value = "Contacted">Contacted</option>
                  <option value = "Shipped">Shipped</option>
                  <option value = "Delivered">Delivered</option>
                </select> */}

                {/* Image
                <img
                  src={post.qr}
                  alt="Card"
                  className="w-60 h-60 object-cover"
                />

                <CopyButton url={post.qr} /> */}



              </div>
            )
          })}
        </div>
      }

    </div>
  )
}

export default page
