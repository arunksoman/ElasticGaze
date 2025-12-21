package service

import (
	"net/http"
)

// ElasticsearchService handles Elasticsearch connection testing
type ElasticsearchService struct {
	client *http.Client
}
