const PlaceEntry = (props) => {
    const handleClick = () => {
        props.onClickHandler(props.data.location);
    }

    const entryStyle = {
        display: "inline-block",
        padding: "10px",
        margin: "5px",
        border: "1px solid gray",
        borderRadius: "5px",
        cursor: "pointer",
    };

    return (
        <div style={entryStyle} onClick={handleClick}>
            {props.data.name}
        </div>
    )
}

const PlaceList = (props) => {
    const entries = props.list;

    const list = entries.map((entry) => {
        return <PlaceEntry key={Math.random()} data={entry} onClickHandler={props.onClickHandler} />
    })


    return (
        <div id="place-list" style={{ 'display': 'grid' }} >
            {list}
        </div>
    )
}

export default PlaceList;