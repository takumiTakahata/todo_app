import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoDelete from "../src/app/components/TodoDelete";

// Mock the fetch API
global.fetch = jest.fn();

describe("TodoDelete Component", () => {
  const mockOnDeleteSuccess = jest.fn();
  const taskId = "1"; // テスト用のtaskId
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mockの初期化
    (fetch as jest.Mock).mockClear();
    mockOnDeleteSuccess.mockClear();

    // console.errorのモック
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // console.errorのモックをリセット
    consoleErrorSpy.mockRestore();
  });

  test("renders delete button", () => {
    render(<TodoDelete taskId={taskId} onDeleteSuccess={mockOnDeleteSuccess} />);

    // 削除ボタンがレンダリングされるかを確認
    const deleteButton = screen.getByText("削除");
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls the API to delete task when delete button is clicked", async () => {
    // Mock fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<TodoDelete taskId={taskId} onDeleteSuccess={mockOnDeleteSuccess} />);

    // 削除ボタンを取得してクリックする
    const deleteButton = screen.getByText("削除");
    fireEvent.click(deleteButton);

    // fetchが正しいエンドポイントで呼ばれたことを確認
    expect(fetch).toHaveBeenCalledWith(`http://localhost:3001/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // API呼び出し後、onDeleteSuccessが呼ばれたことを確認
    await waitFor(() => expect(mockOnDeleteSuccess).toHaveBeenCalledWith(taskId));
  });

  test("displays 'Deleting...' while the task is being deleted", async () => {
    // Mock fetch response with a delay
    (fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 1000))
    );

    render(<TodoDelete taskId={taskId} onDeleteSuccess={mockOnDeleteSuccess} />);

    const deleteButton = screen.getByText("削除");
    fireEvent.click(deleteButton);
  });

  test("does not call onDeleteSuccess if API request fails", async () => {
    // Mock fetch response with an error
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<TodoDelete taskId={taskId} onDeleteSuccess={mockOnDeleteSuccess} />);

    const deleteButton = screen.getByText("削除");
    fireEvent.click(deleteButton);

    // APIが失敗した場合、onDeleteSuccessは呼ばれないことを確認
    await waitFor(() => expect(mockOnDeleteSuccess).not.toHaveBeenCalled());

    // APIが失敗したときにconsole.errorが呼ばれたか確認
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to delete the task.");
  });

  test("logs error if fetch throws an exception", async () => {
    // Mock fetch to throw an error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Fetch failed"));

    render(<TodoDelete taskId={taskId} onDeleteSuccess={mockOnDeleteSuccess} />);

    const deleteButton = screen.getByText("削除");
    fireEvent.click(deleteButton);

    // エラーが発生したときにconsole.errorが呼ばれたことを確認
    await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", expect.any(Error)));

    // onDeleteSuccessが呼ばれないことを確認
    expect(mockOnDeleteSuccess).not.toHaveBeenCalled();
  });
});
