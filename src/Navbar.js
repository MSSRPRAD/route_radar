const Navbar = ({ list, categoryHandler }) => {

    const onClickHandler = (id) => {
        console.log("id = " + id);
        categoryHandler(id);
    }

    return (
        <div className="Navbar">
            <h3>Select Emergency:</h3>
            {list.map((item) => (
                <button key={item.id} onClick={() => onClickHandler(item.id)}>
                    {item.name}
                </button>
            ))}
        </div>
    );
};

export default Navbar;