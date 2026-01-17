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
	ctx                context.Context
	db                 *database.DB
	configService      *service.ConfigService
	esService          *service.ElasticsearchService
	collectionsService *service.CollectionsService
	nodesService       *service.NodesService
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

	// Initialize collections repository and service
	collectionsRepo := repository.NewCollectionsRepository(db.Conn())
	a.collectionsService = service.NewCollectionsService(collectionsRepo)

	// Initialize nodes service with elasticsearch service
	a.nodesService = service.NewNodesService(a.esService)

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

// GetClusterDashboardData retrieves comprehensive dashboard data for a specific configuration
func (a *App) GetClusterDashboardData(configID int) (*models.ProcessedDashboardData, error) {
	runtime.LogInfof(a.ctx, "Fetching cluster dashboard data for config ID: %d", configID)

	// Get the configuration
	config, err := a.configService.GetConfigByID(configID)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to get configuration: %v", err)
		return nil, err
	}

	// Fetch dashboard data
	dashboardData, err := a.esService.GetClusterDashboardData(config)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to fetch dashboard data: %v", err)
		return nil, err
	}

	runtime.LogInfo(a.ctx, "Successfully retrieved cluster dashboard data")
	return dashboardData, nil
}

// GetClusterHealth retrieves cluster health for a specific connection
func (a *App) GetClusterHealth(req *models.ConnectionTestRequest) (*models.ClusterHealth, error) {
	runtime.LogInfof(a.ctx, "Fetching cluster health for %s:%s", req.Host, req.Port)

	clusterHealth, err := a.esService.GetClusterHealthByConfig(req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to fetch cluster health: %v", err)
		return nil, err
	}

	runtime.LogInfo(a.ctx, "Successfully retrieved cluster health")
	return clusterHealth, nil
}

// ExecuteRestRequest executes a generic REST request to Elasticsearch
func (a *App) ExecuteRestRequest(configID int, req *models.ElasticsearchRestRequest) (*models.ElasticsearchRestResponse, error) {
	runtime.LogInfof(a.ctx, "Executing REST request: %s %s", req.Method, req.Endpoint)

	// Get the configuration
	config, err := a.configService.GetConfigByID(configID)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to get configuration: %v", err)
		return nil, err
	}

	// Execute the REST request
	response, err := a.esService.ExecuteRestRequest(config, req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to execute REST request: %v", err)
		return nil, err
	}

	if response.Success {
		runtime.LogInfo(a.ctx, "REST request completed successfully")
	} else {
		runtime.LogWarningf(a.ctx, "REST request failed with status %d", response.StatusCode)
	}

	return response, nil
}

// GetNodes retrieves information about all nodes in the cluster for a specific configuration
func (a *App) GetNodes(configID int) (*models.NodesResponse, error) {
	runtime.LogInfof(a.ctx, "Fetching nodes data for config ID: %d", configID)

	// Get the configuration
	config, err := a.configService.GetConfigByID(configID)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to get configuration: %v", err)
		return nil, fmt.Errorf("failed to get configuration: %w", err)
	}

	// Fetch nodes data
	response, err := a.nodesService.GetNodes(config)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to fetch nodes: %v", err)
		return nil, fmt.Errorf("failed to fetch nodes: %w", err)
	}

	if !response.Success {
		runtime.LogWarningf(a.ctx, "Nodes fetch completed with errors: %s", response.Error)
	}

	runtime.LogInfof(a.ctx, "Successfully fetched %d nodes", len(response.Nodes))
	return response, nil
}

// Collections Management API Methods

// CreateCollection creates a new collection
func (a *App) CreateCollection(req *models.CreateCollectionRequest) (*models.Collection, error) {
	runtime.LogInfof(a.ctx, "Creating new collection: %s", req.Name)
	collection, err := a.collectionsService.CreateCollection(req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to create collection: %v", err)
		return nil, err
	}
	runtime.LogInfof(a.ctx, "Successfully created collection with ID: %d", collection.ID)
	return collection, nil
}

// GetCollectionByID retrieves a collection by ID
func (a *App) GetCollectionByID(id int) (*models.Collection, error) {
	return a.collectionsService.GetCollectionByID(id)
}

// GetAllCollections retrieves all collections
func (a *App) GetAllCollections() ([]*models.Collection, error) {
	return a.collectionsService.GetAllCollections()
}

// UpdateCollection updates an existing collection
func (a *App) UpdateCollection(id int, req *models.UpdateCollectionRequest) (*models.Collection, error) {
	runtime.LogInfof(a.ctx, "Updating collection ID: %d", id)
	collection, err := a.collectionsService.UpdateCollection(id, req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update collection: %v", err)
		return nil, err
	}
	runtime.LogInfo(a.ctx, "Successfully updated collection")
	return collection, nil
}

// DeleteCollection deletes a collection by ID
func (a *App) DeleteCollection(id int) error {
	runtime.LogInfof(a.ctx, "Deleting collection ID: %d", id)
	err := a.collectionsService.DeleteCollection(id)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to delete collection: %v", err)
		return err
	}
	runtime.LogInfo(a.ctx, "Successfully deleted collection")
	return nil
}

// Folder Management API Methods

// CreateFolder creates a new folder within a collection
func (a *App) CreateFolder(req *models.CreateFolderRequest) (*models.Folder, error) {
	runtime.LogInfof(a.ctx, "Creating new folder: %s in collection %d", req.Name, req.CollectionID)
	folder, err := a.collectionsService.CreateFolder(req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to create folder: %v", err)
		return nil, err
	}
	runtime.LogInfof(a.ctx, "Successfully created folder with ID: %d", folder.ID)
	return folder, nil
}

// GetFolderByID retrieves a folder by ID
func (a *App) GetFolderByID(id int) (*models.Folder, error) {
	return a.collectionsService.GetFolderByID(id)
}

// GetFoldersByCollectionID retrieves all folders for a specific collection
func (a *App) GetFoldersByCollectionID(collectionID int) ([]*models.Folder, error) {
	return a.collectionsService.GetFoldersByCollectionID(collectionID)
}

// UpdateFolder updates an existing folder
func (a *App) UpdateFolder(id int, req *models.UpdateFolderRequest) (*models.Folder, error) {
	runtime.LogInfof(a.ctx, "Updating folder ID: %d", id)
	folder, err := a.collectionsService.UpdateFolder(id, req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update folder: %v", err)
		return nil, err
	}
	runtime.LogInfo(a.ctx, "Successfully updated folder")
	return folder, nil
}

// DeleteFolder deletes a folder by ID
func (a *App) DeleteFolder(id int) error {
	runtime.LogInfof(a.ctx, "Deleting folder ID: %d", id)
	err := a.collectionsService.DeleteFolder(id)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to delete folder: %v", err)
		return err
	}
	runtime.LogInfo(a.ctx, "Successfully deleted folder")
	return nil
}

// Request Management API Methods

// CreateRequest creates a new request within a collection or folder
func (a *App) CreateRequest(req *models.CreateRequestRequest) (*models.Request, error) {
	runtime.LogInfof(a.ctx, "Creating new request: %s in collection %d", req.Name, req.CollectionID)
	request, err := a.collectionsService.CreateRequest(req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to create request: %v", err)
		return nil, err
	}
	runtime.LogInfof(a.ctx, "Successfully created request with ID: %d", request.ID)
	return request, nil
}

// GetRequestByID retrieves a request by ID
func (a *App) GetRequestByID(id int) (*models.Request, error) {
	return a.collectionsService.GetRequestByID(id)
}

// GetRequestsByCollectionID retrieves all requests for a specific collection
func (a *App) GetRequestsByCollectionID(collectionID int) ([]*models.Request, error) {
	return a.collectionsService.GetRequestsByCollectionID(collectionID)
}

// GetRequestsByFolderID retrieves all requests for a specific folder
func (a *App) GetRequestsByFolderID(folderID int) ([]*models.Request, error) {
	return a.collectionsService.GetRequestsByFolderID(folderID)
}

// UpdateRequest updates an existing request
func (a *App) UpdateRequest(id int, req *models.UpdateRequestRequest) (*models.Request, error) {
	runtime.LogInfof(a.ctx, "Updating request ID: %d", id)
	request, err := a.collectionsService.UpdateRequest(id, req)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update request: %v", err)
		return nil, err
	}
	runtime.LogInfo(a.ctx, "Successfully updated request")
	return request, nil
}

// DeleteRequest deletes a request by ID
func (a *App) DeleteRequest(id int) error {
	runtime.LogInfof(a.ctx, "Deleting request ID: %d", id)
	err := a.collectionsService.DeleteRequest(id)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to delete request: %v", err)
		return err
	}
	runtime.LogInfo(a.ctx, "Successfully deleted request")
	return nil
}

// Tree Structure API Methods

// GetCollectionTree retrieves a hierarchical tree structure for a collection
func (a *App) GetCollectionTree(collectionID int) (*models.CollectionTreeNode, error) {
	runtime.LogInfof(a.ctx, "Fetching collection tree for ID: %d", collectionID)
	tree, err := a.collectionsService.GetCollectionTree(collectionID)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to fetch collection tree: %v", err)
		return nil, err
	}
	runtime.LogInfo(a.ctx, "Successfully retrieved collection tree")
	return tree, nil
}

// GetAllCollectionTrees retrieves hierarchical tree structures for all collections
func (a *App) GetAllCollectionTrees() ([]*models.CollectionTreeNode, error) {
	runtime.LogInfo(a.ctx, "Fetching all collection trees")
	trees, err := a.collectionsService.GetAllCollectionTrees()
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to fetch collection trees: %v", err)
		return nil, err
	}
	runtime.LogInfof(a.ctx, "Successfully retrieved %d collection trees", len(trees))
	return trees, nil
}

// EnsureDefaultCollection ensures that at least one collection exists
func (a *App) EnsureDefaultCollection() (*models.Collection, error) {
	return a.collectionsService.EnsureDefaultCollection()
}

// Close closes the database connection
func (a *App) Close() error {
	runtime.LogInfo(a.ctx, "Closing application and database connection")
	if a.db != nil {
		return a.db.Close()
	}
	return nil
}
