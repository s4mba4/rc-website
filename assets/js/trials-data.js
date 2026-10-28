/* ==========================================================================
   Published trials — feeds the "Results explorer" on our-results.html.
   To add a trial, copy one object below and fill it in. No other change needed.
   type:   "row" | "tree" | "garden"          (row crops / tree crops / market gardening)
   regime: "irrigated" | "rainfed"
   Only add a trial once its report is validated and the grower has agreed to publication.
   ========================================================================== */
window.RC_TRIALS = [
  {
    title: "Cotton in Hatay, Türkiye (2025)",
    crop: "Cotton",
    country: "Türkiye",
    region: "Hatay",
    type: "row",
    typeLabel: "Row crops",
    regime: "irrigated",
    regimeLabel: "Irrigated",
    summary: "Yield almost doubled in one of Türkiye's driest regions: 4.88 t/ha treated against 2.53 t/ha in the untreated control area, +93%.*",
    details: [
      ["Season", "2025"],
      ["Soil and climate", "Clay soils, extreme summer heat, damaged irrigation infrastructure"],
      ["Protocol", "Hydro-retainer applied under the cotton rows with the RCSeeder®, next to an untreated control area managed in the same way"],
      ["Results", "4.88 t/ha vs 2.53 t/ha (+93%); net gain about 1,180 US dollars per hectare; investment recovered within the first season"],
      ["Source", "RainCatcher use case published by the Solar Impulse Foundation"]
    ],
    link: "our-results.html#hatay"
  },
  {
    title: "Date palms in Dubai, United Arab Emirates",
    crop: "Date palm",
    country: "United Arab Emirates",
    region: "Dubai",
    type: "tree",
    typeLabel: "Tree crops",
    regime: "irrigated",
    regimeLabel: "Irrigated",
    summary: "Hyper-arid conditions, summer temperatures above 45 °C: water savings of up to 87% reported, with yield gains of at least 30%.*",
    details: [
      ["Soil and climate", "Hyper-arid Gulf conditions; irrigation from deep wells or desalinated water"],
      ["Protocol", "Hydro-retainer injected around the root systems of the palms, at the depth where the active roots draw water"],
      ["Results", "Up to 87% less irrigation water; yield gains of at least 30%"]
    ],
    link: "our-results.html#dubai"
  }
];
