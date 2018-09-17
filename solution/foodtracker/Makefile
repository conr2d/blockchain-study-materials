CC = eosiocpp
ACCOUNT = eosio

TARGET := $(shell basename $(CURDIR))
SOURCE := $(addsuffix .cpp,  $(TARGET))
WASM   := $(addsuffix .wast, $(TARGET))
ABI    := $(addsuffix .abi,  $(TARGET))

all:
	$(CC) -o $(WASM) $(SOURCE)
	$(CC) -g $(ABI)  $(SOURCE)

init:
	sed -i '0,/ACCOUNT =.*/{s/ACCOUNT = .*/ACCOUNT = $(ACCOUNT)/}' Makefile

install:
	cleos set contract $(ACCOUNT) ../$(TARGET)

clean:
	rm -f *.wast
	rm -f *.wasm
	rm -f *.abi
