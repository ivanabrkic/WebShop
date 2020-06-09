package services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Korisnik;
import beans.Oglas;
import beans.Poruka;
import beans.Recenzija;
import dao.KategorijeDAO;
import dao.KorisnikDAO;
import dao.OglasiDAO;

@Path("recenzije")
public class RecenzijaServis {
	
	@Context
	ServletContext ctx;
	
	public RecenzijaServis() {
		
	}
	
	@PostConstruct
	public void init() {		
		if  (ctx.getAttribute("oglasiDAO") == null) {
	    	String contextPath = ctx.getRealPath("");
			ctx.setAttribute("oglasiDAO", new OglasiDAO(contextPath));
		}
	}
	
	@POST
	@Path("dodajRecenziju/{idOglasa}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Boolean dodajRecenziju(@PathParam("idOglasa") String idOglasa, Recenzija recenzija, @Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		//KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		
		Recenzija r = new Recenzija();
		r.setId(UUID.randomUUID().toString());
		
		r.setNaslovRecenzije(recenzija.getNaslovRecenzije());
		r.setSadrzajRecenzije(recenzija.getSadrzajRecenzije());
		r.setStringSlike(recenzija.getStringSlike());
		r.setIspostovanDogovor(recenzija.getIspostovanDogovor());
		r.setOpisIzOglasaTacan(recenzija.getOpisIzOglasaTacan()); 
		r.setKorisnickoImeRecenzenta(((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getKorisnickoIme());
		r.setObrisana(false);
		
		oglasiDAO.getOglasi().get(idOglasa).getListaRecenzija().add(r);

		/*ArrayList<Oglas> listaOglasaKategorije = kategorijeDAO.getKategorije().get(oglasiDAO.getOglasi().get(idOglasa).getImeKategorije()).getListaOglasa();
		for(Oglas o : listaOglasaKategorije) {
			if(o.getId().equals(idOglasa)) {
				o.getListaRecenzija().add(r);
			}
		}*/
		
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik prodavac = korisnikDAO.getKorisnici().get(oglasiDAO.getOglasi().get(idOglasa).getKorisnickoImeProdavca());
		///////////////////// ZA AUTOMATSKU PORUKU ///////////////////////////////////////////////////
		Poruka poruka = new Poruka();
			
		poruka.setId(UUID.randomUUID().toString());
		poruka.setNaslovPoruke("AUTOMATSKA PORUKA");
		poruka.setSadrzajPoruke("Kupac " + ulogovanKorisnik.getKorisnickoIme() + " je ostavio recenziju na Vaš oglas " + oglasiDAO.getOglasi().get(idOglasa).getNaziv() + ".");
			
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String datum = formatter.format(date);
			
		poruka.setDatumVremePoruke(datum);
		poruka.setPosiljalac("MEGAFON");

		poruka.setMozeDaOdgovori(false);
		poruka.setObrisana(false);
		
		prodavac.getListaPoruka().add(poruka);
		
		return true;
	}
	
	@POST
	@Path("listaRecenzija")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Recenzija> listaRecenzija(Oglas oglas, @Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Recenzija> listaFilter = new ArrayList<Recenzija>();
		
		for(Recenzija r : oglasiDAO.getOglasi().get(oglas.getId()).getListaRecenzija()) {
			if(!r.getObrisana()) {
				listaFilter.add(r);
			}
		}
		
		return listaFilter;
	}
	
	@GET
	@Path("podaciRecenzije/{idOglasa}/{idRecenzije}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Recenzija podaciRecenzije(@PathParam("idOglasa") String idOglasa, @PathParam("idRecenzije") String idRecenzije, @Context HttpServletRequest request) {
		ArrayList<Recenzija> listaRecenzija = ((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getListaRecenzija();
		
		for(Recenzija r : listaRecenzija) {
			if(r.getId().equals(idRecenzije)) {
				return r;
			}
		}
		
		return null;
	}
	
	@DELETE
	@Path("obrisiRecenziju/{idOglasa}/{idRecenzije}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Boolean obrisiRecenziju(@PathParam("idOglasa") String idOglasa, @PathParam("idRecenzije") String idRecenzije, @Context HttpServletRequest request) {
		ArrayList<Recenzija> listaRecenzija = ((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getListaRecenzija();
		
		for(int i = 0; i < listaRecenzija.size(); i++) {
			if(listaRecenzija.get(i).getId().equals(idRecenzije)) {
				listaRecenzija.get(i).setObrisana(true);
			}
		}
		
		String imeKategorije = ((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getImeKategorije();
		ArrayList<Oglas> listaOglasaKategorije = ((KategorijeDAO) ctx.getAttribute("kategorijeDAO")).getKategorije().get(imeKategorije).getListaOglasa();
		
		for(int i = 0; i < listaOglasaKategorije.size(); i++) {
			if(listaOglasaKategorije.get(i).getId().equals(idOglasa)) {
				for(int j = 0; j < listaOglasaKategorije.get(i).getListaRecenzija().size(); j++) {
					if(listaOglasaKategorije.get(i).getListaRecenzija().get(j).getId().equals(idRecenzije)) {
						listaOglasaKategorije.get(i).getListaRecenzija().get(j).setObrisana(true);
						break;
					}
				}
			}
		}
		
		return true;
	}
	
	@PUT
	@Path("izmeniRecenziju/{idOglasa}/{idRecenzije}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Boolean izmeniRecenziju(@PathParam("idOglasa") String idOglasa, @PathParam("idRecenzije") String idRecenzije, Recenzija recenzija, @Context HttpServletRequest request) {
		ArrayList<Recenzija> listaRecenzija = ((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getListaRecenzija();
		
		for(int i = 0; i < listaRecenzija.size(); i++) {
			if(listaRecenzija.get(i).getId().equals(idRecenzije)) {
				listaRecenzija.get(i).setNaslovRecenzije(recenzija.getNaslovRecenzije());
				listaRecenzija.get(i).setSadrzajRecenzije(recenzija.getSadrzajRecenzije());
				listaRecenzija.get(i).setStringSlike(recenzija.getStringSlike());
				listaRecenzija.get(i).setIspostovanDogovor(recenzija.getIspostovanDogovor());
				listaRecenzija.get(i).setOpisIzOglasaTacan(recenzija.getOpisIzOglasaTacan());
				break;
			}
		}
		
		String imeKategorije = ((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getImeKategorije();
		ArrayList<Oglas> listaOglasaKategorije = ((KategorijeDAO) ctx.getAttribute("kategorijeDAO")).getKategorije().get(imeKategorije).getListaOglasa();
		
		for(int i = 0; i < listaOglasaKategorije.size(); i++) {
			if(listaOglasaKategorije.get(i).getId().equals(idOglasa)) {
				for(int j = 0; j < listaOglasaKategorije.get(i).getListaRecenzija().size(); j++) {
					if(listaOglasaKategorije.get(i).getListaRecenzija().get(j).getId().equals(idRecenzije)) {
						listaOglasaKategorije.get(i).getListaRecenzija().get(j).setNaslovRecenzije(recenzija.getNaslovRecenzije());
						listaOglasaKategorije.get(i).getListaRecenzija().get(j).setSadrzajRecenzije(recenzija.getSadrzajRecenzije());
						listaOglasaKategorije.get(i).getListaRecenzija().get(j).setStringSlike(recenzija.getStringSlike());
						listaOglasaKategorije.get(i).getListaRecenzija().get(j).setIspostovanDogovor(recenzija.getIspostovanDogovor());
						listaOglasaKategorije.get(i).getListaRecenzija().get(j).setOpisIzOglasaTacan(recenzija.getOpisIzOglasaTacan());
						break;
					}
				}
			}
		}
		
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik prodavac = korisnikDAO.getKorisnici().get(((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getKorisnickoImeProdavca());
		///////////////////// ZA AUTOMATSKU PORUKU ///////////////////////////////////////////////////
		Poruka poruka = new Poruka();
			
		poruka.setId(UUID.randomUUID().toString());
		poruka.setNaslovPoruke("AUTOMATSKA PORUKA");
		poruka.setSadrzajPoruke("Kupac " + ulogovanKorisnik.getKorisnickoIme() + " je izmenio recenziju na Vašem oglasu " + ((OglasiDAO) ctx.getAttribute("oglasiDAO")).getOglasi().get(idOglasa).getNaziv() + ".");
			
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String datum = formatter.format(date);
			
		poruka.setDatumVremePoruke(datum);
		poruka.setPosiljalac("MEGAFON");

		poruka.setMozeDaOdgovori(false);
		poruka.setObrisana(false);
		
		prodavac.getListaPoruka().add(poruka);
		
		return true;
	}
}
