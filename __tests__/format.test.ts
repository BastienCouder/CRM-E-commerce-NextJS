// yourModule.test.ts

import formatPrice, {
  formatDate,
  formatDateMonth,
  formatDescription,
} from "../format";

describe("Utility Functions", () => {
  // Test for formatPrice
  //   describe("formatPrice", () => {
  //     it("formats price in EUR correctly", () => {
  //       expect(formatPrice(12345, "EUR")).toBe("123,45 €");
  //     });

  //     it("formats price in USD correctly", () => {
  //       expect(formatPrice(12345, "USD")).toBe("$123.45");
  //     });

  //   });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2023-01-01T12:30:00");
      // Example output, adjust according to your locale settings
      expect(formatDate(date)).toBe("1 janvier 2023 à 12:30");
    });
  });

  // Test for formatDateMonth
  describe("formatDateMonth", () => {
    it("formats month in short format correctly", () => {
      expect(formatDateMonth("2023-01-01")).toBe("janv.");
    });

    it("formats month in long format correctly", () => {
      expect(formatDateMonth("2023-01-01", "long")).toBe("janvier");
    });
  });

  // Test for formatDescription
  describe("formatDescription", () => {
    it("does not truncate short descriptions", () => {
      const shortDescription = "This is a short description.";
      expect(formatDescription(shortDescription)).toBe(shortDescription);
    });

    it("truncates long descriptions", () => {
      const longDescription = new Array(25).fill("word").join(" ");
      const expected = new Array(20).fill("word").join(" ") + "...";
      expect(formatDescription(longDescription)).toBe(expected);
    });
  });
});
