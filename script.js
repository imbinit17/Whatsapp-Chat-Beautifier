let names = [] ;

let link_info = [] ;

let media = {
    'default': 'default.jpg'
};

let media_info = {
    'default': 'NA'
}

function isLink(msg)
{
    let arr = msg.split(" ") ;
    var bool = false ;
    // console.log(arr) ;
    let newMsg = "" ;
    for (let i = 0; i < arr.length; i++) {
        try {
            new URL(arr[i]);
            newMsg += `<a href="${arr[i]}" target="_blank">${arr[i]}</a> `;
            bool = true ;
        } catch (err) {
            newMsg += arr[i] + " ";
        }
    }
    
    let result = [newMsg.trim(),bool] ;
    return result ;
}

function addLinks(msg,date_time_info)
{
    let link_card = document.createElement('div');
    link_card.className = "link-card";
    link_card.innerHTML = `${msg} <span>${date_time_info}</span>` ;

    // console.log(msg) ;
    link_info.push(link_card);
}


function attachMediaInfo(name,info)
{
    media_info[name] = info;
}


function getCorrespondingProfilePic(name){
    if(name in media){
        return media[name];
    }
    else{
        return 'default.jpg';
    }
}

function checkName(name,bool){
    if (!names.includes(name) && bool==true )
        names.push(name) ;

    if(names.includes(name) && bool==false)
        return true ;
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
    let you_name = document.getElementById("nameOnRight").value ;
    
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
        

        // console.log(file.name)
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
            // console.log(data_obj);

            let newElement = document.createElement('div');
            newElement.className = "navbar";
            newElement.innerHTML = `<ul>
                    <li id="home" onClick="switchTab('home')">HOME</li>
                    <li id="people" onClick="switchTab('people')">PEOPLE</li>
                    <li id="medias" onClick="switchTab('medias')">MEDIA</li>
                    <li id="links" onClick="switchTab('links')">LINKS</li>
                </ul>` ;
            document.getElementById('chat_head').append(newElement);

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

                    //removing <> to make sure HTML element is not triggered


                    if(time_split[1].includes("<This message was edited>"))
                    {
                        time_split[1] = time_split[1].replace("<This message was edited>","{This message was edited}") ;
                        console.log(time_split[1]) ;
                    }

                    //creating date_time info for a chat_id
                    let date_time_info = `${key} ${time_split[0]}`;
                    
                    let name_msg = time_split[1].split(": ");

                    if(name_msg[1].includes("<Media omitted>")){
                        name_msg[1] = "{Media omitted}";
                    }

                    checkName(name_msg[0],true);
                    
                    if (name_msg[0]!=you_name) 
                    {
                        // insert msg left 

                        image_src = getCorrespondingProfilePic(name_msg[0]);

                        if(name_msg[1].includes("(file attached)"))
                        {
                            let file = name_msg[1].split(" (file attached)")[0];
                            let file_name = file.split(".")[0];

                            //storing data of media into media_info
                            attachMediaInfo(file_name,date_time_info);

                            let file_extension = file.split(".")[1];
                            let msg = name_msg[1].split(" (file attached)")[1];

                            if(msg==undefined)
                            msg = ' ' ;

                            let result = isLink(msg) ;
                            msg = result[0] ;

                            if(result[1]==true)
                            addLinks(msg,date_time_info);


                            if(file_extension=='jpg' || file_extension=='jpeg' || file_extension=='png' || file_extension=='gif'){
                                let newElement = document.createElement('div');
                                newElement.className = "l_msg";
                                newElement.innerHTML = `
                                    <div class="media"><img src=${media[file_name]} alt="media"><div class="left">${msg}</div><span>${time_split[0]}</span></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='mp4') {
                                let newElement = document.createElement('div');
                                newElement.className = "l_msg";
                                newElement.innerHTML = `
                                    <div class="media"><video src=${media[file_name]} controls></video>$<div class="left">${msg}</div><span>${time_split[0]}</span></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='pdf') {
                                let newElement = document.createElement('div');
                                newElement.className = "l_msg";
                                newElement.innerHTML = `
                                <img src='pdf.png' alt='PDF'>
                                    <div class="media"><a href=${media[file_name]} target="_blank">Open PDF :${file_name}</a>$<div class="left">${msg}</div><span>${time_split[0]}</span></div>
                                `
                                chatDiv.append(newElement);
                            }
                        }

                        else{
                            let newElement = document.createElement('div');
                            newElement.className = "left-msg";

                            let result = isLink(name_msg[1]) ;
                            name_msg[1] = result[0] ;

                            if(result[1]==true)
                            addLinks(name_msg[1],date_time_info);
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

                            //storing data of media into media_info
                            attachMediaInfo(file_name,date_time_info);

                            let file_extension = file.split(".")[1];
                            let msg = name_msg[1].split(" (file attached)")[1];

                            if(msg==undefined)
                            msg = ' ' ;

                            let result = isLink(msg) ;
                            msg = result[0] ;

                            if(result[1]==true)
                            addLinks(msg,date_time_info);

                            if(file_extension=='jpg' || file_extension=='jpeg' || file_extension=='png' || file_extension=='gif'){
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                    <div class="media"><img src=${media[file_name]} alt="media"><div class="right">${msg}</div><span>${time_split[0]}</span></div>
                                `;
                                
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='mp4') {
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                    <div class="media"><video src=${media[file_name]} controls></video>${msg}<div class="right">${msg}</div><span>${time_split[0]}</span></div>
                                `;
                                chatDiv.append(newElement);
                            }
                            else if(file_extension=='pdf') {
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";
                                newElement.innerHTML = `
                                <img src='pdf.png' alt='PDF'>
                                    <div class="media"><a href=${media[file_name]} target="_blank">Open PDF :${file_name}</a><div class="right">${msg}</div><span>${time_split[0]}</span></div>
                                `;
                                chatDiv.append(newElement);
                            }
                        }
                        else{
                                let newElement = document.createElement('div');
                                newElement.className = "r_msg";

                                let result = isLink(name_msg[1]) ;
                                name_msg[1] = result[0] ;

                                if(result[1]==true)
                                addLinks(name_msg[1],date_time_info);
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

                let elementChatDiv = document.getElementsByClassName("chat_head")[0] ;
                if(names.length>2)
                elementChatDiv.innerHTML = "Whatsapp Group Chat" ; ;
        
            elementChatDiv.style = "margin-bottom:10px" ;
            
            
            await sleep(100);
        }
        // hide loader
        document.getElementsByClassName("loader")[0].style = "display: none";
        
        
        //calling other functions 
        PeopleDisplay(document);
        mediaDisplay(document);
        linksDisplay(document);
        
        //by default show home tab
        // tabHome();
        switchTab('home');
        let elm = document.getElementById('chat_head') ;
        elm.style.position= "fixed" ;  
        console.log('here')  
        }
    }
}

function switchTab(tabName) {
    const tabToContentMap = {
        home: 'chat',
        people: 'people',
        medias: 'medias',
        links: 'links'
    };

    const tabs = Object.keys(tabToContentMap);
    const contents = Object.values(tabToContentMap);

    // console.log(`${tabName}`);

    tabs.forEach(tab => {
        const tabElement = document.getElementById(tab);
        if (tabElement) {
            if (tab === tabName) {
                tabElement.style.backgroundColor = 'white';
                tabElement.style.color = 'rgb(43, 12, 117)';
                // console.log(`Activated : ${tab}`);
            } else {
                tabElement.style.backgroundColor = 'inherit';
                tabElement.style.color = 'white';
                // console.log(`Deactivated ${tab}`);
            }
        } else {
            // console.log(`${tab} not found..`);
        }
    });

    contents.forEach(content => {
        const contentElement = document.getElementsByClassName(content)[0];
        if (contentElement) {
            if (content === tabToContentMap[tabName]) {
                contentElement.style.display = 'flex';
                // console.log(`Displaying ${content}`);
            } else {
                contentElement.style.display = 'none';
                // console.log(`Display None : ${content}`);
            }
        } else {
            // console.log(`not found ${content}`);
        }
    });
}

function PeopleDisplay(document)
{
    let peopleDiv = document.createElement('div');
    peopleDiv.className = "people";
    peopleDiv.innerHTML=`<h1>People in this Conversation</h1>` ;
    
    for (var i=0;i<names.length;i++){
        {
            let people_card = document.createElement('div');
            people_card.className = "people-card";
            let image_src = getCorrespondingProfilePic(names[i]);
            people_card.innerHTML = `<div class="profile-pic">
                                <img src="${image_src}" alt="">
                            </div> 
                                <div class="people-name">${names[i]}</div>`;
            peopleDiv.append(people_card);

        }
    document.getElementById('screen').append(peopleDiv);
    }
}

function mediaDisplay(document)
{
    let mediaDiv = document.createElement('div');
    mediaDiv.className = "medias";
    // mediaDiv.innerHTML=`<h1>Media in this Conversation</h1>` ;
    
    for (var key in media){
        {
            if(key!='default' && checkName(key,false)!=true)
            {
                let media_card = document.createElement('div');
                media_card.className = "media-card";

                if(media[key].includes("video"))
                {
                    media_card.innerHTML = `<video src="${media[key]}" controls></video>${media_info[key]}`;
                    mediaDiv.append(media_card);
                }

                else
                {
                    media_card.innerHTML = `<img src="${media[key]}" alt="${key}">${media_info[key]}`;
                    mediaDiv.append(media_card);
                }
            }
        }
    document.getElementById('screen').append(mediaDiv);
    }
}

function linksDisplay(document)
{
    let linksDiv = document.createElement('div');
    linksDiv.className = "links";
    linksDiv.innerHTML=`<h1>Links in this Conversation</h1>` ;
    
    for (var i=0;i<link_info.length;i++){
        {
            linksDiv.append(link_info[i]);
        }
    document.getElementById('screen').append(linksDiv);
    }
}

function sleep(ms) {
return new Promise(
resolve => setTimeout(resolve, ms)
);
}