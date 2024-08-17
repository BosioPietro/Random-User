'use strict'

const URL = "https://randomuser.me/api/"

function inviaRichiesta(parameters={}) {
    return $.ajax({
        "url":  URL,
		"data": parameters,
		"type": "GET",   
		"contentType": "application/x-www-form-urlencoded;charset=utf-8", 
        "dataType": "json",   // default      
        "timeout": 5000,      // default 
    });	
}

function errore(jqXHR, text_status, string_error) {
    const testo = "C'è stato un errore nella richeista dei dati, prova a ricarica la pagina o ad aspettare qualche minuto";
    let errore;
    if (jqXHR.status == 0)
        errore = "Connection Refused or Server timeout";
	else if (jqXHR.status == 200)
        errore = "Formato dei dati non corretto : " + jqXHR.responseText;
    else
        errore = "Server Error: " + jqXHR.status + " - " + jqXHR.responseText;
        $("#cErrore").css("transform", "translateX(-50%) translateY(58px)").children().eq(0).text(`${testo}: ${errore}`);
}