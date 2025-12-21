package main

import (
	"context"
	"elasticgaze/backend/core/database"
	"elasticgaze/backend/core/models"
	"elasticgaze/backend/repository"
	service "elasticgaze/backend/services"
	"fmt"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	db            *database.DB
	configService *service.ConfigService
	esService     *service.ElasticsearchService
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// Initialize database
	if err := a.initDatabase(); err != nil {
		runtime.LogErrorf(ctx, "Failed to initialize database: %v", err)
		fmt.Printf("Failed to initialize database: %v\n", err)
		// You might want to handle this more gracefully
		os.Exit(1)
	}

	// Logger is already initialized in main.go, just log that we're ready
	runtime.LogInfo(ctx, "ElasticGaze application startup completed successfully")
}

// initDatabase initializes the SQLite database and services
func (a *App) initDatabase() error {
	// Get the application data directory
	appDataDir, err := os.UserConfigDir()
	if err != nil {
		return fmt.Errorf("failed to get user config directory: %w", err)
	}

	// Create elasticgaze directory if it doesn't exist
	elasticGazeDir := filepath.Join(appDataDir, "elasticgaze")
	if err := os.MkdirAll(elasticGazeDir, 0755); err != nil {
		return fmt.Errorf("failed to create elasticgaze directory: %w", err)
	}

	// Database path
	dbPath := filepath.Join(elasticGazeDir, "elasticgaze.db")

	// Initialize database connection
	db, err := database.New(dbPath)
	if err != nil {
		return fmt.Errorf("failed to create database connection: %w", err)
	}

	a.db = db

	// Initialize repository and service layers
	configRepo := repository.NewConfigRepository(db.Conn())
	a.configService = service.NewConfigService(configRepo)
	a.esService = service.NewElasticsearchService()

	return nil
}

// Configuration Management API Methods

// CreateConfig creates a new Elasticsearch connection configuration
func (a *App) CreateConfig(req *models.CreateConfigRequest) (*models.Config, error) {
	runtime.LogInfof(a.ctx, "Creating new Elasticsearch configuration: %s", req.ConnectionName)
	config, err := a.configService.CreateConfig(req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to create configuration: %v", err)
		return nil, err
	}
	runtime.LogInfof(a.ctx, "Successfully created configuration with ID: %d", config.ID)
	return config, nil
}

// GetConfigByID retrieves a configuration by ID
func (a *App) GetConfigByID(id int) (*models.Config, error) {
	return a.configService.GetConfigByID(id)
}

// GetAllConfigs retrieves all configurations
func (a *App) GetAllConfigs() ([]*models.Config, error) {
	return a.configService.GetAllConfigs()
}

// GetDefaultConfig retrieves the default configuration
func (a *App) GetDefaultConfig() (*models.Config, error) {
	return a.configService.GetDefaultConfig()
}

// UpdateConfig updates an existing configuration
func (a *App) UpdateConfig(id int, req *models.UpdateConfigRequest) (*models.Config, error) {
	return a.configService.UpdateConfig(id, req)
}

// DeleteConfig deletes a configuration by ID
func (a *App) DeleteConfig(id int) error {
	return a.configService.DeleteConfig(id)
}

// CheckConnection tests an Elasticsearch connection
func (a *App) CheckConnection(req *models.ConnectionTestRequest) (*models.ConnectionTestResponse, error) {
	runtime.LogInfof(a.ctx, "Testing Elasticsearch connection to %s:%s", req.Host, req.Port)
	response, err := a.esService.TestConnection(req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Connection test failed: %v", err)
		return response, err
	}
	if response.Success {
		runtime.LogInfo(a.ctx, "Connection test successful")
	} else {
		runtime.LogWarningf(a.ctx, "Connection test failed: %s", response.Message)
	}
	return response, nil
}

// HasDefaultConfig checks if there is a default connection configured
func (a *App) HasDefaultConfig() (bool, error) {
	return a.configService.HasDefaultConfig()
}

// Close closes the database connection
func (a *App) Close() error {
	runtime.LogInfo(a.ctx, "Closing application and database connection")
	if a.db != nil {
		return a.db.Close()
	}
	return nil
}
