package service

import (
	"bytes"
	"elasticgaze/backend/core/logging"
	"elasticgaze/backend/core/models"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// formatDuration formats a time.Duration into a human-readable string
// Returns milliseconds for durations < 1 second, seconds otherwise
func formatDuration(d time.Duration) string {
	if d < time.Second {
		return fmt.Sprintf("%dms", d.Milliseconds())
	}
	return fmt.Sprintf("%.2fs", d.Seconds())
}

// ExecuteRestRequest executes a generic REST request to the default Elasticsearch cluster
func (s *ElasticsearchService) ExecuteRestRequest(config *models.Config, req *models.ElasticsearchRestRequest) (*models.ElasticsearchRestResponse, error) {
	logging.Infof("Executing ES REST request: %s %s", req.Method, req.Endpoint)

	// Validate the request
	if err := req.Validate(); err != nil {
		logging.Errorf("REST request validation failed: %v", err)
		return &models.ElasticsearchRestResponse{
			Success:      false,
			StatusCode:   400,
			Duration:     "0ms",
			ErrorDetails: err.Error(),
			ErrorCode:    "VALIDATION_ERROR",
		}, nil
	}

	// Use the endpoint as complete URL (frontend now sends full URLs)
	url := strings.TrimSpace(req.Endpoint)

	// Basic URL validation
	if url == "" {
		logging.Error("Empty URL provided")
		return &models.ElasticsearchRestResponse{
			Success:      false,
			StatusCode:   400,
			Duration:     "0ms",
			ErrorDetails: "URL cannot be empty",
			ErrorCode:    "INVALID_URL",
		}, nil
	}

	logging.Infof("Request URL: %s", url)

	// Convert config to connection request for authentication
	connReq := &models.ConnectionTestRequest{
		Host:                 config.Host,
		Port:                 config.Port,
		SSLOrHTTPS:           config.SSLOrHTTPS,
		AuthenticationMethod: config.AuthenticationMethod,
		Username:             config.Username,
		Password:             config.Password,
	}

	// Prepare request body
	var body io.Reader
	if req.Body != nil && strings.TrimSpace(*req.Body) != "" {
		body = bytes.NewBufferString(*req.Body)
		logging.Infof("Request body: %s", *req.Body)
	}

	// Create HTTP request
	httpReq, err := http.NewRequest(strings.ToUpper(req.Method), url, body)
	if err != nil {
		logging.Errorf("Failed to create HTTP request: %v", err)
		return &models.ElasticsearchRestResponse{
			Success:      false,
			StatusCode:   500,
			Duration:     "0ms",
			ErrorDetails: fmt.Sprintf("HTTP request creation failed: %v", err),
			ErrorCode:    "REQUEST_CREATION_ERROR",
		}, nil
	}

	// Add authentication
	if err := s.addAuthentication(httpReq, connReq); err != nil {
		logging.Errorf("Authentication setup failed: %v", err)
		return &models.ElasticsearchRestResponse{
			Success:      false,
			StatusCode:   401,
			Duration:     "0ms",
			ErrorDetails: fmt.Sprintf("Authentication error: %v", err),
			ErrorCode:    "AUTH_ERROR",
		}, nil
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("User-Agent", "ElasticGaze/1.0")

	// Make the request
	logging.Info("Making HTTP request...")
	start := time.Now()
	resp, err := s.client.Do(httpReq)
	duration := time.Since(start)

	if err != nil {
		logging.Errorf("HTTP request failed after %v: %v", duration, err)
		return &models.ElasticsearchRestResponse{
			Success:      false,
			StatusCode:   500,
			Duration:     formatDuration(duration),
			ErrorDetails: fmt.Sprintf("Connection failed after %v: %v", duration, err),
			ErrorCode:    "CONNECTION_ERROR",
		}, nil
	}
	defer resp.Body.Close()

	logging.Infof("Response status: %d, Duration: %v", resp.StatusCode, duration)

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		logging.Errorf("Failed to read response body: %v", err)
		return &models.ElasticsearchRestResponse{
			Success:      false,
			StatusCode:   resp.StatusCode,
			Duration:     formatDuration(duration),
			ErrorDetails: fmt.Sprintf("Failed to read response: %v", err),
			ErrorCode:    "RESPONSE_READ_ERROR",
		}, nil
	}

	// Check if the response is successful (2xx status codes)
	success := resp.StatusCode >= 200 && resp.StatusCode < 300
	if !success {
		logging.Warnf("Elasticsearch returned error status %d", resp.StatusCode)
	} else {
		logging.Info("Request completed successfully")
	}

	return &models.ElasticsearchRestResponse{
		Success:    success,
		StatusCode: resp.StatusCode,
		Response:   string(responseBody),
		Duration:   formatDuration(duration),
	}, nil
}

// buildURL constructs the full URL for Elasticsearch API calls
func (s *ElasticsearchService) buildURL(connReq *models.ConnectionTestRequest, endpoint string) string {
	scheme := "http"
	if connReq.SSLOrHTTPS {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s:%s%s", scheme, connReq.Host, connReq.Port, endpoint)
}

// addAuthentication adds authentication headers to the HTTP request
func (s *ElasticsearchService) addAuthentication(req *http.Request, connReq *models.ConnectionTestRequest) error {
	switch connReq.AuthenticationMethod {
	case "basic":
		if connReq.Username == nil || connReq.Password == nil {
			return fmt.Errorf("username and password required for basic authentication")
		}
		req.SetBasicAuth(*connReq.Username, *connReq.Password)

	case "apikey":
		if connReq.APIKey == nil {
			return fmt.Errorf("API key required for API key authentication")
		}
		req.Header.Set("Authorization", "ApiKey "+*connReq.APIKey)

	case "none":
		// No authentication needed

	default:
		return fmt.Errorf("unsupported authentication method: %s", connReq.AuthenticationMethod)
	}

	return nil
}
