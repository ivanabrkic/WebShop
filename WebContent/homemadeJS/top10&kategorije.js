$("#kategorije").hover(function(event){
	event.preventDefault();
	
	$.get({
		url: 'rest/kategorije/sveKategorije',
		success : function(sveK){
			if(sveK != null){
				let sveKategorijeString = '<li data-value="Najpopularniji oglasi"><a href="">Najpopularniji oglasi</a></li>';
				for(i = 0; i < sveK.length; i++){
					if(sveK[i].naziv != "Najpopularniji oglasi"){
						sveKategorijeString += '<li data-value="' 
												+ sveK[i].naziv 
												+ '" > <a href="">' 
												+ sveK[i].naziv 
												+ '</a></li>';
					}
				}
				$('#listaKategorija').html($(sveKategorijeString));
			}
		}
		
	});
	
})

var imeKategorije;

$("#listaKategorija").on("click", "a", function(e){
	
	event.preventDefault();
	
    var $this = $(this).parent();
    $this.addClass("select").siblings().removeClass("select");
    imeKategorije = $this.data("value");
    
    
    $.post({
    	url: 'rest/kategorije/kliknutaKategorija',
    	data: JSON.stringify({naziv: imeKategorije}),
    	contentType: 'application/json',
    	success: function(uspeh){
    		if(uspeh){
	    		window.location = "kategorije.html";
    		}
    	},
    	error: function(){
    	}
    })
    
})

var oglasSvaPolja;
var omiljeniOglasi;

$(document).ready(function(){

	$.get({
		url : 'rest/oglasi/omiljeniOglasi',
		success : function(omiljeni) {
			if(omiljeni != null){
				omiljeniOglasi = omiljeni;
				let omiljeniString = "";
				for (i = 0; i < omiljeni.length; i++) { 
						omiljeniString += '<div class="owl-item" style="width: 320px; margin-right: 20px;"><div class="item"> \n' + 
		                '<div class="block-4 text-center"> \n' + 
		                  '<figure class="block-4-image"> \n' + 
		                    '<img src="' + omiljeni[i].stringSlike + '" ' + ' alt="Image placeholder" class="img-fluid"> \n' +
		                  '</figure>\n<div class="block-4-text p-4"> \n' + 
		                    '<h3>\n<a class="linkDoDetalja" href="#" data-toggle="modal" data-target="#modalLoginForm" ' + ' id="' + omiljeni[i].id + '" > ' + omiljeni[i].naziv + '</a>\n</h3> ' + 
		                    '<p class="mb-0"> \n' + omiljeni[i].opis + '</p> \n' + 
		                    '<p class="text-primary font-weight-bold"> \n' + omiljeni[i].cena + " DIN" + '</p> \n' +
		                  '</div>\n</div>\n</div> \n</div>'
						;
					
				}
				$('.owl-stage').html($(omiljeniString));
				
			}
			
			$('.linkDoDetalja').on("click",function(event){
				event.preventDefault();
				let idOglasa = event.target.id;
				
			    $.post({
					url: 'rest/oglasi/detaljiOglasa',
					data: JSON.stringify({id: idOglasa}),
					contentType: 'application/json',
					success: function(detaljanOglas) {
						if(detaljanOglas != null){
							oglasSvaPolja = detaljanOglas;
							if (oglasSvaPolja != null){
								$('#slikaOglasa').attr("src", oglasSvaPolja.stringSlike);
								$('#nazivOglasa').html(oglasSvaPolja.naziv);
								$('#opisOglasa').html(oglasSvaPolja.opis);
								$('#cenaOglasa').html(oglasSvaPolja.cena);
								$('#brojLajkova').html(detaljanOglas.brojLajkova + "       ");
								$('#brojDislajkova').html(detaljanOglas.brojDislajkova);
								$('#datum').html(detaljanOglas.datumPostavljanja + " - " + detaljanOglas.datumIsticanja);
								$('#grad').html(detaljanOglas.grad);
								$('#brojListaOmiljenih').html(detaljanOglas.brojListaOmiljenih + "       ");
								$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);
							}
						}
					},
					error: function() {
					
					}
				});
			})

		}
	});
})