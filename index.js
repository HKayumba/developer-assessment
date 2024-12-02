import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const PORT = 3000;

// Link database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "clientbc",
    password: "123456",
    port: 5432,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Function to generate client code
// Generate client code dynamically
app.post("/generate-code", async (req, res) => {
    const { clientName } = req.body;

    if (!clientName || clientName.trim() === "") {
        return res.status(400).json({ error: "Client name is required" });
    }

    try {
        // Generate unique client code
        const clientCode = await generateClientCode(clientName);

        res.json({ clientCode });
    } catch (err) {
        console.error("Error generating client code:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Updated generateClientCode function
async function generateClientCode(clientName) {
    const clientNameUpper = clientName.trim().toUpperCase();

    // Generate alpha part
    const alphaPart =
        clientNameUpper.length >= 3
            ? clientNameUpper.slice(0, 3)
            : clientNameUpper.padEnd(3, "A");

    let numericPart = 1;

    while (true) {
        const clientCode = `${alphaPart}${numericPart.toString().padStart(3, "0")}`;

        // Check for uniqueness in the database
        const result = await db.query(
            "SELECT COUNT(*) FROM clients WHERE client_code = $1",
            [clientCode]
        );

        if (parseInt(result.rows[0].count, 10) === 0) {
            return clientCode;
        }
        numericPart++;
    }
}


// Render the Home PAGE
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Render the client-view page
app.get("/clients", async (req, res) => {
    try {
        const client_query = "SELECT * FROM clients";
        const result = await db.query(client_query);
        res.render("clients.ejs", { clients: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error retrieving clients");
    }
});

// Render the form to add a new client
app.get("/add-client", (req, res) => {
    res.render("add-client.ejs");
});

// Add the client with code generation
app.post("/add-client", async (req, res) => {
    const name = req.body.name;
    const clientCode = req.body.clientCode;

    try {
        // Generate unique client code
       // const clientCode = await generateClientCode(name);

        // Insert client into the database
        await db.query("INSERT INTO clients (name, client_code) VALUES ($1, $2)", [name, clientCode]);
        res.redirect("/clients");
    } catch (err) {
        console.error("Error adding client:", err.message);
        res.status(500).send("Error adding client");
    }
});

// Render the contact-view page
app.get("/contacts", async (req, res) => {
    try {
        const contact_query = "SELECT * FROM contacts";
        const result = await db.query(contact_query);
        res.render("contacts.ejs", { contacts: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error retrieving contacts");
    }
});

// Render the form to add a new contact
app.get("/add-contact", (req, res) => {
    res.render("add-contact.ejs");
});

// Add a new contact
app.post("/add-contact", async (req, res) => {
    const { name, surname, email } = req.body;

    try {
        await db.query(
            "INSERT INTO contacts (name, surname, email) VALUES ($1, $2, $3)",
            [name, surname, email]
        );
        res.redirect("/contacts");
    } catch (err) {
        console.error("Error adding contact:", err.message);
        res.status(500).send("Error adding contact");
    }
});

// Render the page to generate a client code
app.get("/generate-code", (req, res) => {
    res.render("generate-code.ejs");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
