package controllers;

import java.util.List;

import models.Cat;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

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
    	if (cat != null) {
    		return ok(Json.toJson(cat));
    	}
    	
    	return badRequest(getErrorJson("No cat found with id " + id)).as("application/json");
    }

	@BodyParser.Of(BodyParser.Json.class)
    public static Result createCat() {
    	JsonNode jsonCat = request().body().asJson();
    	
    	Cat cat = Json.fromJson(jsonCat, Cat.class);
    	cat.save();
    	
    	return ok();
    }
    
    public static Result update() {
    	JsonNode jsonCat = request().body().asJson();
    	
    	Cat cat = Json.fromJson(jsonCat, Cat.class);
    	cat.update();
    	
    	return ok();
    }
    
    private static ObjectNode getErrorJson(String message) {
    	ObjectNode error = Json.newObject();
    	error.put("Error", message);
    	
    	return error;
	}
}
