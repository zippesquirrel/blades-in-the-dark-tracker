const intKeys = ["intPlayerCoin","intPlayerStress","intPlayerTrauma"];

for (i = 0; i< intKeys.length;i++){
    console.log(intKeys[i]);
    console.log(i);
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

//coin intial position
const coinArray = createButtonArray("coin",4);
const stressArray = createButtonArray("stress",9);
const traumaArray = createButtonArray("trauma",4);

buttonDisplay(coinArray,localStorage.getItem("intPlayerCoin"));
buttonDisplay(stressArray,localStorage.getItem("intPlayerStress"));
buttonDisplay(traumaArray,localStorage.getItem("intPlayerTrauma"));


