package database

import (
	"database/sql"
	"elasticgaze/backend/core/logging"
	"fmt"
	"os"
	"path/filepath"

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
