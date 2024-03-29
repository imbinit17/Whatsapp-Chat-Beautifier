let media = {
    'default': 'default.jpg'
};

function getCorrespondingProfilePic(name){
    if(name in media){
        return media[name];
    }
    else{
        return 'default.jpg';
    }
}
       
function processMedia(){
    document.getElementById("input_media").click();

    document.getElementById("input_media").onchange = function () {
        let files = document.getElementById("input_media").files;
        let promises = [];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();

            let promise = new Promise((resolve, reject) => {
                reader.onloadend = function () {
                    let base64data = reader.result;                
                    let name = file.name.split(".")[0] ;
                    media[name] = base64data;
                    resolve();
                }
                reader.onerror = reject;
            });

            reader.readAsDataURL(file);
            promises.push(promise);
        }

        Promise.all(promises)
            .then(() => console.log('All files have been processed'))
            .catch((err) => console.error('An error occurred', err));
    }
}


function Beautify() {
    // open window to select window 
    document.getElementById("input_file").click();

    //get you_name
    let you_name = prompt("Enter the name of the user to be in the right")
    alert("Name entered (Case sensitive) :"+you_name)
    
    // whenever new file is selected run below code
    document.getElementById("input_file").onchange = function () {
        let file = document.getElementById("input_file").files[0];
        // filter to check if file is txt
        if (!(file.name.includes(".txt"))) {
            confirm("This file is not a text file")
            return;
        }
        // show loader and hide chats
        document.getElementsByClassName("loader")[0].style = "display: block";
        document.getElementById("chat").innerHTML = " ";
        document.getElementById("input_container").style = "display:none ";
        // document.getElementById("chat_head").innerHTML = " ";
        // document.getElementById("input_file").style="display:none" ;
        

        console.log(file.name)
        // read content of file 
        var file_reader = new FileReader();
        file_reader.readAsText(file);
        file_reader.onload = async function () {
            let content = file_reader.result;
            let c_arr = content.split("\n");
            if (c_arr[c_arr.length - 1] == "") c_arr.pop();
            // console.log(c_arr[2]);
            let data_obj = {};
            let date = "";
            // sort chats date wise 
            for (var i = 1; i < c_arr.length; ++i) {
                // if line is continuation of last line 
                // console.log(c_arr[i]);
                if (!(c_arr[i].includes(",") && c_arr[i].includes(":") && c_arr[i].includes("/"))) {
                    data_obj[date][data_obj[date].length - 1] = data_obj[date][data_obj[date].length - 1] + " " + (c_arr[i]);
                    continue;
                    // data_obj[date].push(c_arr[i].split(",")[1]);
                }
                let c_date = c_arr[i].split(",")[0];
                if (date != c_date) {
                    date = c_date;
                    data_obj[date] = [];
                    data_obj[date].push(c_arr[i].split(",")[1]);
                } else {
                    data_obj[date].push(c_arr[i].split(",")[1]);
                }
            }
            console.log(data_obj);
            // render chats in browser 
            let user = "";

            let chatDiv = document.getElementById('chat');

            for (const key in data_obj) {

                let newElement = document.createElement('div');
                newElement.className = "c_msg";
                newElement.innerHTML = `${key}` ;
                chatDiv.append(newElement);

                for (let i in data_obj[key]) {
                    try{
                    let temp = data_obj[key][i];
                    let time_split = temp.split(" - ");
                    let name_msg = time_split[1].split(": ");
                    if(name_msg[1].includes("<Media omitted>")){
                        name_msg[1] = "{Media omitted}";
                    }
                    
                    if (name_msg[0]!=you_name) 
                    {
                        // insert msg left 

                        image_src = getCorrespondingProfilePic(name_msg[0]);

                        if(name_msg[1].includes("(file attached)"))
                        {
                            let file = name_msg[1].split(" (file attached)")[0];
                            let file_name = file.split(".")[0];
                            let file_extension = file.split(".")[1];
                            let msg = name_msg[1].split(" (file attached)")[2];

                            if(msg==undefined)
                            msg = ' '

                            if(file_extension=='jpg' || file_extension=='jpeg' || file_extension=='png' || file_extension=='gif'){
                                let newElement = document.createElement('div');
                                newElement.className = "l_msg";
                                newElement.innerHTML = `
                                ${msg}
                                    <div class="media"><img src=${media[file_name]} alt="media"></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='mp4') {
                                let newElement = document.createElement('div');
                                newElement.className = "l_msg";
                                newElement.innerHTML = `
                                ${msg}
                                    <div class="media"><video src=${media[file_name]} controls></video></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='pdf') {
                                let newElement = document.createElement('div');
                                newElement.className = "l_msg";
                                newElement.innerHTML = `
                                <img src='pdf.png' alt='PDF'>
                                ${msg}
                                    <div class="media"><a href=${media[file_name]} target="_blank">Open PDF :${file_name}</a></div>
                                `
                                chatDiv.append(newElement);
                            }
                        }

                        else{
                            let newElement = document.createElement('div');
                            newElement.className = "left-msg";
                            newElement.innerHTML = `
                                <div class="profile-pic"><img src=${image_src} alt="profile pic"></div>
                                    <div class="l_msg">
                                        <div class="upper-section">${name_msg[0]}</div>
                                            <div class="left">
                                            ${name_msg[1]}
                                            </div>
                                       <span>${time_split[0]}</span>
                                </div>
                            ` ;
                            chatDiv.append(newElement);
                        }

                        // colorname = getCorrespondingColor(name_msg[0])
                        // document.getElementsByClassName("upper-section").style=`color: ${colorname}`;
                    }

                   
                    
                    else if(name_msg[0]==you_name) 
                    {
                        // insert msg right 

                        if(name_msg[1].includes("(file attached)"))
                        {
                            let file = name_msg[1].split(" (file attached)")[0];
                            let file_name = file.split(".")[0];
                            let file_extension = file.split(".")[1];
                            let msg = name_msg[1].split(" (file attached)")[2];

                            if(msg==undefined)
                            msg = ' '

                            if(file_extension=='jpg' || file_extension=='jpeg' || file_extension=='png' || file_extension=='gif'){
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                ${msg}
                                    <div class="media"><img src=${media[file_name]} alt="media"></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='mp4') {
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                ${msg}
                                    <div class="media"><video src=${media[file_name]} controls></video></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='pdf') {
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                ${msg}
                                <img src='pdf.png' alt='PDF'>
                                    <div class="media"><a href=${media[file_name]} target="_blank">Open PDF :${file_name}</a></div>
                                `;
                                chatDiv.append(newElement);
                            }
                        }
                        else{
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                    <div class="right">${name_msg[1]}</div><span>${time_split[0]}</span>
                                `;
                                chatDiv.append(newElement);
                        }
                    }
                    
                }catch(err){
                    console.log(data_obj[key][i]);
                    console.log(err.message);
                }

                }
                await sleep(100);
            }
            // hide loader
            document.getElementsByClassName("loader")[0].style = "display: none";

        }
    }
}

function sleep(ms) {
return new Promise(
resolve => setTimeout(resolve, ms)
);
}