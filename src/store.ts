import { createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";

const [store, setStore] = createStore({ todos: Array<any>() });
// const [todos, setTodos] = createStore(Array<any>());

if (localStorage.todos) {
    setStore({ todos: JSON.parse(localStorage.todos) })
    // setTodos(JSON.parse(localStorage.todos))
}

createEffect(() => {
    // localStorage.todos = JSON.stringify(todos)
    localStorage.todos = JSON.stringify(store.todos);
});

const add = (todo: any) => {
    setStore(
        "todos",
        produce((todos) => {
            todos.push({
                id: `id_${Date.now()}`,
                title: todo.title,
                completed: false,
                editing: false
            })
        })
    )
}

const remove = ({ id }: { id: any}) => {
    setStore(
        "todos",
        produce((todos) => {
            let idx = todos.map((t) => t.id).indexOf(id);
            todos.splice(idx, 1);
        })
    )
}

const toggle = ({ id }: { id: any}) => {
    setStore(
        "todos",
        (todo: any) => todo.id === id,
        produce((todo: any) => {
            todo.completed = !todo.completed
        })
    );
}

const edit = ({ id }: { id: any}) => {
    setStore(
        "todos",
        (todo: any) => todo.id === id,
        produce((todo: any) => {
            todo.editing = true
        })
    );
}

const clearCompleted = () => {
    setStore(
        "todos",
        (todo: any) => todo.completed == true,
        produce((todo: any) => {
            todo.completed = false;
        })
    )
}

const update = (updateTodo: any) => {
    setStore(
        "todos",
        (todo: any) => todo.id === updateTodo.id,
        produce((todo: any) => {
            todo.title = updateTodo.title;
            todo.editing = updateTodo.editing;
            todo.completed = updateTodo.completed;
        })
    );
}

const hasCompleted = () => {
    return store.todos.some(todo => todo.completed);
}

const isAllCompleted = () => {
    return store.todos.every(todo => todo.completed);
}

const applyFilter = (filter: string) => {
    switch (filter) {
        case "completed":
            return store.todos.filter((todo) => todo.completed)
        case "active":
            return store.todos.filter((todo) => !todo.completed)
        default:
            return store.todos
    }
}

const toggleAll = () => {
    let completed = !isAllCompleted() || !hasCompleted();
    setStore(
        "todos",
        produce((todos) => {
            todos.map(todo => todo.completed = completed)
        })
    )
}

const actions = {
    add,
    remove,
    toggle,
    clearCompleted,
    update,
    toggleAll,
    edit
}

const lens = {
    hasCompleted,
    isAllCompleted,
    applyFilter
}

export {
   store,
   actions,
    lens
}