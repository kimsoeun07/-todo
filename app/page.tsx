"use client";

import { useEffect, useState } from "react";

function formatTime(input: string): string {
  const inputNumber = parseInt(input);
  const minutes = Math.floor(inputNumber / 60);
  const seconds = inputNumber % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function CountdownPage() {
  const [time, setTime] = useState(300);
  const [isActive, setActive] = useState(false);
  const [inputTime, setInputTime] = useState("300");

  useEffect(() => {
    let interval: NodeJS.Timeout | null; // null이 될 수도 있다

    /* setinterval시에 변수에다 저장해서 중복 실행이 없도록 해야함! */

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else if (time === 0) {
    }

    return () => {
      //useEffect가 끝났을 때 반환되는 값
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time]);
  //[isActive, time] : isActive나 time이 바뀌었을 때 실행(or).
  //그리고 취소가 아니라 동시에 실행되어서 시간이 계속 왔다갔다 하는 것임.

  return (
    <div className="w-full h-screen flex items-center ">
      <div className="flex flex-col items-center w-[400px] mx-auto shadow-lg border rounded-lg p-5 gap-2">
        <h2 className="text-base font-bold">카운트 다운 타이머</h2>
        <h1 className="text-4xl font-bold">{formatTime(time.toString())}</h1>
        <div className="flex gap-2 justify-center">
          <input
            className="border px-4 py-2 border-gray-300 rounded-lg"
            type="number"
            placeholder="초를 입력하세요"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
          ></input>
          <button
            className="bg-blue-500 text-white px-4 border rounded-lg border border-blue-600 hover:shadow-md transition-all hover:bg-blue-600"
            onClick={(e) => setTime(parseInt(inputTime))}
          >
            설정
          </button>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            className={`flex gap-2 justify-center text-white px-4 border rounded-lg border hover:shadow-md transition-all
              ${
                isActive
                  ? "bg-red-500 hover:bg-red-600 border-red-600"
                  : "bg-green-500 hover:bg-green-600 border-green-600"
              }`}
            onClick={(e) => setActive(!isActive)}
          >
            {isActive ? "정지" : "시작"}
          </button>
          <button
            className="flex gap-2 justify-center bg-gray-500 text-white px-4 border rounded-lg border border-gray-600 hover:shadow-md transition-all hover:bg-gray-600"
            onClick={(e) => {
              setActive(false), setTime(parseInt(inputTime));
            }}
          >
            리셋
          </button>
        </div>
      </div>
    </div>
  );
}
