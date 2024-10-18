// TodoList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import TodoList from "../src/app/components/TodoList";

// Mock the fetch call
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: "1", task: "Test Task 1" }]),
  })
) as jest.Mock;

describe("TodoList", () => {
  it("should display tasks fetched from the API", async () => {
    render(<TodoList />);
    
    // Wait for the tasks to load
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });
  });

  it("should display 'No tasks available' if no tasks are fetched", async () => {
    // Mock an empty response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
    
    render(<TodoList />);
    
    // Wait for the 'No tasks available' message to appear
    await waitFor(() => {
      expect(screen.getByText("No tasks available")).toBeInTheDocument();
    });
  });

  it("should handle fetch errors gracefully", async () => {
    // console.error をモックする
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // エラーを発生させるモック
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.reject("API is down")
    );

    render(<TodoList />);

    // エラーメッセージがコンソールに出力されたかを確認
    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", "API is down");
    });

    // タスクがない場合の表示を確認
    expect(screen.getByText("No tasks available")).toBeInTheDocument();

    // テストが終わったらモックを解除
    consoleErrorSpy.mockRestore();
    });
});
