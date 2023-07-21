import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { INotes } from "../Interface";

interface IToDoProps {
  products: INotes;
  edit: string;
  setEdit: Dispatch<SetStateAction<string>>;
  DeleteTd(id: string): void;
  completedTd(id: string): void;
  editTd(id: string): void;
  filtrByTags(tag: string): void;
  selectedTags: string[];
  filteredNotes: INotes[];
}

const Todo: FC<IToDoProps> = ({
  products,
  edit,
  setEdit,
  DeleteTd,
  completedTd,
  editTd,
  filtrByTags,
  selectedTags,
  filteredNotes,
}) => {
  const [editingOpen, setEditingOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        background: products.addColor,
      }}
      className={products.completed ? "NotesOff Notes" : "Notes "}
    >
      <textarea
        className={products.completed ? "completed" : ""}
        value={editingOpen ? edit : products.title}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setEdit(e.target.value)
        }
      />
      <button
        className={products.completed ? "completed" : "notCompleted"}
        onClick={() => completedTd(products.id)}
      >
        Completed
      </button>
      <div className="rightSide">
        <button
          className={editingOpen ? "editing" : ""}
          onClick={() => {
            editTd(products.id), setEditingOpen((prev) => !prev);
          }}
        >
          &#10002;
        </button>
        <button onClick={() => DeleteTd(products.id)}>&#10008;</button>
      </div>
      <div className="time">
        <span>{products.time}</span>
      </div>
      <div className="tags">
        <ul>
          {products.tags.map((tag, index) => (
            <li
              className={selectedTags.includes(tag) ? "filtredTags" : ""}
              style={{ paddingLeft: tag.length }}
              key={index}
              title="To filter tags click on the tag"
              onClick={() => filtrByTags(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { Todo };
