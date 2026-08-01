
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
        console.log(`Clock size ${size} for id ${id} is not a number!`);
        return;
    };
    if (size<2){
        alert(`${id} has too small of a size!`)
        return;
    };
    if (document.getElementById("clock-"+id)!==null){
        console.log("An element with that id already exists!")
        return;
    };


    if (localStorage.getItem("intClock"+size+"-"+id)==null){
        store("intClock"+size+"-"+id,0)
    }
    let localInt = parseInt(localStorage.getItem("intClock"+size+"-"+id));

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
    var yOffset = 20
    for (var i = 1; i <= size; ++i) {
        var childdiv = document.createElement('div');
        childdiv.classList.add("pie","inactive")
        childdiv.style.position = 'absolute';
        var x = Math.sin(((div * i)-div) * (Math.PI / 180)+(Math.PI/size)) * radius;
        var y = -Math.cos(((div * i)-div) * (Math.PI / 180)+(Math.PI/size)) * radius;
        childdiv.id = `clock-${id}-${i}`
        childdiv.style.bottom = (-y + yOffset).toString() + "px";
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
    clockDiv.id = "clock-"+id
    clockDiv.classList.add("clock-parent-div")
    parent.insertAdjacentElement("beforeend",clockDiv)
    
    window[id+"ClockArray"] = createObjectArray("clock-"+id,size)

    const buttonUp = document.createElement("button");
    buttonUp.id="clock-"+id+"-up"
    const buttonDn = document.createElement("button");
    buttonDn.id="clock-"+id+"-dn"
    const buttonRm = document.createElement("button");
    buttonRm.id="clock-"+id+"-rm"
    
    // create buttons for increase, decrease, delete

    buttonUp.classList.add("button-up","clock-button");
    buttonUp.textContent="⬆️";
    buttonUp.onclick = ()=>{
        localInt = parseInt(localStorage.getItem("intClock"+size+"-"+id));
        if (localInt<size){
            buttonUpdate('intClock'+size+"-"+id,window[id+"ClockArray"],localInt+1)
        } else{
            buttonUpdate('intClock'+size+"-"+id,window[id+"ClockArray"],0)
        }
    }
    buttonDiv.appendChild(buttonUp);
    buttonDn.classList.add("button-dn","clock-button");
    buttonDn.textContent="⬇️";
    buttonDn.onclick = ()=>{
        localInt = parseInt(localStorage.getItem("intClock"+size+"-"+id));
        if (localInt>0){
            buttonUpdate('intClock'+size+"-"+id,window[id+"ClockArray"],localInt-1);
        } else {
            buttonUpdate('intClock'+size+"-"+id,window[id+"ClockArray"],size);
        };
    };
    buttonDiv.appendChild(buttonDn);
    buttonRm.classList.add("button-rm","clock-button");
    buttonRm.textContent="💀";
    buttonRm.onclick = ()=>{
        let proceed = confirm(`Are you sure you want to delete ${id}?`);
        if (proceed){
            localStorage.removeItem('intClock'+size+"-"+id);
            clockDiv.replaceChildren();
            clockDiv.remove();
        };
    };
    buttonDiv.appendChild(buttonRm);

    buttonDisplay(window[id+"ClockArray"],localInt);
};

function userCreateClock(size){
    let id = prompt("Clock name:");
    // user presses escape/cancel
    if (id==null){return};
    if (id==""){
        // if no name given, name it 'clock n' where n is the number of existing clocks plus 1
        id = "Clock "+(document.getElementsByClassName("clock-parent-div").length+1).toString();
    };
    createClock("clock-grid",id,size);
};

function updateCustomClock(val){
    const sizeElement = document.getElementById("custom-clock-size");
    const sizeInt = parseInt(sizeElement.innerText);
    if (sizeInt>2 || val >= 0){
        sizeElement.innerText=sizeInt+val;
    };
};

function updateClocks(){
    // Source - https://stackoverflow.com/a/9645447
    // Posted by Ivan Krechetov, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-31, License - CC BY-SA 4.0
    const removeRegex = /.*?(?=\d)/;
    const keyArray = Object.keys(localStorage).sort((a, b) => a.replace(removeRegex,"").localeCompare(b.replace(removeRegex,""), 'en', {'sensitivity': 'base'}));
    let clockArray = new Array;
    for (i in keyArray){
        if (keyArray[i].slice(0,8)=="intClock"){
            clockArray.push(keyArray[i]);
        };
    };

    for (i in clockArray){
        const targetClock = clockArray[i];
        const size = parseInt(targetClock.match(/(?!=clock)\d+/gm));

        
        const remove = targetClock.slice(3,9);
        const targetClockId=targetClock.slice(3).replace(remove,"clock");
        const targetClockName = targetClockId.match(/(?<=-).*/gm);
  
        if (document.getElementById(targetClockId)==null){
            console.log("Creating clock "+targetClockName+" with size "+size);
            createClock("clock-grid",targetClockName,size);
        };
    };
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
            objectArray[i].classList.replace('inactive','active');
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

updateClocks()