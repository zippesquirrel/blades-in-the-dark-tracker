
const intKeys = ["intPlayerCoin","intPlayerStress","intPlayerTrauma"];
for (i = 0; i< intKeys.length;i++){
    if (localStorage.getItem(intKeys[i])== null){
        store(intKeys[i],0);
    };
};

// initially borrowed from https://stackoverflow.com/a/37965346
// keep the contents of the input in local storage at key, called by input onkeydown

function store(key,e) {
    const type = typeof e;
    // if an HTML object, set value to its value
    if (type == "object"){
        localStorage.setItem(key, e.value);
    //if a number or string, set the value to whatever it is
    } else if (type == "number" || type == "string"){
        localStorage.setItem(key, e);
    };
};

function createClock(parentId,id,size){

    // initial exception handling
    if (typeof(size)!=="number"){
        console.log(`Clock size ${size} is not a number!`);
        return;
    };
    if (document.getElementById(id)!==null){
        console.log("An element with that id already exists!")
        return;
    }


    if (localStorage.getItem("int"+id)==null){
        store("int"+id,0)
    }
    let localInt = parseInt(localStorage.getItem("int"+id));

    const parent = document.getElementById(parentId)
    const clockDiv = document.createElement("div")
    
    // Source - https://stackoverflow.com/a/17251714
    // Posted by joelmdev, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-30, License - CC BY-SA 3.0
    const sliceWidth = Math.tan(Math.PI/size)

    // pie slices
    var div = 360 / size;
    var radius = 5;
    var parentdiv = clockDiv
    var xOffset = 20
    var yOffset = 80
    for (var i = 1; i <= size; ++i) {
        var childdiv = document.createElement('div');
        childdiv.classList.add("pie","inactive")
        childdiv.style.position = 'absolute';
        var x = Math.sin(((div * i)-div) * (Math.PI / 180)+(Math.PI/size)) * radius;
        var y = -Math.cos(((div * i)-div) * (Math.PI / 180)+(Math.PI/size)) * radius;
        childdiv.id = `${id}-${i}`
        childdiv.style.top = (y + yOffset).toString() + "px";
        childdiv.style.left = (x + xOffset).toString() + "px";
        childdiv.style.rotate = (-Math.atan2(x,y)*(180/Math.PI)-90).toString()+"deg";
        childdiv.style.clipPath = `polygon(0% ${100*(0.5-sliceWidth/2)}%, 0% ${100*(0.5+sliceWidth/2)}%, 50% 50%)`;
        parentdiv.appendChild(childdiv);
    }
    
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("clock-button-div");

    const heading = document.createElement("h2")
    heading.classList.add("clock-heading")
    heading.innerText=id
    clockDiv.appendChild(heading)
    clockDiv.appendChild(buttonDiv)
    clockDiv.id = id
    clockDiv.classList.add("clock-parent-div")
    parent.insertAdjacentElement("beforeend",clockDiv)
    
    window[id+"Array"] = createObjectArray(id,size)

    const buttonUp = document.createElement("button");
    buttonUp.id=id+"-up"
    const buttonDn = document.createElement("button");
    buttonDn.id=id+"-dn"
    const buttonRm = document.createElement("button");
    buttonRm.id=id+"-rm"
    
    // create buttons for increase, decrease, delete

    buttonUp.classList.add("button-up","clock-button");
    buttonUp.textContent="⬆️";
    buttonUp.onclick = ()=>{
        localInt = parseInt(localStorage.getItem("int"+id));
        if (localInt<size){
            buttonUpdate('int'+id,window[id+"Array"],localInt+1)
        } else{
            buttonUpdate('int'+id,window[id+"Array"],0)
        }
    }
    buttonDiv.appendChild(buttonUp);
    buttonDn.classList.add("button-dn","clock-button");
    buttonDn.textContent="⬇️";
    buttonDn.onclick = ()=>{
        localInt = parseInt(localStorage.getItem("int"+id));
        if (localInt>0){
            buttonUpdate('int'+id,window[id+"Array"],localInt-1);
        } else {
            buttonUpdate('int'+id,window[id+"Array"],size);
        };
    };
    buttonDiv.appendChild(buttonDn);
    buttonRm.classList.add("button-rm","clock-button");
    buttonRm.textContent="💀";
    buttonRm.onclick = ()=>{
        let proceed = confirm(`Are you sure you want to delete ${id}?`);
        if (proceed){
            localStorage.removeItem('int'+id);
            clockDiv.replaceChildren();
            clockDiv.remove();
        };
    };
    buttonDiv.appendChild(buttonRm);

    buttonDisplay(window[id+"Array"],localInt)
};

function createObjectArray(id,count){
    let objectArray = new Array;
    for (i=1;i<=count;i++){
        objectArray.push(document.getElementById(`${id}-${i}`));
    };
    return objectArray;
};

function buttonDisplay(objectArray,int){
    if (int!== 0){
        for (i=0;i<int;i++){
            objectArray[i].classList.replace('inactive','active')
        };
    };
    for (i=int;i<=(objectArray.length-1);i++){
        objectArray[i].classList.replace('active','inactive');
    };
};

function buttonUpdate(key,objectArray, index){

    let storedInt = localStorage.getItem(key);

    //exception handling
    if (storedInt==null){
        console.log(`Key "${key}" has no value!`);
        return;
    };

    if (index==1){
        if  (storedInt == 1) {
        store(key,0);
        }
        else {
        store(key,1);
        };
    } else {
        store(key,index);
    };

    //store new value
    storedInt = localStorage.getItem(key);
    
    // update the appearance of the buttons
    buttonDisplay(objectArray,storedInt);

};

// iterate over storage, setting where not null
for (let i = 0; i < localStorage.length; i++){
    const reg = /(?:str)/;
    let activeKey = localStorage.key(i);
    let activeValue = localStorage.getItem(activeKey);

    // if previous storage exists, use it

    //string input handling with regex
    if(activeValue !== null && reg.test(activeKey.toString())) {
        document.getElementById(`${activeKey}-input`).value = localStorage.getItem(activeKey);
    };
};

//coin intial position
const coinArray = createObjectArray("coin",4);
const stressArray = createObjectArray("stress",9);
const traumaArray = createObjectArray("trauma",4);

buttonDisplay(coinArray,localStorage.getItem("intPlayerCoin"));
buttonDisplay(stressArray,localStorage.getItem("intPlayerStress"));
buttonDisplay(traumaArray,localStorage.getItem("intPlayerTrauma"));

createClock("clock-grid","bob",4,)
createClock("clock-grid","tom",6,)
createClock("clock-grid","joe",8,)