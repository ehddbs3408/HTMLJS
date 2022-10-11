const btn = document.querySelector("#btnRand");

        btn.addEventListener("click",e=>{
            let ratio = Math.random();
            if(ratio< 0.5)
            {
                alert("예!동윤이는 졸꺼에요");
            }
            else
            {
                alert("안뇨 동윤이는 안졸아요!");
            }
        })