package repository

import (
	"database/sql"
	"elasticgaze/backend/core/logging"
	"elasticgaze/backend/core/models"
	"fmt"
)

type ConfigRepository struct {
	db *sql.DB
}

func NewConfigRepository(db *sql.DB) *ConfigRepository {
	return &ConfigRepository{db: db}
}

func (r *ConfigRepository) Create(req *models.CreateConfigRequest) (*models.Config, error) {
	config := &models.Config{
		ConnectionName:       req.ConnectionName,
		EnvIndicatorColor:    req.EnvIndicatorColor,
		Host:                 req.Host,
		Port:                 req.Port,
		SSLOrHTTPS:           req.SSLOrHTTPS,
		AuthenticationMethod: req.AuthenticationMethod,
		Username:             req.Username,
		Password:             req.Password,
		SetAsDefault:         req.SetAsDefault,
	}

	err := r.db.QueryRow(`
		INSERT INTO tbl_config (connection_name, env_indicator_color, host, port, ssl_or_https, authentication_method, username, password, set_as_default)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at
	`, config.ConnectionName, config.EnvIndicatorColor, config.Host, config.Port, config.SSLOrHTTPS, config.AuthenticationMethod, config.Username, config.Password, config.SetAsDefault).Scan(&config.ID, &config.CreatedAt, &config.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return config, nil
}

// GetByID retrieves a configuration by ID
func (r *ConfigRepository) GetByID(id int) (*models.Config, error) {
	query := `
		SELECT id, connection_name, env_indicator_color, host, port, ssl_or_https,
		       authentication_method, username, password, set_as_default, created_at, updated_at
		FROM tbl_config
		WHERE id = ?
	`

	var config models.Config
	err := r.db.QueryRow(query, id).Scan(
		&config.ID,
		&config.ConnectionName,
		&config.EnvIndicatorColor,
		&config.Host,
		&config.Port,
		&config.SSLOrHTTPS,
		&config.AuthenticationMethod,
		&config.Username,
		&config.Password,
		&config.SetAsDefault,
		&config.CreatedAt,
		&config.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("config with ID %d not found", id)
		}
		return nil, fmt.Errorf("failed to get config by ID: %w", err)
	}

	return &config, nil
}

// GetAll retrieves all configurations
func (r *ConfigRepository) GetAll() ([]*models.Config, error) {
	query := `
		SELECT id, connection_name, env_indicator_color, host, port, ssl_or_https,
		       authentication_method, username, password, set_as_default, created_at, updated_at
		FROM tbl_config
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to get all configs: %w", err)
	}
	defer rows.Close()

	var configs []*models.Config
	for rows.Next() {
		var config models.Config
		err := rows.Scan(
			&config.ID,
			&config.ConnectionName,
			&config.EnvIndicatorColor,
			&config.Host,
			&config.Port,
			&config.SSLOrHTTPS,
			&config.AuthenticationMethod,
			&config.Username,
			&config.Password,
			&config.SetAsDefault,
			&config.CreatedAt,
			&config.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan config row: %w", err)
		}
		configs = append(configs, &config)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating config rows: %w", err)
	}

	return configs, nil
}

func (r *ConfigRepository) GetDefault() (*models.Config, error) {
	query := `
		SELECT id, connection_name, env_indicator_color, host, port, ssl_or_https,
		       authentication_method, username, password, set_as_default, created_at, updated_at
		FROM tbl_config
		WHERE set_as_default = 1
		LIMIT 1
	`

	var config models.Config
	err := r.db.QueryRow(query).Scan(
		&config.ID,
		&config.ConnectionName,
		&config.EnvIndicatorColor,
		&config.Host,
		&config.Port,
		&config.SSLOrHTTPS,
		&config.AuthenticationMethod,
		&config.Username,
		&config.Password,
		&config.SetAsDefault,
		&config.CreatedAt,
		&config.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no default configuration found")
		}
		return nil, fmt.Errorf("failed to get default config: %w", err)
	}

	return &config, nil
}

func (r *ConfigRepository) Update(id int, req *models.UpdateConfigRequest) (*models.Config, error) {
	// If this config is being set as default, unset all other defaults first
	if req.SetAsDefault != nil && *req.SetAsDefault {
		if err := r.unsetAllDefaults(); err != nil {
			return nil, fmt.Errorf("failed to unset other defaults: %w", err)
		}
	}

	// Build dynamic query based on provided fields
	query := "UPDATE tbl_config SET "
	args := []interface{}{}
	setParts := []string{}

	if req.ConnectionName != nil {
		setParts = append(setParts, "connection_name = ?")
		args = append(args, *req.ConnectionName)
	}
	if req.EnvIndicatorColor != nil {
		setParts = append(setParts, "env_indicator_color = ?")
		args = append(args, *req.EnvIndicatorColor)
	}
	if req.Host != nil {
		setParts = append(setParts, "host = ?")
		args = append(args, *req.Host)
	}
	if req.Port != nil {
		setParts = append(setParts, "port = ?")
		args = append(args, *req.Port)
	}
	if req.SSLOrHTTPS != nil {
		setParts = append(setParts, "ssl_or_https = ?")
		args = append(args, *req.SSLOrHTTPS)
	}
	if req.AuthenticationMethod != nil {
		setParts = append(setParts, "authentication_method = ?")
		args = append(args, *req.AuthenticationMethod)
	}
	if req.Username != nil {
		setParts = append(setParts, "username = ?")
		args = append(args, *req.Username)
	}
	if req.Password != nil {
		setParts = append(setParts, "password = ?")
		args = append(args, *req.Password)
	}
	if req.SetAsDefault != nil {
		setParts = append(setParts, "set_as_default = ?")
		args = append(args, *req.SetAsDefault)
	}

	if len(setParts) == 0 {
		return nil, fmt.Errorf("no fields provided for update")
	}

	// Join all SET parts with commas
	query += setParts[0]
	for i := 1; i < len(setParts); i++ {
		query += ", " + setParts[i]
	}
	query += " WHERE id = ?"
	args = append(args, id)

	_, err := r.db.Exec(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to update config: %w", err)
	}

	// Return the updated config
	return r.GetByID(id)
}

func (r *ConfigRepository) Delete(id int) error {
	query := `DELETE FROM configs WHERE id = $1`
	result, err := r.db.Exec(query, id)

	if err != nil {
		message := fmt.Sprintf("failed to delete config with id %d: %v", id, err)
		logging.Errorf(message)
		return fmt.Errorf("failed to delete config with id %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		message := fmt.Sprintf("failed to get rows affected for config with id %d: %v", id, err)
		logging.Errorf(message)
		return fmt.Errorf("failed to get rows affected for config with id %w", err)
	}

	if rowsAffected == 0 {
		message := fmt.Sprintf("no config found with id %d", id)
		logging.Warnf(message)
		return fmt.Errorf("no config found with id %d", id)
	}

	return nil
}

func (r *ConfigRepository) HasDefaultConfig() (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM configs WHERE set_as_default = 1`
	err := r.db.QueryRow(query).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *ConfigRepository) unsetAllDefaults() error {
	query := `UPDATE configs SET set_as_default = 0 WHERE set_as_default = 1`
	_, err := r.db.Exec(query)
	return err
}
