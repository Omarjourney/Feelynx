#!/usr/bin/env bash
# Start LiveKit server using Docker and the provided configuration

docker run --rm \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 50000-60000:50000-60000/udp \
  -v "$(pwd)/livekit.yaml:/etc/livekit.yaml" \
  livekit/livekit:latest \
  --config /etc/livekit.yaml
