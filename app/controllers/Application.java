package controllers;

import java.util.Arrays;

import models.Cat;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class Application extends Controller {
  
    public static Result findAll() {
    	
    	Cat katten = new Cat();
    	
    	katten.id = 1L;
    	katten.comment = "Så att...";
    	katten.name = "Tiger";
    	katten.pictureUrl = "http://images4.fanpop.com/image/photos/16100000/-cats-16140154-1920-1080.jpg";
    	katten.score = 10;
    	

    	Cat katten1 = new Cat();
    	
    	katten1.id = 2L;
    	katten1.comment = "Äckel gillar att gå på ditt ansikte när du sover, älskar att bajsa i soffan för att så att du ska känna dig överraskad när du sätter dig där. Samt är en jävle på att putta ner telefoner från bord osv....";
    	katten1.name = "Äckel";
    	katten1.pictureUrl = "http://legacy-cdn.smosh.com/smosh-pit/122010/ugly-cat-9.jpg";
    	katten1.score = -20;
    	
    	return ok(Json.toJson(Arrays.asList(katten, katten1)));
    	
    }
    
    public static Result getCat(Long id) {
    	Cat katten = new Cat();
    	
    	katten.id = id;
    	katten.comment = "Så att...";
    	katten.name = "Tiger";
    	katten.pictureUrl = "http://images4.fanpop.com/image/photos/16100000/-cats-16140154-1920-1080.jpg";
    	katten.score = 10;
    	
    	return ok(Json.toJson(katten));
    }
}
