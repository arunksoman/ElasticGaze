package models

import "encoding/json"

// NodeInfo represents comprehensive information about an Elasticsearch node
type NodeInfo struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	IP         string   `json:"ip"`
	Master     bool     `json:"master"`
	Roles      []string `json:"roles"`
	RoleString string   `json:"role_string"` // Abbreviated role string (e.g., "dim" for data, ingest, master)
	Attributes string   `json:"attributes"`
	// Resource usage
	Load        string  `json:"load"`         // 1m, 5m, 15m load average
	CPUPercent  float64 `json:"cpu_percent"`  // CPU usage percentage
	RAMPercent  float64 `json:"ram_percent"`  // RAM usage percentage
	HeapPercent float64 `json:"heap_percent"` // JVM Heap usage percentage
	DiskPercent float64 `json:"disk_percent"` // Disk usage percentage
	// Additional info
	Shards  int    `json:"shards"`
	Version string `json:"version"`
}

// NodesResponse represents the response containing all node information
type NodesResponse struct {
	Success bool       `json:"success"`
	Nodes   []NodeInfo `json:"nodes"`
	Error   string     `json:"error,omitempty"`
}

// ElasticsearchNodesStatsResponse represents the response from _nodes/stats API
type ElasticsearchNodesStatsResponse struct {
	Nodes map[string]struct {
		Name       string            `json:"name"`
		Version    string            `json:"version"`
		Host       string            `json:"host"`
		IP         string            `json:"ip"`
		Roles      []string          `json:"roles"`
		Attributes map[string]string `json:"attributes"`
		OS         struct {
			CPU struct {
				Percent int `json:"percent"`
			} `json:"cpu"`
			Mem struct {
				Total int64 `json:"total_in_bytes"`
				Free  int64 `json:"free_in_bytes"`
			} `json:"mem"`
			LoadAverage struct {
				OneM     float64 `json:"1m"`
				FiveM    float64 `json:"5m"`
				FifteenM float64 `json:"15m"`
			} `json:"load_average"`
		} `json:"os"`
		JVM struct {
			Mem struct {
				HeapUsed int64 `json:"heap_used_in_bytes"`
				HeapMax  int64 `json:"heap_max_in_bytes"`
			} `json:"mem"`
		} `json:"jvm"`
		FS struct {
			Total struct {
				Total     int64 `json:"total_in_bytes"`
				Available int64 `json:"available_in_bytes"`
			} `json:"total"`
		} `json:"fs"`
	} `json:"nodes"`
}

// ElasticsearchCatNodesResponse represents a single node from _cat/nodes API
type ElasticsearchCatNodesResponse struct {
	IP          string `json:"ip"`
	HeapPercent string `json:"heap.percent"`
	RAMPercent  string `json:"ram.percent"`
	CPU         string `json:"cpu"`
	Load1m      string `json:"load_1m"`
	Load5m      string `json:"load_5m"`
	Load15m     string `json:"load_15m"`
	NodeRole    string `json:"node.role"`
	Master      string `json:"master"`
	Name        string `json:"name"`
	DiskAvail   string `json:"disk.avail"`
	DiskUsed    string `json:"disk.used"`
	DiskTotal   string `json:"disk.total"`
	DiskPercent string `json:"disk.percent"`
}

// ElasticsearchCatShardsResponse represents shard information for counting
type ElasticsearchCatShardsResponse struct {
	Node string `json:"node"`
}

// ParseNodesStatsResponse parses the Elasticsearch nodes stats response
func ParseNodesStatsResponse(responseBody []byte) (*ElasticsearchNodesStatsResponse, error) {
	var response ElasticsearchNodesStatsResponse
	if err := json.Unmarshal(responseBody, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

// ParseCatNodesResponse parses the Elasticsearch cat nodes response
func ParseCatNodesResponse(responseBody []byte) ([]ElasticsearchCatNodesResponse, error) {
	var response []ElasticsearchCatNodesResponse
	if err := json.Unmarshal(responseBody, &response); err != nil {
		return nil, err
	}
	return response, nil
}

// ParseCatShardsResponse parses the Elasticsearch cat shards response
func ParseCatShardsResponse(responseBody []byte) ([]ElasticsearchCatShardsResponse, error) {
	var response []ElasticsearchCatShardsResponse
	if err := json.Unmarshal(responseBody, &response); err != nil {
		return nil, err
	}
	return response, nil
}
