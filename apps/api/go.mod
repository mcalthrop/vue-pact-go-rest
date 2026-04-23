module vue-pact-go-rest/api

go 1.25.5

require (
	github.com/getkin/kin-openapi v0.135.0
	github.com/oapi-codegen/runtime v1.4.0
	github.com/pact-foundation/pact-go/v2 v2.4.3 // pact build tag only — run `go mod tidy -tags pact` to keep this entry
)

require github.com/oapi-codegen/oapi-codegen/v2 v2.6.1-0.20260409173938-9fffadedd3a5 // indirect

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/dprotaso/go-yit v0.0.0-20220510233725-9ba8df137936 // indirect
	github.com/go-openapi/jsonpointer v0.22.4 // indirect
	github.com/go-openapi/swag/jsonname v0.25.4 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/hashicorp/go-version v1.9.0 // indirect
	github.com/hashicorp/logutils v1.0.0 // indirect
	github.com/inconshreveable/mousetrap v1.1.0 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/mailru/easyjson v0.9.1 // indirect
	github.com/mohae/deepcopy v0.0.0-20170929034955-c48cc78d4826 // indirect
	github.com/oasdiff/yaml v0.0.9 // indirect
	github.com/oasdiff/yaml3 v0.0.9 // indirect
	github.com/perimeterx/marshmallow v1.1.5 // indirect
	github.com/speakeasy-api/jsonpath v0.6.0 // indirect
	github.com/speakeasy-api/openapi-overlay v0.10.2 // indirect
	github.com/spf13/afero v1.15.0 // indirect
	github.com/spf13/cobra v1.10.2 // indirect
	github.com/spf13/pflag v1.0.9 // indirect
	github.com/vmware-labs/yaml-jsonpath v0.3.2 // indirect
	github.com/woodsbury/decimal128 v1.4.0 // indirect
	golang.org/x/mod v0.33.0 // indirect
	golang.org/x/net v0.50.0 // indirect
	golang.org/x/sync v0.19.0 // indirect
	golang.org/x/sys v0.41.0 // indirect
	golang.org/x/text v0.34.0 // indirect
	golang.org/x/tools v0.42.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20260120221211-b8f7ae30c516 // indirect
	google.golang.org/grpc v1.80.0 // indirect
	google.golang.org/protobuf v1.36.11 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

tool github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen
