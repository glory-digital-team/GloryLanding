import { Header } from "@/widgets/header";
import { Hero } from "@/widgets/hero";
import { Advantages } from "@/widgets/advantages";
import { Cta } from "@/widgets/cta";
import { Bento } from "@/widgets/bento";
import { Portfolio } from "@/widgets/portfolio";
import { LeadForm } from "@/widgets/lead-form";
import { Faq } from "@/widgets/faq";
import { Footer } from "@/widgets/footer";
import styles from "./HomePage.module.scss";

export function HomePage() {
  return (
    <>
      <div className={styles.firstScreen}>
        <Header />
        <main>
          <Hero />
        </main>
      </div>
      <Advantages />
      <Cta />
      <Bento />
      <Portfolio />
      <LeadForm />
      <Faq />
      <Footer />
    </>
  );
}
