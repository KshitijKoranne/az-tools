"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Check, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error("Failed to parse saved todos", e);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Todo List</h1>
            <p className="text-muted-foreground">
              Create and manage your tasks with this simple todo list.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                className="mr-2"
              />
              <Button onClick={addTodo}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="h-8 px-3"
                >
                  All
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("active")}
                  className="h-8 px-3"
                >
                  Active
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                  className="h-8 px-3"
                >
                  Completed
                </Button>
              </div>
              {completedTodosCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompleted}
                  className="h-8 text-xs"
                >
                  Clear completed
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === "all"
                    ? "Add your first task above!"
                    : filter === "active"
                      ? "No active tasks"
                      : "No completed tasks"}
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-md ${todo.completed ? "bg-muted/30" : "bg-muted/10"}`}
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${todo.completed ? "bg-primary border-primary" : "border-muted-foreground"}`}
                      >
                        {todo.completed && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </button>
                      <span
                        className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {activeTodosCount === 0
                ? "All tasks completed!"
                : `${activeTodosCount} task${activeTodosCount !== 1 ? "s" : ""} remaining`}
            </div>
          </div>

          <div className="border rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Type a task in the input field and press Enter or click the add
                button.
              </li>
              <li>Click the circle next to a task to mark it as completed.</li>
              <li>Click the trash icon to delete a task.</li>
              <li>Use the filters to view all, active, or completed tasks.</li>
              <li>Click "Clear completed" to remove all completed tasks.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Your tasks are saved locally in your
                browser, so they'll still be here when you come back later.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
