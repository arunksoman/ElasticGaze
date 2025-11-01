package models

type ValidationError struct {
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
}

func (e *ValidationError) Error() string {
	return e.Message
}
