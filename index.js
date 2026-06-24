import { Drug, Pharmacy } from "./pharmacy";

import fs from "fs";

const drugs = [
  new Drug("Doliprane", 20, 30, {
    benefitRate: -1,
    expiredRate: -2,
  }),

  new Drug("Herbal Tea", 10, 5, {
    benefitRate: +1,
    expiredRate: +1,
  }),

  new Drug("Fervex", 12, 35, {
    benefitRate: +1,
    thresholds: [
      { expiresIn: 10, rate: +1 },
      { expiresIn: 5, rate: +1 },
    ],
    expiredValue: 0,
  }),

  new Drug("Magic Pill", 15, 40, {
    benefitRate: 0,
    frozen: true,
  }),

  new Drug("Dafalgan", 10, 20, {
    benefitRate: -2,
    expiredRate: -4,
  }),
];

const pharmacy = new Pharmacy(drugs);

const log = [];

for (let elapsedDays = 0; elapsedDays < 30; elapsedDays++) {
  log.push(JSON.parse(JSON.stringify(pharmacy.updateBenefitValueWithThresholds().map((drug) => ({ name: drug.name, benefit: drug.benefit, expiresIn: drug.expiresIn })))));
}

/* eslint-disable no-console */
fs.writeFile("output2.json", JSON.stringify({ result: log }, null, 2).concat("\n"), (err) => {
  if (err) {
    console.log("error");
  } else {
    console.log("success");
  }
});

/* eslint-enable no-console */
