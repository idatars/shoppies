import React from 'react';
import searchicon from './searchicon.svg';

export function Search(props) {
    return (
        <div id="search">
            <span><img src={searchicon} alt="search icon" id="searchicon"></img></span>
            <input type="text" value={props.value} onChange={props.onChange} />
        </div>
    )
}

