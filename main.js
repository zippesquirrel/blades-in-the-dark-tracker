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

function buttonUpdate(first){

    let coinInt = localStorage.getItem("intPlayerCoin");
    const coin1 = document.getElementById("coin-1");
    const coin2 = document.getElementById("coin-2");
    const coin3 = document.getElementById("coin-3");
    const coin4 = document.getElementById("coin-4");
    const coinArray = [coin1,coin2,coin3,coin4]

    if (first){
        if  (coinInt == 1) {
        store("intPlayerCoin",0)
        } 
        else {
        store("intPlayerCoin",1)
        }
    }
    coinInt = localStorage.getItem("intPlayerCoin")
    if (coinInt!== 0){
        for (i=0;i<coinInt;i++){
        coinArray[i].style.backgroundColor="#f7c41c"
    };
    }

    // e.style.background-color = "40px";
    for (i=coinInt;i<=3;i++){
        coinArray[i].style.backgroundColor="#b3b3b3"
    };
};
buttonUpdate();
// iterate over storage, setting where not null
for (let i = 0; i < localStorage.length; i++){
    const reg = /(?:str)/;
    let activeKey = localStorage.key(i);
    let activeValue = localStorage.getItem(activeKey);
    // console.log(activeKey)
    // console.log(activeValue)

    // if previous storage exists, use it
    console.log(reg.test(activeKey.toString()));
    //string input handling
    if(activeValue !== null && reg.test(activeKey.toString())) {
        console.log(`${activeKey}-input`);
        console.log(document.getElementById(`${activeKey}-input`));
        document.getElementById(`${activeKey}-input`).value = localStorage.getItem(activeKey);
    };
};

