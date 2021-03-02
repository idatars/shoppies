import React from 'react';
import searchicon from './searchicon.svg';

const placeholders = ["What are your favourite films?", "What films would you recommend to your friends?", "What films are award-worthy?", "What is your underrated favourite?"]

export function Search(props) {
    return (
        <div id="search">
            <span><img src={searchicon} alt="search icon" id="searchicon"></img></span>
            <input type="text" value={props.value} onChange={props.onChange} placeholder="Search"/*{placeholders[Math.floor(Math.random() * placeholders.length)]}*//>
        </div>
    )
}

