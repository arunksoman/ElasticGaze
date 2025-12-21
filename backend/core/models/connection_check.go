package models

// ConnectionTestRequest represents a request to test an Elasticsearch connection
type ConnectionTestRequest struct {
	Host                 string  `json:"host" validate:"required"`
	Port                 string  `json:"port"`
	SSLOrHTTPS           bool    `json:"ssl_or_https"`
	AuthenticationMethod string  `json:"authentication_method"`
	Username             *string `json:"username,omitempty"`
	Password             *string `json:"password,omitempty"`
	APIKey               *string `json:"api_key,omitempty"`
}

// ConnectionTestResponse represents the response from testing a connection
type ConnectionTestResponse struct {
	Success      bool   `json:"success"`
	Message      string `json:"message"`
	ClusterName  string `json:"cluster_name,omitempty"`
	Version      string `json:"version,omitempty"`
	ErrorDetails string `json:"error_details,omitempty"`
	ErrorCode    string `json:"error_code,omitempty"`
}

// Validate performs basic validation on the ConnectionTestRequest
func (t *ConnectionTestRequest) Validate() error {
	if t.Host == "" {
		return ErrHostRequired
	}
	if t.Port == "" {
		t.Port = "9200" // Default port
	}
	if t.AuthenticationMethod == "" {
		t.AuthenticationMethod = "none" // Default auth
	}
	return nil
}
