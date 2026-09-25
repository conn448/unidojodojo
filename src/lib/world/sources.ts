/**
 * Sources for the Finance Around the World pathways.
 *
 * Every URL in this file was checked to resolve before being cited, so the
 * Sources dialog never sends a learner to a dead page. Deep links are used where
 * one was verified; where only the publisher was, the publisher's own page is
 * used rather than a guessed path. Nothing here is invented.
 */
import type { Source } from "../curriculum";

export const WORLD_SOURCES = {
  /* ---------- ethical and sustainable finance ---------- */
  unpri: {
    label: "The six Principles for Responsible Investment and the signatory base",
    url: "https://www.unpri.org/",
    publisher: "UN Principles for Responsible Investment",
  },
  icma: {
    label: "Green Bond Principles: the voluntary framework for labelling a bond green",
    url: "https://www.icmagroup.org/sustainable-finance/the-principles-guidelines-and-handbooks/green-bond-principles-gbp/",
    publisher: "International Capital Market Association",
  },
  gssb: {
    label: "Sustainability reporting standards, and who is expected to use them",
    url: "https://www.globalreporting.org/",
    publisher: "Global Reporting Initiative",
  },
  fsb: {
    label: "Climate-related financial disclosures and the work on consistent reporting",
    url: "https://www.fsb.org/",
    publisher: "Financial Stability Board",
  },
  eurosif: {
    label: "Sustainable investment market studies across Europe, and the fund labels",
    url: "https://www.eurosif.org/",
    publisher: "Eurosif",
  },
  unepfi: {
    label: "How banks, insurers and investors are expected to account for sustainability",
    url: "https://www.unepfi.org/",
    publisher: "UN Environment Programme Finance Initiative",
  },
  boeClimate: {
    label: "Why the Bank of England treats climate as a financial risk",
    url: "https://www.bankofengland.co.uk/climate-change",
    publisher: "Bank of England",
  },
  fcaConsumers: {
    label: "Consumer guidance on investing, and where to check a firm or a scam",
    url: "https://www.fca.org.uk/consumers",
    publisher: "Financial Conduct Authority",
  },

  /* ---------- international finance ---------- */
  boe: {
    label: "Monetary policy, interest rates and the role of a central bank",
    url: "https://www.bankofengland.co.uk/",
    publisher: "Bank of England",
  },
  bis: {
    label: "Cross-border banking, payment systems and currency settlement research",
    url: "https://www.bis.org/",
    publisher: "Bank for International Settlements",
  },
  ecb: {
    label: "The euro area, exchange rate policy and cross-border payments",
    url: "https://www.ecb.europa.eu/",
    publisher: "European Central Bank",
  },
  federalReserve: {
    label: "The dollar system, interest rates and international finance",
    url: "https://www.federalreserve.gov/",
    publisher: "Board of Governors of the Federal Reserve System",
  },
  worldBank: {
    label: "Remittances, development finance and cross-border money flows",
    url: "https://www.worldbank.org/",
    publisher: "World Bank",
  },
  ons: {
    label: "UK exchange rates and inflation data, published monthly",
    url: "https://www.ons.gov.uk/",
    publisher: "Office for National Statistics",
  },
  fcaFinancialCrime: {
    label: "Money laundering rules and what firms must check about a transfer",
    url: "https://www.fca.org.uk/firms/financial-crime",
    publisher: "Financial Conduct Authority",
  },

  /* ---------- community and cooperative finance ---------- */
  woccu: {
    label: "What a credit union is, and the scale of the model worldwide",
    url: "https://www.woccu.org/",
    publisher: "World Council of Credit Unions",
  },
  coopUk: {
    label: "How co-operatives and mutuals are owned and governed in the UK",
    url: "https://www.uk.coop/",
    publisher: "Co-operatives UK",
  },
  findCreditUnion: {
    label: "Directory of UK credit unions, searchable by where you live or study",
    url: "https://findyourcreditunion.co.uk/",
    publisher: "Find Your Credit Union",
  },
  fscs: {
    label: "Protection limits covering banks, building societies and credit unions",
    url: "https://www.fscs.org.uk/",
    publisher: "Financial Services Compensation Scheme",
  },
  cdfi: {
    label: "Community development financial institutions and how they are funded",
    url: "https://www.cdfi.org/",
    publisher: "Community Development Financial Institutions Fund",
  },
  socialEnterpriseUk: {
    label: "Social enterprises, and what distinguishes them from a charity or a company",
    url: "https://www.socialenterprise.org.uk/",
    publisher: "Social Enterprise UK",
  },
  communityShares: {
    label: "Community shares, the legal rules and the risks of this kind of investment",
    url: "https://www.communityshares.org.uk/",
    publisher: "Community Shares Unit",
  },
  cgap: {
    label: "Microfinance research and evidence on what actually helps borrowers",
    url: "https://www.cgap.org/",
    publisher: "CGAP (World Bank)",
  },
} as const satisfies Record<string, Source>;
