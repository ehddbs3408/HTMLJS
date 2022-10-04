window.addEventListener("load", ()=> {
    let btn = document.querySelector("#btn")
    let toggle = false;
    let box = document.querySelector(".box");
            btn.addEventListener("click",()=>{
                if(toggle == false)
                {
                    box.classList.add("on")
                }
                else
                {
                    box.classList.remove("on")
                }
                toggle = !toggle;
                
            });
            let action = () => {
                btn.click();
            }
    
            let id = setInterval(action,200);
            console.log(id);
            
            let bt = document.querySelector("#bt");
            bt.addEventListener("click",()=>{
                clearInterval(id);
            });
});
