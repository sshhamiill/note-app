import { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";

function App() {
    // All notes
    const [notes, setNotes] = useState([]);

    // Search text
    const [search, setSearch] = useState("");

    // Filter
    const [filter, setFilter] = useState("all");

    // Sort
    const [sort, setSort] = useState("newest");

    // Loading
    const [loading, setLoading] = useState(true);

    // LOAD NOTES FROM LOCAL STORAGE
    useEffect(() => {

        const savedNotes =
            JSON.parse(localStorage.getItem("notes")) || [];

        setNotes(savedNotes);

        setLoading(false);

    }, []);


    // SAVE NOTES TO LOCAL STORAGE
    useEffect(() => {

        if (!loading) {

            localStorage.setItem(
                "notes",
                JSON.stringify(notes)
            );

        }

    }, [notes, loading]);


    // CREATE
    function addNote(note) {

        setNotes((oldNotes) => {

            return [note, ...oldNotes];

        });

    }


    // UPDATE
    function updateNote(updatedNote) {

        setNotes((oldNotes) => {

            return oldNotes.map((note) => {

                if (note.id === updatedNote.id) {

                    return updatedNote;

                }

                return note;

            });

        });

    }


    // DELETE
    function deleteNote(id) {

        const answer = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!answer) {
            return;
        }

        setNotes((oldNotes) => {

            return oldNotes.filter((note) => {

                return note.id !== id;

            });

        });

    }


    // PIN / UNPIN
    function togglePin(id) {

        setNotes((oldNotes) => {

            return oldNotes.map((note) => {

                if (note.id === id) {

                    return {
                        ...note,
                        pinned: !note.pinned,
                        updatedAt: new Date().toISOString()
                    };

                }

                return note;

            });

        });

    }


    // ARCHIVE / UNARCHIVE
    function toggleArchive(id) {

        setNotes((oldNotes) => {

            return oldNotes.map((note) => {

                if (note.id === id) {

                    return {
                        ...note,
                        archived: !note.archived,
                        updatedAt: new Date().toISOString()
                    };

                }

                return note;

            });

        });

    }


    // SEARCH + FILTER
    let filteredNotes = notes.filter((note) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText) ||
            note.tag.toLowerCase().includes(searchText);


        // ALL
        if (filter === "all") {

            return matchesSearch;

        }


        // ACTIVE
        if (filter === "active") {

            return matchesSearch && !note.archived;

        }


        // PINNED
        if (filter === "pinned") {

            return (
                matchesSearch &&
                note.pinned &&
                !note.archived
            );

        }


        // ARCHIVED
        if (filter === "archived") {

            return matchesSearch && note.archived;

        }


        return matchesSearch;

    });


    // SORT
    filteredNotes.sort((a, b) => {

        if (sort === "newest") {

            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

        }


        if (sort === "oldest") {

            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );

        }


        if (sort === "title") {

            return a.title.localeCompare(b.title);

        }


        if (sort === "color") {

            return a.color.localeCompare(b.color);

        }

        return 0;

    });


    return (

        <div className="min-h-screen bg-gray-100 p-4">

            <div className="mx-auto max-w-6xl">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    My Notes
                </h1>


                {/* CREATE NOTE */}

                <NoteForm
                    notes={notes}
                    addNote={addNote}
                />


                {/* SEARCH + FILTER */}

                <div className="mb-6 flex flex-col gap-3 sm:flex-row">

                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                    />

                    <Filter
                        filter={filter}
                        setFilter={setFilter}
                        sort={sort}
                        setSort={setSort}
                    />

                </div>


                {/* NOTES */}

                {loading ? (

                    <p className="text-center">
                        Loading notes...
                    </p>

                ) : filteredNotes.length === 0 ? (

                    <div className="rounded-xl bg-white p-10 text-center shadow">

                        <h2 className="text-xl font-bold">
                            No notes found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Create a note to get started.
                        </p>

                    </div>

                ) : (

                    <NoteList
                        notes={filteredNotes}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                        togglePin={togglePin}
                        toggleArchive={toggleArchive}
                    />

                )}

            </div>

        </div>

    );
}

export default App;







