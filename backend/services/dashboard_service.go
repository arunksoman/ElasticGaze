package service

import (
	"elasticgaze/backend/core/logging"
	"elasticgaze/backend/core/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func (s *ElasticsearchService) GetClusterDashboardData(config *models.Config) (*models.ProcessedDashboardData, error) {
	logging.Infof("🔍 Fetching cluster dashboard data for %s", config.ConnectionName)

	// Create test connection request from config
	testReq := &models.ConnectionTestRequest{
		Host:                 config.Host,
		Port:                 config.Port,
		SSLOrHTTPS:           config.SSLOrHTTPS,
		AuthenticationMethod: config.AuthenticationMethod,
		Username:             config.Username,
		Password:             config.Password,
	}

	// Get cluster info
	clusterInfo, err := s.getClusterInfo(testReq)
	if err != nil {
		return nil, fmt.Errorf("failed to get cluster info: %w", err)
	}

	// Get cluster health
	clusterHealth, err := s.getClusterHealth(testReq)
	if err != nil {
		return nil, fmt.Errorf("failed to get cluster health: %w", err)
	}

	// Get nodes info
	nodesInfo, err := s.getNodesInfo(testReq)
	if err != nil {
		return nil, fmt.Errorf("failed to get nodes info: %w", err)
	}

	// Get indices stats
	indicesStats, err := s.getIndicesStats(testReq)
	if err != nil {
		return nil, fmt.Errorf("failed to get indices stats: %w", err)
	}

	// Process the data
	processedData := s.processClusterData(clusterInfo, clusterHealth, nodesInfo, indicesStats)

	logging.Info("✅ Successfully fetched cluster dashboard data")
	return processedData, nil
}

// getClusterInfo fetches cluster information
func (s *ElasticsearchService) getClusterInfo(connReq *models.ConnectionTestRequest) (*models.ClusterInfo, error) {
	url := s.buildURL(connReq, "/")

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var clusterInfo models.ClusterInfo
	if err := json.Unmarshal(body, &clusterInfo); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &clusterInfo, nil
}

// getClusterHealth fetches cluster health
func (s *ElasticsearchService) getClusterHealth(connReq *models.ConnectionTestRequest) (*models.ClusterHealth, error) {
	url := s.buildURL(connReq, "/_cluster/health")

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var clusterHealth models.ClusterHealth
	if err := json.Unmarshal(body, &clusterHealth); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &clusterHealth, nil
}

// getNodesInfo fetches nodes information
func (s *ElasticsearchService) getNodesInfo(connReq *models.ConnectionTestRequest) (*models.NodesInfo, error) {
	url := s.buildURL(connReq, "/_nodes")

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var nodesInfo models.NodesInfo
	if err := json.Unmarshal(body, &nodesInfo); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &nodesInfo, nil
}

// getIndicesStats fetches indices statistics
func (s *ElasticsearchService) getIndicesStats(connReq *models.ConnectionTestRequest) (*models.IndicesStats, error) {
	url := s.buildURL(connReq, "/_stats")

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var indicesStats models.IndicesStats
	if err := json.Unmarshal(body, &indicesStats); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &indicesStats, nil
}

// processClusterData processes raw cluster data into frontend-friendly format
func (s *ElasticsearchService) processClusterData(clusterInfo *models.ClusterInfo, clusterHealth *models.ClusterHealth, nodesInfo *models.NodesInfo, indicesStats *models.IndicesStats) *models.ProcessedDashboardData {
	// Process node counts
	nodeCounts := &models.NodeCounts{
		Total: len(nodesInfo.Nodes),
	}

	for _, node := range nodesInfo.Nodes {
		for _, role := range node.Roles {
			switch role {
			case "master":
				nodeCounts.Master++
			case "data", "data_content", "data_hot", "data_warm", "data_cold", "data_frozen":
				nodeCounts.Data++
			case "ingest":
				nodeCounts.Ingest++
			}
		}
	}

	// Process shard counts
	shardCounts := &models.ShardCounts{
		Primary: clusterHealth.ActivePrimaryShards,
		Total:   clusterHealth.ActiveShards,
	}
	shardCounts.Replica = shardCounts.Total - shardCounts.Primary

	// Process index metrics
	indexMetrics := &models.IndexMetrics{
		DocumentCount:  indicesStats.All.Total.Docs.Count,
		DiskUsageBytes: indicesStats.All.Total.Store.SizeInBytes,
		DiskUsage:      formatBytes(indicesStats.All.Total.Store.SizeInBytes),
	}

	return &models.ProcessedDashboardData{
		ClusterInfo:   clusterInfo,
		ClusterHealth: clusterHealth,
		NodeCounts:    nodeCounts,
		ShardCounts:   shardCounts,
		IndexMetrics:  indexMetrics,
	}
}

// GetClusterHealthByConfig fetches cluster health for a specific config
func (s *ElasticsearchService) GetClusterHealthByConfig(connReq *models.ConnectionTestRequest) (*models.ClusterHealth, error) {
	return s.getClusterHealth(connReq)
}

// formatBytes converts bytes to human readable format
func formatBytes(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}
