#pragma once

#include <WString.h>
#include <WiFi101.h>

class Pir
{
private:
    struct HttpResponse 
    {
        bool wasSuccessful;
        String message;
    };

public:
    ~Pir();
    bool Init(const String& uniqueSensorName, const String& uniqueIpAddress, const String& ssid, const String& password, const String& outgoingClientUrl, int pirPowerPin, int pirReadingPin, int ledPin);

    bool Process();

private:
    void SendStatusChange(const String& newStatus);

    bool InitHardware();

    bool ConnectWifi(const String& uniqueIpAddress, const String& ssid, const String& password);

    void RestartPir();

    void PrintWifiStatus() const;

    String ReadHttpRequest(WiFiClient client);

    int FindCharInString(const String& text);

    HttpResponse ProcessIncomingRequest(const String& requestArg);

    HttpResponse ProcessStatusRequest();

    bool ProcessServer();

    bool ProcessPirSensor();

    // PIR power pin
    int pirPowerPin;
    // PIR status pin
    int pirReadingPin;
    // LED status pin number
    int ledPin;

    String outgoingClientUrl;

    String uniqueSensorName;

    WiFiServer * incomingServer = nullptr;
    WiFiClient * outgoingClient = nullptr;

    bool restartScheduled = false;

    uint64_t stateChangeTimeStampMs;

    String curState;
};