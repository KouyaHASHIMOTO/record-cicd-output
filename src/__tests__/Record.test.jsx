import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Record } from "../Record";

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi
        .fn()
        .mockResolvedValueOnce({
          data: [],
          error: null,
        })
        .mockResolvedValueOnce({
          data: [],
          error: null,
        })
        .mockResolvedValueOnce({
          data: [{ id: 1, title: "テスト内容", time: 1 }],
          error: null,
        }),
    })),
  };
});

describe("Record", () => {
  test("アプリタイトルが表示されている", () => {
    render(<Record />);
    expect(
      screen.getByRole("heading", { name: "学習記録一覧" }),
    ).toBeInTheDocument();
  });
  test("勉強内容時間を登録できる", async () => {
    render(<Record />);
    const inputContent = screen.getByRole("textbox", { name: "学習内容" });
    const inputTime = screen.getByRole("spinbutton", { name: "学習時間" });
    const addButton = screen.getByRole("button", { name: "登録" });

    fireEvent.change(inputContent, { target: { value: "テスト内容" } });
    fireEvent.change(inputTime, { target: { value: 1 } });
    fireEvent.click(addButton);

    const list = await screen.findByRole("list");
    expect(within(list).getByText(/テスト内容/)).toBeInTheDocument();
  });
});
