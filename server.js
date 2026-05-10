const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// zapisywanie danych z formularza do pliku JSON
app.use(express.json());
app.use(express.static("public"));
app.post("/wyslij-formularz", (req, res) => {
    const noweDane = {...req.body, data: new Date().toLocaleString()};
    const sciezka = path.join(__dirname, "dane.json");
    fs.readFile(sciezka, "utf8", (err, data) => {
        let dane = [];
        if (!err && data) {
            try {
                dane = JSON.parse(data);
            } catch {
                dane = [];
            }
        }
        dane.push(noweDane);
        fs.writeFile(sciezka, JSON.stringify(dane, null, 2), (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Błąd zapisu danych"
                });
            }
            res.json({
                message: "Dane zapisane poprawnie"
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});