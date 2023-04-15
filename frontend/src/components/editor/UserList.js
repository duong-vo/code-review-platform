import "./index.css";
import React from "react";


function UserList(userList = []) {
    return (
    <div class="name-container">
        {userList.map((name) => <div class="name"> {name} </div>)}
    </div>
    );
}

export default UserList;