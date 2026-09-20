import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Chatbot from "@/components/Chatbot";
import SideLoadCalculator from "@/components/SideLoadCalculator";
import { readCms } from "@/lib/cms/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cms = await readCms();

  return (
    <>
      <JsonLd />
      <Header
        initialCategories={cms.categories}
        initialProducts={cms.products}
        initialMedia={cms.media}
      />
      <div className="flex-1">{children}</div>
      <Footer />
      <Chatbot />
      <SideLoadCalculator />
    </>
  );
}
