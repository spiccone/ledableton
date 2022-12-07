#!/bin/bash

set -euo pipefail

protoc --cpp_out=generated device.proto
