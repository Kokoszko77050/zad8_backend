require('dotenv').config();

const express = require("express");
const { createClient } = require('@supabase/supabase-js');
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.post("/wyslij-formularz", async (req, res) => {

    try {

        const noweDane = {
            ...req.body,
            data: new Date().toLocaleString()
        };

        // zapis do supabase
        const { error } = await supabase
            .from("DaneFormularz")
            .insert([noweDane]);

        if (error) {

            console.error("Supabase error:", error);

            return res.status(500).json({
                message: "Błąd zapisu do bazy danych"
            });
        }

        // zapis do dane.json
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

            fs.writeFile(
                sciezka,
                JSON.stringify(dane, null, 2),
                (err) => {

                    if (err) {

                        console.error("JSON error:", err);

                        return res.status(500).json({
                            message: "Błąd zapisu do pliku JSON"
                        });
                    }

                    res.json({
                        message: "Dane zapisane poprawnie"
                    });
                }
            );
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Błąd serwera"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});