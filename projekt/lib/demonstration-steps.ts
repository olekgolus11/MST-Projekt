export interface Step {
  id: number;
  title: string;
  explanation: string;
  technicalDetails: string;
  activeElements: string[];
}

export const demonstrationSteps: Step[] = [
  {
    id: 0,
    title: "Stan początkowy",
    explanation:
      "Witaj w symulacji protokołu OpenVPN! Kliknij przycisk 'Dalej' aby rozpocząć demonstrację działania protokołu VPN. Zobaczysz jak dane są szyfrowane i przesyłane przez bezpieczny tunel.",
    technicalDetails:
      "OpenVPN to protokół VPN typu open-source, który wykorzystuje bibliotekę OpenSSL do szyfrowania. Domyślnie działa na porcie UDP 1194, ale może również używać TCP.",
    activeElements: [],
  },
  {
    id: 1,
    title: "Użytkownik inicjuje połączenie",
    explanation:
      "Użytkownik chce bezpiecznie połączyć się z internetem. Uruchamia klienta OpenVPN na swoim urządzeniu, aby nawiązać szyfrowane połączenie z serwerem VPN.",
    technicalDetails:
      "Klient OpenVPN ładuje plik konfiguracyjny (.ovpn) zawierający: adres serwera, port, protokół (UDP/TCP), certyfikaty CA, oraz klucze szyfrowania.",
    activeElements: ["client"],
  },
  {
    id: 2,
    title: "Klient VPN aktywowany",
    explanation:
      "Klient OpenVPN został uruchomiony i jest gotowy do nawiązania bezpiecznego połączenia. Rozpoczyna się proces uzgadniania połączenia (handshake) z serwerem VPN.",
    technicalDetails:
      "Klient inicjuje połączenie TLS 1.2/1.3. Wysyła pakiet Client Hello zawierający: wersję protokołu, obsługiwane szyfry (np. AES-256-GCM), losowy numer sesji.",
    activeElements: ["client", "vpn-client"],
  },
  {
    id: 3,
    title: "Ustanawianie tunelu TLS",
    explanation:
      "Następuje wymiana kluczy między klientem a serwerem VPN. Obie strony weryfikują swoje certyfikaty i uzgadniają wspólny klucz szyfrowania dla sesji.",
    technicalDetails:
      "Handshake TLS:\n1. Server Hello + Certyfikat serwera\n2. Weryfikacja certyfikatu przez klienta\n3. Wymiana kluczy (ECDHE)\n4. Generowanie kluczy sesji\n5. Finished - tunel gotowy",
    activeElements: ["vpn-client", "vpn-tunnel"],
  },
  {
    id: 4,
    title: "Tunel VPN aktywny",
    explanation:
      "Bezpieczny tunel został ustanowiony! Wszystkie dane przesyłane między klientem a serwerem VPN są teraz szyfrowane. Zewnętrzni obserwatorzy widzą tylko zaszyfrowany ruch.",
    technicalDetails:
      "Dane są enkapsulowane:\n[Nagłówek IP] → [Nagłówek UDP/1194] → [OpenVPN Header] → [Zaszyfrowane dane TLS]\n\nSzyfrowanie: AES-256-GCM\nHMAC: SHA256",
    activeElements: ["vpn-client", "vpn-tunnel", "vpn-server"],
  },
  {
    id: 5,
    title: "Serwer VPN odbiera dane",
    explanation:
      "Serwer VPN odbiera zaszyfrowane pakiety, odszyfrowuje je i przekazuje do internetu. Dla serwisów internetowych, ruch wygląda jakby pochodził z serwera VPN, nie od użytkownika.",
    technicalDetails:
      "Serwer VPN:\n1. Odbiera pakiet UDP na porcie 1194\n2. Odszyfrowuje dane kluczem sesji\n3. Wyciąga oryginalny pakiet IP\n4. Wykonuje NAT (zamienia źródłowe IP)\n5. Przekazuje do internetu",
    activeElements: ["vpn-tunnel", "vpn-server"],
  },
  {
    id: 6,
    title: "Żądanie wysłane do Internetu",
    explanation:
      "Odszyfrowane żądanie jest wysyłane do docelowego serwera w internecie. Serwer docelowy widzi tylko adres IP serwera VPN - prawdziwy adres użytkownika jest ukryty.",
    technicalDetails:
      "Pakiet wychodzący do internetu:\nŹródłowe IP: 185.xxx.xxx.xxx (serwer VPN)\nDocelowe IP: 142.250.185.78 (np. google.com)\n\nTwoje prawdziwe IP jest całkowicie ukryte!",
    activeElements: ["vpn-server", "internet"],
  },
  {
    id: 7,
    title: "Odpowiedź wraca przez tunel",
    explanation:
      "Serwer internetowy wysyła odpowiedź do serwera VPN. Serwer VPN szyfruje odpowiedź i przesyła ją z powrotem do klienta przez bezpieczny tunel.",
    technicalDetails:
      "Droga powrotna:\n1. Internet → Serwer VPN (nieszyfrowane)\n2. Serwer szyfruje odpowiedź\n3. Przesyła przez tunel do klienta\n4. Klient odszyfrowuje\n5. Dane trafiają do aplikacji",
    activeElements: [
      "internet",
      "vpn-server",
      "vpn-tunnel",
      "vpn-client",
      "client",
    ],
  },
];
