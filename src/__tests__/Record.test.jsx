import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Record } from "../Record";
import { createClient } from "@supabase/supabase-js";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

describe("Record", () => {
  test("アプリタイトルが表示されている", () => {
    createClient.mockReturnValue({
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    render(<Record />);
    expect(
      screen.getByRole("heading", { name: "学習記録一覧" }),
    ).toBeInTheDocument();
  });
  test("学習内容を登録できてリストに表示されている", async () => {
    createClient.mockReturnValue({
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi
        .fn()
        .mockResolvedValueOnce({
          data: [],
          error: null,
        })
        .mockResolvedValueOnce({
          data: [{ title: "学習内容", time: 1 }],
          error: null,
        }),
    });
    render(<Record />);
    const inputContent = screen.getByRole("textbox", { name: "学習内容" });
    const inputTime = screen.getByRole("spinbutton", { name: "学習時間" });
    const addButton = screen.getByRole("button", { name: "登録" });

    fireEvent.change(inputContent, { target: { value: "学習内容" } });
    fireEvent.change(inputTime, { target: { value: 1 } });
    fireEvent.click(addButton);

    const list = await screen.findByRole("list");
    expect(within(list).getByText("学習内容：1時間")).toBeInTheDocument();
  });

  test("登録した学習内容を消すことができる", async () => {
    createClient.mockReturnValue({
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi
        .fn()
        .mockResolvedValueOnce({
          data: [],
          error: null,
        })
        .mockResolvedValueOnce({
          data: [{ id: 1, title: "学習内容", time: 1 }],
          error: null,
        }),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue([]),
    });
    render(<Record />);
    const inputContent = screen.getByRole("textbox", { name: "学習内容" });
    const inputTime = screen.getByRole("spinbutton", { name: "学習時間" });
    const addButton = screen.getByRole("button", { name: "登録" });

    fireEvent.change(inputContent, { target: { value: "学習内容" } });
    fireEvent.change(inputTime, { target: { value: 1 } });
    fireEvent.click(addButton);
    const removeButton = await screen.findByRole("button", { name: "削除" });

    fireEvent.click(removeButton);

    expect(await screen.findByText("データがありません")).toBeInTheDocument();
  });
});
