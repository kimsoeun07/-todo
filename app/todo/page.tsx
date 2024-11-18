"use client";
// 그냥 브라우저에서만 실행시킬때 오류 안나도록
import { CirclePlus, Download, GripVertical, Trash2, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Todo {
  title: string;
  isCompleted: boolean;
  timestamp: number;
  //ddd
  // subtask : Todo; 인터페이스 안에 인터페이스를 넣을 수 있다!
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");

    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {}, [todos]);

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().length !== 0) {
      const newTodos = [
        ...todos,
        { title: input, isCompleted: false, timestamp: new Date().getTime() },
      ];
      setTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos));
      setInput("");
    }
  }

  function deleteTask(timestamp: number) {
    setTodos(todos.filter((t) => t.timestamp != timestamp));
  }

  function ToggleTask(timestemp: number) {
    const newTodos = todos.map((t) =>
        t.timestamp === timestemp ? { ...t, isCompleted: !t.isCompleted } : t
      )
      setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }

  function handleDragStart(e: React.DragEvent<HTMLLIElement>, todo: Todo) {
    setDraggedTodo(todo);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", todo.timestamp.toString());
    e.currentTarget.classList.add("opacity-50");
  }

  function handleDragEnd(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();

    e.currentTarget.classList.remove("opacity-50");
    setDraggedOverIndex(null);
  }

  function handleDragOver(e: React.DragEvent<HTMLLIElement>, index: number) {
    e.preventDefault();
    setDraggedOverIndex(index);
  }

  function handleDragDrop(
    e: React.DragEvent<HTMLLIElement>,
    targetIndex: number
  ) {
    e.preventDefault();

    if (draggedTodo) {
      const newTodos = todos.filter(
        (it) => it.timestamp != draggedTodo.timestamp
      );
      newTodos.splice(targetIndex, 0, draggedTodo);
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  }

  function downloadTasks(){
    const taskString = JSON.stringify(todos,null, 2);
    const downloadUrl = 'data:application/json;charset=utf-8,'+encodeURIComponent(taskString);

    const aElement = document.createElement('a');
    aElement.setAttribute('href', downloadUrl);
    aElement.setAttribute('download', 'todo-list.json');

    aElement.click();
  }

  function importTasks(e:React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];

    if(file){
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedTasks = JSON.parse(e.target?.result as string);
        setTodos(importedTasks);
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center w-[400px] mx-auto shadow-lg border rounded-lg p-5 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">TODO List</h1>
        <form className="flex gap-1 flex-grow self-stretch" onSubmit={addTask}>
          {/* form을 쓰면 엔터키를 누르거나, 내가 지정한 다른 버튼을 눌렀을 때 둘 다 기능 실행 가능 */}
          <input
            type="text"
            placeholder="태스크를 입력하세요..."
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg flex-grow self-stretch"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={input}
          ></input>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 "
          >
            <CirclePlus />
          </button>
          {/* submit : 엔터키 눌렀을 때도 같은 역할 수행 */}
        </form>
        <ul className="space-y-2 w-full">
          {todos.map((t, i) => (
            <li
              key={t.timestamp}
              className="flex items-center bg-gray-100 rounded-lg p-2"
              draggable
              data-index={i}
              onDragStart={(e) => handleDragStart(e, t)}
              onDragEnd={(e) => handleDragEnd(e)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDragDrop(e, i)}
            >
              <div className="mr-2">
                <GripVertical className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="checkbox"
                className="mr-2 form-checkbox w-5 h-5 text-blue-500"
                onChange={() => ToggleTask(t.timestamp)}
                checked={t.isCompleted}
              ></input>
              <span
                className={`flex-grow ${
                  t.isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                {t.title}
              </span>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => deleteTask(t.timestamp)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-2 w-full">
          <button onClick={downloadTasks} className="flex px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            <Download className="w-5 h-5 mr-2"/>
            다운로드
          </button>

          <label className="flex px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <Upload className="w-5 h-5 mr-2"/>
            업로드
            <input onChange={importTasks} type="file" className="hidden" accept=".json"></input>
          </label>
        </div>

      </div>
    </div>
  );
}
