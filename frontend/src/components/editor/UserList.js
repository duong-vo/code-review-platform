import "./index.css";
import React from "react";


// TODO: There is a bug with this, where the peers color do not match
function UserList(props) {


    return (
        <div class="namelist-container">
            {props.userList.map((userObject) =>
                <div class="name-container">
                    <div class="name-circle" style={{
                        backgroundColor: "#" + userObject.colorHash,
                        alignItems: "center"
                    }} />
                    <p class="name"> {userObject.name} </p>
                </div>
            )}
        </div>
    );
}


export default UserList;