function Beautify() {
    // open window to select window 
    document.getElementById("input_file").click();
    // whenever new file is selected fun below code
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
            for (const key in data_obj) {
                document.getElementById("chat").innerHTML += `<div class="c_msg">${key}</div>`;

                for (let i in data_obj[key]) {
                    try{
                    let temp = data_obj[key][i];
                    let time_split = temp.split(" - ");
                    let name_msg = time_split[1].split(": ");
                    if(name_msg[1].includes("<Media omitted>")){
                        name_msg[1] = "{Media omitted}";
                    }
                    if (user == "") {
                        user = name_msg[0];
                        document.getElementById("chat").innerHTML += `
                        <div class="l_msg">
                            <div class="left">Hey ${user}, this side</div><span></span>
                        </div>
                        `
                    }
                    if (user == name_msg[0]) {
                        // insert msg left 
                        document.getElementById("chat").innerHTML += `
                        <div class="l_msg">
                            <div class="left">${name_msg[1]}</div><span>${time_split[0]}</span>
                        </div>
                        `
                    } else {
                        // insert msg right 
                        document.getElementById("chat").innerHTML += `
                        <div class="r_msg">
                            <div class="right">${name_msg[1]}</div><span>${time_split[0]}</span>
                        </div>
                        `;
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