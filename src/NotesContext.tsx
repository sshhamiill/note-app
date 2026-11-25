import axios from "axios";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

export type NoteId = number | string;

export type Note = {
    id: NoteId;
    title: string;
    content: string;
    color: string;
    tags: string[];
    archived: boolean;
    pinned?: boolean;
    stock: number;
    createdAt: string;
    updatedAt: string;
};

export type NewNote = Omit<Note, "id"> & { id?: NoteId };
export type NoteUpdates = Partial<Omit<Note, "id">>;

type NotesContextValue = {
    notes: Note[];
    loading: boolean;
    error: string | null;
    toast: string | null;
    createNote: (note: NewNote) => Promise<boolean>;
    updateNote: (id: NoteId, updates: NoteUpdates) => Promise<boolean>;
    deleteNote: (id: NoteId) => Promise<boolean>;
    toggleArchive: (id: NoteId) => Promise<boolean>;
    togglePin: (id: NoteId) => Promise<boolean>;
    searchNotes: (query: string) => Note[];
    fetchNotes: () => Promise<void>;
};

const api = axios.create({ baseURL: "http://localhost:3001" });
const NotesContext = createContext<NotesContextValue | null>(null);

function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? error.message;
    }

    return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export function NotesProvider({ children }: { children: ReactNode }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const pendingRequests = useRef(0);

    const beginRequest = () => {
        pendingRequests.current += 1;
        setLoading(true);
    };

    const endRequest = () => {
        pendingRequests.current = Math.max(0, pendingRequests.current - 1);
        setLoading(pendingRequests.current > 0);
    };

    const fetchNotes = useCallback(async () => {
        beginRequest();
        setError(null);
        try {
            const response = await api.get<Note[]>("/notes");
            setNotes(response.data);
        } catch (requestError) {
            setError(`Could not load notes: ${getErrorMessage(requestError)}`);
        } finally {
            endRequest();
        }
    }, []);

    useEffect(() => {
        void fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    const createNote = async (note: NewNote) => {
        beginRequest();
        setError(null);
        try {
            const { id: _id, ...newNote } = note;
            const response = await api.post<Note>("/notes", newNote);
            setNotes((current) => [response.data, ...current]);
            setToast("Note created.");
            return true;
        } catch (requestError) {
            setError(`Could not create note: ${getErrorMessage(requestError)}`);
            return false;
        } finally {
            endRequest();
        }
    };

    const saveUpdates = async (
        id: NoteId,
        updates: NoteUpdates,
        successMessage: string,
    ) => {
        beginRequest();
        setError(null);
        try {
            const response = await api.patch<Note>(`/notes/${encodeURIComponent(id)}`, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
            setNotes((current) =>
                current.map((item) => (item.id === id ? response.data : item)),
            );
            setToast(successMessage);
            return true;
        } catch (requestError) {
            setError(`Could not update note: ${getErrorMessage(requestError)}`);
            return false;
        } finally {
            endRequest();
        }
    };

    const updateNote = (id: NoteId, updates: NoteUpdates) =>
        saveUpdates(id, updates, "Note updated.");

    const deleteNote = async (id: NoteId) => {
        beginRequest();
        setError(null);
        try {
            await api.delete(`/notes/${encodeURIComponent(id)}`);
            setNotes((current) => current.filter((note) => note.id !== id));
            setToast("Note deleted.");
            return true;
        } catch (requestError) {
            setError(`Could not delete note: ${getErrorMessage(requestError)}`);
            return false;
        } finally {
            endRequest();
        }
    };

    const toggleArchive = async (id: NoteId) => {
        const note = notes.find((item) => item.id === id);
        if (!note) {
            setError("Could not archive note: The note no longer exists.");
            return false;
        }

        const archived = !note.archived;
        return saveUpdates(
            id,
            { archived },
            archived ? "Note archived." : "Note unarchived.",
        );
    };

    const togglePin = async (id: NoteId) => {
        const note = notes.find((item) => item.id === id);
        if (!note) {
            setError("Could not update pin: The note no longer exists.");
            return false;
        }
        return updateNote(id, { pinned: !note.pinned });
    };

    const searchNotes = useCallback(
        (query: string) => {
            const normalizedQuery = query.trim().toLowerCase();
            if (!normalizedQuery) return notes;
            return notes.filter((note) =>
                [note.title, note.content, ...note.tags].some((value) =>
                    value.toLowerCase().includes(normalizedQuery),
                ),
            );
        },
        [notes],
    );

    return (
        <NotesContext.Provider
            value={{
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
            }}
        >
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error("useNotes must be used within a NotesProvider.");
    }
    return context;
}
