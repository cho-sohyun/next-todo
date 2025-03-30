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
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";

import { VerticalDotsIcon } from "./icons";
import "react-toastify/dist/ReactToastify.css";

import { Todo } from "@/types";
const TodosTable = ({ todos }: { todos: Todo[] }) => {
  // 할일 추가 가능 여부 state
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  // 입력된 할일 state
  const [newTodoInput, setNewTodoInput] = useState("");

  // 로딩상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 로컬 상태로 할일 목록 관리
  const [optimisticTodos, setOptimisticTodos] = useState<Todo[]>(todos);

  const addATodoHandler = async () => {
    if (newTodoInput.trim().length === 0) {
      console.log("글자를 입력하시오");

      return;
    }
    setIsLoading(true);

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
      notify();
    } catch (error) {
      console.error("오류");
    } finally {
      setIsLoading(false);
      setTodoAddEnable(false);
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

  const notify = () => toast.success("할일이 성공적으로 추가되었습니다!");

  return (
    <div className="flex flex-col space-y-2">
      <ToastContainer
        draggable
        pauseOnFocusLoss
        pauseOnHover
        autoClose={1800}
        closeOnClick={false}
        hideProgressBar={false}
        newestOnTop={false}
        position="top-right"
        rtl={false}
        theme="dark"
        transition={Bounce}
      />
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
          <Button
            className="h-14"
            color="warning"
            isDisabled={isLoading}
            onPress={addATodoHandler}
          >
            추가
          </Button>
        ) : (
          DisabledTodoAddTooltip()
        )}
      </div>
      <div className="h-6">
        {isLoading && <Spinner color="warning" size="sm" />}
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디</TableColumn>
          <TableColumn>할일내용</TableColumn>
          <TableColumn>완료여부</TableColumn>
          <TableColumn>생성일</TableColumn>
          <TableColumn>액션</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"할일을 추가해주세요."}>
          {optimisticTodos &&
            optimisticTodos.map((aTodo: Todo) => (
              <TableRow key={aTodo.id}>
                <TableCell>{aTodo.id.slice(0, 4)}</TableCell>
                <TableCell>{aTodo.title}</TableCell>
                <TableCell>{aTodo.is_done ? "✅" : "☑️"}</TableCell>
                <TableCell>
                  {new Date(aTodo.created_at).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <VerticalDotsIcon className="text-default-400" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="view">상세보기</DropdownItem>
                        <DropdownItem key="edit">수정</DropdownItem>
                        <DropdownItem key="delete">삭제</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodosTable;
