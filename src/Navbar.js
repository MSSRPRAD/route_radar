import React, { useState } from 'react';

const Navbar = ({ list, categoryHandler }) => {

    const onClickHandler = (id) => {
        categoryHandler(id)
    }
    return (
        <div className="Navbar">
            <h3>Select Emergency:</h3>
            {list.map((item) => {
                return <button key={item.id} onClick={onClickHandler}> {item.name}</button>
            })
            }
        </div>
    );
};

export default Navbar;
