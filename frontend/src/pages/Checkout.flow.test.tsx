import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { StrictMode } from "react";
import App from "../App";

const items = [
  { template_id: "t1", name: "Alpha_Resume", description: "A", price: 10 },
  { template_id: "t2", name: "Beta_Resume", description: "B", price: 20 },
  { template_id: "t3", name: "Gamma_Resume", description: "C", price: 30 },
];

beforeEach(() => {
  window.history.replaceState(null, "", "/cart");
  localStorage.setItem("chatPanelOpen", "false");
  localStorage.removeItem("checkoutIds");
  global.fetch = jest.fn((url: string) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(String(url).endsWith("/cart") ? items : []),
    })
  ) as unknown as typeof fetch;
});

const orderList = () =>
  screen.getByRole("heading", { name: "Order Summary" }).parentElement!;

test("cart -> checkout with two items, minus removes only one", async () => {
  render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Select Alpha and Beta in the cart, then check out
  await screen.findByText("Alpha Resume");
  const selectButtons = screen.getAllByRole("button", { name: "Select" });
  fireEvent.click(selectButtons[0]);
  fireEvent.click(selectButtons[1]);
  fireEvent.click(screen.getByRole("button", { name: /checkout now/i }));

  await screen.findByRole("heading", { name: "Order Summary" });
  expect(within(orderList()).getByText("Alpha Resume")).toBeInTheDocument();
  expect(within(orderList()).getByText("Beta Resume")).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("Remove Alpha Resume from this order"));

  await waitFor(() =>
    expect(
      within(orderList()).queryByText("Alpha Resume")
    ).not.toBeInTheDocument()
  );
  expect(within(orderList()).getByText("Beta Resume")).toBeInTheDocument();

  // Alpha is back in the cart; Beta is not (it is still in checkout)
  fireEvent.click(screen.getAllByRole("link", { name: "Cart" })[0]);
  await screen.findByText("Alpha Resume");
  expect(screen.queryByText("Beta Resume")).not.toBeInTheDocument();
  expect(screen.getByText("Gamma Resume")).toBeInTheDocument();

  // Returning via the nav link still shows Beta in checkout
  fireEvent.click(screen.getAllByRole("link", { name: "Checkout" })[0]);
  await screen.findByRole("heading", { name: "Order Summary" });
  expect(within(orderList()).getByText("Beta Resume")).toBeInTheDocument();
  expect(
    within(orderList()).queryByText("Alpha Resume")
  ).not.toBeInTheDocument();
});
