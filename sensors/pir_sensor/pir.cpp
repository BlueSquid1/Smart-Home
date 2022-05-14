#include "pir.hh"

#include <SPI.h>
#include <wiring_digital.c>

namespace
{
    const int SERIAL_BAUD_COUNT = 9600;
    const int HTTP_PORT = 80;
}

Pir::~Pir()
{
    if(this->incomingServer) 
    {
        delete this->incomingServer;
        this->incomingServer = nullptr;
    }

    if(this->outgoingClient) 
    {
        delete this->outgoingClient;
        this->outgoingClient = nullptr;
    }
}

bool Pir::Init(const String& ssid, const String& password, const String& outgoingClientUrl, int pirPowerPin, int pirReadingPin, int ledPin) {
    this->outgoingClientUrl = outgoingClientUrl;
    this->pirPowerPin = pirPowerPin;
    this->pirReadingPin = pirReadingPin;
    this->ledPin = ledPin;

    bool validHardware = this->InitHardware();
    if(!validHardware) 
    {
        return false;
    }
    bool validSoftware = this->ConnectWifi(ssid, password);
    if(!validSoftware) 
    {
        return false;
    }
    return true;
}

bool Pir::HandleServer()
{
    // Block until a client connects
    WiFiClient client = this->incomingServer->available();
    if(client) 
    {
        Serial.println("reading connection");
        
        //Read the entire request
        String request = this->ReadHttpRequest(client);
        if(request.length() == 0)
        {
            Serial.println("failed to read incoming http request");
            return false;
        }

        bool isGetRequest = request.startsWith("GET /");
        if(!isGetRequest)
        {
            Serial.println("not a GET request");
            return false;
        }

        // Cut off 'GET /'
        String cutRequest = request.substring(5);

        // Read word until ' '
        int whiteSpaceIndex = this->FindCharInString(cutRequest);
        if(whiteSpaceIndex < 0)
        {
            Serial.println("failed to find whitespace in request");
            return false;
        }

        String requestArg = cutRequest.substring(0, whiteSpaceIndex);

        Serial.println("processing request");
        Pir::HttpResponse response = this->ProcessIncomingRequest(requestArg);

        // Send response back
        if(response.wasSuccessful) {
            client.println("HTTP/1.1 200 OK");
        } 
        else 
        {
            client.println("HTTP/1.1 500 ERR");
        }
        client.println("Content-type:text/html");
        client.println();

        client.print(response.message);
        
        // end message with a blank line
        client.println();

        client.stop();
        Serial.println("closed connection");

        if(this->restartScheduled)
        {
            NVIC_SystemReset();
        }
    }
}

bool Pir::InitHardware() 
{
    // Set of serial link.
    Serial.begin(::SERIAL_BAUD_COUNT);
    while (!Serial) {}

    // Check if board supports WiFi.
    if(WiFi.status() == WL_NO_SHIELD) 
    {
        Serial.println("Wifi shield not present");
        return false;
    }
    Serial.println("Found wifi shield");
    

    // Power on PIR.
    Serial.println("Powering up PIR sensor");
    pinMode(this->pirPowerPin, OUTPUT);
    this->RestartPir();
    Serial.println("PIR sensor turned on");

    // Use on board LED to indicate detections.
    pinMode(this->ledPin, OUTPUT);
    digitalWrite(this->ledPin, LOW);

    // This is the pin the PIR sets high when a detection event occurs.
    pinMode(this->pirReadingPin, INPUT);
    return true;
}

bool Pir::ConnectWifi(const String& ssid, const String& password)
{
    Serial.print("Attempting to connect to network: ");
    Serial.println(ssid);

    int status = WiFi.begin(ssid, password);

    while (status != WL_CONNECTED) 
    {
         // wait 10 seconds
        delay(10000);

        Serial.print("Trying to connect to network again");
        status = WiFi.begin(ssid, password);
    }
    Serial.println("connected to network");
    PrintWifiStatus();

    this->incomingServer = new WiFiServer(::HTTP_PORT);
    this->incomingServer->begin();

    this->outgoingClient = new WiFiClient();

    this->SendStatusChange("connected");
    return true;
}

void Pir::RestartPir() 
{
    digitalWrite(this->pirPowerPin, LOW);
    delay(5000);
    digitalWrite(this->pirPowerPin, HIGH);
}

void Pir::PrintWifiStatus() 
{
    Serial.println("Board Information:");

    // print your board's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    byte mac[6];
    WiFi.macAddress(mac);
    Serial.print("MAC address: ");
    for(int i = 5; i >= 0; --i) 
    {
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

String Pir::ReadHttpRequest(WiFiClient client)
{
    bool previousWasEndOfLine = false;
    bool endOfRequest = false;
    bool endOfHttpMethodString = false;
    String httpMethodString = "";
    while(client.connected() && !endOfRequest) 
    {
        // check if there are bytes to read
        if(client.available()) 
        {
            char curChar = client.read();

            // Handle special cases
            if(curChar == '\n')
            {
                endOfHttpMethodString = true;
                if(previousWasEndOfLine)
                {
                    endOfRequest = true;
                }
                previousWasEndOfLine = true;
            }
            else if(curChar != '\r')
            {
                previousWasEndOfLine = false;
            }

            if(!endOfHttpMethodString)
            {
                httpMethodString += curChar;
            }
        }
    }

    if(!endOfRequest)
    {
        return "";
    }
    return httpMethodString;
}

void Pir::SendStatusChange(const String& newStatus) 
{
    Serial.print("status has changed to: ");
    Serial.println(newStatus);

    bool clientConnected = this->outgoingClient->connect(this->outgoingClientUrl.c_str(), ::HTTP_PORT);
    if(!clientConnected) 
    {
        Serial.println("failed to report PIR");
        return;
    }

    this->outgoingClient->print("GET /api/sensor/pir_sensor_1?status=");
    this->outgoingClient->println(newStatus);
    this->outgoingClient->print("Host: ");
    this->outgoingClient->println(this->outgoingClientUrl);
    this->outgoingClient->println("Connection: close");
    this->outgoingClient->println();
}

int Pir::FindCharInString(const String& text)
{
    for(int i = 0; i < text.length(); ++i)
    {
        if(text[i] == ' ') 
        {
            return i;
        }
    }
    return -1;
}

Pir::HttpResponse Pir::ProcessIncomingRequest(const String& requestArg)
{
    Pir::HttpResponse response;
    response.wasSuccessful = true;

    if(requestArg == "status")
    {
        response.message = "hello";
    }
    else if(requestArg == "restart")
    {
        Serial.println("restarting board");
        this->restartScheduled = true;
    }
    return response;
}