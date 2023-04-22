import "./index.css";
import React from "react";

const colorUserDict = {};

// TODO: There is a bug with this, where the peers color do not match
function UserList(props) {

    console.log("userList: ", props.userList);
    for (const name of props.userList) {
        if (!(name in colorUserDict)) {
            colorUserDict[name] = Math.floor(Math.random() * 16777215).toString(16);
        }
    }
    console.log(colorUserDict);
    return (
    <div class="namelist-container">
        { props.userList.map((object) => 
            <div class="name-container"> 
                <div class="name-circle" style={{backgroundColor:"#"+colorUserDict[object.name],
                                                 alignItems: "center"}}/>
                <p class="name"> {object.name} </p> 
            </div>
          ) 
        }
    </div>
    );
}
        

export default UserList;