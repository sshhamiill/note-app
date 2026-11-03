import { useState } from "react";


function NoteCard({
    note,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive
}) {

    const [editing, setEditing] = useState(false);

    const [editTitle, setEditTitle] =
        useState(note.title);

    const [editContent, setEditContent] =
        useState(note.content);


    // SAVE EDIT

    function saveEdit() {

        if (editContent.trim() === "") {

            alert("Content cannot be empty.");

            return;
        }


        if (editTitle.length > 100) {

            alert(
                "Title cannot exceed 100 characters."
            );

            return;
        }


        const updatedNote = {

            ...note,

            title: editTitle.trim(),

            content: editContent.trim(),

            updatedAt:
                new Date().toISOString()

        };


        updateNote(updatedNote);

        setEditing(false);

    }


    // COLOR CLASSES

    const colorClasses = {

        yellow: "bg-yellow-100",

        blue: "bg-blue-100",

        green: "bg-green-100",

        pink: "bg-pink-100",

        purple: "bg-purple-100"

    };


    // EDIT MODE

    if (editing) {

        return (

            <div
                className={
                    `rounded-xl p-4 shadow
                    ${colorClasses[note.color]}`
                }
            >

                <input
                    value={editTitle}
                    maxLength={100}
                    onChange={(event) => {
                        setEditTitle(
                            event.target.value
                        );
                    }}
                    className="mb-3 w-full rounded border p-2"
                />


                <textarea
                    value={editContent}
                    onChange={(event) => {
                        setEditContent(
                            event.target.value
                        );
                    }}
                    className="mb-3 min-h-24 w-full rounded border p-2"
                />


                <div className="flex gap-2">

                    <button
                        onClick={saveEdit}
                        className="rounded bg-black px-3 py-2 text-white"
                    >
                        Save
                    </button>


                    <button
                        onClick={() => {
                            setEditing(false);
                        }}
                        className="rounded bg-gray-300 px-3 py-2"
                    >
                        Cancel
                    </button>

                </div>

            </div>
        );
    }


    // NORMAL MODE

    return (

        <div
            className={
                `rounded-xl p-5 shadow
                ${colorClasses[note.color]}`
            }
        >

            {/* TITLE + PIN */}

            <div className="flex items-start justify-between">

                <div>

                    {note.title && (

                        <h2 className="text-lg font-bold">
                            {note.title}
                        </h2>

                    )}


                    <p className="mt-2 whitespace-pre-wrap">
                        {note.content}
                    </p>


                    {note.tag && (

                        <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-sm">

                            #{note.tag}

                        </span>

                    )}

                </div>


                {/* PIN */}

                <button
                    onClick={() => {
                        togglePin(note.id);
                    }}
                    className="text-xl"
                >

                    {note.pinned
                        ? "📌"
                        : "📍"}

                </button>

            </div>


            {/* CREATED TIME */}

            <p className="mt-4 text-xs text-gray-500">

                Created:{" "}

                {new Date(
                    note.createdAt
                ).toLocaleString()}

            </p>


            {/* UPDATED TIME */}

            <p className="text-xs text-gray-500">

                Updated:{" "}

                {new Date(
                    note.updatedAt
                ).toLocaleString()}

            </p>


            {/* BUTTONS */}

            <div className="mt-4 flex flex-wrap gap-2">


                {/* EDIT */}

                <button
                    onClick={() => {
                        setEditing(true);
                    }}
                    className="rounded bg-white px-3 py-2"
                >
                    Edit
                </button>


                {/* DELETE */}

                <button
                    onClick={() => {
                        deleteNote(note.id);
                    }}
                    className="rounded bg-red-500 px-3 py-2 text-white"
                >
                    Delete
                </button>


                {/* ARCHIVE */}

                <button
                    onClick={() => {
                        toggleArchive(note.id);
                    }}
                    className="rounded bg-gray-700 px-3 py-2 text-white"
                >

                    {note.archived
                        ? "Unarchive"
                        : "Archive"}

                </button>

            </div>

        </div>
    );
}

export default NoteCard;