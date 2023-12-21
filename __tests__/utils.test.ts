import {
  VAT_RATE,
  cn,
  findCategoryIdByName,
  generateOrderNumber,
  getStartDateForFilter,
  handleStatusChange,
  validateEmail,
} from "@/helpers/utils";
import { Category } from "@/lib/DbSchema";
import { subDays, subMonths, subYears } from "date-fns";

describe("Utility Functions", () => {
  // Test pour la fonction cn
  describe("cn", () => {
    it("combines class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
      // Ajoutez d'autres cas de test selon le besoin
    });
  });

  // Test pour la constante VAT_RATE
  describe("VAT_RATE", () => {
    it("has the correct value", () => {
      expect(VAT_RATE).toBe(0.2);
    });
  });

  // Test pour la fonction validateEmail
  describe("validateEmail", () => {
    it("validates emails correctly", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
      // Ajoutez d'autres cas de test selon le besoin
    });
  });

  // Test pour la fonction generateOrderNumber
  describe("generateOrderNumber", () => {
    it("generates a valid order number", () => {
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toMatch(/^CMD[A-Za-z0-9]{12}$/);
    });
  });

  // Test pour la fonction handleStatusChange
  describe("handleStatusChange", () => {
    it("handles status changes correctly", () => {
      expect(handleStatusChange("waiting")).toBe("En attente");
      // Ajoutez d'autres cas de test selon le besoin
    });
  });

  // Test pour la fonction findCategoryIdByName
  describe("findCategoryIdByName", () => {
    it("finds category ID by name", () => {
      const categories: Category[] = ["bracelet_cuir", "bracelet_acier"]; // Remplacez ceci par des données de test appropriées
      expect(findCategoryIdByName("bracelet_cuir", categories)).toBe(
        "bracelet_cuir"
      );
    });
  });

  // Test pour la fonction calculateSubtotal
  //   describe('calculateSubtotal', () => {
  //     it('calculates subtotal correctly', () => {
  //       const order = {/* Mettez ici des données de test appropriées */};
  //       expect(calculateSubtotal(order)).toBe(/* Valeur attendue */);
  //     });
  //   });

  // Test pour la fonction getStartDateForFilter
  describe("getStartDateForFilter", () => {
    it("calculates start date for filters correctly", () => {
      const now = new Date();
      expect(getStartDateForFilter("day", now)).toEqual(subDays(now, 1));
      // Ajoutez d'autres cas de test selon le besoin
    });
  });
});
