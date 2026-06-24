import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy", () => {
  describe("Normal drugs", () => {
    it("should decrease benefit and expiresIn", () => {
      expect(new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValueWithThresholds()).toEqual([new Drug("test", 1, 2)]);
    });

    it("should decrease benefit twice as fast after expiration", () => {
      expect(new Pharmacy([new Drug("test", 0, 10)]).updateBenefitValueWithThresholds()).toEqual([new Drug("test", -1, 7)]);
    });

    it("should never have negative benefit", () => {
      expect(new Pharmacy([new Drug("test", 0, 1)]).updateBenefitValueWithThresholds()).toEqual([new Drug("test", -1, 0)]);
    });
  });

  describe("Herbal Tea", () => {
    const config = {
      benefitRate: 1,
      expiredRate: 1,
    };

    it("should increase benefit before expiration", () => {
      expect(new Pharmacy([new Drug("Herbal Tea", 2, 10, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Herbal Tea", 1, 11, config)]);
    });

    it("should increase benefit twice as fast after expiration", () => {
      expect(new Pharmacy([new Drug("Herbal Tea", 0, 10, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Herbal Tea", -1, 12, config)]);
    });

    it("should never exceed 50", () => {
      expect(new Pharmacy([new Drug("Herbal Tea", 2, 50, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Herbal Tea", 1, 50, config)]);
    });
  });

  describe("Magic Pill", () => {
    const config = {
      frozen: true,
    };

    it("should never change", () => {
      expect(new Pharmacy([new Drug("Magic Pill", 0, 80, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Magic Pill", 0, 80, config)]);
    });
  });

  describe("Fervex", () => {
    const config = {
      benefitRate: 1,
      thresholds: [
        { expiresIn: 10, rate: 1 },
        { expiresIn: 5, rate: 1 },
      ],
      expiredValue: 0,
    };

    it("should increase by 1 when expiresIn > 10", () => {
      expect(new Pharmacy([new Drug("Fervex", 15, 20, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Fervex", 14, 21, config)]);
    });

    it("should increase by 2 when expiresIn <= 10", () => {
      expect(new Pharmacy([new Drug("Fervex", 10, 20, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Fervex", 9, 22, config)]);
    });

    it("should increase by 3 when expiresIn <= 5", () => {
      expect(new Pharmacy([new Drug("Fervex", 5, 20, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Fervex", 4, 23, config)]);
    });

    it("should drop to 0 after expiration", () => {
      expect(new Pharmacy([new Drug("Fervex", 0, 20, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Fervex", -1, 0, config)]);
    });
  });

  describe("Dafalgan", () => {
    const config = {
      benefitRate: -2,
      expiredRate: -4,
    };

    it("should degrade twice as fast as normal drugs", () => {
      expect(new Pharmacy([new Drug("Dafalgan", 10, 20, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Dafalgan", 9, 18, config)]);
    });

    it("should degrade four times after expiration", () => {
      expect(new Pharmacy([new Drug("Dafalgan", 0, 20, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Dafalgan", -1, 14, config)]);
    });

    it("should never have negative benefit", () => {
      expect(new Pharmacy([new Drug("Dafalgan", 0, 3, config)]).updateBenefitValueWithThresholds()).toEqual([new Drug("Dafalgan", -1, 0, config)]);
    });
  });
});
