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
  const querySnapshot = await getDocs(collection(db, "todos"));

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

// 단일 할일 조회
export async function fetchATodo({ id }) {
  if (id === null) {
    return null;
  }

  try {
    const todoDocRef = doc(db, "todos", id);
    const todoDocSnap = await getDoc(todoDocRef);

    if (todoDocSnap.exists()) {
      console.log("Document data:", todoDocSnap.data());

      const todoData = todoDocSnap.data(); // Firestore 문서 데이터 가져오기

      const fetchedTodo = {
        id: todoDocSnap.id, // 문서 ID
        title: todoData.title || "제목 없음", // undefined 방지
        is_done: todoData.is_done ?? false, // undefined 방지
        created_at: todoData.created_at?.toDate() || new Date(),
      };

      return fetchedTodo;
    } else {
      console.log("No such document");

      return null;
    }
  } catch (error) {
    console.error("Error fetching todo:", error);

    return null;
  }
}

// 단일 할일 삭제
export async function deleteATodo({ id }) {
  const fetchedTodo = await fetchATodo(id);

  if (fetchedTodo === null) {
    return null;
  }

  await deleteDoc(doc(db, "todos", id));

  return fetchedTodo;
}

// 단일 할일 수정
export async function editATodo(id, { title, is_done }) {
  const fetchedTodo = await fetchATodo(id);

  if (fetchedTodo === null) {
    return null;
  }

  const todoRef = doc(db, "todos", id);

  await updateDoc(todoRef, {
    title: title,
    is_done: is_done,
  });

  return {
    id: id,
    title: title,
    is_done: is_done,
    created_at: fetchedTodo.created_at,
  };
}

export default { fetchTodos, addATodo, fetchATodo, deleteATodo, editATodo };
