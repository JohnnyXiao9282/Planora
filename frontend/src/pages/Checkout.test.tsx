import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout";
import { CartProvider } from "../context/CartContext";

const items = [
  { template_id: "t1", name: "Alpha_Resume", description: "A", price: 10 },
  { template_id: "t2", name: "Beta_Resume", description: "B", price: 20 },
  { template_id: "t3", name: "Gamma_Resume", description: "C", price: 30 },
];

beforeEach(() => {
  localStorage.setItem("checkoutIds", JSON.stringify(["t1", "t2"]));
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(items) })
  ) as unknown as typeof fetch;
});

test("minus removes only that item from the order", async () => {
  render(
    <CartProvider>
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

  await screen.findByText("Alpha Resume");
  expect(screen.getByText("Beta Resume")).toBeInTheDocument();
  expect(screen.queryByText("Gamma Resume")).not.toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("Remove Alpha Resume from this order"));

  await waitFor(() =>
    expect(screen.queryByText("Alpha Resume")).not.toBeInTheDocument()
  );
  expect(screen.getByText("Beta Resume")).toBeInTheDocument();
  expect(
    screen.getAllByText((_, el) => el?.textContent === "$20.00").length
  ).toBeGreaterThan(0);
});
