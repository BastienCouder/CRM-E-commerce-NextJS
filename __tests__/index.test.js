import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation"; // Assurez-vous que c'est 'next/navigation'

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

describe("Home", () => {
  it("renders a heading", () => {
    useRouter.mockImplementation(() => ({
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
    }));

    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /Titre du site web/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
