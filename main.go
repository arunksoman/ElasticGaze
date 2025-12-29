package main

import (
	"elasticgaze/backend/core/logging"
	"embed"
	"fmt"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	// "github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/build
var assets embed.FS

func main() {
	// Initialize logger
	appDataDir, err := os.UserConfigDir()
	if err != nil {
		fmt.Printf("Failed to get user config directory: %v\n", err)
		os.Exit(1)
	}

	elasticGazeDir := filepath.Join(appDataDir, "elasticgaze")
	if err := os.MkdirAll(elasticGazeDir, 0755); err != nil {
		fmt.Printf("Failed to create elasticgaze directory: %v\n", err)
		os.Exit(1)
	}

	// Setup log directory
	logDir := filepath.Join(elasticGazeDir, "es_gaze_logs")
	wailsLogger, err := logging.InitLogger(logDir)
	if err != nil {
		fmt.Printf("Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}

	logging.Info("ElasticGaze application starting...")

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "elasticgaze",
		Width:     980,
		Height:    752,
		MinWidth:  980,
		MinHeight: 752,
		Logger:    wailsLogger,
		// Windows: &windows.Options{
		// 	ZoomFactor:           0.9,
		// 	IsZoomControlEnabled: true,
		// 	DisablePinchZoom:     true,
		// },
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Frameless:        true,
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		logging.Errorf("Error running application: %v", err)
		println("Error:", err.Error())
	}

	logging.Info("ElasticGaze application shutting down...")
}
