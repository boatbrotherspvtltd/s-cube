import Link from "next/link";
import { company, nav } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt={`${company.name} logo`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-md bg-white object-contain p-0.5"
            />
            <h3 className="font-semibold text-white">{company.name}</h3>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {company.address}
          </p>
          <p className="mt-3 text-sm">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              WhatsApp us
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${company.email}`} className="hover:text-white">
              {company.email}
            </a>
          </p>
          <p className="mt-1 text-sm">GSTN: {company.gstn}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
            Quick links
          </h3>
          <ul className="space-y-2 text-sm">
            {nav
              .filter((item) => item.href !== "/")
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
            Credentials
          </h3>
          <p className="text-sm">{company.iso} Certified Firm</p>
          <p className="mt-1 text-sm">{company.years} years of trusted service</p>
          <p className="mt-1 text-sm">Serving {company.region}</p>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            Brand availability is subject to product, territory and commercial
            terms.
          </p>
        </div>
      </div>

      {/* Regional Solar Network & SEO Keywords Strip */}
      <div className="border-t border-white/10 bg-black/20 py-8 text-xs text-white/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-xs leading-relaxed">
            <div>
              <p className="font-semibold text-white/90 uppercase tracking-wider mb-2">
                Guwahati & Regional Reach
              </p>
              <p className="text-white/65">
                Headquartered at Khanpara, Guwahati, supplying genuine solar panels, inverters, and equipment across Kamrup, Assam, Meghalaya, Arunachal Pradesh, Nagaland, and all 7 Northeast states.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white/90 uppercase tracking-wider mb-2">
                Authorised Brand Portfolio
              </p>
              <p className="text-white/65">
                Direct distribution and dealer channels for Adani Solar PV Modules, Waaree Energies, Luminous Solar Inverters & Batteries, Microtek Inverters, and Tata Power Solar Water Pumps.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white/90 uppercase tracking-wider mb-2">
                Solar Solutions & Schemes
              </p>
              <p className="text-white/65">
                Residential rooftop solar, commercial & industrial solar installations, PM Surya Ghar Muft Bijli Yojana support, solar agricultural water pumps, and BOS accessories.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {company.name}. All rights reserved. · Guwahati, Assam
      </div>
    </footer>
  );
}
