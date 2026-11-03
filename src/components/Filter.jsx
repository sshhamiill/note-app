function Filter({
    filter,
    setFilter,
    sort,
    setSort
}) {

    return (

        <div className="flex gap-2">

            {/* FILTER */}

            <select
                value={filter}
                onChange={(event) => {
                    setFilter(event.target.value);
                }}
                className="rounded-lg border bg-white p-3"
            >

                <option value="all">
                    All
                </option>

                <option value="active">
                    Active
                </option>

                <option value="pinned">
                    Pinned
                </option>

                <option value="archived">
                    Archived
                </option>

            </select>


            {/* SORT */}

            <select
                value={sort}
                onChange={(event) => {
                    setSort(event.target.value);
                }}
                className="rounded-lg border bg-white p-3"
            >

                <option value="newest">
                    Newest
                </option>

                <option value="oldest">
                    Oldest
                </option>

                <option value="title">
                    Title
                </option>

                <option value="color">
                    Color
                </option>

            </select>

        </div>
    );
}

export default Filter;