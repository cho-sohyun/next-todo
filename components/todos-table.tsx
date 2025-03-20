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
      <TableBody emptyContent={"할일을 추가해주세요."}>
        {todos &&
          todos.map((aTodo: Todo) => (
            <TableRow key={aTodo.id}>
              <TableCell>{aTodo.id.slice(0, 4)}</TableCell>
              <TableCell>{aTodo.title}</TableCell>
              <TableCell>{aTodo.is_done ? "✅" : "☑️"}</TableCell>
              <TableCell>{`${aTodo.created_at}`}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TodosTable;
