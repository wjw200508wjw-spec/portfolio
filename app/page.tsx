import Navbar from "./components/Navbar";
import SideIndicator from "./components/SideIndicator";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";

import Blog from "./components/Blog";
import DataDashboard from "./components/DataDashboard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// ============================================================
// EXTENSIBILITY: To add a new section:
// 1. Import the component above
// 2. Add it inside <main> below
// 3. Add its id to SECTION_IDS in lib/constants.ts
// ============================================================

export default function Home() {
  return (
    <>
      <Navbar />
      <SideIndicator />
      <main>
        <Hero />
        <About />
        <Projects />

        <Blog />
        <DataDashboard />
        <Contact />
        {/* EXTENSION POINT: Add new sections here */}
      </main>
      <Footer />
    </>
  );
}
