# 🍜 Nep-gappa - System Zamówień Jedzenia

Kompleksowy system zamówień jedzenia z kalendarzem dostaw, zarządzaniem menu i panelem administratora.

## 🚀 Funkcjonalności

### Dla użytkowników:
- 📝 **Rejestracja i logowanie** - bezpieczne konta użytkowników
- 🍽️ **Przeglądanie menu** - kategoryzowane pozycje z opisami i cenami
- 📅 **Składanie zamówień** - wybór daty, godziny i adresu dostawy
- 📋 **Historia zamówień** - śledzenie statusu własnych zamówień
- 📞 **Kontakt** - łatwy dostęp do danych administratora

### Dla administratorów:
- 🏪 **Zarządzanie menu** - dodawanie pozycji w kategoriach
- 💰 **Edycja cennika** - aktualizacja cen i opisów
- 📦 **Zarządzanie zamówieniami** - przyjmowanie/odrzucanie zamówień
- 👥 **Przegląd klientów** - pełne dane kontaktowe
- 📊 **Panel administracyjny** - wszystko w jednym miejscu

## 🛠️ Instalacja i uruchomienie

### Wymagania:
- Node.js (wersja 16 lub nowsza)
- npm (Node Package Manager)

### Instalacja:

```bash
# Sklonuj repozytorium
git clone https://github.com/barwis3/Nep-gappa.git
cd Nep-gappa

# Zainstaluj zależności
npm install

# Uruchom serwer
npm start
```

### Dostęp do aplikacji:

Otwórz przeglądarkę i przejdź do: `http://localhost:3000`

### Domyślne konto administratora:
- **Login:** `admin`
- **Hasło:** `admin123`

## 📱 Interfejs użytkownika

### Strona główna
![Strona główna](https://github.com/user-attachments/assets/fb4eaa9c-fd23-447f-bb9e-7d1b90b06d71)

### Panel zamówień użytkownika
![Panel użytkownika](https://github.com/user-attachments/assets/9b651907-c69f-42cf-ab8a-8af3b2e320f0)

### Panel administratora
![Panel administratora](https://github.com/user-attachments/assets/25dc88c0-2895-4724-bd51-15e9a18e905d)

## 🏗️ Architektura techniczna

### Frontend:
- **HTML5** - semantyczna struktura
- **CSS3** - nowoczesne style z responsywnością
- **JavaScript** - interaktywne funkcjonalności

### Backend:
- **Node.js** - środowisko uruchomieniowe
- **Express.js** - framework webowy
- **express-session** - zarządzanie sesjami
- **bcryptjs** - hashowanie haseł
- **uuid** - generowanie unikalnych identyfikatorów

### Baza danych:
- **JSON files** - proste przechowywanie danych w plikach

## 📁 Struktura projektu

```
Nep-gappa/
├── public/                 # Pliki frontend
│   ├── css/
│   │   └── style.css      # Style CSS
│   ├── js/
│   │   └── app.js         # Główna logika frontend
│   ├── index.html         # Strona główna
│   ├── login.html         # Strona logowania
│   └── register.html      # Strona rejestracji
├── data/                  # Pliki danych (tworzone automatycznie)
│   ├── users.json        # Dane użytkowników
│   ├── menu.json         # Dane menu
│   └── orders.json       # Dane zamówień
├── server.js             # Serwer Node.js
├── package.json          # Konfiguracja npm
└── README.md            # Ten plik
```

## 🔧 API Endpoints

### Autentykacja:
- `POST /api/login` - Logowanie użytkownika
- `POST /api/register` - Rejestracja nowego użytkownika
- `POST /api/logout` - Wylogowanie użytkownika
- `GET /api/session` - Sprawdzenie sesji użytkownika

### Menu:
- `GET /api/menu` - Pobranie menu
- `POST /api/menu` - Dodanie pozycji do menu (admin)

### Zamówienia:
- `GET /api/orders` - Pobranie zamówień
- `POST /api/orders` - Złożenie nowego zamówienia
- `PATCH /api/orders/:id` - Aktualizacja statusu zamówienia (admin)

### Inne:
- `GET /api/contact` - Informacje kontaktowe

## 💡 Sposób użycia

### Dla nowych użytkowników:
1. Wejdź na stronę główną
2. Kliknij "Zarejestruj" i utwórz konto
3. Zaloguj się używając swoich danych
4. Przeglądaj menu i dodawaj pozycje do koszyka
5. Wypełnij formularz dostawy i złóż zamówienie
6. Śledź status zamówienia w sekcji "Moje zamówienia"

### Dla administratorów:
1. Zaloguj się jako admin (`admin` / `admin123`)
2. Przejdź do "Panel administratora"
3. Zarządzaj menu w zakładce "Menu"
4. Przeglądaj i akceptuj zamówienia w zakładce "Zamówienia"

## 🔒 Bezpieczeństwo

- Hasła są hashowane przy użyciu bcrypt
- Sesje użytkowników są zabezpieczone
- Wszystkie operacje administratora wymagają autoryzacji
- Walidacja danych po stronie serwera

## 🌟 Funkcjonalności szczegółowe

### System zamówień:
- ✅ Kalendarz z wyborem daty dostawy
- ✅ Wybór godziny dostawy
- ✅ Pole na adres dostawy
- ✅ Opcjonalne uwagi do zamówienia
- ✅ Automatyczne obliczanie sumy
- ✅ Historia zamówień użytkownika

### Panel administratora:
- ✅ Dodawanie pozycji menu w kategoriach
- ✅ Edycja cen i opisów
- ✅ Akceptowanie/odrzucanie zamówień
- ✅ Podgląd danych kontaktowych klientów
- ✅ Zarządzanie wszystkimi zamówieniami

### Responsywność:
- ✅ Działa na komputerach
- ✅ Dostosowane do tabletów
- ✅ Zoptymalizowane dla smartfonów

## 📞 Wsparcie

W przypadku problemów lub pytań, skontaktuj się z administratorem:
- **Telefon:** +48 123 456 789
- **Email:** kontakt@nep-gappa.pl
- **Adres:** ul. Przykładowa 123, 00-000 Warszawa

## 🚀 Rozwój

Projekt jest gotowy do dalszego rozwoju. Możliwe rozszerzenia:
- Płatności online
- Powiadomienia email/SMS
- Integracja z mapami
- System ocen i komentarzy
- Aplikacja mobilna

## 📄 Licencja

Projekt dostępny na licencji ISC.