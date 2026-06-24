export class Drug {
  constructor(name, expiresIn, benefit, config = {}) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;

    this.config = {
      benefitRate: -1,
      thresholds: [],
      expiredValue: undefined,
      expiredRate: -2,
      frozen: false,
      ...config,
    };
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  // Optimized implementation by business rules
  updateBenefitValueWithThresholds() {
    for (const drug of this.drugs) {
      if (drug.config.frozen) continue;

      let beneficeDif = drug.config.benefitRate;
      for (const threshold of drug.config.thresholds) {
        if (drug.expiresIn <= threshold.expiresIn) {
          beneficeDif += threshold.rate;
        }
      }

      drug.benefit = this.clamp(drug.benefit + beneficeDif);
      drug.expiresIn = drug.expiresIn - 1;

      if (drug.expiresIn < 0) {
        drug.benefit = drug.config.expiredValue ?? this.clamp(drug.benefit + drug.config.expiredRate);
      }
    }

    return this.drugs;
  }

  // Optimized legacy implementation for backward compatibility
  legacyUpdateBenefitValue() {
    for (const drug of this.drugs) {
      if (drug.name === "Magic Pill") {
        continue;
      }

      if (drug.name === "Herbal Tea") {
        this.increase(drug);
      } else if (drug.name === "Fervex") {
        this.increase(drug);

        if (drug.expiresIn < 11) this.increase(drug);
        if (drug.expiresIn < 6) this.increase(drug);
      } else if (drug.name === "Dafalgan") {
        this.decrease(drug);
        this.decrease(drug);
      } else {
        this.decrease(drug);
      }

      drug.expiresIn = drug.expiresIn - 1;

      if (drug.expiresIn < 0) {
        if (drug.name === "Herbal Tea") {
          this.increase(drug);
        } else if (drug.name === "Fervex") {
          drug.benefit = 0;
        } else if (drug.name === "Dafalgan") {
          this.decrease(drug);
          this.decrease(drug);
        } else {
          this.decrease(drug);
        }
      }
    }

    return this.drugs;
  }

  increase(drug) {
    drug.benefit = this.clamp(drug.benefit + 1);
  }

  decrease(drug) {
    drug.benefit = this.clamp(drug.benefit - 1);
  }

  clamp(value, min = 0, max = 50) {
    return Math.max(min, Math.min(max, value));
  }
}
