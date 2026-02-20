import SignUp from "@/components/sign-up"
import styles from './page.module.css';

const page = () => {
  return (
    <div className={styles.backgroundContainer}>
        <div className={styles.container}>
    <SignUp />
    </div>
    </div>
  )
}

export default page