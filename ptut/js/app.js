$(document).ready(function(){

  //CHANGEMENTS FORMULAIRES 

  //Recupération des élements du formulaire
  var divReglageText = document.getElementById("reglagetextuel");
  var divReglageImage = document.getElementById("reglageimage");
  var nombreSymbole = document.getElementById("nbsymbole");
  var typeCarte = document.getElementById("typecarte");
  var divListMot = document.getElementById("listmot");
  var spanNbImages = document.getElementById("nbImages");
  var btnGenerer = document.getElementById("btnGenerer");
  var forme = document.getElementById("forme");
  var couleurCarte = document.getElementById("couleurCarte");
  var tailleTexte = document.getElementById("tailleTexte");
  var melangePolice = document.getElementById("melangePolice");
  var melangeMaj = document.getElementById("melangeMaj");
  var couleurTexte = document.getElementById("couleurTexte");
  var melangeCouleurTexte = document.getElementById("melangeCouleurTexte");
  var inputFile = document.getElementById("inputfile");
  var msgErrorInput = document.getElementById("inputerror");
  var nombreCarte = document.getElementById("nbcartes");
  var chckVersion = document.getElementById("checkFutureVersion");
  var divReglageFuture = document.getElementById("reglagenextversion");
  var chckmelange = document.getElementById("melangeCartes");

  //Gestion de la Popup d'erreur
  var closeBtn = document.getElementById("closeBtn");
  closeBtn.onclick = function(){
    togglePopup();
  }

  function togglePopup($msg){
    
    document.getElementById("popUpMsg").innerHTML = $msg;
    document.getElementById("popupErr").classList.toggle("active");
  }



  //Changements graphiques
  typeCarte.onchange = function(){
    var type = this[this.selectedIndex].text;

    if (type == 'Texte / Nombre') {
      divReglageImage.classList.add("invisible");
      divReglageText.classList.remove("invisible");
      divReglageFuture.classList.add("invisible");
      $("#forme").append('<option value="Circulaire">Circulaire</option>');
    }else{
      divReglageImage.classList.remove("invisible");
      divReglageText.classList.add("invisible");
      divReglageFuture.classList.add("invisible");
      $("#forme option[value='Circulaire']").remove();
    }
  };

  /*Checkbox version*/
  chckVersion.onchange = function(){
    if (chckVersion.checked == true) {
      divReglageFuture.classList.remove("invisible");
      divReglageImage.classList.add("invisible");
      divReglageText.classList.add("invisible");

      typeCarte.disabled = true;
      nombreCarte.disabled = true;
      nombreSymbole.disabled = true;

    }else{
      if (typeCarte.value == "Texte / Nombre") {
        divReglageImage.classList.add("invisible");
        divReglageText.classList.remove("invisible");
        divReglageFuture.classList.add("invisible");
      }else{
        divReglageImage.classList.remove("invisible");
        divReglageText.classList.add("invisible");
        divReglageFuture.classList.add("invisible");
      }
      typeCarte.disabled = false;
      nombreCarte.disabled = false;
      nombreSymbole.disabled = false;
    }
  }

  chckmelange.onchange = function(){
    if (chckmelange.checked == true) {
      tailleTexte.disabled = true;
    }else{
      tailleTexte.disabled = false;
    }
  }

  melangeCouleurTexte.onchange = function(){
    if (melangeCouleurTexte.checked == true) {
      couleurTexte.disabled = true;
    }else{
      couleurTexte.disabled = false;
    }
  }

  nombreSymbole.onchange = function(){
    //changement nombre de cartes max
    var nbCartesMax ;
    if(nombreSymbole.value == 4){
      nbCartesMax = 12;
    }else if(nombreSymbole.value == 5){
      nbCartesMax = 20;
    }else if(nombreSymbole.value == 6){
      nbCartesMax = 30;
    }else if(nombreSymbole.value == 7){
      nbCartesMax = 42;
    }else if(nombreSymbole.value == 8){
      nbCartesMax = 56;
    }

    nombreCarte.innerHTML = "";
    for(var i=nbCartesMax;i>=1;i--){
      nombreCarte.innerHTML += "<option value='" + i + "'>"+ i + "</option>";
    }

    //Changement nombre de mots
    var nvxNombreSymbole = this[this.selectedIndex].text;
    nbFormule = nvxNombreSymbole - 1;
    var nombreMot = (nbFormule*nbFormule) + nbFormule + 1;

    spanNbImages.innerHTML= "";
    spanNbImages.innerHTML = nombreMot;

    divListMot.innerHTML = "";
    for(var i=1; i<=nombreMot;i++){
      divListMot.innerHTML += "<input type='text' id='mot" +i +"' />";
    }

    if (nombreMot == inputFile.files.length) {
      msgErrorInput.classList.add("invisible");
    }else{
      msgErrorInput.classList.remove("invisible");
    }
  };

  inputFile.onchange = function(){
    var NombreSymbole = nombreSymbole.value;
    nbFormule = NombreSymbole - 1;
    var nombreImage = (nbFormule*nbFormule) + nbFormule + 1;

    if (nombreImage == inputFile.files.length) {
      msgErrorInput.classList.add("invisible");
    }else{
      msgErrorInput.classList.remove("invisible");
    }
  };

  var listeImg = [];
  //Prévi images lors de l'upload
  inputFile.addEventListener("change", function(){
    var divImg = document.getElementById("imgsprevi");
    divImg.innerHTML="";
    if(inputFile.files){
      for(i=0; i<inputFile.files.length; i++){
        var reader = new FileReader();

        reader.onload = function(event){
          var e = $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(divImg);
          e.attr('class',"imgprevi");
          listeImg.push(event.target.result);

        }
        reader.readAsDataURL(inputFile.files[i]);
      }
    }
  });

  //Click sur generer
  btnGenerer.onclick = genererKit;

  //Fonction generer

  function genererKit(){

    //Class

    //cas ou le kit est composé de texte

    if (chckVersion.checked == false) {
      function kitCarteText(){
        this.type = "Texte";
        this.nbSymbole = parseInt(nombreSymbole.value);
        this.forme = forme.value;
        this.couleurCarte = couleurCarte.value;
        this.tailleTexte = tailleTexte.value; 
        this.couleurTexte = couleurTexte.value;
        this.nbcartes = nombreCarte.value;
        this.listeMot = this.getListeMot();
      };

      kitCarteText.prototype.getListeMot = function(){
        var nbFormule = nombreSymbole.value -1 ;
        var nbMot = (nbFormule * nbFormule) + nbFormule +1;
        var listeMot = new Array();

        for(var i=1;i<=nbMot;i++){
          var inputmot = document.getElementById("mot"+i);
          if (inputmot.value == "") {
            togglePopup("Vous n'avez pas renseigné tous les mots demandés.");
            return;
          }
          listeMot[i-1] = inputmot.value;
        } 

        return listeMot;
      }
      
    }else{
      function kitCarteText(){
        this.type = "Texte";
        this.nbSymbole = 4;
        this.forme = forme.value;
        this.couleurCarte = couleurCarte.value;
        this.tailleTexte = tailleTexte.value;
        this.couleurTexte = couleurTexte.value;
        this.nbcartes = 12;
        this.listeMot = this.getListeMotFuture();
      };

      kitCarteText.prototype.getListeMotFuture = function(){
        var listeMot = new Array(13);
        for(var i=0;i<13;i++){
          listeMot[i] = new Array();
          var j = i+1;

          var mot1 = document.getElementById("th"+j+"m1").value;
          listeMot[i].push(mot1);
          var mot2 = document.getElementById("th"+j+"m2").value;
          listeMot[i].push(mot2);
          var mot3 = document.getElementById("th"+j+"m3").value;
          listeMot[i].push(mot3);
          var mot4 = document.getElementById("th"+j+"m4").value;
          listeMot[i].push(mot4);
          
        }
        return listeMot
      }
    }



    //cas ou le kit est composé d'images
    function kitCarteImage(){
      this.type = "Image";
      this.nbSymbole = parseInt(nombreSymbole.value);
      this.nbcartes = nombreCarte.value;
      this.listeImg = this.getListeImg();
      this.forme = forme.value;
      this.couleurCarte = couleurCarte.value;
    }

    kitCarteImage.prototype.getListeImg = function(){

      var nbFormule = nombreSymbole.value -1 ;
      var nbImg = (nbFormule * nbFormule) + nbFormule +1;
      for(var i=0;i<nbImg;i++){
        if (inputFile.files[i] == null) {
          togglePopup("Vous n'avez pas renseigné le bon nombre d'images.");
          return;
        }
      }
      return(listeImg);
    }

    //Création du kit

    var kit;
    var cartes;

    //Choix du type de kit
    if (typeCarte.value == 'Texte / Nombre' || chckVersion.checked == true) {
      kit = new kitCarteText();
      console.log(kit);
      if (chckVersion.checked == false){
        cartes = Carte2D(kit.nbcartes, kit.nbSymbole, kit.listeMot);
      }else{
        cartes = Carte2DVers(kit.nbcartes, kit.nbSymbole, kit.listeMot);
      }
      creationPDF(cartes, kit.nbSymbole, kit.nbcartes, kit.forme, kit.couleurCarte, kit.couleurTexte, kit.tailleTexte);
    }else{
      kit = new kitCarteImage();
      cartes = Carte2D(kit.nbcartes, kit.nbSymbole, kit.listeImg);
      creationPDFimg(cartes, kit.nbSymbole, kit.nbcartes, kit.forme, kit.couleurCarte);
    }

    //Lancement du pdf

  };

  function gen3Dto2D(tableau){
    var tab = new Array();
    var tmp = new Array();

    tmp[0] = tableau[0][0][0];
    tmp[1] = tableau[0][1][0];
    tmp[2] = tableau[0][2][0];
    tmp[3] = tableau[0][3][0];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[1][0][1];
    tmp[1] = tableau[1][1][1];
    tmp[2] = tableau[1][2][1];
    tmp[3] = tableau[1][3][1];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[2][0][2];
    tmp[1] = tableau[2][1][2];
    tmp[2] = tableau[2][2][2];
    tmp[3] = tableau[2][3][2];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[3][0][3];
    tmp[1] = tableau[3][1][3];
    tmp[2] = tableau[3][2][3];
    tmp[3] = tableau[3][3][3];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[4][0][1];
    tmp[1] = tableau[4][1][0];
    tmp[2] = tableau[4][2][0];
    tmp[3] = tableau[4][3][0];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[5][0][2];
    tmp[1] = tableau[5][1][0];
    tmp[2] = tableau[5][2][0];
    tmp[3] = tableau[5][3][0];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[6][0][3];
    tmp[1] = tableau[6][1][0];
    tmp[2] = tableau[6][2][0];
    tmp[3] = tableau[6][3][0];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[7][0][1];
    tmp[1] = tableau[7][1][2];
    tmp[2] = tableau[7][2][1];
    tmp[3] = tableau[7][3][1];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[8][0][2];
    tmp[1] = tableau[8][1][2];
    tmp[2] = tableau[8][2][1];
    tmp[3] = tableau[8][3][1];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[9][0][3];
    tmp[1] = tableau[9][1][2];
    tmp[2] = tableau[9][2][1];
    tmp[3] = tableau[9][3][1];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[10][0][1];
    tmp[1] = tableau[10][1][3];
    tmp[2] = tableau[10][2][3];
    tmp[3] = tableau[10][3][2];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[11][0][2];
    tmp[1] = tableau[11][1][3];
    tmp[2] = tableau[11][2][3];
    tmp[3] = tableau[11][3][2];
    tab.push(tmp);
    tmp = [];

    tmp[0] = tableau[12][0][3];
    tmp[1] = tableau[12][1][3];
    tmp[2] = tableau[12][2][3];
    tmp[3] = tableau[12][3][2];
    tab.push(tmp);
    tmp = [];

    return tab;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  
  function genererCartes(n,mots){
    var crds = [];
      for (var crd = 0; crd < n; crd++) {
          var symbols = [mots[0]];
          for (var sym = 1; sym < n; sym++) {
              symbols.push(mots[crd * (n-1) + sym]);
          }
          crds.push(symbols.slice());
      }

      for (var cat = 1; cat < n; cat++) {
          for (var crd = 0; crd < n-1; crd++) {
              var symbols = [mots[cat]];
              for (var sym = 1; sym < n; sym++) {
                  symbols.push(mots[1 + sym * (n-1) + ((cat-1) * (sym-1) + crd) % (n-1)]);
              }
              crds.push(symbols.slice());
          }
      }
      return crds;
  }

  function Carte2D(n, nbrMots, listeMots){
      var tableauCartes = genererCartes(nbrMots, listeMots);//Tableau à deux dimension avec toutes les cartes dedans
      var newTab = [];

      for (var i = 0; i <= n; i++){
          y = getRandomInt(0,tableauCartes.length);
          newTab.push(tableauCartes[y]);
          tableauCartes.splice(y, 1);
      }
      console.log(newTab);
      return newTab; 
  }

  function Carte2DVers(n, nbrMots, listeMots){
      var tableauCartes = genererCartes(nbrMots, listeMots);//Tableau à deux dimension avec toutes les cartes dedans
      var tableauCartesDef = gen3Dto2D(tableauCartes);
      var newTab = [];

      for (var i = 0; i <= n; i++){
          y = getRandomInt(0,tableauCartesDef.length);
          newTab.push(tableauCartesDef[y]);
          tableauCartesDef.splice(y, 1);
      }
      return newTab;
  }

function creationPDF(Tab, nbSymb, nbcar, forme, coulcarte, coultexte, taille){

function createText(tab){

  if (melangeCouleurTexte.checked == false){
    couleurtexte = coultexte;
    console.log(couleurtexte);
  }else{
    couleurtexte = randomCouleur();
    console.log(couleurtexte);
  }

  if (chckmelange.checked == false){
    return {text: tab,border: [false, false, false, false],alignment: 'center', color: couleurtexte, fontSize: taille,}
  }else{
    return {text: tab,border: [false, false, false, false],alignment: 'center', color: couleurtexte, fontSize: randomTaille(),}
  }
}

function randomTaille(){
  tailleTab = [9, 11, 13, 15, 17];

  return tailleTab[Math.floor(Math.random()*tailleTab.length)];

}

function randomCouleur(){
  coulTab = ["#FF0000", "#FF8B00", "#FFF700", "#24FF01", "#0107FF", "#8101FF", "#FF01DC"];"#FF0000", "#FF8B00", "#FFF700", "#24FF01", "#0107FF", "#8101FF", "#FF01DC"

  return coulTab[Math.floor(Math.random()*coulTab.length)];

}

let nbcan = 0;
let symb = 0;
var ct = [];


  while (nbcan < nbcar){

    if (forme == 'Rectangle'){
      ct.push({
              canvas:[
              {
                type: 'rect',
                x: 0, y: 0,
                w: 350,
                h: 140,
                r: 6,
                color: coulcarte,
                lineColor : 'black',
              },
              ]
          });
    }
    if (forme == 'Circulaire'){
      ct.push({
              canvas:[
              {
              type: 'ellipse',
              x: 170, y: 90,
              color: coulcarte,
              r1: 160, r2: 80,
              lineColor : 'black',
              },
              ]
          });
    }

    if (nbSymb == '4'){

      ct.push({
              table: {
                  widths: [100, 100, 100],
                  heights : [20,20,20],
              body: [
                [
                  createText(Tab[nbcan][0]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][1]),
                ],
                [
                  {text: '',border: [false, false, false, false],},
                  {text: '',border: [false, false, false, false],},
                  {text: '',border: [false, false, false, false],},
                ],
                [
                  createText(Tab[nbcan][2]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][3]),
                ],
              ]
            },
            relativePosition: { x: 10, y: -110 },
            
           
         });
    }

    if (nbSymb == '5'){

      ct.push({
              table: {
                  widths: [100, 100, 100],
                  heights : [20,20,20],
              body: [
                [
                  createText(Tab[nbcan][0]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][1]),
                ],
                [
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][4]),
                  {text: '',border: [false, false, false, false],},
                ],
                [
                  createText(Tab[nbcan][2]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][3]),
                ],
              ]
            },
            relativePosition: { x: 10, y: -110 },
            
           
         });
    }

    if (nbSymb == '6'){

     ct.push({
              table: {
                  widths: [100, 100, 100],
                  heights : [20,20,20],
              body: [
                [
                  createText(Tab[nbcan][0]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][1]),
                ],
                [
                  createText(Tab[nbcan][2]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][4]),
                ],
                [
                  createText(Tab[nbcan][3]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][5]),
                ],
              ]
            },
            relativePosition: { x: 10, y: -110 },
            
           
         });
    }

    if (nbSymb == '7'){

     ct.push({
              table: {
                  widths: [100, 100, 100],
                  heights : [20,20,20],
              body: [
                [
                  createText(Tab[nbcan][0]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][1]),
                ],
                [
                  createText(Tab[nbcan][2]),
                  createText(Tab[nbcan][3]),
                  createText(Tab[nbcan][4]),
                ],
                [
                  createText(Tab[nbcan][5]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][6]),
                ],
              ]
            },
            relativePosition: { x: 10, y: -110 },
            
           
         });
    }

    if (nbSymb == '8'){

     ct.push({
              table: {
                  widths: [100, 100, 100],
                  heights : [20,20,20],
              body: [
                [
                  createText(Tab[nbcan][0]),
                  createText(Tab[nbcan][1]),
                  createText(Tab[nbcan][2]),
                ],
                [
                  createText(Tab[nbcan][3]),
                  {text: '',border: [false, false, false, false],},
                  createText(Tab[nbcan][4]),
                ],
                [
                  createText(Tab[nbcan][5]),
                  createText(Tab[nbcan][6]),
                  createText(Tab[nbcan][7]),
                ],
              ]
            },
            relativePosition: { x: 10, y: -110 },
            
           
         });
    }
  //}
nbcan++;
}

var dd = {
    pageSize: {
    width: 595.28,
    height: 750},
    content: ct
}

pdfMake.createPdf(dd).download('Jeu-Dobble-TXT.pdf');
}

function creationPDFimg(Tab, nbSymb, nbcar, forme, coulcarte){


function createImg(tab){

  return {image: tab, width: 40, height: 40,alignment: 'center',border: [false, false, false, false]}
}

let nbcan = 0;
var ct = [];

while (nbcan < nbcar){

if (forme == 'Rectangle'){
  ct.push({
          canvas:[
          {
            type: 'rect',
            x: 0, y: 0,
            w: 350,
            h: 200,
            r: 6,
            color: coulcarte,
            lineColor : 'black',
          },
          ]
      });
}
if (forme == 'Circulaire'){
  ct.push({
          canvas:[
          {
          type: 'ellipse',
          x: 170, y: 90,
          color: coulcarte,
          r1: 160, r2: 80,
          lineColor : 'black',
          },
          ]
      });
}

if (nbSymb == '4'){

  ct.push({
          table: {
              widths: [100, 100, 100],
              heights : [40,40,40],
          body: [
            [
              createImg(Tab[nbcan][0]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][1]),
            ],
            [
              {text: '',border: [false, false, false, false],},
              {text: '',border: [false, false, false, false],},
              {text: '',border: [false, false, false, false],},
            ],
            [
              createImg(Tab[nbcan][2]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][3]),
            ],
          ]
        },
        relativePosition: { x: 10, y: -170 },
        
       
     });

}

if (nbSymb == '5'){

  ct.push({
          table: {
              widths: [100, 100, 100],
              heights : [40,40,40],
          body: [
            [
              createImg(Tab[nbcan][0]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][1]),
            ],
            [
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][4]),
              {text: '',border: [false, false, false, false],},
            ],
            [
              createImg(Tab[nbcan][2]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][3]),
            ],
          ]
        },
        relativePosition: { x: 10, y: -170 },
        
       
     });
}

if (nbSymb == '6'){

 ct.push({
          table: {
              widths: [100, 100, 100],
              heights : [40,40,40],
          body: [
            [
              createImg(Tab[nbcan][0]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][1]),
            ],
            [
              createImg(Tab[nbcan][2]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][4]),
            ],
            [
              createImg(Tab[nbcan][3]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][5]),
            ],
          ]
        },
        relativePosition: { x: 10, y: -170 },
        
       
     });
}

if (nbSymb == '7'){

 ct.push({
          table: {
              widths: [100, 100, 100],
              heights : [40,40,40],
          body: [
            [
              createImg(Tab[nbcan][0]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][1]),
            ],
            [
              createImg(Tab[nbcan][2]),
              createImg(Tab[nbcan][3]),
              createImg(Tab[nbcan][4]),
            ],
            [
              createImg(Tab[nbcan][5]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][6]),
            ],
          ]
        },
        relativePosition: { x: 10, y: -170 },
        
       
     });
}

if (nbSymb == '8'){

 ct.push({
          table: {
              widths: [100, 100, 100],
              heights : [40,40,40],
          body: [
            [
              createImg(Tab[nbcan][0]),
              createImg(Tab[nbcan][1]),
              createImg(Tab[nbcan][2]),
            ],
            [
              createImg(Tab[nbcan][3]),
              {text: '',border: [false, false, false, false],},
              createImg(Tab[nbcan][4]),
            ],
            [
              createImg(Tab[nbcan][5]),
              createImg(Tab[nbcan][6]),
              createImg(Tab[nbcan][7]),
            ],
          ]
        },
        relativePosition: { x: 10, y: -170 },
        
       
     });
}
nbcan++;
}

var dd = {
    pageSize: {
    width: 595.28,
    height: 825},
    content: ct
}

pdfMake.createPdf(dd).download('Jeu-Dobble-IMG.pdf');
}

  
});
