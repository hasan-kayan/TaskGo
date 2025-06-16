.PHONY: test
test:
	go test -coverpkg=./... -coverprofile=coverage.out ./...
	go tool cover -func=coverage.out
	