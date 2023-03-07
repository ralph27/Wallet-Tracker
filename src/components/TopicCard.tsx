import { type FormEvent, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { api } from "~/utils/api";

export default function TopicCard({
  listSelected,
  setListSelected,
  name,
  id,
  onSave,
}: {
  listSelected: string;
  setListSelected: () => void;
  name: string;
  id: string;
  onSave: () => void;
}) {
  const [newName, setNewName] = useState<string>("");

  const deleteList = api.lists.deleteList.useMutation({
    onSuccess: () => onSave(),
  });

  const editList = api.lists.editListName.useMutation({
    onSuccess: () => onSave(),
  });

  return (
    <li className="group hover:text-lightGreen" onClick={setListSelected}>
      <a
        className={`${
          id === listSelected
            ? "active bg-bc bg-opacity-10 text-lightGreen"
            : ""
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <h1>{name}</h1>
          <div className="dropdown">
            <label tabIndex={0}>
              <BsThreeDots className="invisible group-hover:visible" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <li
                onClick={() => deleteList.mutate({ id })}
                className=" text-bc hover:text-lightGreen"
              >
                <a>Delete</a>
              </li>
              <li className=" text-bc hover:text-lightGreen">
                <label htmlFor={`edit-modal-${id}`}>
                  <a>Edit</a>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </a>
      <input type="checkbox" id={`edit-modal-${id}`} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-2xl font-bold text-bc">Enter new name</h3>
          <div className="py-2" />
          <input
            type="text"
            placeholder="Enter new name..."
            className="input-bordered input w-full max-w-xs text-bc"
            value={newName}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setNewName(e.currentTarget.value)
            }
          />
          <div className="modal-action">
            <label
              htmlFor={`edit-modal-${id}`}
              className="btn hover:text-lightGreen"
            >
              Cancel
            </label>
            <label
              onClick={() => editList.mutate({ id, newName })}
              htmlFor={`edit-modal-${id}`}
              className="btn hover:text-lightGreen"
            >
              Save
            </label>
          </div>
        </div>
      </div>
    </li>
  );
}
