package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Kategorija;
import beans.Oglas;
import dao.KategorijeDAO;
import dao.OglasiDAO;

@Path("kategorije")
public class KategorijaServis {
	
	@Context
	ServletContext ctx;
	
	public KategorijaServis() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("kategorijeDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("kategorijeDAO", new KategorijeDAO(contextPath));
		}
	}
	
	@GET
	@Path("sveKategorije")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Kategorija> getKategorije(@Context HttpServletRequest request) {
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		ArrayList<Kategorija> kategorije = new ArrayList<Kategorija>(kategorijeDAO.getKategorije().values());
		ArrayList<Kategorija> filter = new ArrayList<Kategorija>();
		
		for(Kategorija k : kategorije) {
			if(!k.getObrisana()) {
				filter.add(k);
			}
		}
		
		return filter;
	}
	
	@POST
	@Path("podaciZaSlajder")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Integer> getPodaciZaSlajder(Kategorija k, @Context HttpServletRequest request) {
		ArrayList<Oglas> oglasi = k.getListaOglasa();
		ArrayList<Integer> podaciZaSlajder = new ArrayList<Integer>();
		
		if(oglasi.size() > 0) {
			int minCena = 0, maxCena = 0, minLajk = 0, maxLajk = 0;
			
			minCena = oglasi.get(0).getCena();
			maxCena = oglasi.get(0).getCena();
			minLajk = oglasi.get(0).getBrojLajkova();
			maxLajk =  oglasi.get(0).getBrojLajkova();
			
			if(oglasi.size() > 1) {
				for(Oglas o : oglasi) {	
					if(minCena > o.getCena()) {
						minCena = o.getCena();
					}
					
					if(maxCena < o.getCena()) {
						maxCena = o.getCena();
					}
					
					if(minLajk > o.getBrojLajkova()) {
						minLajk = o.getBrojLajkova();
					}
					
					if(maxLajk < o.getBrojLajkova()) {
						maxLajk = o.getBrojLajkova();
					}
				}
			}
			else {
				minCena = maxCena;
				minLajk = maxLajk;
			}
						
			podaciZaSlajder.add(minCena);
			podaciZaSlajder.add(maxCena);
			podaciZaSlajder.add(minLajk);
			podaciZaSlajder.add(maxLajk);
			
	
			
			return podaciZaSlajder;
		}
		
		podaciZaSlajder.add(100);
		podaciZaSlajder.add(300);
		podaciZaSlajder.add(100);
		podaciZaSlajder.add(300);
		
		return null;
		
	}
	
	@POST
	@Path("kategorisaniOglasi")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> kategorisaniOglasi(Kategorija k, @Context HttpServletRequest request) {
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		
		Kategorija dobraKategorija  = kategorijeDAO.getKategorije().get(k.getNaziv());
		
		ArrayList<Oglas> filter = new ArrayList<Oglas>();
		
		for(Oglas o : dobraKategorija.getListaOglasa()) {
			if(!o.getObrisan()) {
				filter.add(o);
			}
		}
		
		return filter;
	}
	
	@POST
	@Path("kliknutaKategorija")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean kliknutaKategorija(Kategorija k, @Context HttpServletRequest request) {
		
		request.getSession().setAttribute("kliknutaKategorija", k.getNaziv());
		return true;
	}
	
	@GET
	@Path("getKliknutaKategorija")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Kategorija getKliknutaKategorija(@Context HttpServletRequest request) {
		
		String imeKategorije = (String) request.getSession().getAttribute("kliknutaKategorija");
		
		Kategorija k;
		
		if(imeKategorije.equals("Najpopularniji oglasi")){
			k = new Kategorija();
			k.setNaziv(imeKategorije);
		}
		else {
			KategorijeDAO katDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
			k  =  katDAO.getKategorije().get(imeKategorije);
		}
		
		return k;
	}
	
	@PUT
	@Path("detaljiKategorije")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Kategorija detaljiKategorije(Kategorija k, @Context HttpServletRequest request) {
		return ((KategorijeDAO)ctx.getAttribute("kategorijeDAO")).getKategorije().get(k.getNaziv());
	}
	
	@DELETE
	@Path("obrisiKategoriju")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean obrisiKategoriju(Kategorija k, @Context HttpServletRequest request) {
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		
		if(!(kategorijeDAO.getKategorije().get(k.getNaziv()).getListaOglasa().size() > 0)) {
			kategorijeDAO.getKategorije().get(k.getNaziv()).setObrisana(true);
			return true;
		}
		
		
		return false;
	}
	
	@PUT
	@Path("izmeniKategoriju")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean izmeniKategoriju(Kategorija k, @Context HttpServletRequest request) {
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		
		Kategorija kategorija = kategorijeDAO.getKategorije().get(k.getListaParametara().get(0));
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");

		
		if(!kategorijeDAO.getKategorije().containsKey(k.getNaziv()) || (kategorijeDAO.getKategorije().containsKey(k.getNaziv()) && kategorijeDAO.getKategorije().get(k.getNaziv()).getObrisana())) {
			
			for(Oglas oglas : k.getListaOglasa()) {
				oglas.setImeKategorije(k.getNaziv());
			}
			
			ArrayList<Oglas> oglasi = new ArrayList<Oglas>(oglasiDAO.getOglasi().values());
			
			for(Oglas oglas :  oglasi){
				if(oglas.getImeKategorije().equals(k.getListaParametara().get(0))) {
					oglasiDAO.getOglasi().get(oglas.getId()).setImeKategorije(k.getNaziv());;
				}
			}
			
			kategorijeDAO.getKategorije().put(k.getNaziv(), kategorija);
			kategorijeDAO.getKategorije().remove(k.getListaParametara().get(0));
			
			kategorija.setNaziv(k.getNaziv());
			kategorija.setOpis(k.getOpis());
			return true;
		}
		
		return false;
	}
	
	@POST
	@Path("dodajKategoriju")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean dodajKategoriju(Kategorija k, @Context HttpServletRequest request) {
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");

		if(!kategorijeDAO.getKategorije().containsKey(k.getNaziv()) || (kategorijeDAO.getKategorije().containsKey(k.getNaziv()) && kategorijeDAO.getKategorije().get(k.getNaziv()).getObrisana())) {
			k.setListaOglasa(new ArrayList<Oglas>());
			k.setListaParametara(new ArrayList<String>());
			kategorijeDAO.getKategorije().put(k.getNaziv(), k);
			return true;
		}
		else {
			return false;
		}
		
	}

}
