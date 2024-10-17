import { render, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import TodoForm from '../src/app/components/TodoForm';

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('TodoForm', () => {
  test('renders the form correctly', () => {
    render(<TodoForm />);
    expect(screen.getByPlaceholderText('タスクを入力')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

test('adds a task to the list using real API', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: 1, task: 'テストタスク' }), { status: 200 });

    render(<TodoForm />);

    const input = screen.getByPlaceholderText('タスクを入力');
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'テストタスク' } });
    fireEvent.click(button);

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/tasks', expect.anything());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
