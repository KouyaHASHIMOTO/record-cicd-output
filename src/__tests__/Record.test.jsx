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
  /*  test("学習記録を登録できる", async () => {
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
  test("削除ボタンを押すと学習記録が削除される", () => {
    render(<Record />);
  }); */
});
