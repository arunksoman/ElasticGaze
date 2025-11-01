package database

import "fmt"

func (db *DB) initializeSchema() error {
	// Create tbl_config table
	configQuery := `
	CREATE TABLE IF NOT EXISTS tbl_config (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		connection_name VARCHAR(255) NOT NULL UNIQUE,
		env_indicator_color VARCHAR(30) NOT NULL DEFAULT 'blue',
		host VARCHAR(255) NOT NULL,
		port VARCHAR(8) NOT NULL DEFAULT '9200',
		ssl_or_https BOOLEAN NOT NULL DEFAULT 0,
		authentication_method VARCHAR(255) NOT NULL DEFAULT 'none',
		username VARCHAR(255),
		password VARCHAR(255),
		set_as_default BOOLEAN NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := db.conn.Exec(configQuery); err != nil {
		return fmt.Errorf("failed to create tbl_config table: %w", err)
	}

	// Create collections table
	collectionsQuery := `
	CREATE TABLE IF NOT EXISTS tbl_collections (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(255) NOT NULL,
		description TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := db.conn.Exec(collectionsQuery); err != nil {
		return fmt.Errorf("failed to create tbl_collections table: %w", err)
	}

	// Create folders table
	foldersQuery := `
	CREATE TABLE IF NOT EXISTS tbl_folders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(255) NOT NULL,
		parent_folder_id INTEGER,
		collection_id INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (parent_folder_id) REFERENCES tbl_folders(id) ON DELETE CASCADE,
		FOREIGN KEY (collection_id) REFERENCES tbl_collections(id) ON DELETE CASCADE
	);`

	if _, err := db.conn.Exec(foldersQuery); err != nil {
		return fmt.Errorf("failed to create tbl_folders table: %w", err)
	}

	// Create requests table
	requestsQuery := `
	CREATE TABLE IF NOT EXISTS tbl_requests (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(255) NOT NULL,
		method VARCHAR(10) NOT NULL DEFAULT 'GET',
		url TEXT NOT NULL,
		body TEXT,
		description TEXT,
		folder_id INTEGER,
		collection_id INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (folder_id) REFERENCES tbl_folders(id) ON DELETE CASCADE,
		FOREIGN KEY (collection_id) REFERENCES tbl_collections(id) ON DELETE CASCADE
	);`

	if _, err := db.conn.Exec(requestsQuery); err != nil {
		return fmt.Errorf("failed to create tbl_requests table: %w", err)
	}

	// Create trigger to update updated_at field for tbl_config
	configTriggerQuery := `
	CREATE TRIGGER IF NOT EXISTS update_tbl_config_updated_at 
	AFTER UPDATE ON tbl_config
	FOR EACH ROW
	BEGIN
		UPDATE tbl_config SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	if _, err := db.conn.Exec(configTriggerQuery); err != nil {
		return fmt.Errorf("failed to create config trigger: %w", err)
	}

	// Create trigger to update updated_at field for tbl_collections
	collectionsTriggerQuery := `
	CREATE TRIGGER IF NOT EXISTS update_tbl_collections_updated_at 
	AFTER UPDATE ON tbl_collections
	FOR EACH ROW
	BEGIN
		UPDATE tbl_collections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	if _, err := db.conn.Exec(collectionsTriggerQuery); err != nil {
		return fmt.Errorf("failed to create collections trigger: %w", err)
	}

	// Create trigger to update updated_at field for tbl_folders
	foldersTriggerQuery := `
	CREATE TRIGGER IF NOT EXISTS update_tbl_folders_updated_at 
	AFTER UPDATE ON tbl_folders
	FOR EACH ROW
	BEGIN
		UPDATE tbl_folders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	if _, err := db.conn.Exec(foldersTriggerQuery); err != nil {
		return fmt.Errorf("failed to create folders trigger: %w", err)
	}

	// Create trigger to update updated_at field for tbl_requests
	requestsTriggerQuery := `
	CREATE TRIGGER IF NOT EXISTS update_tbl_requests_updated_at 
	AFTER UPDATE ON tbl_requests
	FOR EACH ROW
	BEGIN
		UPDATE tbl_requests SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	if _, err := db.conn.Exec(requestsTriggerQuery); err != nil {
		return fmt.Errorf("failed to create requests trigger: %w", err)
	}

	return nil
}
