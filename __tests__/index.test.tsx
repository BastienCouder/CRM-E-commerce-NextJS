import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/(pages)/page"; // Assurez-vous que le chemin est correct

// Mock useRouter
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

describe("Home Page", () => {
  it("should display the heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /Titre du site web/i,
    });

    expect(heading).toBeInTheDocument();
  });

  // Ajoutez d'autres tests ici si nécessaire
});
