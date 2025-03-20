import { NextRequest, NextResponse } from "next/server";

import { fetchTodos, addATodo } from "@/data/firestore";

// 모든 할일 가져오기
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const fetchedTodos = await fetchTodos();

  const response = {
    message: "todos 몽땅가져오기",
    data: fetchedTodos,
  };

  return NextResponse.json(response, { status: 200 });
}

// 할일 추가
export async function POST(request: NextRequest) {
  const { title } = await request.json();

  if (title === undefined) {
    const errMessage = {
      message: "제목을 작성해주세요!",
    };

    return NextResponse.json(errMessage, { status: 422 });
  }

  const addedTodo = await addATodo({ title });

  const response = {
    message: "할일 추가 성공!",
    data: addedTodo,
  };

  return Response.json(response, { status: 201 });
}
