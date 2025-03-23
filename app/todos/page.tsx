import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

async function fetchTodosApi() {
  const res = await fetch(`${process.env.BASE_URL}/api/todos/`, {
    cache: "no-store", // 항상 최신 데이터 가져옴
  });

  return res.json();
}

export default async function TodosPage() {
  const response = await fetchTodosApi();

  return (
    <div className="flex flex-col space-y-8">
      <h1 className={title()}>Todos</h1>
      <TodosTable todos={response.data ?? []} />
    </div>
  );
}
