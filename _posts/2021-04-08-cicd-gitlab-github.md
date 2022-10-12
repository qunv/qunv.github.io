[comment]: <> (Deploy code using CICD)

[comment]: <> (deloyment,cicd)

> Automatic will help us more leisurely

### Rambling a little

As a programmer, I really like creating automated programs and plenty there, it looks magic.

Not long ago, I worked with Tekoda team (not Tokuda :D), to build an application called ``Àừnhỏ.com``. The application
name sounded like ``"Holy sh!t, I finally found it"`` with your surprised face.

I built backend app and whenever I finished coding for any task, and all had to perform the step below to deploy my code
on docker hub.

1. Docker build with ``docker build -t IMAGE_NAME:IMAGE_TAG .``

2. Docker tag ``docker tag IMAGE_ID`` where ``IMAGE_ID`` you can see with command ``docker image ls``

3. Finally, push my image on my docker hub using ``docker push``

Not to mention, I had to push my all code on the Github with ``add``, ``commit`` and ``push``, it's really boring.

So, I look to CICD as a savior for my problem as a clever way from now.

### Build a magic

Humm, I don't mention CICD anymore because Google is number one.

I'm going to use ``Golang`` for this example

First, build a simple program, a file ``main.go``.

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("Lookup on the moon")
}
```

It's very simple, isn't it? Of course, it's really powerful.

And then, write a ``Dockerfile``

```dockerfile
FROM golang:alpine as builder

RUN apk update

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/

FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /root/


COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

See, I have 2 doses of sedatives. Let's make runner.

#### Gitlab

Gittlab runs CICD by running ``.gitlab-ci.yml``

```yaml
# We define stages that is going to run whenever my code is pushed on Gitlab
stages:
  - build
  # - test
  # - deploy
  # - ...

variables:
  CONTAINER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG

docker build:
  image: docker:stable
  stage: build
  when: on_success
  services:
    - name: docker:dind
      alias: dockerbuild
  variables:
    # Tell docker CLI how to talk to Docker daemon; see
    # https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-in-docker-executor
    DOCKER_HOST: tcp://dockerbuild:2375/
    # Use the overlayfs driver for improved performance:
    DOCKER_DRIVER: overlay2
    DOCKER_TLS_CERTDIR: ""
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CONTAINER_IMAGE .
    - docker push $CONTAINER_IMAGE
```

All variables with the prefix ``$`` is defined on Gitlab -> Settings -> CI/CD -> Variables

#### Github

Different from Gitlab, Github workflow must be run in ``.github/workflows/yourworkflow.yaml``

```yaml
name: Go

on:
  push:
    branches: [ main, feature/cicd ]
  pull_request:
    branches: [ main, main, feature/cicd ]

jobs:

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v1

      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v2
        with:
          context: ./
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/webrtc-hubs-state:latest

      - name: Image digest
        run: echo ${{ steps.docker_build.outputs.digest }}
```

Let's push some code into Github or Gitlab and wait for finished. Open Your [Docker hub](https://hub.docker.com/) and
see result.
