package models

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// IndicesRequest represents a request to get indices information
type IndicesRequest struct {
	ConfigID int `json:"config_id"`
}

// CreateIndexRequest represents a request to create a new index
type CreateIndexRequest struct {
	ConfigID    int    `json:"config_id"`
	IndexName   string `json:"index_name"`
	NumShards   int    `json:"num_shards"`
	NumReplicas int    `json:"num_replicas"`
}

// Validate validates the create index request
func (r *CreateIndexRequest) Validate() error {
	if strings.TrimSpace(r.IndexName) == "" {
		return fmt.Errorf("index name is required")
	}
	if r.NumShards < 1 {
		return fmt.Errorf("number of shards must be at least 1")
	}
	if r.NumReplicas < 0 {
		return fmt.Errorf("number of replicas cannot be negative")
	}
	return nil
}

// DeleteIndexRequest represents a request to delete an index
type DeleteIndexRequest struct {
	ConfigID  int    `json:"config_id"`
	IndexName string `json:"index_name"`
}

// IndexInfo represents information about a single Elasticsearch index
type IndexInfo struct {
	Name         string    `json:"name"`
	Health       string    `json:"health"`
	Status       string    `json:"status"`
	UUID         string    `json:"uuid"`
	Pri          string    `json:"pri"` // Primary shards
	Rep          string    `json:"rep"` // Replica shards
	DocsCount    string    `json:"docs_count"`
	DocsDeleted  string    `json:"docs_deleted"`
	StoreSize    string    `json:"store_size"`
	PriStoreSize string    `json:"pri_store_size"`
	CreationDate string    `json:"creation_date"`
	CreationTime time.Time `json:"creation_time"`
	Segments     string    `json:"segments,omitempty"`
	Aliases      string    `json:"aliases,omitempty"`
}

// IndicesResponse represents the response with all indices information
type IndicesResponse struct {
	Success bool        `json:"success"`
	Indices []IndexInfo `json:"indices,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// CreateIndexResponse represents the response after creating an index
type CreateIndexResponse struct {
	Success            bool   `json:"success"`
	Acknowledged       bool   `json:"acknowledged,omitempty"`
	ShardsAcknowledged bool   `json:"shards_acknowledged,omitempty"`
	Index              string `json:"index,omitempty"`
	Error              string `json:"error,omitempty"`
}

// DeleteIndexResponse represents the response after deleting an index
type DeleteIndexResponse struct {
	Success      bool   `json:"success"`
	Acknowledged bool   `json:"acknowledged,omitempty"`
	Error        string `json:"error,omitempty"`
}

// IndexSettings represents the settings for creating an index
type IndexSettings struct {
	Index IndexConfiguration `json:"index"`
}

// IndexConfiguration represents the index configuration
type IndexConfiguration struct {
	NumberOfShards   int `json:"number_of_shards"`
	NumberOfReplicas int `json:"number_of_replicas"`
}

// CreateIndexBody represents the request body for creating an index
type CreateIndexBody struct {
	Settings IndexSettings `json:"settings"`
}

// ElasticsearchIndexResponse represents the raw response from Elasticsearch when creating an index
type ElasticsearchIndexResponse struct {
	Acknowledged       bool   `json:"acknowledged"`
	ShardsAcknowledged bool   `json:"shards_acknowledged"`
	Index              string `json:"index"`
}

// ElasticsearchDeleteResponse represents the raw response from Elasticsearch when deleting an index
type ElasticsearchDeleteResponse struct {
	Acknowledged bool `json:"acknowledged"`
}

// ParseIndicesFromCatAPI parses the cat indices API response
func ParseIndicesFromCatAPI(responseBody string) ([]IndexInfo, error) {
	var rawIndices []map[string]interface{}
	if err := json.Unmarshal([]byte(responseBody), &rawIndices); err != nil {
		return nil, fmt.Errorf("failed to parse indices response: %v", err)
	}

	indices := make([]IndexInfo, 0, len(rawIndices))
	for _, raw := range rawIndices {
		index := IndexInfo{
			Name:         getString(raw, "index"),
			Health:       getString(raw, "health"),
			Status:       getString(raw, "status"),
			UUID:         getString(raw, "uuid"),
			Pri:          getString(raw, "pri"),
			Rep:          getString(raw, "rep"),
			DocsCount:    getString(raw, "docs.count"),
			DocsDeleted:  getString(raw, "docs.deleted"),
			StoreSize:    getString(raw, "store.size"),
			PriStoreSize: getString(raw, "pri.store.size"),
			CreationDate: getString(raw, "creation.date.string"),
			Segments:     getString(raw, "segments.count"),
		}

		// Parse creation time if available
		if creationDateMillis := getString(raw, "creation.date"); creationDateMillis != "" {
			// Elasticsearch returns creation date in milliseconds since epoch
			var millis int64
			fmt.Sscanf(creationDateMillis, "%d", &millis)
			index.CreationTime = time.Unix(0, millis*int64(time.Millisecond))
		}

		indices = append(indices, index)
	}

	return indices, nil
}

// Helper function to safely get string from map
func getString(m map[string]interface{}, key string) string {
	if val, ok := m[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
		// Convert to string if not already
		return fmt.Sprintf("%v", val)
	}
	return ""
}
