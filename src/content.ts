/**
 * Central content + company constants for the Quant Mesh site.
 * Keep factual/legal data here so it has a single source of truth.
 */

export const COMPANY = {
  legalName: "Quant Mesh Limited",
  brand: "Quant Mesh",
  tagline: "Distributed compute infrastructure for the AI era",
  business: "Software as a Service",
  domain: "quantmesh.ai",
  url: "https://quantmesh.ai",
  email: "business@quantmesh.ai",
  jurisdiction: "Hong Kong",
  // Address split for both display and structured data (schema.org PostalAddress)
  address: {
    line1: "Unit A, 22/F, Wing Cheong Commercial Building",
    line2: "23 Jervois Street, Sheung Wan",
    locality: "Sheung Wan",
    region: "Hong Kong",
    country: "Hong Kong SAR, China",
    countryCode: "HK",
    full: "Unit A, 22/F, Wing Cheong Comm. Bldg., 23 Jervois St., Sheung Wan, Hong Kong",
  },
  yearNow: "2026",
} as const;

export const REVEAL_STAGGER_MS = 90;
