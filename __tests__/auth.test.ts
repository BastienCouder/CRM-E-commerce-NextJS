import {
  checkEmail,
  checkIfEmailExists,
  checkPassword,
} from "@/helpers/authHelper";
import { compare } from "bcryptjs";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

// Mock direct de la méthode findUnique
const mockedFindUnique = jest.fn();

jest.mock("@prisma/client/edge", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: mockedFindUnique,
    },
  })),
}));

describe("User Authentication Functions", () => {
  // Test pour checkIfEmailExists
  describe("checkIfEmailExists", () => {
    it("returns true if email exists", async () => {
      const email = "exists@example.com";
      mockedFindUnique.mockResolvedValueOnce({ id: "someUserId", email });
      const exists = await checkIfEmailExists(email);

      console.log(`checkIfEmailExists: ${email} exists? ${exists}`);
      expect(exists).toBe(true);
    });

    it("returns false if email does not exist", async () => {
      const email = "nonexistent@example.com";
      mockedFindUnique.mockResolvedValueOnce(null);
      const exists = await checkIfEmailExists(email);

      console.log(`checkIfEmailExists: ${email} exists? ${exists}`);
      expect(exists).toBe(false);
    });
  });

  // Test pour checkEmail
  describe("checkEmail", () => {
    it("returns user object if email exists and has hashed password", async () => {
      const email = "exists@example.com";
      const user = { email, hashedPassword: "hashed" };
      mockedFindUnique.mockResolvedValueOnce(user);
      const result = await checkEmail(email);

      console.log(`checkEmail: Found user for ${email}:`, result);
      expect(result).toEqual(user);
    });

    it("returns null if user does not exist or has no hashed password", async () => {
      const email = "nonexistent@example.com";
      mockedFindUnique.mockResolvedValueOnce(null);
      const result = await checkEmail(email);

      console.log(
        `checkEmail: User for ${email} not found or no hashed password.`
      );
      expect(result).toBeNull();
    });
  });

  // Test pour checkPassword
  describe("checkPassword", () => {
    it("returns true for correct password", async () => {
      const email = "user@example.com";
      const user = { email, hashedPassword: "hashedPassword" };
      mockedFindUnique.mockResolvedValueOnce(user);
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const isCorrectPassword = await checkPassword(email, "correctPassword");

      console.log(
        `checkPassword: Correct password for ${email}? ${isCorrectPassword}`
      );
      expect(isCorrectPassword).toBe(true);
    });

    it("returns false for incorrect password", async () => {
      const email = "user@example.com";
      const user = { email, hashedPassword: "hashedPassword" };
      mockedFindUnique.mockResolvedValueOnce(user);
      (compare as jest.Mock).mockResolvedValueOnce(false);

      const isCorrectPassword = await checkPassword(email, "incorrectPassword");

      console.log(
        `checkPassword: Correct password for ${email}? ${isCorrectPassword}`
      );
      expect(isCorrectPassword).toBe(false);
    });
  });
});
