package services;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
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

@Path("korisnici")
public class KorisnikServis {
	
	@Context
	ServletContext ctx;
	
	public KorisnikServis() {
		
	}
	
	@PostConstruct
	public void init() {
		if (ctx.getAttribute("korisnikDAO")== null)
		{
			ctx.setAttribute("korisnikDAO", new KorisnikDAO(ctx.getRealPath("")));
		}
	}
/////////////// KUPAC /////////////////////////////////////////////////////////////////////////////////////////////	
	@PUT
	@Path("dodajUOmiljene")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dodajUOmiljene(Oglas oglas, @Context HttpServletRequest request) {
		
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO"); // PREUZMI SVE KORISNIKE DA IZMENIS KORISNIKA DIREKTNO U MAPI
		ArrayList<Oglas> listaOmiljenih = korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaOmiljenih(); // NIZ IZ KORISNICKE MAPE
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO"); // PREUZMI SVE OGLASE DA IZMENIS OMILJENI BROJ
		Oglas detaljanOglas = oglasiDAO.getOglasi().get(oglas.getId()); // PREUZMI OGLAS SA SVIM DETALJIMA KOJI SE DODAJE U KORISNICKU LISTU
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO"); // PREUZMI SVE KATEGORIJE DA IZMENIS POTREBNU LISTU OGLASA
		ArrayList<Oglas> listaOglasaKategorije = kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa();
		
		int staro = detaljanOglas.getBrojListaOmiljenih(); // ONO STO ZELIM DA PROMENIM		
			
		int j = 0;
			
			for(Oglas o : listaOmiljenih) {
				if(detaljanOglas.getId().equals(o.getId())) {
					
					korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaOmiljenih().remove(j);
					oglasiDAO.getOglasi().get(oglas.getId()).setBrojListaOmiljenih(staro - 1);
					
					int i = 0;
					for(Oglas og : listaOglasaKategorije) {
						if(og.getId().equals(oglas.getId())) {
								kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setBrojListaOmiljenih(staro - 1);;
								break;
						}
						i++;
					}
					
					return true;
				}
				j++;
			}
			
			korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaOmiljenih().add(detaljanOglas);
			oglasiDAO.getOglasi().get(oglas.getId()).setBrojListaOmiljenih(staro + 1);
			
			int i = 0;
			for(Oglas og : listaOglasaKategorije) {
					if(og.getId().equals(oglas.getId())) {
						kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setBrojListaOmiljenih(staro + 1);
						break;
					}
					i++;
			}
			
			return true;

	}
	
	@PUT
	@Path("dodajULajkovane")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dodajULajkovane(Oglas oglas, @Context HttpServletRequest request) {
		
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO"); // PREUZMI SVE KORISNIKE DA IZMENIS KORISNIKA DIREKTNO U MAPI
		ArrayList<Oglas> listaLajkovanih = korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaLajkovanih(); // NIZ IZ KORISNICKE MAPE
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO"); // PREUZMI SVE OGLASE DA IZMENIS OMILJENI BROJ
		Oglas detaljanOglas = oglasiDAO.getOglasi().get(oglas.getId()); // PREUZMI OGLAS SA SVIM DETALJIMA KOJI SE DODAJE U KORISNICKU LISTU
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO"); // PREUZMI SVE KATEGORIJE DA IZMENIS POTREBNU LISTU OGLASA
		
		ArrayList<Oglas> listaOglasaKategorije = kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa();
		
		int staro = detaljanOglas.getBrojLajkova(); // ONO STO ZELIM DA PROMENIM	
			
			int j = 0;
			
			for(Oglas o : listaLajkovanih) {
				if(detaljanOglas.getId().equals(o.getId())) {
					
					korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaLajkovanih().remove(j);
					oglasiDAO.getOglasi().get(oglas.getId()).setBrojLajkova(staro - 1);
					
						int i = 0;
						for(Oglas og : listaOglasaKategorije) {
							if(og.getId().equals(oglas.getId())) {
								kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setBrojLajkova(staro - 1);;
								break;
							}
							i++;
						}
					
					return true;
				}
				j++;
			}
			
			korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaLajkovanih().add(detaljanOglas);
			oglasiDAO.getOglasi().get(oglas.getId()).setBrojLajkova(staro + 1);
			
				int i = 0;
				for(Oglas og : listaOglasaKategorije) {
					if(og.getId().equals(oglas.getId())) {
						kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setBrojLajkova(staro + 1);
						break;
					}
					i++;
				}
			
			return true;

	}
	
	@PUT
	@Path("dodajUDislajkovane")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dodajUDislajkovane(Oglas oglas, @Context HttpServletRequest request) {
		
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO"); // PREUZMI SVE KORISNIKE DA IZMENIS KORISNIKA DIREKTNO U MAPI
		ArrayList<Oglas> listaDislajkovanih = korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaDislajkovanih(); // NIZ IZ KORISNICKE MAPE
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO"); // PREUZMI SVE OGLASE DA IZMENIS OMILJENI BROJ
		Oglas detaljanOglas = oglasiDAO.getOglasi().get(oglas.getId()); // PREUZMI OGLAS SA SVIM DETALJIMA KOJI SE DODAJE U KORISNICKU LISTU
		
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO"); // PREUZMI SVE KATEGORIJE DA IZMENIS POTREBNU LISTU OGLASA
		
		ArrayList<Oglas> listaOglasaKategorije = kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa();
		
		int staro = detaljanOglas.getBrojDislajkova(); // ONO STO ZELIM DA PROMENIM	
			
			int j = 0;
			
			for(Oglas o : listaDislajkovanih) {
				if(detaljanOglas.getId().equals(o.getId())) {
					
					korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaDislajkovanih().remove(j);
					oglasiDAO.getOglasi().get(oglas.getId()).setBrojDislajkova(staro - 1);
					
						int i = 0;
						for(Oglas og : listaOglasaKategorije) {
							if(og.getId().equals(oglas.getId())) {
								kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setBrojDislajkova(staro - 1);;
								break;
							}
							i++;
						}
					
					return true;
				}
				j++;
			}
			
			korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).getListaDislajkovanih().add(detaljanOglas);
			oglasiDAO.getOglasi().get(oglas.getId()).setBrojDislajkova(staro + 1);
			
				int i = 0;
				for(Oglas og : listaOglasaKategorije) {
					if(og.getId().equals(oglas.getId())) {
						kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setBrojDislajkova(staro + 1);
						break;
					}
					i++;
				}
			
			return true;

	}
	
	@POST
	@Path("promeniSlicicuDetalja")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Integer> promeniSlicicu(Oglas oglas, @Context HttpServletRequest request) {
		ArrayList<Integer> parametri = new ArrayList<Integer>();
		
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		ArrayList<Oglas> listaOmiljenih = k.getListaOmiljenih();
		ArrayList<Oglas> listaLajkovanih = k.getListaLajkovanih();
		ArrayList<Oglas> listaDislajkovanih = k.getListaDislajkovanih();
		
		for(Oglas o : listaOmiljenih) {
			if(oglas.getId().equals(o.getId())) {
				parametri.add(1);
				break;
			}
		}
		
		if(parametri.size() != 1) {
			parametri.add(0);
		}
		
		for(Oglas o : listaLajkovanih) {
			if(oglas.getId().equals(o.getId())) {
				parametri.add(1);
				break;
			}
		}
		
		if(parametri.size() != 2) {
			parametri.add(0);
		}
		
		for(Oglas o : listaDislajkovanih) {
			if(oglas.getId().equals(o.getId())) {
				parametri.add(1);
				break;
			}
		}
		
		if(parametri.size() != 3) {
			parametri.add(0);
		}
		
		return parametri;
	}
	
	@GET
	@Path("listaOmiljenih")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> listaOmiljenih(@Context HttpServletRequest request) {
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> filter = new ArrayList<Oglas>();
		
		for(Oglas o : ulogovanKorisnik.getListaOmiljenih()) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan()) {
				filter.add(o);
			}
		}
		
		return filter;
	}
	
	@PUT
	@Path("dodajUPorucene")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dodajUPorucene(Oglas oglas, @Context HttpServletRequest request) {
		
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		for(int i = 0; i < ulogovanKorisnik.getListaOmiljenih().size(); i++) {
			if(ulogovanKorisnik.getListaOmiljenih().get(i).getId().equals(oglas.getId())) {
				ulogovanKorisnik.getListaOmiljenih().remove(i);
			}
		}
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		oglasiDAO.getOglasi().get(oglas.getId()).setStatus("U REALIZACIJI");
		Oglas detaljanOglas = oglasiDAO.getOglasi().get(oglas.getId());
		
		ulogovanKorisnik.getListaPorucenih().add(detaljanOglas);
			
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		ArrayList<Oglas> listaUKategorijama;
		
		listaUKategorijama = kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa();
		
		for(int i = 0; i < listaUKategorijama.size(); i++) {
			if(listaUKategorijama.get(i).getId().equals(oglas.getId())){
				kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setStatus("U REALIZACIJI");
			}
		}
		
	
		return true;
	}
	
	@GET
	@Path("listaPorucenih")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> listaPorucenih(@Context HttpServletRequest request) {
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> filter = new ArrayList<Oglas>();
		
		for(Oglas o : k.getListaPorucenih()) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan()) {
				filter.add(oglasiDAO.getOglasi().get(o.getId()));
			}
		}
		
		return filter;
	}
	
	@GET
	@Path("listaDostavljenih")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> listaDostavljenih(@Context HttpServletRequest request) {
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> filter = new ArrayList<Oglas>();
		
		for(Oglas o : k.getListaDostavljenih()) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan()) {
				filter.add(oglasiDAO.getOglasi().get(o.getId()));
			}
		}
		
		return filter;
	}
	
	@GET
	@Path("listaPrijavljenih")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> listaPrijavljenih(Oglas oglas, @Context HttpServletRequest request) {
		Korisnik k = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> filter = new ArrayList<Oglas>();
		
		for(Oglas o : k.getListaPrijavljenih()) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan()) {
				filter.add(oglasiDAO.getOglasi().get(o.getId()));
			}
		}
		
		
		return filter;
	}
	
	@PUT
	@Path("dodajUDostavljene")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean dodajUDostavljene(Oglas oglas, @Context HttpServletRequest request) {
			
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		for(int i = 0; i < ulogovanKorisnik.getListaPorucenih().size(); i++) {
			if(ulogovanKorisnik.getListaPorucenih().get(i).getId().equals(oglas.getId())) {
				ulogovanKorisnik.getListaPorucenih().remove(i);
				break;
			}
		}
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		oglasiDAO.getOglasi().get(oglas.getId()).setStatus("DOSTAVLJEN");
		Oglas detaljanOglas = oglasiDAO.getOglasi().get(oglas.getId());
		
		ulogovanKorisnik.getListaDostavljenih().add(detaljanOglas);
			
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		ArrayList<Oglas> listaUKategorijama;
		
		listaUKategorijama = kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa();
		
		for(int i = 0; i < listaUKategorijama.size(); i++) {
			if(listaUKategorijama.get(i).getId().equals(oglas.getId())){
				kategorijeDAO.getKategorije().get(detaljanOglas.getImeKategorije()).getListaOglasa().get(i).setStatus("DOSTAVLJEN");
			}
		}
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		korisnikDAO.getKorisnici().get(detaljanOglas.getKorisnickoImeProdavca()).getListaIsporucenih().add(detaljanOglas);
		
		Korisnik prodavac = korisnikDAO.getKorisnici().get(oglasiDAO.getOglasi().get(oglas.getId()).getKorisnickoImeProdavca());
		///////////////////// ZA AUTOMATSKU PORUKU ///////////////////////////////////////////////////
		Poruka poruka = new Poruka();
			
		poruka.setId(UUID.randomUUID().toString());
		poruka.setNaslovPoruke("AUTOMATSKA PORUKA");
		poruka.setSadrzajPoruke("Kupac " + ulogovanKorisnik.getKorisnickoIme() + " je označio oglas " + oglasiDAO.getOglasi().get(oglas.getId()).getNaziv() + " dostavljenim.");
			
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
////////////////// PRODAVAC ///////////////////////////////////////////////////////////////////////////////////////////////
	@GET
	@Path("sviLajkoviDislajkovi")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Integer> sviLajkoviDislajkovi(@Context HttpServletRequest request) {
		ArrayList<Integer> lajkdislajk = new ArrayList<Integer>();
		
		Korisnik prodavac = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> oglasi = new ArrayList<Oglas>(oglasiDAO.getOglasi().values());
		
		int lajkovi = 0;
		int dislajkovi = 0;
		
		for(Oglas o : oglasi) {
			if(o.getKorisnickoImeProdavca().equals(prodavac.getKorisnickoIme()) && !(o.getObrisan())) {
				lajkovi += o.getBrojLajkova();
				dislajkovi += o.getBrojDislajkova();
			}
		}
		
		lajkdislajk.add(lajkovi);
		lajkdislajk.add(dislajkovi);
		
		( (Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).setBrojLajkova(lajkovi);
		( (Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).setBrojDislajkova(dislajkovi);

		return lajkdislajk;
	}
	
	@GET
	@Path("getProdavacListaRecenzija")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Recenzija> getProdavacListaRecenzija(@Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Recenzija> listaRecenzija = new ArrayList<Recenzija>();
		
		ArrayList<Oglas> oglasi = ((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getListaIsporucenih();
		
		for(Oglas o : oglasi) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan()) {
				for(Recenzija r : o.getListaRecenzija()) {
					r.setNazivOglasa(o.getNaziv());
					listaRecenzija.add(r);
				}
			}
		}
		
		return listaRecenzija;
	}	
	
	@GET
	@Path("listaMojihOglasa")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Oglas> listaMojihOglasa(@Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		
		ArrayList<Oglas> filtrirano = new ArrayList<Oglas>();
		
		for(Oglas o : ((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getListaObjavljenih()) {
			if(!oglasiDAO.getOglasi().get(o.getId()).getObrisan()) {
				filtrirano.add(oglasiDAO.getOglasi().get(o.getId()));
			}
		}
		
		return filtrirano;
	}
	
	@POST
	@Path("dodajNoviOglas")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean dodajNoviOglas(Oglas o, @Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");
		
		Oglas oglas = new Oglas();
		
		oglas.setNaziv(o.getNaziv());
		oglas.setCena(o.getCena());
		oglas.setOpis(o.getOpis());
		oglas.setStringSlike(o.getStringSlike());
		oglas.setDatumIsticanja(o.getDatumIsticanja());
		oglas.setImeKategorije(o.getImeKategorije());
		
		oglas.setGrad(((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getGrad());
		oglas.setKorisnickoImeProdavca(((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getKorisnickoIme());
		oglas.setId(UUID.randomUUID().toString());
		oglas.setBrojLajkova(0);
		oglas.setBrojDislajkova(0);
		
		Date datum = new Date();
		SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
		oglas.setDatumPostavljanja(format.format(datum));
		
		oglas.setStatus("AKTIVAN");
		oglas.setBrojListaOmiljenih(0);
		
		((Korisnik)request.getSession().getAttribute("ulogovanKorisnik")).getListaObjavljenih().add(oglas);
		
		oglasiDAO.getOglasi().put(oglas.getId(), oglas);
		
	
		
		kategorijeDAO.getKategorije().get(o.getImeKategorije()).getListaOglasa().add(oglas);
		
		return true;
	}
	
	@DELETE
	@Path("obrisiOglas")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean obrisiOglas(Oglas o, @Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		KategorijeDAO kategorijeDAO = (KategorijeDAO) ctx.getAttribute("kategorijeDAO");

		if(oglasiDAO.getOglasi().get(o.getId()).getStatus().equals("AKTIVAN") || ((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getUloga().equals("ADMIN")) {
			oglasiDAO.getOglasi().get(o.getId()).setObrisan(true);			
		}
		else {
			return false;
		}
		
		String imeKategorije = oglasiDAO.getOglasi().get(o.getId()).getImeKategorije();
		
		ArrayList<Oglas> listaUKategorijama = kategorijeDAO.getKategorije().get(imeKategorije).getListaOglasa();
		
		for(int i = 0; i < listaUKategorijama.size(); i++) {
			if(listaUKategorijama.get(i).getId().equals(o.getId())){
				kategorijeDAO.getKategorije().get(imeKategorije).getListaOglasa().get(i).setObrisan(true);
				break;
			}
		}
		
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
		Korisnik admin = (Korisnik) request.getSession().getAttribute("admin");
		///////////////////// ZA AUTOMATSKU PORUKU ///////////////////////////////////////////////////
		if(ulogovanKorisnik.getUloga().equals("PRODAVAC")) {
			Poruka poruka = new Poruka();
			
			poruka.setId(UUID.randomUUID().toString());
			poruka.setNaslovPoruke("AUTOMATSKA PORUKA");
			poruka.setSadrzajPoruke("Prodavac " + ulogovanKorisnik.getKorisnickoIme() + " je obrisao oglas " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
			
			Date date = new Date();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			String datum = formatter.format(date);
			
			poruka.setDatumVremePoruke(datum);
			poruka.setPosiljalac("MEGAFON");

			poruka.setMozeDaOdgovori(false);
			poruka.setObrisana(false);
			admin.getListaPoruka().add(poruka);
		}
		else {
			/// POSALJI PRODAVCU PORUKU
			Poruka poruka = new Poruka();
			
			poruka.setId(UUID.randomUUID().toString());
			poruka.setNaslovPoruke("AUTOMATSKA PORUKA");
			poruka.setSadrzajPoruke("Administrator " + ulogovanKorisnik.getKorisnickoIme() + " je obrisao Vaš oglas " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
			
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
				poruka1.setSadrzajPoruke("Administrator " + ulogovanKorisnik.getKorisnickoIme() + " je obrisao oglas Vašeg dostavljenog proizvoda " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
				
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
				poruka1.setSadrzajPoruke("Administrator " + ulogovanKorisnik.getKorisnickoIme() + " je obrisao oglas Vašeg poručenog proizvoda " + oglasiDAO.getOglasi().get(o.getId()).getNaziv() + ".");
				
				poruka1.setDatumVremePoruke(datum);
				poruka1.setPosiljalac("MEGAFON");

				poruka1.setMozeDaOdgovori(false);
				poruka1.setObrisana(false);
				
				kupacPoruceno.getListaPoruka().add(poruka1);
			}
		}
		
		
		return true;
	}
	
	@GET
	@Path("listaKorisnika")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Korisnik> listaKorisnika(@Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>(korisnikDAO.getKorisnici().values());
		ArrayList<Korisnik> filter = new ArrayList<Korisnik>();
		
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		for(Korisnik k : korisnici) {
			if(!k.getKorisnickoIme().equals(ulogovanKorisnik.getKorisnickoIme())) {
				filter.add(k);
			}
		}
		
		
		return filter;
		
	}
	
	@POST
	@Path("izmeniTipKorisnika")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean izmeniTipKorisnika(Korisnik k, @Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik korisnik = korisnikDAO.getKorisnici().get(k.getKorisnickoIme());
		
		int prazno = 0;
		
		if(korisnik.getListaDislajkovanih().size() > 0 || korisnik.getListaDostavljenih().size() > 0 || korisnik.getListaIsporucenih().size() > 0 || korisnik.getListaLajkovanih().size() > 0 || korisnik.getListaObjavljenih().size() > 0 || korisnik.getListaOmiljenih().size() > 0 || korisnik.getListaPorucenih().size() > 0 || korisnik.getListaPoruka().size() > 0) {
			prazno = 1;
		}
		
		if(prazno != 1) {
			if(korisnik.getUloga().equals("KUPAC")) {
				korisnik.setUloga("PRODAVAC");
			}
			else {
				korisnik.setUloga("KUPAC");			
			}
			return true;
		}
		
		
		return false;
	}
	
	@PUT
	@Path("pretragaKorisnika")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Korisnik> pretragaKorisnika(Korisnik k, @Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>(korisnikDAO.getKorisnici().values());
		
		ArrayList<Korisnik> filter = new ArrayList<Korisnik>();
				
		for(Korisnik korisnik : korisnici) {
			if(korisnik.getKorisnickoIme().contains(k.getKorisnickoIme()) && ((korisnik.getGrad().equals(k.getGrad()) || k.getGrad().contains("Svi gradovi")))) {
				if(!korisnik.getKorisnickoIme().equals(ulogovanKorisnik.getKorisnickoIme())) {
					filter.add(korisnik);
				}
			}
		}		
				
		return filter;
	}
/////////// PRIJAVA	
	@PUT
	@Path("prijaviOglas")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean prijaviOglas(Oglas oglas, @Context HttpServletRequest request) {
		
		OglasiDAO oglasiDAO = (OglasiDAO) ctx.getAttribute("oglasiDAO");
		String prodavac = oglasiDAO.getOglasi().get(oglas.getId()).getKorisnickoImeProdavca();
		
		((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getListaPrijavljenih().add(oglas);
		
		for(Oglas o : ((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getListaDostavljenih()) {
			if(o.getId().equals(oglas.getId())) {
				 ((Korisnik) request.getSession().getAttribute("ulogovanKorisnik")).getListaDostavljenih().remove(o);
				 break;
			}
		}
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		int stariBroj = korisnikDAO.getKorisnici().get(prodavac).getUpozorenja();
		
		korisnikDAO.getKorisnici().get(prodavac).setUpozorenja(stariBroj+1);
		////////// PORUKA
		Korisnik admin = (Korisnik) request.getSession().getAttribute("admin");
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		Korisnik prodavacObjekat = (Korisnik) korisnikDAO.getKorisnici().get(prodavac);
		Poruka poruka1 = new Poruka();
		
		poruka1.setId(UUID.randomUUID().toString());
		poruka1.setNaslovPoruke("Upozorenje");
		poruka1.setSadrzajPoruke("Kupac " + ulogovanKorisnik.getKorisnickoIme() + " je prijavio Vaš oglas " + oglasiDAO.getOglasi().get(oglas.getId()).getNaziv() + ". Ukoliko Vaš nalog primi više od tri prijave nećete biti u mogućnosti da kreirate nove oglase. Vaš trenutni broj prijava je " + prodavacObjekat.getUpozorenja() + ".");
		
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String datum = formatter.format(date);
		
		poruka1.setDatumVremePoruke(datum);
		poruka1.setPosiljalac("ADMINISTRATOR " + admin.getKorisnickoIme());

		poruka1.setMozeDaOdgovori(false);
		poruka1.setObrisana(false);
		
		prodavacObjekat.getListaPoruka().add(poruka1);
				
		return true;
	}
	
	@PUT
	@Path("detaljiKorisnika")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik detaljiKorisnika(Korisnik k, @Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		return korisnikDAO.getKorisnici().get(k.getKorisnickoIme());
		
	}
/////////// PRIJAVA
	@PUT
	@Path("skiniPrijavu")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean skiniPrijavu(Korisnik k, @Context HttpServletRequest request) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		korisnikDAO.getKorisnici().get(k.getKorisnickoIme()).setUpozorenja(0);
		return true;
		
	}
//////////////// PORUKA	
	@GET
	@Path("listaPoruka")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Poruka> listaPoruka(@Context HttpServletRequest request) {
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		ArrayList<Poruka> poruke = new ArrayList<Poruka>(ulogovanKorisnik.getListaPoruka());
		ArrayList<Poruka> filter = new ArrayList<Poruka>();
		
		for(Poruka p : poruke) {
			if(!p.getObrisana()) {
				filter.add(p);
			}
		}
		
		return filter;
		
	}
	
	@POST
	@Path("posaljiPoruku")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean posaljiPoruku(Poruka p, @Context HttpServletRequest request) {
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		Poruka mojInboks = new Poruka();
		
		String idPoruke = UUID.randomUUID().toString();
		mojInboks.setId(idPoruke);
		
		mojInboks.setNaslovPoruke(p.getNaslovPoruke());
		mojInboks.setSadrzajPoruke(p.getSadrzajPoruke());
		
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String datum = formatter.format(date);
		
		mojInboks.setDatumVremePoruke(datum);
		mojInboks.setPosiljalac("JA");


		mojInboks.setMozeDaOdgovori(false);
		mojInboks.setObrisana(false);
		
		ulogovanKorisnik.getListaPoruka().add(mojInboks);
		
		Poruka poslata = new Poruka();
		
		poslata.setId(idPoruke);
		poslata.setNaslovPoruke(p.getNaslovPoruke());
		poslata.setSadrzajPoruke(p.getSadrzajPoruke());
		
		poslata.setDatumVremePoruke(datum);
		poslata.setPosiljalac(ulogovanKorisnik.getKorisnickoIme());


		poslata.setMozeDaOdgovori(true);
		poslata.setObrisana(false);
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik primalac = korisnikDAO.getKorisnici().get(p.getId());
		primalac.getListaPoruka().add(poslata);
		
		poslata.setPrimalac(primalac.getKorisnickoIme());
		mojInboks.setPrimalac(primalac.getKorisnickoIme());
		
		return true;
		
	}
	
	@POST
	@Path("odgovoriNaPoruku")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean odgovoriNaPoruku(Poruka p, @Context HttpServletRequest request) {
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		Poruka mojInboks = new Poruka();
		
		String idPoruke = UUID.randomUUID().toString();
		
		mojInboks.setId(idPoruke);
		mojInboks.setNaslovPoruke(p.getNaslovPoruke());
		mojInboks.setSadrzajPoruke(p.getSadrzajPoruke());
		
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String datum = formatter.format(date);
		
		mojInboks.setDatumVremePoruke(datum);
		mojInboks.setPosiljalac("JA");
		

		mojInboks.setMozeDaOdgovori(false);
		mojInboks.setObrisana(false);
		
		ulogovanKorisnik.getListaPoruka().add(mojInboks);
		
		Poruka poslata = new Poruka();
		
		poslata.setId(idPoruke);
		poslata.setNaslovPoruke(p.getNaslovPoruke());
		poslata.setSadrzajPoruke(p.getSadrzajPoruke());
		
		poslata.setDatumVremePoruke(datum);
		poslata.setPosiljalac(ulogovanKorisnik.getKorisnickoIme());


		poslata.setMozeDaOdgovori(true);
		poslata.setObrisana(false);
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik primalac = korisnikDAO.getKorisnici().get(p.getId());
		primalac.getListaPoruka().add(poslata);
		
		poslata.setPrimalac(primalac.getKorisnickoIme());
		mojInboks.setPrimalac(primalac.getKorisnickoIme());
		
		return true;
		
	}
	
	@GET
	@Path("detaljiPoruke/{idOdgovora}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Poruka detaljiPoruke(@PathParam("idOdgovora") String idPoruke, @Context HttpServletRequest request) {
		Poruka poruka = null;
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		for(Poruka por : ulogovanKorisnik.getListaPoruka()) {
			if(por.getId().equals(idPoruke)) {
				poruka = por;
				break;
			}
		}
		
		
		return poruka;
	}
	
	@DELETE
	@Path("obrisiPoruku")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean obrisiPoruku(Poruka p, @Context HttpServletRequest request) {
		
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");

		for(Poruka por : ulogovanKorisnik.getListaPoruka()) {
			if(por.getId().equals(p.getId())) {
				por.setObrisana(true);
				break;
			}
		}
		
		return true;
	}
	
	@PUT
	@Path("izmeniPoruku")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Boolean izmeniPoruku(Poruka p, @Context HttpServletRequest request) {
		
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String datum = sdf.format(date);
		
		Korisnik ulogovanKorisnik = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		String primalac = "";
		for(Poruka por : ulogovanKorisnik.getListaPoruka()) {
			if(por.getId().equals(p.getId())) {
				por.setNaslovPoruke(p.getNaslovPoruke());
				por.setSadrzajPoruke(p.getSadrzajPoruke());
				por.setDatumVremePoruke(datum);
				primalac = por.getPrimalac();
				break;
			}
		}
		
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		ArrayList<Poruka> poruke = korisnikDAO.getKorisnici().get(primalac).getListaPoruka();
		
		for(Poruka por : poruke) {
			if(por.getId().equals(p.getId())) {
				por.setNaslovPoruke(p.getNaslovPoruke());
				por.setSadrzajPoruke(p.getSadrzajPoruke());
				por.setDatumVremePoruke(datum);
				break;
			}
		}
		
		return true;
	}

}
