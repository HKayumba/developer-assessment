CREATE TABLE clients (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	client_code VARCHAR(100),
	contact_linked INT
);

SELECT * FROM clients

	
CREATE TABLE contacts (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	surname VARCHAR (100),
	email_address TEXT,
	contact_linked INT
);

SELECT * FROM contacts

ALTER TABLE contacts
RENAME COLUMN email_address TO email;



CREATE TABLE linked_contact (
	id SERIAL PRIMARY,
	client_id INT,
	contact_id INT,
	FOREIGN KEY (client_id) REFERENCE (clients_id),
	FOREIGN KEY (contact_id) REFERENCE (contacts_id)
)

ALTER TABLE clients
ALTER COLUMN client_code TYPE VARCHAR(10);

TRUNCATE TABLE contacts