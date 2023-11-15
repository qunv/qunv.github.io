+++
title =  "Dùng Dockertest cho unit test"
tags = ["unit-test","docker"]
date = "2023-11-15"
+++

## Tại sao phải viết unit test?

Nhìn nhận một cách thực tế thì thực sự viết unit test tốn rất nhiều thời gian, nên nhiều developer thường bỏ qua hoặc lười
viết `unit test`, tuy nhiên việc lười viết unit test thật sự là một vấn đề rất lớn đấy 😐. Trước tiên thì tại sao unit test lại quan trọng,
có thể điểm qua một vài lý do như thế này:

+ Giúp phát hiện các lỗi nhỏ trong quá trình phát triển sản phẩm/tính năng
- Giúp verify lại biz logic khi thực hiện update/refactor code
+ Giúp dev take over lại code sẽ có thể nhanh chóng hiểu được logic...

Nhìn chung thì việc viết unit test có nhiều lợi ích lắm nên đừng lười viết unit test ㋡.

## Viết unit test dùng mock

Cái này thì dev nào cũng biết rồi cơ mà nhiều lúc mock test hoặc là đọc mock test của những người anh em để lại cũng không 
biết là đúng hay sai nữa mà test vẫn cứ pass nên nhiều lúc vừa lười sửa test vừa hoang mang 😆. Cho nên tôi đã tìm đến một
cách để có thể viết unit test mà không cần mock, đấy là dùng Dockertest để tạo môi trường local các thứ

## Viết unit test dùng Dockertest

Trước tiên phải cảm ơn [Dockertest](https://github.com/ory/dockertest), nhờ nó mà đôi khi việc viết test cũng bớt nhàm chán khi phải
mock. Package trên là cho `Golang`, tuy nhiên thì với những ngôn ngữ khác thì có package tương ứng. Dockertest sẽ tốt hơn cho viết
integration test nhé :v

> Vậy thì viết unit test dùng docker hoạt động như thế nào?

Cũng không có gì cao siêu lắm, nó giống như kiểu bạn viết một `docker-compose` file chạy local rồi sẽ connect đến local endpoint thôi,
`dockertest` sẽ khởi tạo các container tương ứng theo mục đích và setup test của bạn cho mỗi lần chạy unit test.

Ví dụ, tôi muốn test với `elastic search`

Để test local mà chưa tính đến unit test thì docker-compose file như sau:

```yaml
version: "3.8"

services:
  elasticsearch:
    container_name: es-container
    image: docker.elastic.co/elasticsearch/elasticsearch:7.11.0
    environment:
      - xpack.security.enabled=false
      - "discovery.type=single-node"
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata:/usr/share/elasticsearch/data
    networks:
      - es-net
    ports:
      - 9200:9200

  kibana:
    container_name: kb-container
    image: docker.elastic.co/kibana/kibana:7.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://es-container:9200
    networks:
      - es-net
    depends_on:
      - elasticsearch
    ports:
      - 5601:5601    
volumes:
  esdata:
    driver: local
networks:
  es-net:
    driver: bridge   
```

Giờ sẽ viết một Go file, trong đấy có hàm tạo index

```go
package dockertest

import (
	"github.com/elastic/go-elasticsearch/v7"
	"github.com/elastic/go-elasticsearch/v7/esutil"
)

type ElasticDockerTest struct {
	client *elasticsearch.Client
	index  string
}

func (e *ElasticDockerTest) CreateIndex() error {
	updateRequest := map[string]interface{}{
		"mappings": map[string]interface{}{
			"properties": map[string]interface{}{
				"user_id": map[string]interface{}{
					"type": "keyword",
				},
			},
		},
	}
	_, err := e.client.Indices.Create(
		e.index,
		e.client.Indices.Create.WithBody(esutil.NewJSONReader(updateRequest)),
	)
	return err
}
```

Sau đấy sẽ khởi tạo một elastic container test sử dụng Docker test

```go
package dockertest

import (
	"fmt"
	"github.com/elastic/go-elasticsearch/v7"
	"github.com/ory/dockertest/v3"
	"log"
	"time"
)

type ElasticTester struct {
	client   *elasticsearch.Client
	pool     *dockertest.Pool
	resource *dockertest.Resource
}

func NewElasticTester(index string) (*ElasticTester, error) {
	var esClient *elasticsearch.Client
	var err error
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Printf("Docker init pool error: %s", err.Error())
		return nil, err
	}
	log.Println(pool.Client.Endpoint())
	if err = pool.Client.Ping(); err != nil {
		log.Printf("Ping error: %s", err.Error())
	}

	resource, err := pool.RunWithOptions(&dockertest.RunOptions{
		Name:         fmt.Sprintf("es-container-test-%d", time.Now().Unix()),
		Repository:   "docker.elastic.co/elasticsearch/elasticsearch",
		Tag:          "7.11.0",
		ExposedPorts: []string{"9200"},
		Env: []string{
			"xpack.security.enabled=false",
			"discovery.type=single-node",
			"ES_JAVA_OPTS=-Xms512m -Xmx512m",
		},
	})
	if err != nil {
		log.Printf("Init resource error: %s", err.Error())
		return nil, err
	}
	if err = pool.Retry(func() error {
		esconf := elasticsearch.Config{
			Addresses: []string{fmt.Sprintf("http://127.0.0.1:%s", resource.GetPort("9200/tcp"))},
			//APIKey: base64.StdEncoding.EncodeToString(
			//	[]byte(fmt.Sprintf("%v:%v", config.Id, config.ApiKey))),
		}
		esClient, err = elasticsearch.NewClient(esconf)
		if err != nil {
			return err
		}
		_, err = esClient.Ping()
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		log.Printf("Retry error: %s", err.Error())
		return nil, err
	}
	es := &ElasticTester{
		client:   esClient,
		pool:     pool,
		resource: resource,
	}
	return es, nil
}

func (e *ElasticTester) GetClient() *elasticsearch.Client {
	return e.client
}

func (e *ElasticTester) Close() {
	if err := e.pool.Purge(e.resource); err != nil {
		log.Printf("Could not purge resource: %s", err)
	}
}
```

Nhìn vào `resource` thấy rằng việc setup giống hệt với việc mình viết `docker-compose` file.

Và cuối dùng là viết test

```go
package dockertest

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
)

type ExampleTestSuite struct {
	suite.Suite
	elasticDockerTest *ElasticDockerTest
	elasticTester     *ElasticTester
}

func TestExampleTestSuite(t *testing.T) {
	suite.Run(t, new(ExampleTestSuite))
}

func (e *ExampleTestSuite) TearDownSuite() {
	e.elasticTester.Close()
}

func (e *ExampleTestSuite) SetupSuite() {
	index := "example-index-test"
	elasticTester, err := NewElasticTester(index)
	assert.Nil(e.T(), err)
	e.elasticTester = elasticTester
	e.elasticDockerTest = &ElasticDockerTest{
		index:  index,
		client: e.elasticTester.GetClient(),
	}
}

func (e *ExampleTestSuite) TestCreateIndex() {
	err := e.elasticDockerTest.CreateIndex()
	assert.Nil(e.T(), err)
}
```

Khi run test, ở local sẽ tạo một container (cái này tôi dùng test suite để tạo 1 container cho mỗi test, và delete container khi tất cả test chạy xong) 
trông như thế này 

```shell
➜ docker ps                                      
CONTAINER ID   IMAGE                                                  COMMAND                  CREATED         STATUS         PORTS                                                                                                                                   NAMES
44dff6cdffd8   docker.elastic.co/elasticsearch/elasticsearch:7.11.0   "/bin/tini -- /usr/l…"   7 seconds ago   Up 5 seconds   0.0.0.0:32772->9200/tcp, 0.0.0.0:32773->9200/tcp, :::32772->9200/tcp, :::32773->9200/tcp, 0.0.0.0:32771->9300/tcp, :::32771->9300/tcp   es-container-test-1700042406
```

Nhớ xóa container test đi để tiết kiệm resource khi dùng xong nhé :v

## Biết cái này bạn có được tăng lương không?

Biết đâu được シ



