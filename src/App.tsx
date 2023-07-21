import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { Todo } from "./components/Todo";
import "./index.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { INotes } from "./Interface";
const App: FC = () => {
  const [Notes, setNotes] = useState<INotes[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<INotes[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [edit, setEdit] = useState<string>("");
  const [tag, setTag] = useState("");
  const [addedTags, setAddedTags] = useState(false);
  const [addColor, setAddColor] = useState<string>("rgb(17, 17, 34)");
  useEffect((): void => {
    let Notes = JSON.parse(localStorage.getItem("Notes") || "[]");
    if (Notes) {
      setNotes(Notes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Notes", JSON.stringify(Notes));
  }, [Notes]);

  const handleCreateNotes = (event: FormEvent): void => {
    event.preventDefault();

    const regex = /#[A-Za-z0-9]+/g;

    let match;

    if ((match = regex.exec(`#${tag}`)) !== null && title) {
      let tagsF = match.input
        .split(" ")
        .join(" #")
        .toLocaleLowerCase()
        .trim()
        .split(" ");

      tagsF.map((t) => {
        tags.push(t);
        setTags(tags);
      });

      const newNote = {
        title,
        tags,
        id: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        completed: false,
        addColor,
      };
      setNotes([...Notes, newNote]);
      setTitle("");
      setTag("");
      setTags([]);

      toast.success("🎯 Task is added! ", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error(
        "🙄 Error with tags or title input! Please use only numbers and words.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      setTag("");
      setTags([]);
    }
  };
  const tagsX: string[] = [];
  const filtrByTags = (tag: string): void => {
    const updatedSelectedTags = !selectedTags.includes(tag)
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    setSelectedTags(updatedSelectedTags);

    const notesToAdd = Notes.filter((note) => {
      return note.tags.some((noteTag) => updatedSelectedTags.includes(noteTag));
    });
    console.log(notesToAdd);

    setFilteredNotes([...notesToAdd]);
  };

  console.log(selectedTags);

  const DeleteTd = (id: string): void => {
    setNotes(
      Notes.filter((el) => {
        return el.id !== id;
      })
    );
    setFilteredNotes(
      filteredNotes.filter((el) => {
        return el.id !== id;
      })
    );
  };

  const editTd = (id: string): void => {
    setNotes(
      Notes.map((Notes) => {
        if (Notes.id === id) {
          setEdit(Notes.title);
          return {
            ...Notes,
            title: edit,
          };
        } else {
          return Notes;
        }
      })
    );
    setFilteredNotes(
      filteredNotes.map((Notes) => {
        if (Notes.id === id) {
          setEdit(Notes.title);
          return {
            ...Notes,
            title: edit,
          };
        } else {
          return Notes;
        }
      })
    );
  };

  const completedTd = (id: string): void => {
    setNotes(
      Notes.map((Notes) => {
        if (Notes.id === id) {
          return {
            ...Notes,
            completed: !Notes.completed,
          };
        } else {
          return Notes;
        }
      })
    );
    setFilteredNotes(
      filteredNotes.map((Notes) => {
        if (Notes.id === id) {
          return {
            ...Notes,
            completed: !Notes.completed,
          };
        } else {
          return Notes;
        }
      })
    );
  };
  return (
    <div className="App">
      <div className="FormContent">
        <form onSubmit={handleCreateNotes}>
          <input
            type="text"
            placeholder="Example: Go to shop"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Example: shopping"
            value={tag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTag(e.target.value)
            }
          />
          <button type="submit" className="create">
            Create
          </button>
          <input
            type="color"
            value={addColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAddColor(e.target.value);
            }}
          />
          <ToastContainer />
        </form>
      </div>
      <div className="bodyNotes">
        {Notes.length ? (
          filteredNotes.length ? (
            filteredNotes.map((products, index) => (
              <Todo
                key={index}
                products={products}
                DeleteTd={DeleteTd}
                completedTd={completedTd}
                filtrByTags={filtrByTags}
                editTd={editTd}
                edit={edit}
                setEdit={setEdit}
                filteredNotes={filteredNotes}
                selectedTags={selectedTags}
              />
            ))
          ) : (
            Notes.map((products, index) => (
              <Todo
                key={index}
                filteredNotes={filteredNotes}
                products={products}
                DeleteTd={DeleteTd}
                completedTd={completedTd}
                filtrByTags={filtrByTags}
                editTd={editTd}
                edit={edit}
                selectedTags={selectedTags}
                setEdit={setEdit}
              />
            ))
          )
        ) : (
          <h1>You haven't added to-do yet</h1>
        )}
      </div>
    </div>
  );
};

export default App;
