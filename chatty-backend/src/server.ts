import app from "./app";

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port : http://localhost:${PORT}`);
});
