package service

import (
	"elasticgaze/backend/core/logging"
	"elasticgaze/backend/core/models"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
)

// NodesService handles operations related to Elasticsearch nodes
type NodesService struct {
	esService *ElasticsearchService
}

// NewNodesService creates a new NodesService
func NewNodesService(esService *ElasticsearchService) *NodesService {
	return &NodesService{
		esService: esService,
	}
}

// GetNodes retrieves comprehensive information about all nodes in the cluster
func (s *NodesService) GetNodes(config *models.Config) (*models.NodesResponse, error) {
	logging.Info("Fetching nodes information from Elasticsearch")

	// Convert config to connection request
	connReq := &models.ConnectionTestRequest{
		Host:                 config.Host,
		Port:                 config.Port,
		SSLOrHTTPS:           config.SSLOrHTTPS,
		AuthenticationMethod: config.AuthenticationMethod,
		Username:             config.Username,
		Password:             config.Password,
	}

	// Fetch nodes stats from _nodes/stats API
	nodesStats, err := s.fetchNodesStats(connReq)
	if err != nil {
		logging.Errorf("Failed to fetch nodes stats: %v", err)
		return &models.NodesResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to fetch nodes stats: %v", err),
		}, nil
	}

	// Fetch cat nodes for additional information
	catNodes, err := s.fetchCatNodes(connReq)
	if err != nil {
		logging.Errorf("Failed to fetch cat nodes: %v", err)
		return &models.NodesResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to fetch cat nodes: %v", err),
		}, nil
	}

	// Fetch shard counts per node
	shardCounts, err := s.fetchShardCounts(connReq)
	if err != nil {
		logging.Warnf("Failed to fetch shard counts: %v", err)
		shardCounts = make(map[string]int)
	}

	// Process and combine the data
	nodes := s.processNodesData(nodesStats, catNodes, shardCounts)

	logging.Infof("Successfully fetched information for %d nodes", len(nodes))

	return &models.NodesResponse{
		Success: true,
		Nodes:   nodes,
	}, nil
}

// fetchNodesStats fetches detailed statistics from _nodes/stats API
func (s *NodesService) fetchNodesStats(connReq *models.ConnectionTestRequest) (*models.ElasticsearchNodesStatsResponse, error) {
	url := s.esService.buildURL(connReq, "/_nodes")
	logging.Infof("Fetching nodes stats from: %s", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.esService.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.esService.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	return models.ParseNodesStatsResponse(body)
}

// fetchCatNodes fetches node information from _cat/nodes API
func (s *NodesService) fetchCatNodes(connReq *models.ConnectionTestRequest) ([]models.ElasticsearchCatNodesResponse, error) {
	url := s.esService.buildURL(connReq, "/_cat/nodes?format=json&h=ip,heap.percent,ram.percent,cpu,load_1m,load_5m,load_15m,node.role,master,name,disk.avail,disk.used,disk.total,disk.percent")
	logging.Infof("Fetching cat nodes from: %s", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.esService.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.esService.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	return models.ParseCatNodesResponse(body)
}

// fetchShardCounts fetches the number of shards per node
func (s *NodesService) fetchShardCounts(connReq *models.ConnectionTestRequest) (map[string]int, error) {
	url := s.esService.buildURL(connReq, "/_cat/shards?format=json&h=node")
	logging.Infof("Fetching shard counts from: %s", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if err := s.esService.addAuthentication(req, connReq); err != nil {
		return nil, fmt.Errorf("failed to add authentication: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.esService.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("unexpected status code %d: %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	shards, err := models.ParseCatShardsResponse(body)
	if err != nil {
		return nil, err
	}

	// Count shards per node
	counts := make(map[string]int)
	for _, shard := range shards {
		if shard.Node != "" {
			counts[shard.Node]++
		}
	}

	return counts, nil
}

// processNodesData combines and processes data from multiple sources
func (s *NodesService) processNodesData(
	nodesStats *models.ElasticsearchNodesStatsResponse,
	catNodes []models.ElasticsearchCatNodesResponse,
	shardCounts map[string]int,
) []models.NodeInfo {
	var nodes []models.NodeInfo

	// Create a map of cat nodes by name for easy lookup
	catNodesMap := make(map[string]models.ElasticsearchCatNodesResponse)
	for _, catNode := range catNodes {
		catNodesMap[catNode.Name] = catNode
	}

	// Process each node from stats API
	for nodeID, nodeData := range nodesStats.Nodes {
		node := models.NodeInfo{
			ID:      nodeID,
			Name:    nodeData.Name,
			Version: nodeData.Version,
			IP:      nodeData.IP,
			Roles:   nodeData.Roles,
			Shards:  shardCounts[nodeData.Name],
		}

		// Format attributes
		if len(nodeData.Attributes) > 0 {
			attrs := []string{}
			for key, value := range nodeData.Attributes {
				attrs = append(attrs, fmt.Sprintf("%s: %s", key, value))
			}
			node.Attributes = strings.Join(attrs, ", ")
		}

		// Calculate CPU percentage
		node.CPUPercent = float64(nodeData.OS.CPU.Percent)

		// Calculate RAM percentage
		if nodeData.OS.Mem.Total > 0 {
			used := nodeData.OS.Mem.Total - nodeData.OS.Mem.Free
			node.RAMPercent = float64(used) / float64(nodeData.OS.Mem.Total) * 100
		}

		// Calculate Heap percentage
		if nodeData.JVM.Mem.HeapMax > 0 {
			node.HeapPercent = float64(nodeData.JVM.Mem.HeapUsed) / float64(nodeData.JVM.Mem.HeapMax) * 100
		}

		// Calculate Disk percentage
		if nodeData.FS.Total.Total > 0 {
			used := nodeData.FS.Total.Total - nodeData.FS.Total.Available
			node.DiskPercent = float64(used) / float64(nodeData.FS.Total.Total) * 100
		}

		// Check if this is the master node from cat nodes
		if catNode, ok := catNodesMap[nodeData.Name]; ok {
			node.Master = catNode.Master == "*"
			node.RoleString = catNode.NodeRole
			logging.Infof("Node %s has role string: %s", nodeData.Name, catNode.NodeRole)

			// Format load average - prefer cat nodes data as it's more reliable
			if catNode.Load1m != "" && catNode.Load5m != "" && catNode.Load15m != "" {
				node.Load = fmt.Sprintf("%s / %s / %s", catNode.Load1m, catNode.Load5m, catNode.Load15m)
			} else {
				node.Load = fmt.Sprintf("%v / %v / %v",
					nodeData.OS.LoadAverage.OneM,
					nodeData.OS.LoadAverage.FiveM,
					nodeData.OS.LoadAverage.FifteenM,
				)
			}

			// Use cat nodes data if stats data is missing or zero
			if node.CPUPercent == 0 && catNode.CPU != "" {
				if cpu, err := strconv.ParseFloat(catNode.CPU, 64); err == nil {
					node.CPUPercent = cpu
				}
			}

			if node.RAMPercent == 0 && catNode.RAMPercent != "" {
				if ram, err := strconv.ParseFloat(catNode.RAMPercent, 64); err == nil {
					node.RAMPercent = ram
				}
			}

			if node.HeapPercent == 0 && catNode.HeapPercent != "" {
				if heap, err := strconv.ParseFloat(catNode.HeapPercent, 64); err == nil {
					node.HeapPercent = heap
				}
			}

			if node.DiskPercent == 0 && catNode.DiskPercent != "" {
				if disk, err := strconv.ParseFloat(catNode.DiskPercent, 64); err == nil {
					node.DiskPercent = disk
				}
			}
		}

		nodes = append(nodes, node)
	}

	return nodes
}
