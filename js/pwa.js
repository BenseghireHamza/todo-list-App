const App = {
  defferredInstall:null,
  init(){
    if('serviceWorker' in navigator){
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then(regester =>{
                console.log("yes of course the seriveWorker are regetser");
             }).catch(err =>{
                 console.log(err);
             })
           });

           window.addEventListener('beforeinstallprompt', (event) =>{

            event.preventDefault();

            App.defferredInstall = event;
        })

        const btnInstall = document.querySelector('.btnInstall');
        btnInstall.addEventListener('click', App.StartChromeInstall);

        }
  },
     StartChromeInstall(){
          App.defferredInstall.prompt();
       
   },
}

document.addEventListener('DOMContentLoaded',App.init);