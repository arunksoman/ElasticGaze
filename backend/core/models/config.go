package models

type Config struct {
	ID                   int     `json:"id" db:"id"`
	ConnectionName       string  `json:"connection_name" db:"connection_name"`
	EnvIndicatorColor    string  `json:"env_indicator_color" db:"env_indicator_color"`
	Host                 string  `json:"host" db:"host"`
	Port                 string  `json:"port" db:"port"`
	SSLOrHTTPS           bool    `json:"ssl_or_https" db:"ssl_or_https"`
	AuthenticationMethod string  `json:"authentication_method" db:"authentication_method"`
	Username             *string `json:"username" db:"username"`
	Password             *string `json:"password" db:"password"`
	SetAsDefault         bool    `json:"set_as_default" db:"set_as_default"`
	CreatedAt            string  `json:"created_at" db:"created_at"`
	UpdatedAt            string  `json:"updated_at" db:"updated_at"`
}

type CreateConfigRequest struct {
	ConnectionName       string  `json:"connection_name" binding:"required"`
	EnvIndicatorColor    string  `json:"env_indicator_color"`
	Host                 string  `json:"host" binding:"required"`
	Port                 string  `json:"port"`
	SSLOrHTTPS           bool    `json:"ssl_or_https"`
	AuthenticationMethod string  `json:"authentication_method"`
	Username             *string `json:"username"`
	Password             *string `json:"password"`
	SetAsDefault         bool    `json:"set_as_default"`
}

type UpdateConfigRequest struct {
	ConnectionName       *string `json:"connection_name"`
	EnvIndicatorColor    *string `json:"env_indicator_color"`
	Host                 *string `json:"host"`
	Port                 *string `json:"port"`
	SSLOrHTTPS           *bool   `json:"ssl_or_https"`
	AuthenticationMethod *string `json:"authentication_method"`
	Username             *string `json:"username"`
	Password             *string `json:"password"`
	SetAsDefault         *bool   `json:"set_as_default"`
}

func (c *CreateConfigRequest) Validate() error {
	if c.ConnectionName == "" {
		return ErrConnectionNameRequired
	}
	if c.Host == "" {
		return ErrHostRequired
	}
	return nil
}

var (
	ErrConnectionNameRequired     = &ValidationError{Field: "connection_name", Message: "Connection name is required"}
	ErrHostRequired               = &ValidationError{Field: "host", Message: "Host is required"}
	ErrMultipleDefaultsNotAllowed = &ValidationError{Field: "set_as_default", Message: "Only one configuration can be set as default"}
	ErrMethodRequired             = &ValidationError{Field: "method", Message: "HTTP method is required"}
	ErrEndpointRequired           = &ValidationError{Field: "endpoint", Message: "endpoint is required"}
)
