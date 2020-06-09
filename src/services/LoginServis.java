package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Korisnik;
import dao.KategorijeDAO;
import dao.KorisnikDAO;
import dao.OglasiDAO;

@Path("")
public class LoginServis {
	
	@Context
	ServletContext ctx;
	
	public LoginServis() {
		
	}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("korisnikDAO")== null)
		{
			ctx.setAttribute("korisnikDAO", new KorisnikDAO(ctx.getRealPath("")));
		}
	}
	
	@GET
	@Path("korisnici")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Collection<Korisnik> getKorisnici(@Context HttpServletRequest request) {
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");		
		
		return korisnikDAO.findAll();
	}
	
	@POST
	@Path("login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik login(Korisnik korisnik, @Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik ulogovanKorisnik = korisnikDAO.find(korisnik.getKorisnickoIme(), korisnik.getLozinka());
		
		if (ulogovanKorisnik == null) {
			return null;
		}
		request.getSession().setAttribute("ulogovanKorisnik", ulogovanKorisnik);
		
		ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>(korisnikDAO.getKorisnici().values());
		
		for(Korisnik k : korisnici) {
			if(k.getUloga().equals("ADMIN")) {
				request.getSession().setAttribute("admin", k);
				break;
			}
		}
		
		return ulogovanKorisnik;
	}
	
	@GET
	@Path("logout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void logout(@Context HttpServletRequest request) {
		KorisnikDAO sviKorisnici = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		OglasiDAO sviOglasi = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		KategorijeDAO sveKategorije = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		
		sviKorisnici.sacuvajKorisnike(ctx.getRealPath(""));
		sviOglasi.sacuvajOglase(ctx.getRealPath(""));
		sveKategorije.sacuvajKategorije(ctx.getRealPath(""));
		
		request.getSession().invalidate();
	}
	
	@POST
	@Path("registracija")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean register(Korisnik korisnik, @Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik k = korisnikDAO.find(korisnik.getKorisnickoIme(), korisnik.getLozinka());
		if (k == null) {		
			korisnikDAO.getKorisnici().put(korisnik.getKorisnickoIme(), korisnik) ;	
			korisnikDAO.sacuvajKorisnike(ctx.getRealPath(""));
			return true ;
		}
		
		return false;
	}
	
	@GET
	@Path("ulogovanKorisnik")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik ulogovanKorisnik(@Context HttpServletRequest request) {
		return (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
	}

}
