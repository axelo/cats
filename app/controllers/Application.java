package controllers;

import java.util.List;

import models.Cat;

import org.codehaus.jackson.JsonNode;

import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;

public class Application extends Controller {
  
    public static Result findAll() {
    	List<Cat> Cats = Cat.find.all();
    	
    	return ok(Json.toJson(Cats));
    	
    }
    
    public static Result getCat(Long id) {
    	Cat cat = Cat.find.byId(id);
    	return ok(Json.toJson(cat));
    }
    
    @BodyParser.Of(BodyParser.Json.class)
    public static Result createCat() {
    	JsonNode jsonCat = request().body().asJson();
    	
    	Cat cat = Json.fromJson(jsonCat, Cat.class);
    	cat.save();
    	
    	return ok();
    }
    
//    public static Result update() {
//    	cat.save();
//    	
//    	return ok();
//    }
}
