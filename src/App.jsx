import { useMemo, useState } from "react";
import { useNotes } from "./NotesContext";
import Filter from "./components/Filter";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

function LoadingSpinner() {
    return (
        <span
            aria-label="Loading"
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"
            role="status"
        />
    );
}

function App() {
    const {
        notes,
        loading,
        error,
        toast,
        createNote,
        updateNote,
        deleteNote,
        toggleArchive,
        togglePin,
        searchNotes,
        fetchNotes,
    } = useNotes();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");

    const visibleNotes = useMemo(() => {
        const filtered = searchNotes(search).filter((note) => {
            if (filter === "active") return !note.archived;
            if (filter === "archived") return note.archived;
            if (filter === "pinned") return Boolean(note.pinned) && !note.archived;
            return true;
        });

        return filtered.sort((first, second) => {
            if (sort === "oldest") {
                return new Date(first.createdAt) - new Date(second.createdAt);
            }
            if (sort === "title") return first.title.localeCompare(second.title);
            if (sort === "color") return first.color.localeCompare(second.color);
            return new Date(second.createdAt) - new Date(first.createdAt);
        });
    }, [filter, search, searchNotes, sort]);

    return (
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Notes</h1>
                    <p className="mt-1 text-gray-600">Capture your thoughts and keep them organized.</p>
                </div>
                {loading && <LoadingSpinner />}
            </header>

            <NoteForm notes={notes} addNote={createNote} />

            {error && (
                <div className="mb-5 flex items-center justify-between rounded-lg bg-red-50 p-4 text-red-700" role="alert">
                    <p>{error}</p>
                    <button
                        className="ml-4 font-medium underline"
                        onClick={() => void fetchNotes()}
                        type="button"
                    >
                        Retry
                    </button>
                </div>
            )}

            <section aria-label="Notes">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <SearchBar search={search} setSearch={setSearch} />
                    <Filter
                        filter={filter}
                        setFilter={setFilter}
                        sort={sort}
                        setSort={setSort}
                    />
                </div>

                {loading && notes.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-12 text-gray-600">
                        <LoadingSpinner />
                        <span>Loading notes...</span>
                    </div>
                ) : visibleNotes.length ? (
                    <NoteList
                        notes={visibleNotes}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                        togglePin={togglePin}
                        toggleArchive={toggleArchive}
                    />
                ) : (
                    <p className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
                        {search || filter !== "all"
                            ? "No notes match your search or filter."
                            : "No notes yet. Add one above to get started."}
                    </p>
                )}
            </section>

            {toast && (
                <div
                    className="fixed bottom-5 right-5 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg"
                    role="status"
                >
                    {toast}
                </div>
            )}
        </main>
    );
}

export default App;
