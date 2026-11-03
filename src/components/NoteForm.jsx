import { useState } from "react";

import ColorPicker from "./ColorPicker";


function NoteForm({ notes, addNote }) {

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [color, setColor] = useState("yellow");

    const [tag, setTag] = useState("");

    const [error, setError] = useState("");


    function handleSubmit(event) {

        event.preventDefault();

        setError("");


        // CONTENT VALIDATION

        if (content.trim() === "") {

            setError(
                "Content cannot be empty."
            );

            return;
        }


        // TITLE VALIDATION

        if (title.length > 100) {

            setError(
                "Title cannot exceed 100 characters."
            );

            return;
        }


        // TAG VALIDATION

        if (tag.length > 30) {

            setError(
                "Tag cannot exceed 30 characters."
            );

            return;
        }


        // DUPLICATE CHECK

        const duplicate = notes.some((note) => {

            return (
                note.title.trim().toLowerCase() ===
                title.trim().toLowerCase()
                &&
                note.content.trim().toLowerCase() ===
                content.trim().toLowerCase()
            );

        });


        if (duplicate) {

            setError(
                "A note with the same title and content already exists."
            );

            return;
        }


        // CREATE NOTE OBJECT

        const newNote = {

            id: Date.now(),

            title: title.trim(),

            content: content.trim(),

            color: color,

            tag: tag.trim(),

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

            pinned: false,

            archived: false

        };


        // SEND NOTE TO APP

        addNote(newNote);


        // CLEAR FORM

        setTitle("");

        setContent("");

        setColor("yellow");

        setTag("");

    }


    return (

        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-xl bg-white p-5 shadow"
        >

            {/* TITLE */}

            <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                maxLength={100}
                onChange={(event) => {
                    setTitle(event.target.value);
                }}
                className="mb-3 w-full border-b p-2 text-xl outline-none"
            />


            {/* CONTENT */}

            <textarea
                placeholder="Take a note..."
                value={content}
                onChange={(event) => {
                    setContent(event.target.value);
                }}
                className="mb-3 min-h-32 w-full resize-none rounded-lg border p-3 outline-none"
            />


            {/* COLOR */}

            <ColorPicker
                color={color}
                setColor={setColor}
            />


            {/* TAG */}

            <input
                type="text"
                placeholder="Tag (optional)"
                value={tag}
                maxLength={30}
                onChange={(event) => {
                    setTag(event.target.value);
                }}
                className="mb-3 w-full rounded-lg border p-3"
            />


            {/* ERROR */}

            {error && (

                <p className="mb-3 text-red-500">
                    {error}
                </p>

            )}


            {/* ADD BUTTON */}

            <button
                type="submit"
                className="rounded-lg bg-black px-5 py-2 text-white"
            >
                Add Note
            </button>

        </form>
    );
}

export default NoteForm;







