import { Component, createSignal, For } from "solid-js";
import { store, actions, lens } from "./store";

const App: Component = () => {
  let [filter, setFilter] = createSignal(
    document.location.hash.replace(/^#\//, "")
  );

  return (
    <>
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <input
            class="new-todo"
            placeholder="What needs to be done?"
            autofocus
            onkeyup={(e: KeyboardEvent) => {
              if (
                e.key === "Enter" &&
                ((e as Event).target as HTMLInputElement).value.length
              ) {
                actions.add({
                  title: ((e as Event).target as HTMLInputElement).value,
                });
                ((e as Event).target as HTMLInputElement).value = "";
              }
            }}
          ></input>
        </header>
        <section class="main" style={`display: ${store.todos.length > 0 ? 'block': 'none'}`}>
          <input
            id="toggle-all"
            class="toggle-all"
            onclick={() => actions.toggleAll()}
            type="checkbox"
          ></input>
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            <For each={lens.applyFilter(filter())}>
              {(todo: any, i) => {
                return (
                  <li
                    id={todo.id}
                    classList={{
                      editing: todo.editing,
                      completed: todo.completed,
                    }}
                  >
                    <div class="view">
                      <input
                        class="toggle"
                        type="checkbox"
                        onclick={() => actions.toggle(todo)}
                        checked={todo.completed}
                      ></input>
                      <label
                        ondblclick={(e: Event) => {
                          actions.edit(todo);
                          (
                            (e.target as HTMLLabelElement).parentNode
                              ?.parentNode?.childNodes[1] as HTMLInputElement
                          ).focus();
                        }}
                      >
                        {todo.title}
                      </label>
                      <button
                        class="destroy"
                        onclick={() => actions.remove(todo)}
                      ></button>
                    </div>
                    <input
                      class="edit"
                      onkeyup={(e) => {
                        if (
                          e.key === "Enter" &&
                          ((e as Event).target as HTMLInputElement).value
                        ) {
                          actions.update({
                            ...todo,
                            editing: false,
                            title: ((e as Event).target as HTMLInputElement)
                              .value,
                          });
                        }
                        if (e.key === "Escape") {
                          ((e as Event).target as HTMLInputElement).value =
                            todo.title;
                          actions.update({ ...todo, editing: false });
                        }
                      }}
                      onblur={(e) => {
                        let title = ((e as Event).target as HTMLInputElement)
                          .value;
                        actions.update({ ...todo, editing: false, title });
                      }}
                      value={todo.title}
                    ></input>
                  </li>
                );
              }}
            </For>
          </ul>
        </section>
        <footer class="footer" style={`display: ${store.todos.length > 0 ? 'block': 'none'}`}>
          <span class="todo-count">
            <strong>{store.todos.length}</strong> {store.todos.length > 1 ? 'items': 'item'} left
          </span>
          <ul class="filters">
            <li>
              <a
                class={filter() == "" ? "selected" : ""}
                href="#/"
                onclick={() => setFilter("")}
              >
                All
              </a>
            </li>
            <li>
              <a
                class={filter() == "active" ? "selected" : ""}
                href="#/active"
                onclick={() => setFilter("active")}
              >
                Active
              </a>
            </li>
            <li>
              <a
                class={filter() == "completed" ? "selected" : ""}
                href="#/completed"
                onclick={() => setFilter("completed")}
              >
                Completed
              </a>
            </li>
          </ul>
          <button
            class="clear-completed"
            onclick={() => actions.clearCompleted()}
            style={`display: ${lens.hasCompleted() ? 'block': 'none'}`}
          >
            Clear completed
          </button>
        </footer>
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="https://dev.to/cawfeecoder">Nicholas Frush</a>
        </p>
        <p>
          Project on GitHub:{" "}
          <a href="https://github.com/cawfeecoder/solidjs-todo-ts-2022">
            SolidJS Todo Typescript 2022
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;
