#!/bin/bash

# Judge script for executing user code safely
# Usage: ./judge.sh <language> <code_file> <input_file> <expected_output>

LANGUAGE=$1
CODE_FILE=$2
INPUT_FILE=$3
EXPECTED_OUTPUT=$4

TIMEOUT=2
MEMORY_LIMIT=256

case $LANGUAGE in
    "JAVA")
        timeout $TIMEOUT java -Xmx${MEMORY_LIMIT}m -cp /judge $CODE_FILE < $INPUT_FILE
        ;;
    "PYTHON")
        timeout $TIMEOUT python3 $CODE_FILE < $INPUT_FILE
        ;;
    "CPP")
        timeout $TIMEOUT ./$CODE_FILE < $INPUT_FILE
        ;;
    *)
        echo "Unsupported language: $LANGUAGE"
        exit 1
        ;;
esac

exit $?
