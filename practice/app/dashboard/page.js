import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import styles from './page.module.css';

const page = async () => {
    const session = await auth();
    console.log(session);
  return (
    <div>
        <Navbar />
        <div className={styles.container}>
            Hi User! {session.user.name}
      </div>
    </div>
  )
}

export default page
