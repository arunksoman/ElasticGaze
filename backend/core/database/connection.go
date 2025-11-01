package database

import (
	"database/sql"
	"elasticgaze/backend/core/logging"
	"fmt"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

type DB struct {
	conn *sql.DB
}

func New(dbPath string) (*DB, error) {
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		logging.Errorf("Failed to create Database directory: %w", err)
		return nil, fmt.Errorf("failed to create Database directory: %w", err)
	}
	conn, err := sql.Open("sqlite", dbPath+"?_busy_timeout=10000&_journal_mode=WAL&_synchronous=NORMAL&_cache_size=1000&_foreign_keys=true")
	if err != nil {
		logging.Errorf("Failed to open Database connection: %w", err)
		return nil, fmt.Errorf("failed to open Database connection: %w", err)
	}
	conn.SetMaxOpenConns(25)
	conn.SetMaxIdleConns(25)
	conn.SetConnMaxLifetime(0)
	if err := conn.Ping(); err != nil {
		conn.Close()
		logging.Errorf("Failed to ping Database: %w", err)
		return nil, fmt.Errorf("failed to ping Database: %w", err)
	}
	db := &DB{conn: conn}

	if err := db.configurePragmas(); err != nil {
		db.Close()
		logging.Errorf("Failed to configure Database pragmas: %w", err)
		return nil, fmt.Errorf("failed to configure Database pragmas %w", err)
	}
	if err := db.initializeSchema(); err != nil {
		db.Close()
		logging.Errorf("Failed to initialize Database schema: %w", err)
		return nil, fmt.Errorf("failed to initialize Database schema: %w", err)
	}
	return db, nil
}

func (db *DB) Close() error {
	if db.conn != nil {
		if _, err := db.conn.Exec("PRAGMA wal_checkpoint(TRUNCATE);"); err != nil {
			logging.Warnf("Failed to checkpoint WAL before closing Database: %w", err)
		}
		err := db.conn.Close()
		db.conn = nil
		return err
	}
	return nil
}

func (db *DB) Conn() *sql.DB {
	return db.conn
}

func (db *DB) configurePragmas() error {
	pragmas := []string{
		"PRAGMA synchronous = NORMAL;",
		"PRAGMA busy_timeout = 10000;",
		"PRAGMA cache_size = 1000;",
		"PRAGMA temp_store = MEMORY;",
		"PRAGMA mapping_size = 268435456;",  // 256MB,
		"PRAGMA wal_autocheckpoint = 1000;", //checkpoint every 1000 pages
	}
	for _, pragma := range pragmas {
		if _, err := db.conn.Exec(pragma); err != nil {
			logging.Warnf("Failed to set Database pragma '%s': %w", pragma, err)
			return fmt.Errorf("failed to set Database pragma '%s': %w", pragma, err)
		}
	}
	return nil
}

// ExecuteWithRetry executes a function with retry logic for database busy errors
func (db *DB) ExecWithRetry(operation func() error, maxRetries int) error {
	var lastErr error

	for i := 0; i <= maxRetries; i++ {
		err := operation()
		if err == nil {
			return nil
		}

		// Check if it's a database busy error
		if err.Error() == "database is locked" || err.Error() == "database is busy" {
			lastErr = err
			if i < maxRetries {
				// Wait with exponential backoff
				waitTime := time.Duration(50*(i+1)) * time.Millisecond
				time.Sleep(waitTime)
				continue
			}
		} else {
			// If it's not a busy/lock error, return immediately
			return err
		}
	}

	return fmt.Errorf("operation failed after %d retries: %w", maxRetries, lastErr)
}
