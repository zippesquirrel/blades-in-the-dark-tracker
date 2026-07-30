const sliceAngle = [1,0.57735,0.414213]

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

function createButtonArray(id,count){
    let buttonArray = new Array;
    for (i=1;i<=count;i++){
        buttonArray.push(document.getElementById(`${id}-${i}`));
    };
    return buttonArray;
};

function buttonDisplay(objectArray,int){
    if (int!== 0){
        for (i=0;i<int;i++){
            objectArray[i].classList.replace('inactive','active')
        };
    };

    for (i=int;i<=(objectArray.length-1);i++){
        objectArray[i].classList.replace('active','inactive')
    };
}
;
function buttonUpdate(key,objectArray, index,primary, secondary){

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
    buttonDisplay(objectArray,storedInt,primary,secondary);

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

function createClock(parentId,size,id){
    // initial exception handling
    if (typeof(size)!=="number"){
        console.log(`Clock size ${size} is not a number!`);
        return;
    };
    if (size%2!==0||size<4||8<size){
        console.log("Clock size is not 4,6 or 8")
        return;
    };
    const parent = document.getElementById(parentId)
    const clockDiv = document.createElement("div")
    
    // Source - https://stackoverflow.com/a/17251714
    // Posted by joelmdev, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-30, License - CC BY-SA 3.0
    const sliceWidth = sliceAngle[(size-4)/2]

    // pie slices
    var div = 360 / size;
    var radius = 5;
    var parentdiv = clockDiv
    var offsetToParentCenter = 0;//parseInt(parentdiv.offsetWidth / 2); //assumes parent is square
    var offsetToChildCenter = 0;
    var totalOffset = offsetToParentCenter - offsetToChildCenter;
    for (var i = 1; i <= size; ++i) {
        var childdiv = document.createElement('div');
        childdiv.classList.add("div2","inactive")
        childdiv.style.position = 'absolute';
        var x = Math.sin((div * i) * (Math.PI / 180)+(Math.PI/size)) * radius;
        var y = Math.cos((div * i) * (Math.PI / 180)+(Math.PI/size)) * radius;
        childdiv.id = `${id}-${i}`
        childdiv.style.top = (y + totalOffset).toString() + "px";
        childdiv.style.left = (x + totalOffset).toString() + "px";
        childdiv.style.rotate = (-Math.atan2(x,y)*(180/Math.PI)-90).toString()+"deg";
        childdiv.style.clipPath = `polygon(0% ${100*(0.5-sliceWidth/2)}%, 0% ${100*(0.5+sliceWidth/2)}%, 50% 50%)`
        parentdiv.appendChild(childdiv);
    }
    
    const buttonDiv = document.createElement("div")
    buttonDiv.classList.add("clock-button-div")
    const buttonUp = document.createElement("button")
    const buttonDn = document.createElement("button")
    const buttonRm = document.createElement("button")

    buttonUp.classList.add("button-up","clock-button")
    buttonUp.textContent="⬆️"
    buttonUp.oninput = "buttonUpdate('intPlayerTrauma',traumaArray,1)"
    buttonDiv.appendChild(buttonUp)
    buttonDn.classList.add("button-dn","clock-button")
    buttonDn.textContent="⬇️"
    buttonDiv.appendChild(buttonDn)
    buttonRm.classList.add("button-rm","clock-button")
    buttonRm.textContent="💀"
    buttonDiv.appendChild(buttonRm)


    

    clockDiv.appendChild(buttonDiv)
    clockDiv.id = id
    clockDiv.classList.add("clock-parent-div")
    parent.insertAdjacentElement("beforeend",clockDiv)
};





//coin intial position
const coinArray = createButtonArray("coin",4);
const stressArray = createButtonArray("stress",9);
const traumaArray = createButtonArray("trauma",4);

buttonDisplay(coinArray,localStorage.getItem("intPlayerCoin"));
buttonDisplay(stressArray,localStorage.getItem("intPlayerStress"));
buttonDisplay(traumaArray,localStorage.getItem("intPlayerTrauma"));

createClock("clock-div",6,"bob")