const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000; // Port pour le serveur backend

// Middleware pour parser le JSON
app.use(bodyParser.json());
app.use(cors()); // Permet les requêtes CORS depuis le frontend React

// Configuration de la connexion à la base de données "majordhom"
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306, // Port MySQL
  user: "root", // L'utilisateur MySQL par défaut dans XAMPP est 'root'
  password: "", // Le mot de passe par défaut est généralement vide pour 'root'
  database: "majordhom", // Nom de la base de données
});

// Vérification de la connexion
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL "majordhom"');
});

// Route POST pour ajouter un utilisateur dans la table "users"
app.post("/api/users", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    message,
    availability,
    visitRequest,
    callbackRequest,
    photoRequest,
  } = req.body;

  console.log("Requête reçue avec les données suivantes :", req.body);

  try {
    // Définir un username basé sur l'email ou toute autre logique

    // Conversion des valeurs true/false en 1/0

    // Requête SQL pour insérer les données dans la table users
    const query = `
      INSERT INTO users
      (email, first_name, last_name, phone_number, gender, visit_request, callback_request, photo_request, message, availability, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    connection.query(
      query,
      [
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        req.body.phoneNumber,
        req.body.gender,
        req.body.visitRequest,
        req.body.callbackRequest,
        req.body.photoRequest,
        req.body.message,
        JSON.stringify(availability),
      ],
      (err, results) => {
        if (err) {
          console.error("Erreur lors de l'insertion de l'utilisateur :", err);
          res
            .status(500)
            .json({ error: "Erreur lors de l'insertion de l'utilisateur" });
        } else {
          if (results.affectedRows > 0) {
            console.log("Utilisateur ajouté avec succès :", results);
            res.status(201).json({
              message: "Utilisateur ajouté avec succès",
              userId: results.insertId,
            });
          } else {
            console.log("Aucune ligne insérée. Vérifiez votre requête SQL.");
            res.status(500).json({
              error: "Aucune ligne insérée. Vérifiez votre requête SQL.",
            });
          }
        }
      }
    );
  } catch (error) {
    console.error("Erreur lors du traitement des données :", error);
    res.status(500).json({ error: "Erreur lors du traitement des données" });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(
    `Serveur backend en cours d'exécution sur http://localhost:${port}`
  );
});
