import "./index.css";
import React from "react";

const colorUserDict = {};

// TODO: There is a bug with this, where the peers color do not match
function UserList(props) {

    for (const name of props.userList) {
        if (!(name in colorUserDict)) {
            colorUserDict[name] = Math.floor(Math.random() * 16777215).toString(16);
        }
    }
    console.log(colorUserDict);
    return (
        <div class="namelist-container">
            {props.userList.map((userObject) =>
                <div class="name-container">
                    <div class="name-circle" style={{
                        backgroundColor: "#" + colorUserDict[userObject.name],
                        alignItems: "center"
                    }} />
                    <p class="name"> {userObject.name} </p>
                </div>
            )}
        </div>
    );
}


export default UserList;