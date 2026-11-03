function SearchBar({ search, setSearch }) {

    return (

        <input
            type="text"
            placeholder="🔍 Search notes..."
            value={search}
            onChange={(event) => {
                setSearch(event.target.value);
            }}
            className="flex-1 rounded-lg border bg-white p-3 outline-none"
        />

    );
}

export default SearchBar;