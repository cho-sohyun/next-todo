/* eslint-disable no-console */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  Timestamp,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 모든 할일 가져오기
export async function fetchTodos() {
  const todosRef = collection(db, "todos");
  const descQuery = query(todosRef, orderBy("created_at", "desc"));

  const querySnapshot = await getDocs(descQuery);

  if (querySnapshot.empty) {
    return [];
  }

  const fetchedTodos = [];

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());

    const aTodo = {
      id: doc.id,
      title: doc.data()["title"],
      is_done: doc.data()["is_done"],
      created_at: doc.data()["created_at"].toDate(),
    };

    //.toLocaleTimeString('ko')
    fetchedTodos.push(aTodo);
  });

  return fetchedTodos;
}

// 할일 추가
export async function addATodo({ title }) {
  const newTodoRef = doc(collection(db, "todos"));

  const createdAtTimestamp = Timestamp.fromDate(new Date());

  const newTodoData = {
    id: newTodoRef.id,
    title: title,
    is_done: false,
    created_at: createdAtTimestamp,
  };

  await setDoc(newTodoRef, newTodoData);

  return {
    id: newTodoRef.id,
    title: title,
    is_done: false,
    created_at: createdAtTimestamp.toDate(),
  };
}

export async function fetchATodo({ id }) {
  if (!id) {
    throw new Error("fetchATodo: id가 제공되지 않았습니다.");
  }

  console.log("fetchATodo id:", id); // 디버깅 로그

  try {
    const todoDocRef = doc(db, "todos", id);
    const todoDocSnap = await getDoc(todoDocRef);

    if (todoDocSnap.exists()) {
      return { id: todoDocSnap.id, ...todoDocSnap.data() };
    } else {
      throw new Error("할일을 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw error;
  }
}

// 단일 할일 삭제
export async function deleteATodo({ id }) {
  if (!id) {
    throw new Error("deleteATodo: id가 제공되지 않았습니다.");
  }

  console.log("deleteATodo id:", id); // 디버깅 로그

  const fetchedTodo = await fetchATodo({ id });

  if (!fetchedTodo) {
    console.error("deleteATodo: 할일을 찾을 수 없습니다.");

    return null;
  }

  await deleteDoc(doc(db, "todos", id));

  console.log("deleteATodo: 삭제 완료");

  return fetchedTodo;
}

// 단일 할일 수정
export async function editATodo(id, data) {
  if (!id) {
    throw new Error("editATodo: id가 제공되지 않았습니다.");
  }

  console.log("editATodo id:", id); // 디버깅 로그
  console.log("editATodo data:", data); // 디버깅 로그

  try {
    const todoDocRef = doc(db, "todos", id);

    await updateDoc(todoDocRef, data);

    return await fetchATodo({ id });
  } catch (error) {
    console.error("editATodo: 서버 오류 발생", error);
    throw error;
  }
}

export default { fetchTodos, addATodo, fetchATodo, deleteATodo, editATodo };
