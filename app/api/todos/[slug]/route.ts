/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from "next/server";

import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore";

// 할일 단일 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const fetchedTodo = await fetchATodo({ id: slug });

  if (!fetchedTodo) {
    return new Response(null, { status: 204 });
  }

  return NextResponse.json(
    { message: "단일 할일 가져오기 성공!", data: fetchedTodo },
    { status: 200 }
  );
}

// 할일 단일 삭제 id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deletedTodo = await deleteATodo({ id: slug });

  if (!deletedTodo) {
    return new Response(null, { status: 204 });
  }

  return NextResponse.json(
    { message: "단일 할일 삭제 성공", data: deletedTodo },
    { status: 200 }
  );
}

// 할일 단일 수정 id
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { title, is_done } = await request.json();

  const editedTodo = await editATodo(slug, { title, is_done });

  if (!editedTodo) {
    return new Response(null, { status: 204 });
  }

  return NextResponse.json(
    { message: "단일 할일 수정 성공", data: editedTodo },
    { status: 200 }
  );
}
