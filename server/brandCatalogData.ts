import { BrandCatalogItem } from './db';

export const COMPREHENSIVE_BRAND_CATALOG: BrandCatalogItem[] = [
  // ==========================================
  // JAPAN
  // ==========================================
  {
    id: 'b-toyota',
    name: 'Toyota',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-toy-landcruiser', name: 'Land Cruiser', years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'SUV' },
      { id: 'm-toy-prado', name: 'Land Cruiser Prado', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'SUV' },
      { id: 'm-toy-camry', name: 'Camry', years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'Sedan' },
      { id: 'm-toy-corolla', name: 'Corolla', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'Sedan' },
      { id: 'm-toy-rav4', name: 'RAV4', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'SUV' },
      { id: 'm-toy-highlander', name: 'Highlander', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'SUV' },
      { id: 'm-toy-hilux', name: 'Hilux', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'Truck' },
      { id: 'm-toy-fortuner', name: 'Fortuner', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'SUV' },
      { id: 'm-toy-sienna', name: 'Sienna', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Van' },
      { id: 'm-toy-venza', name: 'Venza', years: [2024, 2023, 2022, 2021, 2020], category: 'Crossover' },
      { id: 'm-toy-avalon', name: 'Avalon', years: [2022, 2021, 2020, 2019, 2018], category: 'Sedan' },
      { id: 'm-toy-crown', name: 'Crown', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-toy-4runner', name: '4Runner', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
    ]
  },
  {
    id: 'b-lexus',
    name: 'Lexus',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-lex-lx600', name: 'LX 600 / LX 570', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'SUV' },
      { id: 'm-lex-gx460', name: 'GX 460 / GX 550', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'SUV' },
      { id: 'm-lex-rx350', name: 'RX 350', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018], category: 'Crossover' },
      { id: 'm-lex-es350', name: 'ES 350', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'Sedan' },
      { id: 'm-lex-is350', name: 'IS 300 / IS 350', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-lex-nx350', name: 'NX 350', years: [2025, 2024, 2023, 2022, 2021], category: 'Crossover' },
      { id: 'm-lex-tx350', name: 'TX 350', years: [2025, 2024], category: 'SUV' },
      { id: 'm-lex-ls500', name: 'LS 500', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
    ]
  },
  {
    id: 'b-honda',
    name: 'Honda',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-hon-accord', name: 'Accord', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'Sedan' },
      { id: 'm-hon-civic', name: 'Civic', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-hon-crv', name: 'CR-V', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-hon-pilot', name: 'Pilot', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-hon-hrv', name: 'HR-V', years: [2025, 2024, 2023, 2022, 2021], category: 'Crossover' },
      { id: 'm-hon-passport', name: 'Passport', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-hon-odyssey', name: 'Odyssey', years: [2025, 2024, 2023, 2022, 2021], category: 'Van' },
    ]
  },
  {
    id: 'b-nissan',
    name: 'Nissan',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-nis-patrol', name: 'Patrol / Armada', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'SUV' },
      { id: 'm-nis-pathfinder', name: 'Pathfinder', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-nis-altima', name: 'Altima', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-nis-rogue', name: 'Rogue / X-Trail', years: [2025, 2024, 2023, 2022, 2021], category: 'Crossover' },
      { id: 'm-nis-navara', name: 'Navara / Frontier', years: [2025, 2024, 2023, 2022, 2021], category: 'Truck' },
      { id: 'm-nis-gtr', name: 'GT-R', years: [2024, 2023, 2022, 2021, 2020], category: 'Coupe' },
    ]
  },
  {
    id: 'b-mazda',
    name: 'Mazda',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-maz-cx5', name: 'CX-5', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Crossover' },
      { id: 'm-maz-cx90', name: 'CX-90', years: [2025, 2024], category: 'SUV' },
      { id: 'm-maz-cx60', name: 'CX-60', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-maz-mazda3', name: 'Mazda 3', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-maz-mazda6', name: 'Mazda 6', years: [2023, 2022, 2021, 2020], category: 'Sedan' },
    ]
  },
  {
    id: 'b-subaru',
    name: 'Subaru',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-sub-outback', name: 'Outback', years: [2025, 2024, 2023, 2022, 2021], category: 'Crossover' },
      { id: 'm-sub-forester', name: 'Forester', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-sub-crosstrek', name: 'Crosstrek', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-sub-wrx', name: 'WRX', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
    ]
  },
  {
    id: 'b-mitsubishi',
    name: 'Mitsubishi',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-mit-pajero', name: 'Pajero / Montero Sport', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-mit-outlander', name: 'Outlander', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-mit-l200', name: 'L200 / Triton', years: [2025, 2024, 2023, 2022, 2021], category: 'Truck' },
    ]
  },
  {
    id: 'b-suzuki',
    name: 'Suzuki',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-suz-jimny', name: 'Jimny', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-suz-grandvitara', name: 'Grand Vitara', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-suz-swift', name: 'Swift', years: [2025, 2024, 2023, 2022, 2021], category: 'Hatchback' },
    ]
  },
  {
    id: 'b-isuzu',
    name: 'Isuzu',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-isu-dmax', name: 'D-Max', years: [2025, 2024, 2023, 2022, 2021], category: 'Truck' },
      { id: 'm-isu-mux', name: 'MU-X', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
    ]
  },
  {
    id: 'b-infiniti',
    name: 'Infiniti',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-inf-qx80', name: 'QX80', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-inf-qx60', name: 'QX60', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-inf-q50', name: 'Q50', years: [2024, 2023, 2022, 2021], category: 'Sedan' },
    ]
  },
  {
    id: 'b-acura',
    name: 'Acura',
    country: 'Japan',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-acu-mdx', name: 'MDX', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-acu-rdx', name: 'RDX', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-acu-tlx', name: 'TLX', years: [2024, 2023, 2022, 2021], category: 'Sedan' },
    ]
  },

  // ==========================================
  // GERMANY
  // ==========================================
  {
    id: 'b-mercedes-benz',
    name: 'Mercedes-Benz',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-mb-gclass', name: 'G-Class (G63 AMG / G500)', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'SUV' },
      { id: 'm-mb-sclass', name: 'S-Class (S500 / S580)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-mb-eclass', name: 'E-Class (E350 / E450)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-mb-cclass', name: 'C-Class (C300 / C43)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-mb-gle', name: 'GLE (GLE 450 / GLE 53)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-mb-gls', name: 'GLS (GLS 450 / GLS 580)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-mb-glc', name: 'GLC 300', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-mb-cla', name: 'CLA 250', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-mb-amggt', name: 'AMG GT', years: [2025, 2024, 2023, 2022, 2021], category: 'Coupe' },
      { id: 'm-mb-maybach-s', name: 'Maybach S-Class', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-mb-maybach-gls', name: 'Maybach GLS 600', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  },
  {
    id: 'b-bmw',
    name: 'BMW',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-bmw-x7', name: 'X7', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-bmw-x6', name: 'X6', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-bmw-x5', name: 'X5', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-bmw-x3', name: 'X3', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-bmw-7series', name: '7 Series (740i / 760i / i7)', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-bmw-5series', name: '5 Series (530i / 540i)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-bmw-3series', name: '3 Series (330i / M340i)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-bmw-m3', name: 'M3 / M4 / M5', years: [2025, 2024, 2023, 2022, 2021], category: 'Coupe' },
      { id: 'm-bmw-ix', name: 'iX Electric Flagship', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  },
  {
    id: 'b-audi',
    name: 'Audi',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-aud-q8', name: 'Q8 / RS Q8', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-aud-q7', name: 'Q7', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-aud-q5', name: 'Q5', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-aud-a8', name: 'A8 / S8', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-aud-a6', name: 'A6', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-aud-a4', name: 'A4', years: [2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-aud-etron', name: 'e-tron GT', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
    ]
  },
  {
    id: 'b-porsche',
    name: 'Porsche',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-por-cayenne', name: 'Cayenne', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-por-macan', name: 'Macan', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-por-911', name: '911 (Carrera / Turbo / GT3)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Coupe' },
      { id: 'm-por-panamera', name: 'Panamera', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-por-taycan', name: 'Taycan EV', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
    ]
  },
  {
    id: 'b-volkswagen',
    name: 'Volkswagen',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-vw-touareg', name: 'Touareg', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-vw-teramont', name: 'Teramont / Atlas', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-vw-tiguan', name: 'Tiguan', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-vw-passat', name: 'Passat', years: [2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-vw-golf', name: 'Golf GTI / Golf R', years: [2025, 2024, 2023, 2022], category: 'Hatchback' },
      { id: 'm-vw-id4', name: 'ID.4 / ID.6', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  },
  {
    id: 'b-opel',
    name: 'Opel',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-op-grandland', name: 'Grandland', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-op-mokka', name: 'Mokka', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-op-astra', name: 'Astra', years: [2025, 2024, 2023], category: 'Hatchback' },
    ]
  },
  {
    id: 'b-maybach',
    name: 'Maybach',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-may-s680', name: 'Maybach S 680 V12', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-may-s580', name: 'Maybach S 580', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-may-gls600', name: 'Maybach GLS 600', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  },
  {
    id: 'b-smart',
    name: 'Smart',
    country: 'Germany',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-smt-1', name: '#1 Compact SUV', years: [2025, 2024, 2023], category: 'Crossover' },
      { id: 'm-smt-3', name: '#3 Coupe SUV', years: [2025, 2024], category: 'Crossover' },
    ]
  },

  // ==========================================
  // UNITED STATES
  // ==========================================
  {
    id: 'b-ford',
    name: 'Ford',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-for-f150', name: 'F-150 / Raptor', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Truck' },
      { id: 'm-for-explorer', name: 'Explorer', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-for-expedition', name: 'Expedition', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-for-mustang', name: 'Mustang', years: [2025, 2024, 2023, 2022, 2021], category: 'Coupe' },
      { id: 'm-for-ranger', name: 'Ranger', years: [2025, 2024, 2023, 2022, 2021], category: 'Truck' },
      { id: 'm-for-edge', name: 'Edge', years: [2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-for-bronco', name: 'Bronco', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
    ]
  },
  {
    id: 'b-chevrolet',
    name: 'Chevrolet',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-che-tahoe', name: 'Tahoe', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-che-suburban', name: 'Suburban', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-che-corvette', name: 'Corvette C8', years: [2025, 2024, 2023, 2022, 2021], category: 'Coupe' },
      { id: 'm-che-silverado', name: 'Silverado 1500', years: [2025, 2024, 2023, 2022, 2021], category: 'Truck' },
      { id: 'm-che-traverse', name: 'Traverse', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  },
  {
    id: 'b-cadillac',
    name: 'Cadillac',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-cad-escalade', name: 'Escalade / Escalade ESV', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-cad-xt6', name: 'XT6', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cad-xt5', name: 'XT5', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cad-lyriq', name: 'Lyriq EV', years: [2025, 2024, 2023], category: 'SUV' },
    ]
  },
  {
    id: 'b-gmc',
    name: 'GMC',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-gmc-yukon', name: 'Yukon / Yukon Denali', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-gmc-sierra', name: 'Sierra 1500 Denali', years: [2025, 2024, 2023, 2022, 2021], category: 'Truck' },
      { id: 'm-gmc-hummer', name: 'Hummer EV SUV / Truck', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-gmc-acadia', name: 'Acadia', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  },
  {
    id: 'b-dodge',
    name: 'Dodge',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-dod-charger', name: 'Charger', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'Sedan' },
      { id: 'm-dod-challenger', name: 'Challenger', years: [2023, 2022, 2021, 2020], category: 'Coupe' },
      { id: 'm-dod-durango', name: 'Durango (SRT / Hellcat)', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
    ]
  },
  {
    id: 'b-jeep',
    name: 'Jeep',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-jee-grandcherokee', name: 'Grand Cherokee / Grand Cherokee L', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-jee-wrangler', name: 'Wrangler Rubicon', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-jee-wagoneer', name: 'Grand Wagoneer', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-jee-gladiator', name: 'Gladiator', years: [2025, 2024, 2023, 2022], category: 'Truck' },
    ]
  },
  {
    id: 'b-chrysler',
    name: 'Chrysler',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-chr-pacifica', name: 'Pacifica', years: [2025, 2024, 2023, 2022, 2021], category: 'Van' },
      { id: 'm-chr-300', name: '300C', years: [2023, 2022, 2021, 2020], category: 'Sedan' },
    ]
  },
  {
    id: 'b-tesla',
    name: 'Tesla',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-tsl-modely', name: 'Model Y', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-tsl-model3', name: 'Model 3 (Highland)', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-tsl-modelx', name: 'Model X Plaid', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-tsl-models', name: 'Model S Plaid', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-tsl-cybertruck', name: 'Cybertruck', years: [2025, 2024], category: 'Truck' },
    ]
  },
  {
    id: 'b-lincoln',
    name: 'Lincoln',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-lin-navigator', name: 'Navigator', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-lin-aviator', name: 'Aviator', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-lin-nautilus', name: 'Nautilus', years: [2025, 2024], category: 'SUV' },
    ]
  },
  {
    id: 'b-rivian',
    name: 'Rivian',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-riv-r1s', name: 'R1S Electric SUV', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-riv-r1t', name: 'R1T Electric Truck', years: [2025, 2024, 2023, 2022], category: 'Truck' },
    ]
  },
  {
    id: 'b-lucid',
    name: 'Lucid',
    country: 'United States',
    region: 'Americas',
    enabled: true,
    models: [
      { id: 'm-luc-air', name: 'Air Dream / Grand Touring', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-luc-gravity', name: 'Gravity SUV', years: [2025], category: 'SUV' },
    ]
  },

  // ==========================================
  // SOUTH KOREA
  // ==========================================
  {
    id: 'b-hyundai',
    name: 'Hyundai',
    country: 'South Korea',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-hyu-palisade', name: 'Palisade', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-hyu-santafe', name: 'Santa Fe', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-hyu-tucson', name: 'Tucson', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-hyu-sonata', name: 'Sonata', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-hyu-elantra', name: 'Elantra', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-hyu-creta', name: 'Creta', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-hyu-ioniq5', name: 'Ioniq 5', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-hyu-staria', name: 'Staria Luxury Van', years: [2025, 2024, 2023, 2022], category: 'Van' },
    ]
  },
  {
    id: 'b-kia',
    name: 'Kia',
    country: 'South Korea',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-kia-telluride', name: 'Telluride', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-kia-sorento', name: 'Sorento', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-kia-sportage', name: 'Sportage', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-kia-carnival', name: 'Carnival MPV', years: [2025, 2024, 2023, 2022], category: 'Van' },
      { id: 'm-kia-k5', name: 'K5', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-kia-seltos', name: 'Seltos', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-kia-ev9', name: 'EV9 Flagship SUV', years: [2025, 2024], category: 'SUV' },
    ]
  },
  {
    id: 'b-genesis',
    name: 'Genesis',
    country: 'South Korea',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-gen-gv80', name: 'GV80 / GV80 Coupe', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-gen-g80', name: 'G80', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-gen-gv70', name: 'GV70', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-gen-g90', name: 'G90', years: [2025, 2024, 2023], category: 'Sedan' },
    ]
  },

  // ==========================================
  // UNITED KINGDOM
  // ==========================================
  {
    id: 'b-land-rover',
    name: 'Land Rover',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-lr-rangerover', name: 'Range Rover (Autobiography / SV)', years: [2025, 2024, 2023, 2022, 2021, 2020, 2019], category: 'SUV' },
      { id: 'm-lr-sport', name: 'Range Rover Sport', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-lr-velar', name: 'Range Rover Velar', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-lr-evoque', name: 'Range Rover Evoque', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-lr-defender', name: 'Defender (90 / 110 / 130)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-lr-discovery', name: 'Discovery', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
    ]
  },
  {
    id: 'b-jaguar',
    name: 'Jaguar',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-jag-fpace', name: 'F-Pace SVR', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-jag-epace', name: 'E-Pace', years: [2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-jag-xf', name: 'XF', years: [2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-jag-ftype', name: 'F-Type', years: [2024, 2023, 2022, 2021], category: 'Coupe' },
    ]
  },
  {
    id: 'b-bentley',
    name: 'Bentley',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-ben-bentayga', name: 'Bentayga (V8 / Speed / EWB)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-ben-continental', name: 'Continental GT', years: [2025, 2024, 2023, 2022, 2021], category: 'Coupe' },
      { id: 'm-ben-flyingspur', name: 'Flying Spur', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
    ]
  },
  {
    id: 'b-rolls-royce',
    name: 'Rolls-Royce',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-rr-cullinan', name: 'Cullinan (Series II / Black Badge)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-rr-phantom', name: 'Phantom VIII', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-rr-ghost', name: 'Ghost', years: [2025, 2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-rr-spectre', name: 'Spectre EV Coupe', years: [2025, 2024], category: 'Coupe' },
    ]
  },
  {
    id: 'b-aston-martin',
    name: 'Aston Martin',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-am-dbx', name: 'DBX / DBX707', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-am-db12', name: 'DB12', years: [2025, 2024], category: 'Coupe' },
      { id: 'm-am-vantage', name: 'Vantage', years: [2025, 2024, 2023, 2022], category: 'Coupe' },
    ]
  },
  {
    id: 'b-mclaren',
    name: 'McLaren',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-mcl-750s', name: '750S', years: [2025, 2024], category: 'Coupe' },
      { id: 'm-mcl-artura', name: 'Artura Hybrid', years: [2025, 2024, 2023], category: 'Coupe' },
      { id: 'm-mcl-720s', name: '720S', years: [2023, 2022, 2021, 2020], category: 'Coupe' },
      { id: 'm-mcl-gt', name: 'McLaren GT', years: [2024, 2023, 2022], category: 'Coupe' },
    ]
  },
  {
    id: 'b-lotus',
    name: 'Lotus',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-lot-eletre', name: 'Eletre Hyper-SUV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-lot-emira', name: 'Emira', years: [2025, 2024, 2023], category: 'Coupe' },
    ]
  },
  {
    id: 'b-mini',
    name: 'Mini',
    country: 'United Kingdom',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-mini-countryman', name: 'Countryman', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-mini-cooper', name: 'Cooper S', years: [2025, 2024, 2023, 2022], category: 'Hatchback' },
    ]
  },

  // ==========================================
  // SWEDEN
  // ==========================================
  {
    id: 'b-volvo',
    name: 'Volvo',
    country: 'Sweden',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-vol-xc90', name: 'XC90', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-vol-xc60', name: 'XC60', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-vol-xc40', name: 'XC40 / EX40', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-vol-ex90', name: 'EX90 Electric', years: [2025, 2024], category: 'SUV' },
      { id: 'm-vol-s90', name: 'S90', years: [2024, 2023, 2022, 2021], category: 'Sedan' },
    ]
  },
  {
    id: 'b-polestar',
    name: 'Polestar',
    country: 'Sweden',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-pol-2', name: 'Polestar 2', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-pol-3', name: 'Polestar 3 SUV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-pol-4', name: 'Polestar 4 Coupe SUV', years: [2025], category: 'SUV' },
    ]
  },

  // ==========================================
  // FRANCE
  // ==========================================
  {
    id: 'b-peugeot',
    name: 'Peugeot',
    country: 'France',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-peu-5008', name: '5008', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-peu-3008', name: '3008', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-peu-2008', name: '2008', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-peu-508', name: '508', years: [2024, 2023, 2022, 2021], category: 'Sedan' },
      { id: 'm-peu-landtrek', name: 'Landtrek Pickup', years: [2025, 2024, 2023, 2022], category: 'Truck' },
    ]
  },
  {
    id: 'b-citroen',
    name: 'Citroën',
    country: 'France',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-cit-c5aircross', name: 'C5 Aircross', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cit-c4', name: 'C4', years: [2024, 2023, 2022], category: 'Hatchback' },
    ]
  },
  {
    id: 'b-renault',
    name: 'Renault',
    country: 'France',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-ren-duster', name: 'Duster', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-ren-koleos', name: 'Koleos', years: [2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-ren-arkana', name: 'Arkana', years: [2024, 2023, 2022], category: 'Crossover' },
    ]
  },
  {
    id: 'b-ds',
    name: 'DS Automobiles',
    country: 'France',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-ds-7', name: 'DS 7 Crossback', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-ds-9', name: 'DS 9', years: [2024, 2023, 2022], category: 'Sedan' },
    ]
  },
  {
    id: 'b-bugatti',
    name: 'Bugatti',
    country: 'France',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-bug-tourbillon', name: 'Tourbillon V16', years: [2026], category: 'Coupe' },
      { id: 'm-bug-chiron', name: 'Chiron Pur Sport / Super Sport', years: [2024, 2023, 2022, 2021, 2020], category: 'Coupe' },
    ]
  },

  // ==========================================
  // ITALY
  // ==========================================
  {
    id: 'b-ferrari',
    name: 'Ferrari',
    country: 'Italy',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-fer-purosangue', name: 'Purosangue V12', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-fer-296', name: '296 GTB / GTS', years: [2025, 2024, 2023], category: 'Coupe' },
      { id: 'm-fer-roma', name: 'Roma', years: [2025, 2024, 2023, 2022, 2021], category: 'Coupe' },
      { id: 'm-fer-sf90', name: 'SF90 Stradale', years: [2024, 2023, 2022, 2021], category: 'Coupe' },
    ]
  },
  {
    id: 'b-lamborghini',
    name: 'Lamborghini',
    country: 'Italy',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-lam-urus', name: 'Urus (S / Performante / SE)', years: [2025, 2024, 2023, 2022, 2021, 2020], category: 'SUV' },
      { id: 'm-lam-revuelto', name: 'Revuelto V12 Hybrid', years: [2025, 2024], category: 'Coupe' },
      { id: 'm-lam-huracan', name: 'Huracán (Tecnica / STO)', years: [2024, 2023, 2022, 2021], category: 'Coupe' },
    ]
  },
  {
    id: 'b-maserati',
    name: 'Maserati',
    country: 'Italy',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-mas-grecale', name: 'Grecale (Trofeo / Modena)', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-mas-levante', name: 'Levante', years: [2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-mas-mc20', name: 'MC20 Supercar', years: [2025, 2024, 2023], category: 'Coupe' },
      { id: 'm-mas-granturismo', name: 'GranTurismo', years: [2025, 2024], category: 'Coupe' },
    ]
  },
  {
    id: 'b-alfa-romeo',
    name: 'Alfa Romeo',
    country: 'Italy',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-alf-stelvio', name: 'Stelvio Quadrifoglio', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-alf-tonale', name: 'Tonale', years: [2025, 2024, 2023], category: 'Crossover' },
      { id: 'm-alf-giulia', name: 'Giulia Quadrifoglio', years: [2024, 2023, 2022, 2021], category: 'Sedan' },
    ]
  },
  {
    id: 'b-fiat',
    name: 'Fiat',
    country: 'Italy',
    region: 'Europe',
    enabled: true,
    models: [
      { id: 'm-fia-500', name: '500e', years: [2025, 2024, 2023, 2022], category: 'Hatchback' },
      { id: 'm-fia-500x', name: '500X', years: [2024, 2023, 2022], category: 'Crossover' },
    ]
  },

  // ==========================================
  // CHINA (Direct Vehicle Sourcing Hub)
  // ==========================================
  {
    id: 'b-byd',
    name: 'BYD',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-byd-tang', name: 'Tang (EV / DM-i / DM-p)', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-byd-han', name: 'Han Luxury Sedan', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-byd-seal', name: 'Seal / Seal U', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-byd-songplus', name: 'Song Plus DM-i', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-byd-atto3', name: 'Atto 3 / Yuan Plus', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-byd-dolphin', name: 'Dolphin', years: [2025, 2024, 2023], category: 'Hatchback' },
      { id: 'm-byd-seagull', name: 'Seagull', years: [2025, 2024], category: 'Hatchback' },
      { id: 'm-byd-u8', name: 'Yangwang U8 Off-Road Flagship', years: [2025, 2024], category: 'SUV' },
      { id: 'm-byd-denzad9', name: 'Denza D9 Executive MPV', years: [2025, 2024, 2023], category: 'Van' },
    ]
  },
  {
    id: 'b-geely',
    name: 'Geely',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-gee-monjaro', name: 'Monjaro (Xingyue L)', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-gee-coolray', name: 'Coolray (Binyue)', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-gee-tugella', name: 'Tugella (Xingyue)', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-gee-emgrand', name: 'Emgrand', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-gee-okavango', name: 'Okavango (Haoyue)', years: [2025, 2024, 2023], category: 'SUV' },
    ]
  },
  {
    id: 'b-changan',
    name: 'Changan',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-cha-cs95', name: 'CS95 Plus', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cha-cs75plus', name: 'CS75 Plus', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cha-cs55plus', name: 'CS55 Plus', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cha-unik', name: 'UNI-K', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-cha-unit', name: 'UNI-T', years: [2025, 2024, 2023, 2022], category: 'Crossover' },
      { id: 'm-cha-univ', name: 'UNI-V', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-cha-deepals7', name: 'Deepal S7 EV / EREV', years: [2025, 2024], category: 'SUV' },
    ]
  },
  {
    id: 'b-chery',
    name: 'Chery',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-che-tiggo8pro', name: 'Tiggo 8 Pro / Max', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-che-tiggo7pro', name: 'Tiggo 7 Pro', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-che-tiggo4pro', name: 'Tiggo 4 Pro', years: [2025, 2024, 2023], category: 'Crossover' },
      { id: 'm-che-arrizo8', name: 'Arrizo 8', years: [2025, 2024, 2023], category: 'Sedan' },
    ]
  },
  {
    id: 'b-gwm',
    name: 'GWM',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-gwm-poer', name: 'Poer Pickup', years: [2025, 2024, 2023, 2022], category: 'Truck' },
      { id: 'm-gwm-cannon', name: 'Cannon X', years: [2025, 2024, 2023], category: 'Truck' },
    ]
  },
  {
    id: 'b-haval',
    name: 'Haval',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-hav-h6', name: 'H6 (GT / HEV)', years: [2025, 2024, 2023, 2022, 2021], category: 'SUV' },
      { id: 'm-hav-jolion', name: 'Jolion / Jolion Pro', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-hav-dargo', name: 'Dargo (Big Dog)', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-hav-h9', name: 'H9 4WD', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-hav-raptor', name: 'Raptor Hi4', years: [2025, 2024], category: 'SUV' },
    ]
  },
  {
    id: 'b-tank',
    name: 'Tank',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-tnk-300', name: 'Tank 300 Off-Roader', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-tnk-500', name: 'Tank 500 Luxury 4WD', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-tnk-700', name: 'Tank 700 Hi4-T', years: [2025, 2024], category: 'SUV' },
    ]
  },
  {
    id: 'b-jetour',
    name: 'Jetour',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-jet-t2', name: 'Traveler T2 4WD', years: [2025, 2024], category: 'SUV' },
      { id: 'm-jet-dashing', name: 'Dashing', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-jet-x70plus', name: 'X70 Plus', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-jet-x90plus', name: 'X90 Plus', years: [2025, 2024, 2023], category: 'SUV' },
    ]
  },
  {
    id: 'b-jac',
    name: 'JAC',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-jac-js8', name: 'JS8 Pro', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-jac-js6', name: 'JS6', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-jac-t8', name: 'T8 Pro 4x4 Pickup', years: [2025, 2024, 2023, 2022], category: 'Truck' },
    ]
  },
  {
    id: 'b-mg',
    name: 'MG',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-mg-rx8', name: 'RX8 7-Seater 4WD', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-mg-hs', name: 'HS / HS Trophy', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-mg-gt', name: 'MG GT Sedan', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-mg-mg4', name: 'MG 4 EV', years: [2025, 2024, 2023], category: 'Hatchback' },
      { id: 'm-mg-cyberster', name: 'Cyberster Roadster', years: [2025, 2024], category: 'Coupe' },
    ]
  },
  {
    id: 'b-nio',
    name: 'NIO',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-nio-es8', name: 'ES8 Flagship 6-Seater SUV', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-nio-es6', name: 'ES6', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-nio-et7', name: 'ET7 Luxury Sedan', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-nio-et5', name: 'ET5 / ET5 Touring', years: [2025, 2024, 2023], category: 'Sedan' },
    ]
  },
  {
    id: 'b-xpeng',
    name: 'XPeng',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-xpe-g9', name: 'G9 Flagship EV SUV', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-xpe-g6', name: 'G6 Coupe SUV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-xpe-p7i', name: 'P7i Sports Sedan', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-xpe-x9', name: 'X9 Luxury MPV', years: [2025, 2024], category: 'Van' },
    ]
  },
  {
    id: 'b-li-auto',
    name: 'Li Auto',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-lia-l9', name: 'Li L9 Max 6-Seater SUV', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-lia-l8', name: 'Li L8', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-lia-l7', name: 'Li L7 5-Seater Flagship', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-lia-mega', name: 'Li MEGA Pure EV MPV', years: [2025, 2024], category: 'Van' },
    ]
  },
  {
    id: 'b-zeekr',
    name: 'Zeekr',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-zee-001', name: 'Zeekr 001 / FR', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-zee-009', name: 'Zeekr 009 Ultra-Luxury MPV', years: [2025, 2024, 2023], category: 'Van' },
      { id: 'm-zee-x', name: 'Zeekr X Urban SUV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-zee-007', name: 'Zeekr 007 Sedan', years: [2025, 2024], category: 'Sedan' },
    ]
  },
  {
    id: 'b-leapmotor',
    name: 'Leapmotor',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-lea-c11', name: 'C11 SUV', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-lea-c10', name: 'C10 Global SUV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-lea-c16', name: 'C16 6-Seater SUV', years: [2025, 2024], category: 'SUV' },
    ]
  },
  {
    id: 'b-baic',
    name: 'BAIC',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-bai-bj40', name: 'BJ40 Plus Off-Road', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-bai-bj60', name: 'BJ60', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-bai-bj80', name: 'BJ80 Luxury 4WD', years: [2025, 2024, 2023], category: 'SUV' },
    ]
  },
  {
    id: 'b-faw',
    name: 'FAW / Bestune',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-faw-t99', name: 'Bestune T99', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-faw-t77', name: 'Bestune T77 Pro', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-faw-b70', name: 'Bestune B70', years: [2025, 2024, 2023], category: 'Sedan' },
    ]
  },
  {
    id: 'b-dongfeng',
    name: 'Dongfeng',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-don-mhero', name: 'M-Hero 917 Military-Grade EV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-don-voyahfree', name: 'Voyah Free', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-don-shinemax', name: 'Aeolus Shine Max', years: [2025, 2024, 2023], category: 'Sedan' },
    ]
  },
  {
    id: 'b-gac',
    name: 'GAC',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-gac-gs8', name: 'GS8 Luxury SUV', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-gac-gs3', name: 'GS3 Emzoom', years: [2025, 2024, 2023], category: 'Crossover' },
      { id: 'm-gac-empow', name: 'Empow Sport Sedan', years: [2025, 2024, 2023], category: 'Sedan' },
      { id: 'm-gac-m8', name: 'M8 Master Series MPV', years: [2025, 2024, 2023], category: 'Van' },
    ]
  },
  {
    id: 'b-hongqi',
    name: 'Hongqi',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-hon-h9', name: 'H9 Executive Luxury Sedan', years: [2025, 2024, 2023, 2022], category: 'Sedan' },
      { id: 'm-hon-hs5', name: 'HS5', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-hon-ehs9', name: 'E-HS9 Electric Presidential SUV', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-hon-h5', name: 'H5', years: [2025, 2024, 2023], category: 'Sedan' },
    ]
  },
  {
    id: 'b-foton',
    name: 'Foton',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-fot-tunland', name: 'Tunland G7 / G9 4x4', years: [2025, 2024, 2023, 2022], category: 'Truck' },
      { id: 'm-fot-toano', name: 'Toano Executive Van', years: [2025, 2024, 2023], category: 'Van' },
    ]
  },
  {
    id: 'b-exeed',
    name: 'Exeed',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-exe-vx', name: 'VX Flagship 7-Seater', years: [2025, 2024, 2023], category: 'SUV' },
      { id: 'm-exe-rx', name: 'RX Coupe SUV', years: [2025, 2024], category: 'SUV' },
      { id: 'm-exe-txl', name: 'TXL', years: [2025, 2024, 2023], category: 'SUV' },
    ]
  },
  {
    id: 'b-omoda',
    name: 'Omoda',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-omo-c5', name: 'Omoda C5', years: [2025, 2024, 2023], category: 'Crossover' },
      { id: 'm-omo-e5', name: 'Omoda E5 EV', years: [2025, 2024], category: 'Crossover' },
    ]
  },
  {
    id: 'b-jaecoo',
    name: 'Jaecoo',
    country: 'China',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-jae-7', name: 'Jaecoo 7 AWD', years: [2025, 2024], category: 'SUV' },
      { id: 'm-jae-8', name: 'Jaecoo 8 Luxury Off-Road', years: [2025, 2024], category: 'SUV' },
    ]
  },

  // ==========================================
  // INDIA
  // ==========================================
  {
    id: 'b-tata',
    name: 'Tata',
    country: 'India',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-tat-harrier', name: 'Harrier', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-tat-safari', name: 'Safari', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-tat-nexon', name: 'Nexon / Nexon EV', years: [2025, 2024, 2023], category: 'SUV' },
    ]
  },
  {
    id: 'b-mahindra',
    name: 'Mahindra',
    country: 'India',
    region: 'Asia',
    enabled: true,
    models: [
      { id: 'm-mah-scorpio-n', name: 'Scorpio-N 4x4', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-mah-xuv700', name: 'XUV700', years: [2025, 2024, 2023, 2022], category: 'SUV' },
      { id: 'm-mah-thar', name: 'Thar 4x4', years: [2025, 2024, 2023, 2022], category: 'SUV' },
    ]
  }
];
