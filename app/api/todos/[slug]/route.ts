/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from "next/server";

import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore";

// 할일 단일 조회
export async function GET(request: NextRequest, context: any) {
  const { params } = context;

  console.log("GET params.slug:", params?.slug); // 디버깅 로그

  if (!params?.slug) {
    console.error("GET: params.slug가 제공되지 않았습니다.");

    return NextResponse.json({ error: "Slug is missing" }, { status: 400 });
  }

  const fetchedTodo = await fetchATodo({ id: params.slug });

  if (!fetchedTodo) {
    return NextResponse.json(
      { error: "할일을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "단일 할일 가져오기 성공!", data: fetchedTodo },
    { status: 200 }
  );
}

// 할일 단일 삭제 id
export async function DELETE(request: NextRequest, context: any) {
  const { params } = context;

  console.log("DELETE params.slug:", params?.slug); // 디버깅 로그

  if (!params?.slug) {
    console.error("DELETE: params.slug가 제공되지 않았습니다.");

    return NextResponse.json({ error: "Slug is missing" }, { status: 400 });
  }

  try {
    const deletedTodo = await deleteATodo({ id: params.slug });

    if (!deletedTodo) {
      console.error("DELETE: 삭제할 할일을 찾을 수 없습니다.");

      return NextResponse.json(
        { error: "할일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    console.log("DELETE deletedTodo:", deletedTodo);

    return NextResponse.json(
      { message: "단일 할일 삭제 성공", data: deletedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE: 서버 오류 발생", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 할일 단일 수정 id
export async function POST(request: NextRequest, context: any) {
  const { params } = context;

  console.log("POST params:", params); // 디버깅 로그

  const { title, is_done } = await request.json();

  console.log("POST request body:", { title, is_done }); // 디버깅 로그

  if (!params?.slug) {
    console.error("POST: params.slug가 제공되지 않았습니다.");

    return NextResponse.json({ error: "Slug is missing" }, { status: 400 });
  }

  if (!title || typeof is_done !== "boolean") {
    console.error("POST: 요청 데이터가 유효하지 않습니다.");

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const editedTodo = await editATodo(params.slug, { title, is_done });

    if (!editedTodo) {
      console.error("POST: 수정할 할일을 찾을 수 없습니다.");

      return NextResponse.json(
        { error: "할일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    console.log("POST editedTodo:", editedTodo);

    return NextResponse.json(
      { message: "단일 할일 수정 성공", data: editedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST: 서버 오류 발생", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
