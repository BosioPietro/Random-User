"use strict"

var lastItem; 		// Variabile di support per l'hover delle voci nel menù
var active = [];	// 2° variabile di supporto
var indice = 0;		// Indice user corrente
var utente = {};	// Contiene gli utenti generati
var indiceSort = 0;	// Indice per la funzione di ordinamento
const max = 20;		// Massimo numero di utenti generabili

$(document).ready(function(){
	$("#cCaselle").on("sortstart", function( event, ui ) {
		indiceSort = $(".casella").index(ui["item"]);
	});
	$("#cCaselle").on("sortupdate", function( event, ui ) {
		let nuovaPosizione = $(".casella").index(ui["item"]);
		let aus = utente[indiceSort];
		utente[indiceSort] = utente[nuovaPosizione];
		utente[nuovaPosizione] = aus;
		muovi(0);
		preload();
	});
	$("#selected").on("click", function(){apriSelect()});
	$("#cLego").hide();
	$("#grigliaOverlay").hide();
	$("input[type=range]").prop("max", max);

	// Imposta immagini header
	let vet = [0, 8, 1, 2, 3, 4, 5, 6]
	$(".imgCell").each(function(i, ref){
		$(ref).css({"background-image" : "url(./img/nav_icons.png)","background-position-y": vet[i] * - 25})
	});

	// Crea checkbox nazionalità
	let nats = ["AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE", "IN", "IR", "MX", "NL", "NO", "NZ", "RS", "TR", "UA", "US"];
	let cNat = $("#cNat");
	for(let [i,nat] of nats.entries())
	{
		let chk = $("<span>").prop({"id" : `chk${nat}`, "value" : nat}).addClass("checkboxU pointer").text(nat);
		cNat.append(chk);
		if((i + 1) % 4 == 0)
			cNat.append("<br>");
	}
	$(".checkboxU, .checkboxC").on("click", function(){cambiaStato($(this))});
	cNat.append($("<button>Select All</button>").addClass("pointer").on("click", function(){cambiaStato($(this))}));

	// Crea voci menù
	for(let i = 0; i < 6; ++i)
	{
		$("<div>").on("mouseover", function(){menuHover($(this))}).addClass("voceMenu pointer").appendTo($("#cMenu")).css("background-position-x", -85 * i - 4)
	}
	$(".voceMenu").eq(0).css({"background-position-y": 0});
	lastItem = $(".voceMenu").eq(0);

	// Manda richeista all'api
	gen();
})

//#region Richiesta

function gen(singolo){
	let jsonParametri = {
		"results": singolo ? 1 : $("input[type=range]").val(),
		"noinfo":"noinfo",
		"gender":$("#cGender .checkboxC").prop("value"),
	}
	if($("#cNat .checkboxU").length != 0)
	{
		let nat = "";
		$("#cNat .checkboxC").each(function(i, ref){
			nat += $(ref).prop("value").toLowerCase() + ",";
		})
		console.log(nat)
		jsonParametri["nat"] = nat.slice(0, -2);
	}
	if($("#cLego input[type=checkbox]").is(":checked"))
	{
		jsonParametri["lego"] = "lego";
	}
	else $("#sGrigio").css("backgroundImage", "none")
	let request = inviaRichiesta(jsonParametri)
	request.fail(errore);
	request.done(function(data){
		if(singolo)
			utente[indice] = data["results"][0];
		else
			utente = data["results"];
		console.log(utente);
		preload();
		chgUtente();
		chgText(0);
		riempiGriglia();
		$(".casella button").each(function(i, ref){$(ref).prop("disabled", indice == i)});
	})
}

//#endregion

//#region Controlli utente

function muovi(direzione){
	indice += direzione;
	chgUtente();
	chgText(0);
}

function preload()
{
	$("#cList").css("overflow-y", utente.length > 3 ? "scroll" : "hidden");
	$("#cSelect > div > div").html("");
	$("#cSelect").css("display", utente.length > 1 ? "flex" : "none");
	let _span = $('<span>expand_more</span>').css({"transform": "scale(1.1)", marginLeft : "auto"}).addClass("pointer material-symbols-outlined");
	for(let [i, img] of utente.entries())
    {
		let aus = new Image();
    	aus.src = img["picture"]["thumbnail"];
		let option = $("<div>").append($(`<div>${img["name"]["first"]}  ${img["name"]["last"]}</div>`)).addClass("pointer")
		$("<img>").prop("src", img["picture"]["thumbnail"]).addClass("selImg").prependTo(option);
		option.addClass("flexRow").appendTo($("#cList")).css("backgroundColor", i == 0 ? "#83ba435f" : "").on("click", function(){
			$("#selected > div").html($(this).html()).append(_span);
			indice = i;
			chgUtente(); 
			chgText(0);
		})
	}
	$("#selected").append($("<div>").html($("#cList").children().eq(0).html()).addClass("pointer flexRow"));
	$("#selected > div").append(_span).css("width", parseInt($("#cSelect").css("width")) + parseInt(_span.css("width")));
}

function apriSelect(){
	let lista = $("#cList");
	let aperto = parseInt(lista.css("height")) > 0;
	lista.css("height", (aperto ? 0 : 120));
	$("hr").css({ "width": aperto > 0 ? 0 : utente.lenght > 3 ? utente.lenght * 40 : "100%"});
}

function chgUtente(){
	$(".casella button").each(function(i, ref){$(ref).prop("disabled", indice == i)});
	$("#cList").children().each(function(i, ref){
		$(ref).css("backgroundColor", i == indice ? "#83ba435f" : "");
		if(i == indice)
			$("#selected > div").html($(ref).html()).append($('<span>expand_more</span>').css({"transform": "scale(1.1)", marginLeft : "auto"}).addClass("pointer material-symbols-outlined"));
	});
	$(".prevImg").eq(0).css("background-image", indice - 1 < 0 ? "none" : `url(${utente[indice - 1]["picture"]["thumbnail"]})`);
	$(".prevImg").eq(1).css("background-image", indice + 1 >= utente.length ? "none" : `url(${utente[indice + 1]["picture"]["thumbnail"]})`);
	$(".material-symbols-outlined").eq(1).prop("disabled", indice == 0);
	$(".material-symbols-outlined").eq(2).prop("disabled", indice == utente.length - 1);
	$("#dPersona").find("img").last().prop("src", utente[indice]["picture"]["large"]);
	$(".voceMenu").eq(0).trigger("mouseover");
}

function chgText(pos){	// Cambia il testo in corrispondenza di un hover
	let corrente = utente[indice];
	let _h1 = $("#cControlli > h1"); 
	let testo = ["name", "email address", "birthday", "address", "phone number", "password"];
	$("#cControlli > h4").text((pos == 0 ? "Hi, " : "") + `My ${testo[pos]} is`);
	switch(pos)
	{
		case 0:
			_h1.text(`${corrente["name"]["first"]} ${corrente["name"]["last"]}`);
			break;
		case 1:
			_h1.text(corrente["email"]);
			break;
		case 2:	// La stringa della data è  in disordine quindi la riordino
			let dob = corrente["dob"]["date"];
			dob = dob.substring(0, dob.indexOf("T")); 
			_h1.text(`${parseInt(dob.substring(0, 4))}/${parseInt(dob.substring(5, 7))}/${dob.substring(8)}`);
			break;
		case 3:
			_h1.text(`${corrente["location"]["street"]["number"]} ${corrente["location"]["street"]["name"]}`);
			break;
		case 4:
			_h1.text(corrente["phone"]);
			break;
		case 5:
			_h1.text(corrente["login"]["password"]);
			break;
	}
}

function mostraGriglia(){
	let cont = $("#grigliaOverlay");
	if(cont.css("height") == "300px")
	{
		$("#cCaselle").css("overflow", "hidden");
		setTimeout(function(){cont.hide();$("#cCaselle").css("overflow", "auto")}, 500);
		cont.css({"height": "", "width": "", "top": "", "left": "",  "padding": ""});
	}
	else
	{
		cont.show();
		cont.css({"height": "300px", "width": "550px", "top": "0", "left": "20", "padding": "50px 150px 175px 75px"});
	}
}

function riempiGriglia(){
	let cont = $("#cCaselle");
	let jsonParametri = {
		"containment": "#grigliaOverlay>div",
		"items": "div", 
		"helper": "clone",
		"clone": true,
		"scroll": true,
		"opaciry": 0.5,
		"cursor": "grabbing",
		"helper": "clone",
		"tolerance": "pointer",
		"placeholder": "blur",
		"forcePlaceholderSize": true,
		"forceHelperSize": true,
		"scrollSensitivity": 10,
	};
	cont.sortable(jsonParametri);
	cont.children().remove();
	for(let [i, persona] of utente.entries())
	{
		let div = $("<div>").addClass("flexColumn casella").appendTo(cont);
		$("<div>").addClass("barra").appendTo(div);
		$("<img>").prop("src", persona["picture"]["medium"]).appendTo(div);
		$("<h5>").text(`${persona["name"]["first"]} ${persona["name"]["last"]}`).appendTo(div);
		$("<button>See</button>").appendTo(div).on("click", function(){mostraGriglia(); indice = i; chgUtente();});
	}
	cont.css("height", Math.ceil(utente.length / 4) * 160);
}

//#endregion

//#region Eventi input

function controllaValore(cas){	// Controlla che il valore inserito sia corretto
	if(event.key == "Enter"){
		cas.blur();
		event.preventDefault()
	}
	if("0123456789".includes(event.key) || event.key == "Backspace" || event.key.includes("Arrow")) return;
	event.preventDefault();
}

function controllaNumero(cas){
	let txt = $(cas).text();
	if(txt[0] == "0" && txt.length > 1)
		$(cas).text(txt.substring(1));
	if(txt < 0 || txt > max || txt == ""){
		$(cas).text(txt > max ? max : 1);
		event.preventDefault()
	}
	$("input[type=range]").val($(cas).text());
}

function chkBottone(){	// Disattiva il bottone se non ci sono checkbox checkcate
	let disabled = false;
	let select = false;
	$("#cNat").find("span").each(function(i, ref){
		disabled |= $(ref).hasClass("checkboxC");
		select |= $(ref).hasClass("checkboxU");
		
	})
	$("#cNat button").text(!select ? "Deselect All" : $("#cNat button").text());
	$("#cGenera button").eq(1).prop("disabled", !disabled);
}

function menuHover(div){ // Gestisce l'hover delle voci nel menù
	let posDiv = $(".voceMenu").index(div);
	if($(".voceMenu").index(div) == $(".voceMenu").index(lastItem) || active.includes(posDiv)) return;
	active.push(posDiv);													// uso un array di appoggio per evitare che gli eventi si 
	lastItem.animate({"background-position-y": 60}, 300, function(){		// sovrappongano se se ne triggerano tanti in poco tempo
		active.splice(active.indexOf(posDiv), 1)
	})
	div.animate({"background-position-y": 0}, 300)
	chgText(posDiv);
	lastItem = div
}

function cambiaStato(ref){
	let target;
	console.log(ref.parent())
	if(ref.parent().prop("id") == "cGender")
	{
		$("#cGender span").removeClass("checkboxC").addClass("checkboxU");
		ref.addClass("checkboxC");
		return;
	}
	else if(!ref.prop("value"))
	{
		let mod = ref.text() == "Select All";
		ref.text(mod ? "Deselect All" : "Select All");
		target = mod ? $("#cNat .checkboxU") : $("#cNat .checkboxC");
	}
	else target = ref;
	target.toggleClass("checkboxC checkboxU");
	chkBottone();
}

//#endregion

//#region Easter Egg

const easterEggCmb = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
var egIndex = 0;

function easterEgg(){
	egIndex = easterEggCmb[egIndex] == event.key ? egIndex + 1 : 0;
	if(egIndex < easterEggCmb.length) return
	$("#cLego input[type=checkbox]").prop("checked", true);
	$("#sGrigio").css("backgroundImage", "url(./img/lego_bg.jpg)")
	$("#sGrigio").children().addClass("lego");
	$("#cLego").show();
	$("html, body").animate({ scrollTop: 0 }, "slow");
	gen();
	$("body").off("keydown");
}

//#endregion