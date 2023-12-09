import { getCart, createCart } from "../src/lib/db/cart";
import { prisma } from "../src/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mocks
jest.mock("../src/lib/db/prisma");
jest.mock("next-auth");

// Test pour getCart
describe("getCart", () => {
  it("returns null when session is null and localCartId is null", async () => {
    getServerSession.mockResolvedValueOnce(null);
    cookies.mockReturnValueOnce({ get: () => ({ value: null }) });

    const result = await getCart();

    expect(result).toBeNull();
  });

  it("returns cart when session is null and localCartId is not null", async () => {
    const mockLocalCartId = "mockLocalCartId";
    const mockCart = {
      id: "mockCartId",
      cartItems: [],
    };

    getServerSession.mockResolvedValueOnce(null);
    cookies.mockReturnValueOnce({ get: () => ({ value: mockLocalCartId }) });
    prisma.cart.findUnique.mockResolvedValueOnce(mockCart);

    const result = await getCart();

    expect(result).toEqual({
      ...mockCart,
      size: 0,
      subtotal: 0,
    });
  });

  it("returns cart when session is not null", async () => {
    const mockUser = { id: "mockUserId" };
    const mockCart = {
      id: "mockCartId",
      cartItems: [],
    };

    getServerSession.mockResolvedValueOnce({ user: mockUser });
    prisma.cart.findFirst.mockResolvedValueOnce(mockCart);

    const result = await getCart();

    expect(result).toEqual({
      ...mockCart,
      size: 0,
      subtotal: 0,
    });
  });
});

// Test pour createCart
describe("createCart", () => {
  it("creates and returns a new cart with user session", async () => {
    const mockUser = { id: "mockUserId" };
    const mockNewCart = {
      id: "mockNewCartId",
      cartItems: [],
    };

    getServerSession.mockResolvedValueOnce({ user: mockUser });
    prisma.cart.create.mockResolvedValueOnce(mockNewCart);

    const result = await createCart();

    expect(result).toEqual({
      ...mockNewCart,
      size: 0,
      subtotal: 0,
    });
  });

  it("creates and returns a new cart without user session", async () => {
    const mockNewCart = {
      id: "mockNewCartId",
      cartItems: [],
    };

    getServerSession.mockResolvedValueOnce(null);
    prisma.cart.create.mockResolvedValueOnce(mockNewCart);

    const result = await createCart();

    expect(result).toEqual({
      ...mockNewCart,
      size: 0,
      subtotal: 0,
    });
  });
});
