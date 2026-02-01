package service

import (
	"bytes"
	"elasticgaze/backend/core/logging"
	"elasticgaze/backend/core/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// IndicesService handles operations related to Elasticsearch indices
type IndicesService struct {
	esService *ElasticsearchService
}

// NewIndicesService creates a new IndicesService instance
func NewIndicesService(esService *ElasticsearchService) *IndicesService {
	return &IndicesService{
		esService: esService,
	}
}

// GetIndices retrieves all indices from Elasticsearch
func (s *IndicesService) GetIndices(config *models.Config) (*models.IndicesResponse, error) {
	logging.Info("Fetching indices from Elasticsearch")

	// Build connection request
	connReq := &models.ConnectionTestRequest{
		Host:                 config.Host,
		Port:                 config.Port,
		SSLOrHTTPS:           config.SSLOrHTTPS,
		AuthenticationMethod: config.AuthenticationMethod,
		Username:             config.Username,
		Password:             config.Password,
	}

	// Build URL for cat indices API with format=json for easier parsing
	url := s.esService.buildURL(connReq, "/_cat/indices?format=json&h=index,health,status,uuid,pri,rep,docs.count,docs.deleted,store.size,pri.store.size,creation.date,creation.date.string,segments.count")

	logging.Infof("Request URL: %s", url)

	// Create HTTP request
	httpReq, err := http.NewRequest("GET", url, nil)
	if err != nil {
		logging.Errorf("Failed to create HTTP request: %v", err)
		return &models.IndicesResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create request: %v", err),
		}, nil
	}

	// Add authentication
	if err := s.esService.addAuthentication(httpReq, connReq); err != nil {
		logging.Errorf("Authentication setup failed: %v", err)
		return &models.IndicesResponse{
			Success: false,
			Error:   fmt.Sprintf("Authentication error: %v", err),
		}, nil
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("User-Agent", "ElasticGaze/1.0")

	// Make the request
	resp, err := s.esService.client.Do(httpReq)
	if err != nil {
		logging.Errorf("HTTP request failed: %v", err)
		return &models.IndicesResponse{
			Success: false,
			Error:   fmt.Sprintf("Connection failed: %v", err),
		}, nil
	}
	defer resp.Body.Close()

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		logging.Errorf("Failed to read response body: %v", err)
		return &models.IndicesResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to read response: %v", err),
		}, nil
	}

	// Check status code
	if resp.StatusCode != http.StatusOK {
		logging.Warnf("Elasticsearch returned error status %d: %s", resp.StatusCode, string(responseBody))
		return &models.IndicesResponse{
			Success: false,
			Error:   fmt.Sprintf("Elasticsearch error (status %d): %s", resp.StatusCode, string(responseBody)),
		}, nil
	}

	// Parse indices response
	indices, err := models.ParseIndicesFromCatAPI(string(responseBody))
	if err != nil {
		logging.Errorf("Failed to parse indices: %v", err)
		return &models.IndicesResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse response: %v", err),
		}, nil
	}

	logging.Infof("Successfully fetched %d indices", len(indices))

	return &models.IndicesResponse{
		Success: true,
		Indices: indices,
	}, nil
}

// CreateIndex creates a new index in Elasticsearch
func (s *IndicesService) CreateIndex(config *models.Config, req *models.CreateIndexRequest) (*models.CreateIndexResponse, error) {
	logging.Infof("Creating index: %s", req.IndexName)

	// Validate request
	if err := req.Validate(); err != nil {
		logging.Errorf("Create index request validation failed: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   err.Error(),
		}, nil
	}

	// Build connection request
	connReq := &models.ConnectionTestRequest{
		Host:                 config.Host,
		Port:                 config.Port,
		SSLOrHTTPS:           config.SSLOrHTTPS,
		AuthenticationMethod: config.AuthenticationMethod,
		Username:             config.Username,
		Password:             config.Password,
	}

	// Build URL for creating index
	url := s.esService.buildURL(connReq, "/"+req.IndexName)

	logging.Infof("Request URL: %s", url)

	// Prepare request body with settings
	requestBody := models.CreateIndexBody{
		Settings: models.IndexSettings{
			Index: models.IndexConfiguration{
				NumberOfShards:   req.NumShards,
				NumberOfReplicas: req.NumReplicas,
			},
		},
	}

	bodyBytes, err := json.Marshal(requestBody)
	if err != nil {
		logging.Errorf("Failed to marshal request body: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to prepare request: %v", err),
		}, nil
	}

	logging.Infof("Request body: %s", string(bodyBytes))

	// Create HTTP request
	httpReq, err := http.NewRequest("PUT", url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		logging.Errorf("Failed to create HTTP request: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create request: %v", err),
		}, nil
	}

	// Add authentication
	if err := s.esService.addAuthentication(httpReq, connReq); err != nil {
		logging.Errorf("Authentication setup failed: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Authentication error: %v", err),
		}, nil
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("User-Agent", "ElasticGaze/1.0")

	// Make the request
	resp, err := s.esService.client.Do(httpReq)
	if err != nil {
		logging.Errorf("HTTP request failed: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Connection failed: %v", err),
		}, nil
	}
	defer resp.Body.Close()

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		logging.Errorf("Failed to read response body: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to read response: %v", err),
		}, nil
	}

	logging.Infof("Response status: %d, Body: %s", resp.StatusCode, string(responseBody))

	// Check status code
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		logging.Warnf("Elasticsearch returned error status %d: %s", resp.StatusCode, string(responseBody))
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Elasticsearch error (status %d): %s", resp.StatusCode, string(responseBody)),
		}, nil
	}

	// Parse response
	var esResponse models.ElasticsearchIndexResponse
	if err := json.Unmarshal(responseBody, &esResponse); err != nil {
		logging.Errorf("Failed to parse response: %v", err)
		return &models.CreateIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse response: %v", err),
		}, nil
	}

	logging.Infof("Successfully created index: %s", req.IndexName)

	return &models.CreateIndexResponse{
		Success:            true,
		Acknowledged:       esResponse.Acknowledged,
		ShardsAcknowledged: esResponse.ShardsAcknowledged,
		Index:              esResponse.Index,
	}, nil
}

// DeleteIndex deletes an index from Elasticsearch
func (s *IndicesService) DeleteIndex(config *models.Config, req *models.DeleteIndexRequest) (*models.DeleteIndexResponse, error) {
	logging.Infof("Deleting index: %s", req.IndexName)

	// Build connection request
	connReq := &models.ConnectionTestRequest{
		Host:                 config.Host,
		Port:                 config.Port,
		SSLOrHTTPS:           config.SSLOrHTTPS,
		AuthenticationMethod: config.AuthenticationMethod,
		Username:             config.Username,
		Password:             config.Password,
	}

	// Build URL for deleting index
	url := s.esService.buildURL(connReq, "/"+req.IndexName)

	logging.Infof("Request URL: %s", url)

	// Create HTTP request
	httpReq, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		logging.Errorf("Failed to create HTTP request: %v", err)
		return &models.DeleteIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create request: %v", err),
		}, nil
	}

	// Add authentication
	if err := s.esService.addAuthentication(httpReq, connReq); err != nil {
		logging.Errorf("Authentication setup failed: %v", err)
		return &models.DeleteIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Authentication error: %v", err),
		}, nil
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("User-Agent", "ElasticGaze/1.0")

	// Make the request
	resp, err := s.esService.client.Do(httpReq)
	if err != nil {
		logging.Errorf("HTTP request failed: %v", err)
		return &models.DeleteIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Connection failed: %v", err),
		}, nil
	}
	defer resp.Body.Close()

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		logging.Errorf("Failed to read response body: %v", err)
		return &models.DeleteIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to read response: %v", err),
		}, nil
	}

	logging.Infof("Response status: %d, Body: %s", resp.StatusCode, string(responseBody))

	// Check status code
	if resp.StatusCode != http.StatusOK {
		logging.Warnf("Elasticsearch returned error status %d: %s", resp.StatusCode, string(responseBody))
		return &models.DeleteIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Elasticsearch error (status %d): %s", resp.StatusCode, string(responseBody)),
		}, nil
	}

	// Parse response
	var esResponse models.ElasticsearchDeleteResponse
	if err := json.Unmarshal(responseBody, &esResponse); err != nil {
		logging.Errorf("Failed to parse response: %v", err)
		return &models.DeleteIndexResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse response: %v", err),
		}, nil
	}

	logging.Infof("Successfully deleted index: %s", req.IndexName)

	return &models.DeleteIndexResponse{
		Success:      true,
		Acknowledged: esResponse.Acknowledged,
	}, nil
}
