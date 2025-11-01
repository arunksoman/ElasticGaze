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
		INSERT INTO configs (connection_name, env_indicator_color, host, port, ssl_or_https, authentication_method, username, password, set_as_default)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at
	`, config.ConnectionName, config.EnvIndicatorColor, config.Host, config.Port, config.SSLOrHTTPS, config.AuthenticationMethod, config.Username, config.Password, config.SetAsDefault).Scan(&config.ID, &config.CreatedAt, &config.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return config, nil
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
