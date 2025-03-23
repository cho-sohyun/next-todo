/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useState } from "react";

import { Todo } from "@/types";

const TodosTable = ({ todos }: { todos: Todo[] }) => {
  // 할일 추가 가능 여부 state
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  // 입력된 할일 state
  const [newTodoInput, setNewTodoInput] = useState("");

  // 로컬 상태로 할일 목록 관리
  const [optimisticTodos, setOptimisticTodos] = useState<Todo[]>(todos);

  const addATodoHandler = async () => {
    if (newTodoInput.trim().length === 0) {
      console.log("글자를 입력하시오");

      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(), // 임시 ID
      title: newTodoInput,
      is_done: false, // Todo 타입과 일치하도록 변경
      created_at: new Date(), // Todo 타입과 일치하도록 변경
    };

    // 로컬 상태에서 바로 할일 추가 (비동기 요청 전에 바로 반영)
    setOptimisticTodos((prevTodos) => [...prevTodos, newTodo]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/todos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTodoInput,
          }),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("할일 추가 실패");
      }
      console.log(`할일 추가 완료 : ${newTodoInput}`);
      setNewTodoInput("");
    } catch (error) {
      console.error("오류");
    }
  };

  const DisabledTodoAddTooltip = () => {
    return (
      <Popover placement="top" showArrow={true}>
        <PopoverTrigger>
          <Button className="h-14" color="default">
            추가
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">🙋🏻‍♀️</div>
            <div className="text-tiny">할일을 입력해주세요!</div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          label="새로운 할일"
          type="text"
          value={newTodoInput}
          onChange={(e) => {
            const inputValue = e.target.value;

            setNewTodoInput(inputValue);
            setTodoAddEnable(inputValue.trim().length > 0); // 입력값에 따라 버튼 활성화
          }}
        />
        {todoAddEnable ? (
          <Button className="h-14" color="warning" onPress={addATodoHandler}>
            추가
          </Button>
        ) : (
          DisabledTodoAddTooltip()
        )}
      </div>

      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디</TableColumn>
          <TableColumn>할일내용</TableColumn>
          <TableColumn>완료여부</TableColumn>
          <TableColumn>생성일</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"할일을 추가해주세요."}>
          {optimisticTodos &&
            optimisticTodos.map((aTodo: Todo) => (
              <TableRow key={aTodo.id}>
                <TableCell>{aTodo.id.slice(0, 4)}</TableCell>
                <TableCell>{aTodo.title}</TableCell>
                <TableCell>{aTodo.is_done ? "✅" : "☑️"}</TableCell>
                <TableCell>{aTodo.created_at.toISOString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TodosTable;
