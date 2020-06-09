package services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Kategorija;
import beans.Korisnik;
import beans.Oglas;
import beans.Poruka;
import dao.KategorijeDAO;
import dao.KorisnikDAO;
import dao.OglasiDAO;

@Path("oglasi")
public class OglasServis {
	
	@Context
	ServletContext ctx;
	
	public OglasServis() {
		
	}
	
	@PostConstruct
	public void init() {		
		if  (ctx.getAttribute("oglasiDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("oglasiDAO", new OglasiDAO(contextPath));
		}
	}
	
	@GET
	@Path("omiljeniOglasi")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Oglas> getTopOglasi(@Context HttpServletRequest request) {			
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");

		         
		Collection<Oglas> values = oglasiDAO.getOglasi().values(); 
		ArrayList<Oglas> oglasi =  new ArrayList<Oglas>(values);
		
		ArrayList<Oglas> tempOglas = new ArrayList<Oglas>();
		
		for(Oglas o : oglasi) {
			if(o.getStatus().equals("AKTIVAN") && !(o.getObrisan())) {
				tempOglas.add(o);
			}
		}
		
		Collections.sort(tempOglas, new Comparator<Oglas>(){
		     public int compare(Oglas o1, Oglas o2){
		         if(o1.getBrojListaOmiljenih() == o2.getBrojListaOmiljenih())
		             return 0;
		         return o1.getBrojListaOmiljenih() > o2.getBrojListaOmiljenih() ? -1 : 1;
		     }
		});
		
		List<Oglas> omiljeni = new ArrayList<Oglas>();
		
		
		if(tempOglas.size() < 10) {
			omiljeni = tempOglas.subList(0, tempOglas.size());
		}
		else {
			omiljeni = tempOglas.subList(0, 10);
		}
		
		return omiljeni;
	}
	
	@POST
	@Path("detaljiOglasa")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Oglas detaljiOglasa(Oglas oglas, @Context HttpServletRequest request) {			
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		return oglasiDAO.getOglasi().get(oglas.getId());
	}
	
	@GET
	@Path("listaGradova")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<String> getListaGradova(@Context HttpServletRequest request) {
		ArrayList<String> listaGradova;
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>(korisnikDAO.getKorisnici().values());
		HashMap<String, Korisnik> listaKorisnika = new HashMap<String, Korisnik>();
		
		for(int i=0; i < korisnici.size(); i++) {
			listaKorisnika.put(korisnici.get(i).getGrad(), korisnici.get(i));
		}
		
		listaGradova = new ArrayList<String>(listaKorisnika.keySet());
		
		return listaGradova;
	}
	
	@PUT
	@Path("iniciranaPretraga")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Oglas> iniciranaPretraga(Kategorija k, @Context HttpServletRequest request) throws ParseException {		
		
		ArrayList<String> parametri = k.getListaParametara();
		ArrayList<Oglas> oglasi = new ArrayList<Oglas>();
		ArrayList<Oglas> oglasiTemp;
		
		if(!(k.getNaziv().equals("Najpopularniji oglasi"))){
			Kategorija kat = ((KategorijeDAO) ctx.getAttribute("kategorijeDAO")).getKategorije().get(k.getNaziv());
			oglasiTemp = new ArrayList<Oglas>(kat.getListaOglasa());
		}
		else {
			oglasiTemp = new ArrayList<Oglas>(k.getListaOglasa());
		}
		
		ArrayList<Boolean> validacija;
		int index;
		
		for(int i = 0; i < oglasiTemp.size(); i++) {
			
			validacija = new ArrayList<Boolean>();
			index = 1;	
			
			if (oglasiTemp.get(i).getNaziv().contains(parametri.get(0))) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if(oglasiTemp.get(i).getCena() >= Integer.parseInt(parametri.get(1))) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if(oglasiTemp.get(i).getCena() <= Integer.parseInt(parametri.get(2))) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if(oglasiTemp.get(i).getBrojLajkova() >= Integer.parseInt(parametri.get(3))) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if(oglasiTemp.get(i).getBrojLajkova() <= Integer.parseInt(parametri.get(4))) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
		    Date date = new SimpleDateFormat("dd/MM/yyyy").parse(oglasiTemp.get(i).getDatumIsticanja());

		    Date dateInput1 = new SimpleDateFormat("dd/MM/yyyy").parse(parametri.get(5));
		    Date dateInput2 = new SimpleDateFormat("dd/MM/yyyy").parse(parametri.get(6));  

			if (date.compareTo(dateInput1) >= 0) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if (date.compareTo(dateInput2) <= 0) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if (oglasiTemp.get(i).getGrad().equals(parametri.get(7)) || parametri.get(7).contains("Svi gradovi")) {
				validacija.add(true);
			}
			else {
				validacija.add(false);
			}
			
			if(parametri.get(8).equals("000")) {
				validacija.add(true);
			}
			else {
				if(oglasiTemp.get(i).getStatus().equals("AKTIVAN") && parametri.get(8).charAt(0) == '1') {
					validacija.add(true);
				}
				else if (oglasiTemp.get(i).getStatus().equals("U REALIZACIJI") && parametri.get(8).charAt(1) == '1') {
					validacija.add(true);
				}
				else if (oglasiTemp.get(i).getStatus().equals("DOSTAVLJEN") && parametri.get(8).charAt(2) == '1') {
					validacija.add(true);
				}
				else {
					validacija.add(false);
				}	
			}
			
			for(Boolean b : validacija) {
				if(!b.booleanValue()) {
					index = -1;
					break;
				}
			}
			
			if((index != -1) && !(oglasiTemp.get(i).getObrisan())) {
				oglasi.add(oglasiTemp.get(i));
			}
			
	
		}
		
		return oglasi;
	}
	
	@PUT
	@Path("izmeniOglas")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean izmeniOglas(Oglas o, @Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		Oglas izmenjenOglas = oglasiDAO.getOglasi().get(o.getId());
		
		izmenjenOglas.setNaziv(o.getNaziv());
		izmenjenOglas.setOpis(o.getOpis());
		izmenjenOglas.setCena(o.getCena());
		izmenjenOglas.setDatumIsticanja(o.getDatumIsticanja());
		izmenjenOglas.setStringSlike(o.getStringSlike());
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		ArrayList<Oglas> listaOglasa = kategorijeDAO.getKategorije().get(izmenjenOglas.getImeKategorije()).getListaOglasa();
		
		if(!o.getImeKategorije().equals(izmenjenOglas.getImeKategorije())) {
						
			for(Oglas ok : listaOglasa) {
				if(ok.getId().equals(izmenjenOglas.getId())){
					listaOglasa.remove(ok);
					break;
				}
			}
		
			izmenjenOglas.setImeKategorije(o.getImeKategorije());
			kategorijeDAO.getKategorije().get(izmenjenOglas.getImeKategorije()).getListaOglasa().add(izmenjenOglas);
			return true;
		}
		
		for(Oglas ok : listaOglasa) {
			if(ok.getId().equals(izmenjenOglas.getId())) {
				ok.setNaziv(o.getNaziv());
				ok.setOpis(o.getOpis());
				ok.setCena(o.getCena());
				ok.setDatumIsticanja(o.getDatumIsticanja());
				ok.setStringSlike(o.getStringSlike());
			}
		}
		
		//////// AUTOMATSKA PORUKA
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		Korisnik prodavac = korisnikDAO.getKorisnici().get(oglasiDAO.getOglasi().get(o.getId()).getKorisnickoImeProdavca());
		
		ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>(korisnikDAO.getKorisnici().values());
		
		Korisnik kupacDostavljeno = null;
		Korisnik kupacPoruceno = null;
		
		for(Korisnik k : korisnici) {
			if(k.getUloga().equals("KUPAC")) {
				for(Oglas o1 : k.getListaPrijavljenih()) {
					if(o1.getId().equals(o.getId())) {
						kupacDostavljeno = k;
						break;
					}
				}
				if(kupacDostavljeno == null) {
					for(Oglas o2 : k.getListaDostavljenih()) {
						if(o2.getId().equals(o.getId())) {
							kupacDostavljeno = k;
							break;
						}
					}
				}
			}
		}
		
		for(Korisnik k : korisnici) {
			if(k.getUloga().equals("KUPAC")) {
				for(Oglas o1 : k.getListaPorucenih()) {
					if(o1.getId().equals(o.getId())) {
						kupacPoruceno = k;
						break;
					}
				}
			}
		}
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		if(ulogovanKorisnik.getUloga().equals("ADMIN")) {
			/// POSALJI PRODAVCU PORUKU
			Poruka poruka = new Poruka();
			
			poruka.setId(UUID.randomUUID().toString());
			poruka.setNaslovPoruke("AUTOMATSKA PORUKA");
			poruka.setSadrzajPoruke("Administrator " + ulogovanKorisnik.getKorisnickoIme() + " je izmenio Vaš oglas " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
			
			Date date = new Date();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			String datum = formatter.format(date);
			
			poruka.setDatumVremePoruke(datum);
			poruka.setPosiljalac("MEGAFON");

			poruka.setMozeDaOdgovori(false);
			poruka.setObrisana(false);
			
			prodavac.getListaPoruka().add(poruka);
			/// POSALJI KUPCU
			if(kupacDostavljeno != null) {
				Poruka poruka1 = new Poruka();
				
				poruka1.setId(UUID.randomUUID().toString());
				poruka1.setNaslovPoruke("AUTOMATSKA PORUKA");
				poruka1.setSadrzajPoruke("Administrator " + ulogovanKorisnik.getKorisnickoIme() + " je izmenio oglas Vašeg dostavljenog proizvoda " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
				
				poruka1.setDatumVremePoruke(datum);
				poruka1.setPosiljalac("MEGAFON");

				poruka1.setMozeDaOdgovori(false);
				poruka1.setObrisana(false);
				
				kupacDostavljeno.getListaPoruka().add(poruka1);
			}
			
			if(kupacPoruceno != null) {
				Poruka poruka1 = new Poruka();
				
				poruka1.setId(UUID.randomUUID().toString());
				poruka1.setNaslovPoruke("AUTOMATSKA PORUKA");
				poruka1.setSadrzajPoruke("Administrator " + ulogovanKorisnik.getKorisnickoIme() + " je izmenio oglas Vašeg poručenog proizvoda " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
				
				poruka1.setDatumVremePoruke(datum);
				poruka1.setPosiljalac("MEGAFON");

				poruka1.setMozeDaOdgovori(false);
				poruka1.setObrisana(false);
				
				kupacPoruceno.getListaPoruka().add(poruka1);
			}
		}
		
		
		return true;
	}
	
	@PUT
	@Path("filtracijaPoStatusu")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> filtracijaPoStatusu(Oglas oglascic, @Context HttpServletRequest request) {
		
		String parametri = oglascic.getNaziv();
		
		ArrayList<Oglas> filter = new ArrayList<Oglas>();
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> listaObjavljenih = ((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getListaObjavljenih();
		
		for(Oglas o : listaObjavljenih) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan() && oglasiDAO.getOglasi().containsKey(o.getId())) {
				if(parametri.equals("000")) {
					filter.add(oglasiDAO.getOglasi().get(o.getId()));
				}
				else {
					if(oglasiDAO.getOglasi().get(o.getId()).getStatus().equals("AKTIVAN") && parametri.charAt(0) == '1') {
						filter.add(oglasiDAO.getOglasi().get(o.getId()));
					}
					else if (oglasiDAO.getOglasi().get(o.getId()).getStatus().equals("U REALIZACIJI") && parametri.charAt(1) == '1') {
						filter.add(oglasiDAO.getOglasi().get(o.getId()));
					}
					else if (oglasiDAO.getOglasi().get(o.getId()).getStatus().equals("DOSTAVLJEN") && parametri.charAt(2) == '1') {
						filter.add(oglasiDAO.getOglasi().get(o.getId()));
					}
				}
			}
		}

		return filter;
	}
	
	
}
