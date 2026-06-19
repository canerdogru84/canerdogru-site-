import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SystemFlow from "@/components/sections/SystemFlow";
import Audience from "@/components/sections/Audience";
import Steps from "@/components/sections/Steps";
import Services from "@/components/sections/Services";
import Trust from "@/components/sections/Trust";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <SystemFlow />
        <Audience />
        <Steps />
        <Services />
        <Trust />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
