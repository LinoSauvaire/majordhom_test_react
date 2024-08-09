import React, { useState } from "react";
import "../css/forms.css";

function UserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "Mme",
    visitRequest: 0,
    callbackRequest: 0,
    photoRequest: 0,
    message: "",
    dispo: [],
  });

  const [currentDispo, setCurrentDispo] = useState({
    day: "",
    hour: "",
    minute: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDispoChange = (e) => {
    const { name, value } = e.target;
    setCurrentDispo({
      ...currentDispo,
      [name]: value,
    });
  };

  const addDispo = () => {
    const dispoString = `${currentDispo.day} à ${currentDispo.hour}h${currentDispo.minute}`;
    setFormData({
      ...formData,
      dispo: [...formData.dispo, dispoString],
    });
    setCurrentDispo({ day: "", hour: "", minute: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      visitRequest: formData.visitRequest ? 1 : 0,
      callbackRequest: formData.callbackRequest ? 1 : 0,
      photoRequest: formData.photoRequest ? 1 : 0,
      message: formData.message,
      availability: formData.dispo,
    };

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse du serveur:", data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-section-left">
          <h2>Vos coordonnées</h2>
          <div className="gender">
            <label>
              <input
                type="radio"
                name="gender"
                value="Mme"
                checked={formData.gender === "Mme"}
                onChange={handleChange}
              />
              Mme
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Mr"
                checked={formData.gender === "Mr"}
                onChange={handleChange}
              />
              M
            </label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
            />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Adresse mail"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Téléphone"
              required
            />
          </div>
          <div className="dispo-section">
            <h3>Disponibilités pour une visite</h3>
            <div className="dispo-inputs">
              <select
                name="day"
                value={currentDispo.day}
                onChange={handleDispoChange}
              >
                <option value="">Jour</option>
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
              <input
                type="number"
                name="hour"
                value={currentDispo.hour}
                onChange={handleDispoChange}
                placeholder="H"
                min="0"
                max="23"
              />
              <input
                type="number"
                name="minute"
                value={currentDispo.minute}
                onChange={handleDispoChange}
                placeholder="Min"
                min="0"
                max="59"
              />
              <button type="button" className="add-dispo" onClick={addDispo}>
                Ajouter Dispo
              </button>
            </div>
            <div className="dispo-tags">
              {formData.dispo.map((d, index) => (
                <div key={index} className="dispo-tag">
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section-right">
          <h2>Votre message</h2>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="visitRequest"
                checked={formData.visitRequest}
                onChange={handleChange}
              />{" "}
              Demande de visite
            </label>
            <label>
              <input
                type="checkbox"
                name="callbackRequest"
                checked={formData.callback}
                onChange={handleChange}
              />{" "}
              Être rappelé
            </label>
            <label>
              <input
                type="checkbox"
                name="photoRequest"
                checked={formData.photoRequest}
                onChange={handleChange}
              />{" "}
              Plus de photos
            </label>
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Votre message"
            rows="5"
          />
        </div>

        <button type="submit" className="submit-button">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default UserForm;
