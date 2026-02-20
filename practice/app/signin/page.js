import { SignIn } from "@/components/sign-in";
import styles from './page.module.css';

export default function SignInPage() {
  return (
    <div className={styles.backgroundContainer}>
        <div className={styles.container}>
            <SignIn />
        </div>
        </div>);
}