import NoteCard from "./NoteCard";


function NoteList({
    notes,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive
}) {

    return (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {notes.map((note) => (

                <NoteCard
                    key={note.id}
                    note={note}
                    updateNote={updateNote}
                    deleteNote={deleteNote}
                    togglePin={togglePin}
                    toggleArchive={toggleArchive}
                />

            ))}

        </div>

    );
}

export default NoteList;