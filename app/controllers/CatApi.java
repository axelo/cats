package controllers;

import models.Cat;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class CatApi extends Controller {
  
    public static Result findAll() {
    	return ok(Json.toJson(Cat.find.all()));
    }
    
    public static Result getCat(Long id) {
    	Cat cat = Cat.find.byId(id);
    	
    	if (cat != null) {
    		return ok(Json.toJson(cat));
    	}
    	
    	return badRequest(getErrorJson("No cat found with id " + id)).as("application/json");
    }

    public static Result createCat() {
    	JsonNode jsonCat = request().body().asJson();
    	
    	Cat cat = Json.fromJson(jsonCat, Cat.class);
    	cat.id = null;
    	cat.save();
    	
    	String url = routes.CatApi.createCat().absoluteURL(request());
    	url += "/" + cat.id;
    	
    	response().setHeader(LOCATION, url);
    	
    	return created(Json.toJson(cat));
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
