document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("openInvite");

    if(btn){

        btn.addEventListener("click", () => {

            btn.innerHTML="Opening...";

            btn.style.transform="scale(.95)";

            setTimeout(()=>{

                window.location.href="invite.html";

            },700);

        });

    }

});
