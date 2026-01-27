export interface Step {
  id: number;
  title: string;
  explanation: string;
  technicalDetails: string;
  activeElements: string[];
  packetLocation?:
  | "start"
  | "app"
  | "os-stack"
  | "tun"
  | "vpn-client-read"
  | "vpn-client-encrypt"
  | "nic-out"
  | "tunnel"
  | "control-tunnel"
  | "data-tunnel"
  | "server-nic-in"
  | "server-vpn-process"
  | "server-tun"
  | "server-nat"
  | "target-internet"
  | "return-path";
  packetFrom?: Step["packetLocation"];
  packetTo?: Step["packetLocation"];
  packetPath?: Step["packetLocation"][];
  packetStatus?: "none" | "raw" | "encrypted";
  packetLabel?: string;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

export const demonstrationPhases: Phase[] = [
  {
    id: "initiation",
    title: "1. Inicjacja połączenia",
    description:
      "Klient nawiązuje kontakt z serwerem VPN (zwykle UDP/1194) i inicjuje kanał kontrolny OpenVPN.",
    steps: [
      {
        id: 0,
        title: "Stan początkowy",
        explanation:
          "Symulacja szczegółowa. Widzimy wnętrze hosta i klienta: aplikację użytkownika, system operacyjny z interfejsem wirtualnym (TUN) oraz proces VPN.",
        technicalDetails:
          "W systemie zainstalowany jest sterownik TAP/TUN. Interfejs TUN (tun0) działa w warstwie 3 (IP) i symuluje fizyczną kartę sieciową. Po zestawieniu połaczenia system zamiast wysyłać pakiety przez kabel będzie przekazywać dane do programu (OpenVPN).",
        activeElements: ["client-host", "server-host"],
        packetLocation: "start",
        packetFrom: "start",
        packetTo: "start",
        packetStatus: "none",
      },
      {
        id: 1,
        title: "P_CONTROL_HARD_RESET_CLIENT_V2",
        explanation:
          "Klient wysyła pierwszy pakiet kontrolny, aby zainicjować sesję OpenVPN.",
        technicalDetails:
          "Pakiet kontrolny OpenVPN (P_CONTROL_HARD_RESET_CLIENT_V2) jest wysyłany UDP/1194 do serwera. Zawiera losowy Session ID i żądanie rozpoczęcia handshake.",
        activeElements: ["client-vpn-process", "client-nic", "control-tunnel"],
        packetLocation: "nic-out",
        packetFrom: "vpn-client-encrypt",
        packetTo: "control-tunnel",
        packetPath: ["vpn-client-encrypt", "nic-out", "control-tunnel"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_CLIENT",
      },
      {
        id: 2,
        title: "Kanał kontrolny (Internet)",
        explanation:
          "Pakiet inicjujący płynie kanałem kontrolnym przez Internet i dociera do serwera",
        technicalDetails:
          "To nadal UDP/1194, ale logicznie jest to kanał kontrolny (TLS control).",
        activeElements: ["control-tunnel", "server-nic", "server-vpn-process"],
        packetLocation: "control-tunnel",
        packetFrom: "control-tunnel",
        packetTo: "server-vpn-process",
        packetPath: ["control-tunnel", "server-nic-in", "server-vpn-process"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_CLIENT",
      },
      {
        id: 3,
        title: "P_CONTROL_HARD_RESET_SERVER_V2",
        explanation:
          "Serwer odpowiada pakietem resetu i akceptuje rozpoczęcie sesji kontrolnej.",
        technicalDetails:
          "Serwer wysyła P_CONTROL_HARD_RESET_SERVER_V2, potwierdzając gotowość do handshake TLS na kanale kontrolnym.",
        activeElements: ["server-nic", "control-tunnel", "server-vpn-process"],
        packetLocation: "server-vpn-process",
        packetFrom: "server-vpn-process",
        packetTo: "control-tunnel",
        packetPath: ["server-vpn-process", "server-nic-in", "control-tunnel"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_SERVER",
      },
      {
        id: 4,
        title: "Odpowiedź wraca do klienta",
        explanation:
          "Pakiet odpowiedzi serwera wraca kanałem kontrolnym do klienta.",
        technicalDetails:
          "Kanał kontrolny jest wykorzystywany do wymiany komunikatów sterujących TLS/OpenVPN.",
        activeElements: ["control-tunnel", "client-nic", "client-vpn-process"],
        packetLocation: "control-tunnel",
        packetFrom: "control-tunnel",
        packetTo: "vpn-client-read",
        packetPath: ["control-tunnel", "nic-out", "vpn-client-read"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_SERVER",
      },
      {
        id: 5,
        title: "Klient odbiera odpowiedź",
        explanation:
          "Klient otrzymuje potwierdzenie od serwera i przygotowuje się do handshake TLS.",
        technicalDetails:
          "Po odebraniu HARD_RESET_SERVER klient przechodzi do negocjacji TLS.",
        activeElements: ["client-vpn-process"],
        packetLocation: "vpn-client-read",
        packetFrom: "vpn-client-read",
        packetTo: "vpn-client-read",
        packetPath: ["vpn-client-read"],
        packetStatus: "raw",
        packetLabel: "HARD_RESET_SERVER",
      },
    ],
  },
  {
    id: "tls-handshake",
    title: "2. SSL/TLS Handshake",
    description:
      "Strony negocjują parametry szyfrowania, wymieniają certyfikaty i generują klucze sesyjne. Po ChangeCipherSpec kanał staje się szyfrowany.",
    steps: [
      {
        id: 0,
        title: "TLS ClientHello",
        explanation:
          "Klient inicjuje handshake TLS, proponując wersje protokołu i listę obsługiwanych szyfrów.",
        technicalDetails:
          "ClientHello zawiera: wersję TLS (1.2/1.3), listę cipher suites (np. TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384), rozszerzenia (SNI, ALPN), oraz losowy 32-bajtowy nonce.",
        activeElements: [
          "client-vpn-process",
          "control-tunnel",
          "server-vpn-process",
          "client-nic",
          "server-nic"
        ],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: [
          "vpn-client-encrypt",
          "nic-out",
          "control-tunnel",
          "server-nic-in",
          "server-vpn-process",
        ],
        packetStatus: "raw",
        packetLabel: "ClientHello",
      },
      {
        id: 1,
        title: "TLS ServerHello",
        explanation:
          "Serwer odpowiada, wybierając wersję TLS i algorytm szyfrowania z propozycji klienta.",
        technicalDetails:
          "ServerHello zawiera: wybraną wersję TLS, wybrany cipher suite, losowy nonce serwera. To potwierdza parametry sesji TLS.",
        activeElements: ["server-vpn-process", "control-tunnel", "client-vpn-process", "client-nic", "server-nic"],
        packetLocation: "vpn-client-read",
        packetFrom: "server-vpn-process",
        packetTo: "vpn-client-read",
        packetPath: [
          "server-vpn-process",
          "server-nic-in",
          "control-tunnel",
          "nic-out",
          "vpn-client-read",
        ],
        packetStatus: "raw",
        packetLabel: "ServerHello",
      },
      {
        id: 2,
        title: "Certificate serwera",
        explanation:
          "Serwer przesyła swój certyfikat X.509 wraz z łańcuchem zaufania (CA chain). Klient weryfikuje go lokalnie.",
        technicalDetails:
          "Wiadomość Certificate zawiera łańcuch certyfikatów: cert serwera → cert pośredni → root CA. Klient sprawdza: podpis CA, datę ważności, CN/SAN, oraz opcjonalnie CRL/OCSP.",
        activeElements: [
          "server-vpn-process",
          "control-tunnel",
          "client-vpn-process",
        ],
        packetLocation: "vpn-client-read",
        packetFrom: "server-vpn-process",
        packetTo: "vpn-client-read",
        packetPath: ["server-vpn-process", "control-tunnel", "vpn-client-read"],
        packetStatus: "raw",
        packetLabel: "CERTIFICATE",
      },
      {
        id: 3,
        title: "Certificate klienta + CertificateVerify",
        explanation:
          "Klient przesyła swój certyfikat oraz podpis (CertificateVerify) potwierdzający posiadanie klucza prywatnego. Serwer weryfikuje lokalnie.",
        technicalDetails:
          "Wiadomość Certificate zawiera cert klienta. CertificateVerify to podpis cyfrowy na dotychczasowych wiadomościach handshake, dowodzący że klient posiada klucz prywatny odpowiadający certyfikatowi.",
        activeElements: [
          "client-vpn-process",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: [
          "vpn-client-encrypt",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetStatus: "raw",
        packetLabel: "CLIENT CERT",
      },
      {
        id: 4,
        title: "ClientKeyExchange",
        explanation:
          "Klient wysyła materiał kryptograficzny potrzebny do wygenerowania kluczy sesyjnych (ECDHE/DHE).",
        technicalDetails:
          "W przypadku ECDHE: klient wysyła swój publiczny klucz krzywej eliptycznej. Obie strony mogą teraz obliczyć wspólny 'premaster secret' i wygenerować klucze sesyjne (master secret → klucze szyfrowania + MAC).",
        activeElements: [
          "client-vpn-process",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: [
          "vpn-client-encrypt",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetStatus: "raw",
        packetLabel: "KeyExchange",
      },
      {
        id: 5,
        title: "ChangeCipherSpec",
        explanation:
          "Obie strony wysyłają sygnał ChangeCipherSpec, oznaczający przejście na szyfrowaną komunikację. Od tego momentu kanał kontrolny jest chroniony.",
        technicalDetails:
          "ChangeCipherSpec to specjalny komunikat (nie jest częścią handshake). Po jego wysłaniu, wszystkie kolejne wiadomości są szyfrowane wynegocjowanym algorytmem (np. AES-256-GCM) i uwierzytelnione (HMAC/AEAD).",
        activeElements: [
          "client-vpn-process",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: [
          "vpn-client-encrypt",
          "control-tunnel",
          "server-vpn-process",
          "control-tunnel",
          "vpn-client-encrypt"
        ],
        packetStatus: "raw",
        packetLabel: "ChangeCipherSpec",
      },
      {
        id: 6,
        title: "Finished (klient)",
        explanation:
          "Klient wysyła pierwszą zaszyfrowaną wiadomość - Finished. Zawiera hash całego handshake, potwierdzając jego integralność.",
        technicalDetails:
          "Wiadomość Finished to PRF(master_secret, 'client finished', Hash(handshake_messages)). Jest to pierwszy pakiet zaszyfrowany kluczami sesyjnymi. Serwer weryfikuje hash, upewniając się że handshake nie został zmodyfikowany.",
        activeElements: [
          "client-vpn-process",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: [
          "vpn-client-encrypt",
          "control-tunnel",
          "server-vpn-process",
        ],
        packetStatus: "encrypted",
        packetLabel: "Finished",
      },
      {
        id: 7,
        title: "Finished (serwer)",
        explanation:
          "Serwer odpowiada zaszyfrowaną wiadomością Finished. Handshake TLS jest zakończony - kanał kontrolny jest w pełni szyfrowany.",
        technicalDetails:
          "Po wymianie obu Finished, sesja TLS jest ustanowiona. Kanał kontrolny OpenVPN używa teraz szyfrowania symetrycznego (AES-GCM) z Perfect Forward Secrecy. Klucze sesyjne są unikalne dla tej sesji.",
        activeElements: [
          "server-vpn-process",
          "control-tunnel",
          "client-vpn-process",
        ],
        packetLocation: "vpn-client-read",
        packetFrom: "server-vpn-process",
        packetTo: "vpn-client-read",
        packetPath: ["server-vpn-process", "control-tunnel", "vpn-client-read"],
        packetStatus: "encrypted",
        packetLabel: "Finished",
      },
    ],
  },

  {
    id: "authentication",
    title: "3. Uwierzytelnienie",
    description:
      "Opcjonalne uwierzytelnienie loginem i hasłem (auth-user-pass) lub tokenem MFA. Odbywa się w już zaszyfrowanym kanale kontrolnym.",
    steps: [
      {
        id: 0,
        title: "AUTH_REQUEST",
        explanation:
          "Serwer żąda dodatkowego uwierzytelnienia - loginu i hasła lub tokenu OTP. Ten etap jest opcjonalny (zależy od konfiguracji auth-user-pass).",
        technicalDetails:
          "Komunikat AUTH_REQUEST jest wysyłany w zaszyfrowanym kanale kontrolnym. Może zawierać informacje o wymaganym typie uwierzytelnienia (hasło, token TOTP, certyfikat sprzętowy).",
        activeElements: ["server-vpn-process", "control-tunnel"],
        packetLocation: "vpn-client-read",
        packetFrom: "server-vpn-process",
        packetTo: "vpn-client-read",
        packetPath: ["server-vpn-process", "control-tunnel", "vpn-client-read"],
        packetStatus: "encrypted",
        packetLabel: "AUTH_REQUEST",
      },
      {
        id: 1,
        title: "AUTH_REPLY",
        explanation:
          "Klient odsyła poświadczenia - login i hasło lub token jednorazowy. Dane są chronione szyfrowaniem TLS.",
        technicalDetails:
          "Poświadczenia są bezpiecznie przesyłane w zaszyfrowanym kanale. W zależności od konfiguracji może to być: login/hasło (auth-user-pass), token TOTP (np. Google Authenticator), lub odpowiedź challenge-response.",
        activeElements: ["client-vpn-process", "control-tunnel", "server-vpn-process"],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: ["vpn-client-read", "vpn-client-encrypt", "control-tunnel", "server-vpn-process"],
        packetStatus: "encrypted",
        packetLabel: "AUTH_REPLY",
      },
      {
        id: 2,
        title: "AUTH_SUCCESS",
        explanation:
          "Serwer potwierdza poprawne uwierzytelnienie. Klient jest w pełni autoryzowany do korzystania z VPN.",
        technicalDetails:
          "Po AUTH_SUCCESS serwer zapisuje sesję jako uwierzytelnioną. Klient przechodzi do fazy konfiguracji tunelu (PUSH_REQUEST). W przypadku błędu serwer wysłałby AUTH_FAILED i zamknął połączenie.",
        activeElements: [
          "server-vpn-process",
          "control-tunnel",
          "client-vpn-process",
        ],
        packetLocation: "vpn-client-read",
        packetFrom: "server-vpn-process",
        packetTo: "vpn-client-read",
        packetPath: ["server-vpn-process", "control-tunnel", "vpn-client-read"],
        packetStatus: "encrypted",
        packetLabel: "AUTH_SUCCESS",
      },
    ],
  },
  {
    id: "tunnel-creation",
    title: "4. Zestawienie tunelu",
    description:
      "Serwer przypisuje adres, trasy i parametry kanału danych. Tworzony jest interfejs TUN/TAP.",
    steps: [
      {
        id: 0,
        title: "PUSH_REQUEST",
        explanation: "Klient prosi o konfigurację tunelu (IP, trasy, DNS).",
        technicalDetails:
          "PUSH_REQUEST jest wysyłany w kanale kontrolnym po zakończonym TLS. Klient oczekuje konfiguracji sesji.",
        activeElements: ["client-vpn-process", "control-tunnel", "server-vpn-process"],
        packetLocation: "server-vpn-process",
        packetFrom: "vpn-client-encrypt",
        packetTo: "server-vpn-process",
        packetPath: ["vpn-client-encrypt", "control-tunnel", "server-vpn-process"],
        packetStatus: "encrypted",
        packetLabel: "PUSH_REQUEST",
      },
      {
        id: 1,
        title: "PUSH_REPLY (ifconfig, route, DNS)",
        explanation: "Serwer zwraca parametry: IP tunelu, trasy oraz DNS.",
        technicalDetails:
          "W PUSH_REPLY znajdują się m.in. ifconfig 10.8.0.2/24, route 0.0.0.0/0 oraz DNS. Klient zapisuje je lokalnie.",
        activeElements: ["server-vpn-process", "control-tunnel", "client-vpn-process"],
        packetLocation: "vpn-client-read",
        packetFrom: "server-vpn-process",
        packetTo: "vpn-client-read",
        packetPath: [
          "server-vpn-process",
          "control-tunnel",
          "vpn-client-read",
        ],
        packetStatus: "encrypted",
        packetLabel: "PUSH_REPLY",
      },
      {
        id: 2,
        title: "Konfiguracja TUN i routingu",
        explanation:
          "Klient konfiguruje interfejs TUN i aktualizuje tablice routingu.",
        technicalDetails:
          "System ustawia adres IP tunelu, dodaje trasy oraz (opcjonalnie) modyfikuje DNS. Ruch domyślny trafia do tunelu.",
        activeElements: ["client-os", "client-tun", "routing"],
        packetLocation: "tun",
        packetFrom: "tun",
        packetTo: "tun",
        packetPath: ["tun"],
        packetStatus: "none",
      },
      {
        id: 3,
        title: "Initialization Sequence Completed",
        explanation: "Tunel jest aktywny i gotowy do przesyłania danych.",
        technicalDetails:
          "OpenVPN kończy inicjalizację kanału danych. Od tej chwili każdy pakiet będzie szyfrowany i przenoszony tunelem.",
        activeElements: [
          "client-vpn-process",
          "server-vpn-process",
          "data-tunnel",
        ],
        packetLocation: "data-tunnel",
        packetFrom: "vpn-client-read",
        packetTo: "data-tunnel",
        packetPath: ["vpn-client-read", "vpn-client-encrypt", "data-tunnel"],
        packetStatus: "none",
        packetLabel: "READY",
      },
    ],
  },
  {
    id: "data-transmission",
    title: "5. Transmisja danych",
    description:
      "Pakiety aplikacji są szyfrowane, enkapsulowane i przesyłane przez tunel VPN.",
    steps: [
      {
        id: 0,
        title: "Generowanie pakietu (Aplikacja)",
        explanation: "Użytkownik wysyła żądanie, a aplikacja tworzy pakiet IP.",
        technicalDetails:
          "Aplikacja (np. przeglądarka) używa socket() i sendto(). Tworzony jest pakiet z docelowym adresem IP (np. 142.250.x.x).",
        activeElements: ["client-app"],
        packetLocation: "app",
        packetFrom: "app",
        packetTo: "app",
        packetStatus: "raw",
        packetLabel: "IP",
      },
      {
        id: 1,
        title: "Routing systemowy (Kernel)",
        explanation:
          "Kernel kieruje ruch na interfejs TUN zgodnie z trasą domyślną.",
        technicalDetails:
          "Tablica routingu (ip route/route print) wskazuje tun0 jako default gateway dla ruchu 0.0.0.0/0.",
        activeElements: ["client-os", "client-tun", "routing"],
        packetLocation: "tun",
        packetFrom: "app",
        packetTo: "tun",
        packetPath: ["app", "os-stack", "tun"],
        packetStatus: "raw",
        packetLabel: "ROUTE",
      },
      {
        id: 2,
        title: "Odczyt z TUN",
        explanation:
          "Proces OpenVPN odbiera niezaszyfrowany pakiet z interfejsu wirtualnego.",
        technicalDetails:
          "OpenVPN wykonuje read() na /dev/net/tun i uzyskuje oryginalny pakiet IP jako payload.",
        activeElements: ["client-vpn-process"],
        packetLocation: "vpn-client-read",
        packetFrom: "tun",
        packetTo: "vpn-client-read",
        packetPath: ["tun", "vpn-client-read"],
        packetStatus: "raw",
        packetLabel: "PAYLOAD",
      },
      {
        id: 3,
        title: "Szyfrowanie + AEAD/HMAC",
        explanation:
          "Pakiet jest szyfrowany i podpisywany, a następnie enkapsulowany w UDP.",
        technicalDetails:
          "Kanał danych używa AES-256-GCM (AEAD) lub AES-CBC + HMAC. Dodawany jest Packet ID i ochrona przed replay.",
        activeElements: ["client-vpn-process"],
        packetLocation: "vpn-client-encrypt",
        packetFrom: "vpn-client-read",
        packetTo: "vpn-client-encrypt",
        packetPath: ["vpn-client-read", "vpn-client-encrypt"],
        packetStatus: "encrypted",
        packetLabel: "DATA (AES-GCM)",
      },
      {
        id: 4,
        title: "Wysłanie do Internetu",
        explanation:
          "Zaszyfrowany pakiet opuszcza hosta przez fizyczny interfejs.",
        technicalDetails:
          "OpenVPN wysyła UDP/1194 do publicznego IP serwera. Pakiet przechodzi przez NIC (eth0/wlan0).",
        activeElements: ["client-os", "client-nic"],
        packetLocation: "nic-out",
        packetFrom: "vpn-client-encrypt",
        packetTo: "nic-out",
        packetPath: ["vpn-client-encrypt", "nic-out"],
        packetStatus: "encrypted",
        packetLabel: "UDP/1194",
      },
      {
        id: 5,
        title: "Tunel VPN (Internet)",
        explanation:
          "Pakiet podróżuje przez publiczny Internet jako zaszyfrowany strumień UDP.",
        technicalDetails:
          "ISP widzi tylko pakiety UDP między IP klienta i serwera. Treść jest nieczytelna.",
        activeElements: ["data-tunnel"],
        packetLocation: "data-tunnel",
        packetFrom: "nic-out",
        packetTo: "data-tunnel",
        packetPath: ["nic-out", "data-tunnel"],
        packetStatus: "encrypted",
        packetLabel: "ENCRYPTED",
      },
      {
        id: 6,
        title: "Odbiór na serwerze VPN",
        explanation: "Serwer odbiera pakiet i weryfikuje integralność.",
        technicalDetails:
          "Sprawdzany jest HMAC/AEAD oraz Packet ID (ochrona przed replay). Niepoprawne pakiety są odrzucane.",
        activeElements: ["server-os", "server-nic"],
        packetLocation: "server-nic-in",
        packetFrom: "data-tunnel",
        packetTo: "server-nic-in",
        packetPath: ["data-tunnel", "server-nic-in"],
        packetStatus: "encrypted",
        packetLabel: "VERIFY",
      },
      {
        id: 7,
        title: "Dekapsulacja i zapis do TUN",
        explanation:
          "Serwer odszyfrowuje pakiet i kieruje go do interfejsu TUN.",
        technicalDetails:
          "OpenVPN odszyfrowuje payload i zapisuje pakiet IP do tun0. Kernel odbiera go jak normalny ruch.",
        activeElements: ["server-vpn-process", "server-tun"],
        packetLocation: "server-vpn-process",
        packetFrom: "server-nic-in",
        packetTo: "server-vpn-process",
        packetPath: ["server-nic-in", "server-vpn-process"],
        packetStatus: "raw",
        packetLabel: "IP",
      },
      {
        id: 8,
        title: "NAT i wyjście do Internetu",
        explanation: "Serwer wykonuje maskaradę i wysyła ruch do Internetu.",
        technicalDetails:
          "SNAT zmienia adres źródłowy na publiczny IP serwera VPN. Pakiet wychodzi do sieci docelowej.",
        activeElements: ["server-os", "server-nat"],
        packetLocation: "server-nat",
        packetFrom: "server-vpn-process",
        packetTo: "server-nat",
        packetPath: ["server-vpn-process", "server-nat"],
        packetStatus: "raw",
        packetLabel: "SNAT",
      },
      {
        id: 9,
        title: "Dotarcie do celu",
        explanation: "Pakiet dociera do serwera docelowego (np. strony WWW).",
        technicalDetails:
          "Serwer docelowy widzi połączenie z publicznego IP serwera VPN, a nie z IP klienta.",
        activeElements: ["target-internet"],
        packetLocation: "target-internet",
        packetFrom: "server-nat",
        packetTo: "target-internet",
        packetPath: ["server-nat", "target-internet"],
        packetStatus: "raw",
        packetLabel: "HTTP(S)",
      },
      {
        id: 10,
        title: "Odpowiedź wraca do serwera VPN",
        explanation:
          "Serwer docelowy odsyła odpowiedź do publicznego IP serwera VPN.",
        technicalDetails:
          "Odpowiedź trafia na interfejs fizyczny serwera VPN i jest przekazywana do OpenVPN.",
        activeElements: ["server-os", "server-nic"],
        packetLocation: "server-nic-in",
        packetFrom: "target-internet",
        packetTo: "server-nic-in",
        packetPath: ["target-internet", "server-nic-in"],
        packetStatus: "raw",
        packetLabel: "RESPONSE",
      },
      {
        id: 11,
        title: "Szyfrowanie odpowiedzi",
        explanation: "Serwer szyfruje odpowiedź i enkapsuluje ją w UDP.",
        technicalDetails:
          "OpenVPN tworzy pakiet DATA z AES-GCM/HMAC i przygotowuje go do wysłania do klienta.",
        activeElements: ["server-vpn-process"],
        packetLocation: "server-vpn-process",
        packetFrom: "server-nic-in",
        packetTo: "server-vpn-process",
        packetPath: ["server-nic-in", "server-vpn-process"],
        packetStatus: "encrypted",
        packetLabel: "DATA (AES-GCM)",
      },
      {
        id: 12,
        title: "Powrót tunelem",
        explanation: "Zaszyfrowany pakiet wraca do klienta przez Internet.",
        technicalDetails:
          "Pakiet UDP/1194 wraca tą samą ścieżką sieciową do klienta.",
        activeElements: ["data-tunnel"],
        packetLocation: "data-tunnel",
        packetFrom: "server-vpn-process",
        packetTo: "data-tunnel",
        packetPath: ["server-vpn-process", "data-tunnel"],
        packetStatus: "encrypted",
        packetLabel: "ENCRYPTED",
      },
      {
        id: 13,
        title: "Odszyfrowanie u klienta",
        explanation:
          "Zaszyfrowana odpowiedź dociera do procesu OpenVPN klienta.",
        technicalDetails:
          "Pakiet DATA trafia do procesu OpenVPN w przestrzeni użytkownika. W tym momencie jest jeszcze zaszyfrowany.",
        activeElements: ["client-vpn-process", "client-tun"],
        packetLocation: "vpn-client-read",
        packetFrom: "data-tunnel",
        packetTo: "vpn-client-read",
        packetPath: ["data-tunnel", "vpn-client-read"],
        packetStatus: "encrypted",
        packetLabel: "DATA (ENCRYPTED)",
      },
      {
        id: 14,
        title: "Odszyfrowanie i zapis do TUN",
        explanation:
          "OpenVPN weryfikuje integralność i odszyfrowuje odpowiedź, zapisując ją do tun0.",
        technicalDetails:
          "Sprawdzany jest Packet ID/HMAC/AEAD, a następnie payload jest odszyfrowany i zapisany do interfejsu TUN.",
        activeElements: ["client-vpn-process", "client-tun"],
        packetLocation: "tun",
        packetFrom: "vpn-client-read",
        packetTo: "tun",
        packetPath: ["vpn-client-read", "tun"],
        packetStatus: "raw",
        packetLabel: "IP",
      },
      {
        id: 15,
        title: "Pakiet trafia do aplikacji",
        explanation: "Kernel przekazuje odpowiedź do aplikacji użytkownika.",
        technicalDetails:
          "System odczytuje pakiet z tun0 i przekazuje go do gniazda aplikacji (np. przeglądarki).",
        activeElements: ["client-app"],
        packetLocation: "app",
        packetFrom: "tun",
        packetTo: "app",
        packetPath: ["tun", "app"],
        packetStatus: "raw",
        packetLabel: "RESPONSE",
      },
    ],
  },
];
