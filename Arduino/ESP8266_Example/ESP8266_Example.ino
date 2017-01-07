#include <ESP8266WiFi.h>
#include "DHT.h"

const char* ssid = "your-ssid";
const char* password = "your-password";

WiFiServer server(80);
DHT dht;

void setup() {
  Serial.begin(115200);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  
  server.begin();
  Serial.println("Server started");

  Serial.println(WiFi.localIP());

  dht.setup(2);
}

void loop() {
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  
  while(!client.available()){
    delay(1);
  }
  
  String req = client.readStringUntil('\r');
  client.flush();

  int humidity = dht.getHumidity();
  int temperature = dht.getTemperature();
  int output = 0;
  
  if (req.indexOf("/temperature") != -1)
    output = temperature;
  else if (req.indexOf("/humidity") != -1)
    output = humidity;
  else {
    Serial.println("invalid request");
    client.stop();
    return;
  }

  client.flush();
  String s = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<!DOCTYPE HTML>\r\n<html>\r\n";
  s += output;
  s += "</html>\n";

  client.print(s);
  delay(1);
  Serial.println("Client disonnected");
}

