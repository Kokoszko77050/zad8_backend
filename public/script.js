// zmiana motywu
let AktywnyMotyw = "red";
function ZmienMotyw77050() {
    const LinkDoMotywu = document.getElementById("stylesheet");

    if (AktywnyMotyw === "red") {
        LinkDoMotywu.href = "green.css";
        AktywnyMotyw = "green";
    } else {
        LinkDoMotywu.href = "red.css";
        AktywnyMotyw = "red";
    }
}

// pokazanie/ukrycie sekcji
function PokazUkryj77050(sectionId) {
    const section = document.getElementById(sectionId);

    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// walidacja danych z formularza
document.getElementById("Formularz").addEventListener("submit", function(e) {
  e.preventDefault();

  const imie = document.getElementById("imie").value.trim();
  const nazwisko = document.getElementById("nazwisko").value.trim();
  const email = document.getElementById("email").value.trim();

  const imieError = document.getElementById("imieError");
  const nazwiskoError = document.getElementById("nazwiskoError");
  const emailError = document.getElementById("emailError");
  const sukces = document.getElementById("poprawneDane");

  imieError.textContent = "";
  nazwiskoError.textContent = "";
  emailError.textContent = "";
  sukces.textContent = "";

    const imieRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]+$/;
    const nazwiskoRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let czyPoprawne = true;

  if (!imie) {
    imieError.textContent = "Podaj imię.";
    czyPoprawne = false;
  } else if (!imieRegex.test(imie)) {
    imieError.textContent = "Imię może zawierać tylko litery.";
    czyPoprawne = false;
  }

  if (!nazwisko) {
    nazwiskoError.textContent = "Podaj nazwisko.";
    czyPoprawne = false;
  } else if (!nazwiskoRegex.test(nazwisko)) {
    nazwiskoError.textContent = "Nazwisko może zawierać tylko litery.";
    czyPoprawne = false;
  }

  if (!email) {
    emailError.textContent = "Podaj email.";
    czyPoprawne = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Podaj poprawny adres email.";
    czyPoprawne = false;
  }

  if (czyPoprawne) {
  fetch("/wyslij-formularz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imie,
      nazwisko,
      email,
      wiadomosc : document.getElementById("wiadomosc").value.trim()
    })
  })
  .then(res => res.json())
  .then(data => {
      console.log(data);

      sukces.textContent = data.message;

      document.getElementById("Formularz").reset();
  })
  .catch(err => {
       console.error(err);
       sukces.style.color = "red";
       sukces.textContent = "Błąd wysyłania formularza.";
  });
}});


// pobranie danych z JSON i wyświetlenie ich na stronie
async function WczytajDane(file) {
  try {
    let myObject = await fetch(file);
     if (!myObject.ok) {
      throw new Error(`Status: ${myObject.status}`);
    }
    let myText = await myObject.json();

    const ListaUmiejetnosci = document.getElementById('ListaUmiejetnosci');
    const ListaProjekty = document.getElementById('ListaProjekty');

    myText.Umiejetnosci.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ListaUmiejetnosci.appendChild(li);
    });

    myText.Projekty.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ListaProjekty.appendChild(li);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}
WczytajDane('data.json');

// zapisanie notatek do localStorage
function ZapiszNotatke(Notatka) {
  localStorage.setItem("Notatki", JSON.stringify(Notatka));
}

// pobieranie notatek z localStorage
function PobierzNotatke() {
  return JSON.parse(localStorage.getItem("Notatki")) || [];
}

// usuwanie notatki
function UsunNotatke(Indeks) {
  const Notatki = PobierzNotatke();

  Notatki.splice(Indeks, 1);
  ZapiszNotatke(Notatki);

  WyswietlNotatke();
}

// wyświetlanie notatek na stronie
function WyswietlNotatke() {
  const Notatka = PobierzNotatke();
  const ListaNotatek = document.getElementById("ListaNotatek");

  ListaNotatek.innerHTML = "";

  Notatka.forEach((Notatka, Indeks) => {
    const Element = document.createElement("li");
    Element.textContent = Notatka;

    const Przycisk = document.createElement("button");
    Przycisk.textContent = "Usuń";
    Przycisk.onclick = () => UsunNotatke(Indeks);

    Element.appendChild(document.createTextNode("   "));
    Element.appendChild(Przycisk);
    ListaNotatek.appendChild(Element);
  });
}

// dodawanie nowej notatki
function DodajNotatke() {
  const PoleDodawaniaNotatki = document.getElementById("DodajNotatkę");
  const Notatka = PobierzNotatke();

  if (PoleDodawaniaNotatki.value.trim() === "") return;

  Notatka.push(PoleDodawaniaNotatki.value);
  ZapiszNotatke(Notatka);

  PoleDodawaniaNotatki.value = "";
  WyswietlNotatke();
}

// wyświetlenie notatek po załadowaniu strony
document.addEventListener("DOMContentLoaded", WyswietlNotatke);

// sprawdzenie, czy działa backend (placeholder)
const btn = document.getElementById("btn");
const result = document.getElementById("result");
btn.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/hello");
        const data = await response.json();
        result.textContent = data.message;
    } catch (err) {
        console.error("Error:", err);
    }
});
