package logging

import (
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/DeRuina/timberjack"
	"github.com/wailsapp/wails/v2/pkg/logger"
)

var (
	Logger      *log.Logger
	WailsLogger *WailsFileLogger
)

type WailsFileLogger struct {
	logger   *log.Logger
	logFile  *timberjack.Logger
	logLevel logger.LogLevel
}

func InitLogger(baseDir string) (*WailsFileLogger, error) {
	logDir := filepath.Join(baseDir, "es_gaze_logs")
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, err
	}
	logFile := &timberjack.Logger{
		Filename:           "/var/log/myapp/foo.log",   // Choose an appropriate path
		MaxSize:            150,                        // megabytes
		MaxBackups:         3,                          // backups
		MaxAge:             28,                         // days
		Compression:        "gzip",                     // "none" | "gzip" | "zstd" (preferred over legacy Compress)
		LocalTime:          true,                       // default: false (use UTC)
		RotationInterval:   24 * time.Hour,             // Rotate daily if no other rotation met
		RotateAtMinutes:    []int{0, 15, 30, 45},       // Also rotate at HH:00, HH:15, HH:30, HH:45
		RotateAt:           []string{"00:00", "12:00"}, // Also rotate at 00:00 and 12:00 each day
		BackupTimeFormat:   "2006-01-02-15-04-05",      // Rotated files will have format <logfilename>-2006-01-02-15-04-05-<reason>.log
		AppendTimeAfterExt: true,                       // put timestamp after ".log" (foo.log-<timestamp>-<reason>)
		FileMode:           0o644,                      // Custom permissions for newly created files. If unset or 0, defaults to 640.
	}
	multiwriter := io.MultiWriter(os.Stdout, logFile)
	stdLogger := log.New(multiwriter, "", log.LstdFlags|log.Lshortfile)
	wailsLogger := &WailsFileLogger{
		logger:   stdLogger,
		logFile:  logFile,
		logLevel: logger.INFO,
	}
	Logger = stdLogger
	WailsLogger = wailsLogger
	return wailsLogger, nil
}

func (w *WailsFileLogger) Print(message string) {
	w.logger.Print("[PRINT] " + message)
}

func (w *WailsFileLogger) Trace(message string) {
	if w.logLevel <= logger.TRACE {
		w.logger.Print("[TRACE] " + message)
	}
}

func (w *WailsFileLogger) Debug(message string) {
	if w.logLevel <= logger.DEBUG {
		w.logger.Print("[DEBUG] " + message)
	}
}

func (w *WailsFileLogger) Info(message string) {
	if w.logLevel <= logger.INFO {
		w.logger.Print("[INFO] " + message)
	}
}

func (w *WailsFileLogger) Warning(message string) {
	if w.logLevel <= logger.WARNING {
		w.logger.Print("[WARNING] " + message)
	}
}

func (w *WailsFileLogger) Error(message string) {
	if w.logLevel <= logger.ERROR {
		w.logger.Print("[ERROR] " + message)
	}
}

func (w *WailsFileLogger) Fatal(message string) {
	w.logger.Print("[FATAL] " + message)
}

func (w *WailsFileLogger) SetLogLevel(level logger.LogLevel) {
	w.logLevel = level
}

// Backward compatibility functions for existing code
func Info(v ...interface{}) {
	if Logger != nil {
		Logger.Println(append([]interface{}{"[INFO]"}, v...)...)
	}
}

func Error(v ...interface{}) {
	if Logger != nil {
		Logger.Println(append([]interface{}{"[ERROR]"}, v...)...)
	}
}

func Debug(v ...interface{}) {
	if Logger != nil {
		Logger.Println(append([]interface{}{"[DEBUG]"}, v...)...)
	}
}

func Warn(v ...interface{}) {
	if Logger != nil {
		Logger.Println(append([]interface{}{"[WARN]"}, v...)...)
	}
}

func Infof(format string, v ...interface{}) {
	if Logger != nil {
		Logger.Printf("[INFO] "+format, v...)
	}
}

func Errorf(format string, v ...interface{}) {
	if Logger != nil {
		Logger.Printf("[ERROR] "+format, v...)
	}
}

func Debugf(format string, v ...interface{}) {
	if Logger != nil {
		Logger.Printf("[DEBUG] "+format, v...)
	}
}

func Warnf(format string, v ...interface{}) {
	if Logger != nil {
		Logger.Printf("[WARN] "+format, v...)
	}
}
