/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

import { Todo } from "@/types";

const TodosTable = ({ todos }: { todos: Todo[] }) => {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>아이디</TableColumn>
        <TableColumn>할일내용</TableColumn>
        <TableColumn>완료여부</TableColumn>
        <TableColumn>생성일</TableColumn>
      </TableHeader>
      <TableBody>
        {todos &&
          todos.map((todo: Todo) => (
            <TableRow key="1">
              <TableCell>1</TableCell>
              <TableCell>빨래하기</TableCell>
              <TableCell>완료</TableCell>
              <TableCell>오늘</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TodosTable;
