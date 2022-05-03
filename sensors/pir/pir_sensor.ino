#include <SPI.h>
#include <WiFi101.h>
#include "wifi_secrets.h" // Defines SECRET_SSID and SECRET_PASS

char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;     // the Wifi radio's status

void setup() {
  Serial.begin(9600);
  while (!Serial) {}

  if(WiFi.status() == WL_NO_SHIELD) {
    Serial.println("Wifi shield not present");
    while(true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv != "1.1.0") {
    Serial.println("Please upgrade the firmware");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to network: ");
    Serial.println(ssid);

    status = WiFi.begin(ssid, pass);

    // wait 10 seconds
    delay(10000);
  }

  Serial.println("connected to network");
  printWifiData();
}

void loop() {
  // wait 10 seconds
  delay(10000);
}

void printWifiData() {
  Serial.println("Board Information:");

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC address: ");
  for(int i = 5; i >= 0; --i) {
    Serial.print(mac[i], HEX);
    Serial.print(":");
  }
  Serial.println();

  Serial.println();
  Serial.println("Network Information:");
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.println(rssi);
}
