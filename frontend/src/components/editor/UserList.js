import "./index.css";
import React from "react";

const colorUserDict = {};
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
        { props.userList.map((name) => 
            <div class="name-container"> 
                <div class="name-circle" style={{backgroundColor:"#"+colorUserDict[name],
                                                 alignItems: "center"}}/>
                <p class="name"> {name} </p> 
            </div>
          ) 
        }
    </div>
    );
}
        

export default UserList;