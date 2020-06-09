$(document).ready(function(){
	
	$("#izabranoOdGradova").hover( function(event){
		event.preventDefault();
		let listaGradova = "";
		
		$.get({
			url: 'rest/oglasi/listaGradova',
			success : function(listaGradova){
				if(listaGradova != null){
					let sviGradovi = '<li data-value="Svi gradovi" ><a class="dropdown-item" href="">Svi gradovi</a></li>';
					for(i = 0; i < listaGradova.length; i++){
						sviGradovi += '<li data-value="' + listaGradova[i] + 
									  '" ><a class="dropdown-item" href="">' + listaGradova[i] + '</a></li>';
					}
					$('#listaGradova').html($(sviGradovi));
				}
			}
			
		});
	})
})

$('#listaGradova').on("click", "a", function(event){
	 event.preventDefault();
	 
	 let imeGradaString = "";
	 
	 var $this = $(this).parent();
	 $this.addClass("select").siblings().removeClass("select");
	 imeGradaString += $this.data("value");
	 
	 $('#izabraniGrad').html(imeGradaString);
})

$('#pretrazi').on("click", function(event){
	event.preventDefault();
	
	let nazivOglasa = $('#pretragaNaziv').val();
	
	let opsegCene = $('#amount').val();
	let opsegLajk = $('#amount2').val();
	
	let minCena = parseInt((opsegCene.split('-')[0]).replace("DIN", " "));
	let maxCena = parseInt((opsegCene.split('-')[1]).replace("DIN", " "));
	
	let minLajk = parseInt((opsegLajk.split('-')[0]).replace("LAJK", " "));
	let maxLajk = parseInt((opsegLajk.split('-')[1]).replace("LAJK", " "));
		
	let odDatum = $('#datumOdDan').val() + "/" + $('#datumOdMesec').val() + "/" + $('#datumOdGodina').val();
	let doDatum = $('#datumDoDan').val() + "/" + $('#datumDoMesec').val() + "/" + $('#datumDoGodina').val();
	
	let imeGrada = $('#izabraniGrad').html();
	
	if(odDatum == " / / " || odDatum == "//"){
		odDatum = "1/1/1000"
	}
	
	if(doDatum == " / / " || doDatum == "//"){
		doDatum = "31/12/3000";
	}
	
	let status;
	
	if($('#aktivan').prop('checked')) {
	    status = "1";
	} else {
	    status = "0";
	}
	
	if($('#uRealizaciji').prop('checked')) {
	    status += "1";
	} else {
	    status += "0";
	}
	
	if($('#dostavljen').prop('checked')) {
	    status += "1";
	} else {
	    status += "0";
	}
	
	let lista = [nazivOglasa, minCena.toString(), maxCena.toString(), minLajk.toString(), maxLajk.toString(), odDatum, doDatum, imeGrada, status];
	
	
	if(datumValidacija(odDatum, doDatum)){
		
		if(imeKategorije != "Najpopularniji oglasi"){
			$.ajax({
				type: 'PUT',
				url: 'rest/oglasi/iniciranaPretraga',
				data: JSON.stringify({naziv : imeKategorije, listaParametara : lista}),
				contentType: 'application/json',
				success: function(data) {
					if(data!=null){
						ucitajListuOglasa(data);
					}
				},
				error: function(message) {
					alert("NIJE USPEO");
				}
			});
		}
		else{
			if(omiljeniOglasi){
				$.ajax({
					type: 'PUT',
					url: 'rest/oglasi/iniciranaPretraga',
					data: JSON.stringify({naziv : imeKategorije, listaOglasa : omiljeniOglasi, listaParametara : lista}),
					contentType: 'application/json',
					success: function(data) {
						if(data!=null){
							ucitajListuOglasa(data);
						}
					},
					error: function(message) {
						alert("NIJE USPEO");
					}
				});
			}
		}
	}
	
})

function datumValidacija(odDatum, doDatum){	
	
	
	let stanjeDatuma = -1;
	
	let d1;
	
	if(!(odDatum === "1/1/1000")){
		stanjeDatuma = 1;	
	}
	
	if(!(doDatum === "31/12/3000")){
		stanjeDatuma = 2;	
	}
	
	if((odDatum != "1/1/1000") && (doDatum != "31/12/3000")){
		stanjeDatuma = 3;
	}
	
	d1 = stringToDate(odDatum,"dd/mm/yyyy","/");
	if(!dobarDanMesecGodina(odDatum) && !(odDatum === "1/1/1000")){
		d1 = "NIJE DOBRO";
	}
	
	let d2 = stringToDate(doDatum,"dd/mm/yyyy","/");
	if(!dobarDanMesecGodina(doDatum) && !(doDatum === "31/12/3000")){
		d2 = "NIJE DOBRO";
	}
	
	
	switch(stanjeDatuma){
		case 1: if(isNaN(d1)){
					$('#datumOdDan').css('border-color','red');
					$('#datumOdMesec').css('border-color','red');
					$('#datumOdGodina').css('border-color','red');
					$('#datumDoDan').css('border-color', '#CED4DA');
					$('#datumDoMesec').css('border-color', '#CED4DA');
					$('#datumDoGodina').css('border-color', '#CED4DA');
					return false;
				}
				else{
					$('#datumOdDan').css('border-color', '#CED4DA');
					$('#datumOdMesec').css('border-color', '#CED4DA');
					$('#datumOdGodina').css('border-color', '#CED4DA');
					$('#datumDoDan').css('border-color', '#CED4DA');
					$('#datumDoMesec').css('border-color', '#CED4DA');
					$('#datumDoGodina').css('border-color', '#CED4DA');
					return true;
				}
				break;
		case 2: if(isNaN(d2)){
					$('#datumDoDan').css('border-color','red');
					$('#datumDoMesec').css('border-color','red');
					$('#datumDoGodina').css('border-color','red');
					$('#datumOdDan').css('border-color', '#CED4DA');
					$('#datumOdMesec').css('border-color', '#CED4DA');
					$('#datumOdGodina').css('border-color', '#CED4DA');
					return false;
				}
				else{
					$('#datumOdDan').css('border-color', '#CED4DA');
					$('#datumOdMesec').css('border-color', '#CED4DA');
					$('#datumOdGodina').css('border-color', '#CED4DA');
					$('#datumDoDan').css('border-color', '#CED4DA');
					$('#datumDoMesec').css('border-color', '#CED4DA');
					$('#datumDoGodina').css('border-color', '#CED4DA');
					return true;
				}
				break;
		case 3: if(isNaN(d1) || isNaN(d2) || d1 > d2){
					$('#datumOdDan').css('border-color','red');
					$('#datumOdMesec').css('border-color','red');
					$('#datumOdGodina').css('border-color','red');
					$('#datumDoDan').css('border-color','red');
					$('#datumDoMesec').css('border-color','red');
					$('#datumDoGodina').css('border-color','red');
					return false;
				}
				else{
					$('#datumOdDan').css('border-color', '#CED4DA');
					$('#datumOdMesec').css('border-color', '#CED4DA');
					$('#datumOdGodina').css('border-color', '#CED4DA');
					$('#datumDoDan').css('border-color', '#CED4DA');
					$('#datumDoMesec').css('border-color', '#CED4DA');
					$('#datumDoGodina').css('border-color', '#CED4DA');
					return true;
				}
				break;
		default: 	$('#datumOdDan').css('border-color', '#CED4DA');
					$('#datumOdMesec').css('border-color', '#CED4DA');
					$('#datumOdGodina').css('border-color', '#CED4DA');
					$('#datumDoDan').css('border-color', '#CED4DA');
					$('#datumDoMesec').css('border-color', '#CED4DA');
					$('#datumDoGodina').css('border-color', '#CED4DA');	
					return true;
	}
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

function dobarDanMesecGodina(dateString){
	 	var parts = dateString.split("/");
	    var day = parseInt(parts[0], 10);
	    var month = parseInt(parts[1], 10);
	    var year = parseInt(parts[2], 10);

	    // Check the ranges of month and year
	    if(year < 1000 || year > 3000 || month == 0 || month > 12)
	        return false;

	    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	    // Adjust for leap years
	    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
	        monthLength[1] = 29;

	    // Check the range of the day
	    return day > 0 && day <= monthLength[month - 1];
}

$('#ponistiParametre').on("click", function(event){
	event.preventDefault();
	resetujPretragu();
	$('#pretrazi').click();
})