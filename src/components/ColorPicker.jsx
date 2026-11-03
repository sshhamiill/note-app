function ColorPicker({ color, setColor }) {

    const colors = [

        {
            name: "yellow",
            className: "bg-yellow-300"
        },

        {
            name: "blue",
            className: "bg-blue-300"
        },

        {
            name: "green",
            className: "bg-green-300"
        },

        {
            name: "pink",
            className: "bg-pink-300"
        },

        {
            name: "purple",
            className: "bg-purple-300"
        }

    ];


    return (

        <div className="mb-4 flex gap-3">

            {colors.map((item) => (

                <button
                    key={item.name}
                    type="button"

                    onClick={() => {
                        setColor(item.name);
                    }}

                    className={`
                        h-8
                        w-8
                        rounded-full
                        ${item.className}

                        ${
                            color === item.name
                                ? "ring-2 ring-black"
                                : ""
                        }
                    `}

                    aria-label={`Select ${item.name}`}
                />

            ))}

        </div>
    );
}

export default ColorPicker;