"use strict";

const statusElement = document.getElementById("status");
const usersContainer = document.getElementById("users");

function addRow(list, label, value) {
  const row = document.createElement("div");
  row.className = "record-row";
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  detail.textContent = String(value);
  row.append(term, detail);
  list.appendChild(row);
}

function addSectionLabel(card, text) {
  const label = document.createElement("p");
  label.className = "section-label";
  label.textContent = text;
  card.appendChild(label);
}

function renderUser(user, index) {
  const requiredValues = [user.firstName, user.lastName, user.email, user.dateOfBirth];
  const address = user.address;
  const preferences = user.preferences;
  if (
    requiredValues.some((value) => typeof value !== "string" || value.trim() === "") ||
    !address || ![address.street, address.city, address.state, address.zipCode].every((value) => typeof value === "string") ||
    !preferences ||
    typeof preferences.theme !== "string" ||
    typeof preferences.language !== "string" ||
    typeof preferences.notifications !== "boolean" ||
    typeof preferences.subscription !== "boolean"
  ) {
    throw new Error(`Profile ${index + 1} is missing a required field or has an invalid field type.`);
  }

  const card = document.createElement("article");
  card.className = "record";
  const number = document.createElement("p");
  number.className = "profile-index";
  number.textContent = `PROFILE ${String(index + 1).padStart(2, "0")}`;
  const heading = document.createElement("h2");
  heading.textContent = `${user.firstName} ${user.lastName}`;
  const basicInfo = document.createElement("dl");
  basicInfo.className = "record-list";
  addRow(basicInfo, "Email", user.email);
  addRow(basicInfo, "Date of birth", user.dateOfBirth);
  card.append(number, heading, basicInfo);

  addSectionLabel(card, "Address");
  const addressInfo = document.createElement("dl");
  addressInfo.className = "record-list";
  addRow(addressInfo, "Street", address.street);
  addRow(addressInfo, "City", address.city);
  addRow(addressInfo, "State", address.state);
  addRow(addressInfo, "ZIP code", address.zipCode);
  card.appendChild(addressInfo);

  addSectionLabel(card, "Preferences");
  const preferenceInfo = document.createElement("dl");
  preferenceInfo.className = "record-list";
  addRow(preferenceInfo, "Theme", preferences.theme);
  addRow(preferenceInfo, "Language", preferences.language);
  addRow(preferenceInfo, "Notifications", preferences.notifications ? "On" : "Off");

  const subscription = document.createElement("span");
  subscription.className = `status-badge${preferences.subscription ? "" : " off"}`;
  subscription.textContent = preferences.subscription
    ? "Newsletter: Subscribed"
    : "Newsletter: Not subscribed";

  card.append(preferenceInfo, subscription);
  usersContainer.appendChild(card);
}

fetch("userProfiles.json")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((json) => {
    if (!json || !Array.isArray(json.users)) {
      throw new Error('The JSON file must contain a "users" array.');
    }
    if (json.users.length === 0) {
      statusElement.textContent = "No user profiles were found.";
      return;
    }

    json.users.forEach(renderUser);
    statusElement.textContent = `${json.users.length} profiles loaded.`;
  })
  .catch((error) => {
    statusElement.textContent = `Unable to load profiles: ${error.message}`;
    console.error("JSON lab error:", error);
  });
