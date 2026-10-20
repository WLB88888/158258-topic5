"use strict";

const statusElement = document.getElementById("status");
const booksContainer = document.getElementById("books");

function addRow(list, label, value, className = "") {
  const row = document.createElement("div");
  row.className = "record-row";
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  detail.textContent = value;
  if (className) detail.className = className;
  row.append(term, detail);
  list.appendChild(row);
}

fetch("book.xml")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then((xmlText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    if (xmlDoc.querySelector("parsererror")) {
      throw new Error("The XML document is not well-formed.");
    }

    const catalogue = xmlDoc.documentElement;
    if (catalogue.tagName !== "catalogue") {
      throw new Error("The XML root element must be <catalogue>.");
    }

    const books = Array.from(catalogue.children).filter((element) => element.tagName === "book");
    if (books.length === 0) {
      statusElement.textContent = "No books were found in the catalogue.";
      return;
    }

    for (const book of books) {
      const title = book.querySelector(":scope > title")?.textContent.trim();
      const author = book.querySelector(":scope > author")?.textContent.trim();
      const price = book.querySelector(":scope > price")?.textContent.trim();
      const id = book.getAttribute("id");
      if (!id || !title || !author || !price) {
        throw new Error("Each book must have an id, title, author, and price.");
      }

      const article = document.createElement("article");
      article.className = "record";
      const identifier = document.createElement("p");
      identifier.className = "book-id";
      identifier.textContent = `BOOK ${id.toUpperCase()}`;
      const heading = document.createElement("h2");
      heading.textContent = title;
      const details = document.createElement("dl");
      details.className = "record-list";
      addRow(details, "Author", author);
      addRow(details, "Price", `$${price}`, "price");
      article.append(identifier, heading, details);
      booksContainer.appendChild(article);
    }

    statusElement.textContent = `${books.length} books loaded.`;
  })
  .catch((error) => {
    statusElement.textContent = `Unable to load the catalogue: ${error.message}`;
    console.error("XML lab error:", error);
  });
