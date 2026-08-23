const add = document.getElementById("add-back");
const sample = document.getElementById("sample-back");
const title = document.getElementById("title");
const titleInput = document.getElementById("titleInput");
const create = document.getElementById("create");
const setting_title = document.getElementById("setting-back");
const ww = window.innerWidth;
const wh = window.innerHeight;
let clone_no = 0, mx = 0, my = 0, mxx = 0, myy = 0, x2 = 0, y2 = 0;
update();
sample.style.display = "none";

add.addEventListener("click", function () {
    clone_no++;
    title.style.display = "flex";
});

document.getElementById("create").onclick = function () {
    if(titleInput.value != "") {
    title.style.display = "none";
    add_element();
    update();
    } else {
        alert("タイトルを入力してください");
    }
}

document.getElementById("exit").onclick = function() {
    title.style.display = "none";
}

let folderHandle = null;
let fileHandle = null;
document.getElementById("open").addEventListener("click", async () => {
    folderHandle = await window.showDirectoryPicker();
    fileHandle = await folderHandle.getFileHandle("directory-structure.txt");
    load();
})
async function load() {
    const file = await fileHandle.getFile();
    const text = await file.text();
    if(text.trim() === "") {
        return;
    }
    const data = text.split(",");
    const select = document.getElementById("select");
    for(let i = 0; i < data.length/2; i++) {
        clone_no++;
        titleInput.value = data[2*i];
        select.value = data[2*i+1];
        add_element();
    }
    update();
}

function add_element() {
    const clone = sample.cloneNode(true);
    clone.id = `project_No${clone_no}`;
    clone.style.display = "block";
    const titles = clone.querySelector(".samples");
    titles.textContent = titleInput.value;
    const types = clone.querySelector(".types");
    const select = document.getElementById("select");
    types.textContent = select.options[select.selectedIndex].text;
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    clone.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    document.body.appendChild(clone)
    titleInput.value = "";
}

function update() {
    add.style.left = `${ww*0.14+ww*0.15*(clone_no%5)}px`;
    add.style.top = `${ww*0.05+ww*0.13*Math.floor(clone_no/5)}px`;
    for(let j = 0; j < clone_no; j++) {
        const clone_element = document.getElementById(`project_No${j+1}`);
        clone_element.style.left = `${ww*0.14+ww*0.15*(j%5)}px`;
        clone_element.style.top = `${ww*0.05+ww*0.13*Math.floor(j/5)}px`;
    }
}

async function writing(title) {
    if(!fileHandle) {
        alert("先にフォルダを選択してください");
        return;
    }
    const writable = await fileHandle.createWritable();
    await writable.write(title);
    await writable.close();
}

document.addEventListener("mousemove", (event) => {
    mx = event.clientX - ww*0.14;
    my = event.clientY - ww*0.05;
    mxx = mx%(ww*0.15);
    myy = my%(ww*0.13);
    if(mx%(ww*0.15) < ww*0.1 && mx > 0 && my%(ww*0.13) < ww*0.1 && my > 0) {
        x2 = Math.ceil(mx-mxx)/Math.ceil(ww*0.15)+1;
        y2 = Math.ceil(my-myy)/Math.ceil(ww*0.13)*5;
        if(x2+y2 <= clone_no) {
            const clone_element = document.getElementById(`project_No${x2+y2}`);
            if(clone_element) {
            clone_element.style.transform = "scale(0.95)";
            clone_element.onclick = async function () {
                if(clone_element.querySelector(".types").textContent == "2Dcad") {
                await writing(clone_element.querySelector(".samples").textContent);
                window.open("2Dcad/2Dcad.html", "_blank");
                clone_element.style.transform = "scale(1)";
                }
            }
    }
        }
    } else {
        const clone_element = document.getElementById(`project_No${x2+y2}`);
        if(clone_element) {
        clone_element.style.transform = "scale(1)";
        }
    }
})
