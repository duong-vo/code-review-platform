import "./index.css";
import React from "react";


function UserList(props) {

    console.log("userList: ", props.userList);
    return (
    <div class="name-container">
        { props.userList.map((name) => <div class="name"> {name} </div>) }
    </div>
    );
}
        

export default UserList;