/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import {
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Switch,
  CircularProgress,
} from "@heroui/react";
import "react-toastify/dist/ReactToastify.css";

import React from "react";

import { CustomModalType, Todo } from "@/types";

const CustomModal = ({
  focusedTodo,
  modalType,
  onClose,
  onEdit,
  onDelete,
}: {
  focusedTodo: Todo;
  modalType: CustomModalType;
  onClose: () => void;
  onEdit: (id: string, title: string, isDone: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  // 수정된 선택
  const [isDone, setIsDone] = useState(focusedTodo.is_done);

  // 수정된 할일 Input
  const [editedTodoInput, setEditedTodoInput] = useState<string>(
    focusedTodo.title
  );

  // 모달 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  const DetailModal = () => {
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
        <ModalBody>
          <p>
            <span className="font-bold">id : </span>
            {focusedTodo.id}
          </p>
          <p>
            <span className="font-bold">할일 내용 : </span>
            {focusedTodo.title}
          </p>

          <div className="flex space-x-2">
            <span className="font-bold">완료여부 : </span>
            <span className="ml-1">{`${focusedTodo.is_done ? "완료" : "미완료"}`}</span>
          </div>
          <div className="flex space-x-2">
            <p>
              <span className="font-bold">작성일 : </span>
              {`${focusedTodo.created_at}`}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </>
    );
  };

  const EditModal = () => {
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            defaultValue={focusedTodo.title}
            label="할일 내용"
            placeholder="할일을 입력해주세요."
            value={editedTodoInput}
            variant="bordered"
            onValueChange={setEditedTodoInput}
          />

          <div className="flex py-2 px-1 space-x-2">
            <span className="ml-1 text-md">완료</span>
            <Switch
              aria-label="Automatic updates"
              defaultSelected={focusedTodo.is_done}
              size="sm"
              onValueChange={setIsDone}
            />
          </div>
          <div className="flex px-1 space-x-2">
            <span className="ml-1 text-sm">
              작성일 : {`${focusedTodo.created_at}`}
            </span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              setIsLoading(true);
              onEdit(focusedTodo.id, editedTodoInput, isDone);
            }}
          >
            {isLoading ? (
              <CircularProgress
                aria-label="Loading..."
                color="primary"
                size="sm"
              />
            ) : (
              "수정"
            )}
          </Button>
          <Button color="default" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </>
    );
  };

  const DeleteModal = () => {
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">할일 삭제</ModalHeader>

        <ModalBody>
          <p>
            <span className="font-bold">id : </span>
            {focusedTodo.id}
          </p>
          <p>
            <span className="font-bold">할일 내용 : </span>
            {focusedTodo.title}
          </p>

          <div className="flex space-x-2">
            <span className="font-bold">완료여부 : </span>
            <span className="ml-1">{`${focusedTodo.is_done ? "완료" : "미완료"}`}</span>
          </div>
          <div className="flex space-x-2">
            <p>
              <span className="font-bold">작성일 : </span>
              {`${focusedTodo.created_at}`}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={() => {
              setIsLoading(true);
              onDelete(focusedTodo.id);
            }}
          >
            {isLoading ? (
              <CircularProgress
                aria-label="Loading..."
                color="danger"
                size="sm"
              />
            ) : (
              "삭제"
            )}
          </Button>
          <Button color="default" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </>
    );
  };

  const getModal = (type: CustomModalType) => {
    switch (type) {
      case "detail":
        return DetailModal();
      case "delete":
        return DeleteModal();
      case "edit":
        return EditModal();
    }
  };

  return <>{getModal(modalType)}</>;
};

export default CustomModal;
