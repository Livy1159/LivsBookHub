import styles from './page.module.scss';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.content}>
        <h1 className={styles.title}>Currently Reading:</h1>
        <p className={styles.subtitle}>Author:</p>
        <p className={styles.subtitle}>Genre:</p>
        <div className={styles.lead}>
          This is a great book!
        </div>
      </section>
    </main>
  );
}
