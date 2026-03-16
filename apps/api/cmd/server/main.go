package main

import (
	"io/fs"
	"log"
	"net/http"
	"os"
	"time"

	apistatic "vue-pact-go-rest/api/internal/static"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	imgFS, err := fs.Sub(apistatic.Images, "images")
	if err != nil {
		log.Fatalf("static images: %v", err)
	}
	srv := &http.Server{
		Addr:              addr,
		Handler:           newServer(imgFS),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}
	log.Printf("server listening on %s", addr)
	if err = srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
