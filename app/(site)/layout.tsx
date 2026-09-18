import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Chatbot from "@/components/Chatbot";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <Chatbot />
    </>
  );
}
