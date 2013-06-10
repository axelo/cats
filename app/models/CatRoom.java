package models;

import java.util.concurrent.ConcurrentLinkedQueue;

import play.mvc.WebSocket;
import akka.actor.UntypedActor;

public class CatRoom extends UntypedActor  {

	private ConcurrentLinkedQueue<WebSocket.Out<String>> members = new ConcurrentLinkedQueue<WebSocket.Out<String>>();
	
	@Override
	public void onReceive(Object message) throws Exception {
		if (message instanceof Join) {
			
		}
	}

	public static class Join {
		public final WebSocket.Out<String> channel;
		
		public Join(WebSocket.Out<String> channel) {
			this.channel = channel;
		}
	}
	
}
