CC = eosio-cpp
ACCOUNT = eosio

TARGET := $(shell basename $(CURDIR))
SOURCE := $(addsuffix .cpp,  $(TARGET))
WASM   := $(addsuffix .wasm, $(TARGET))

all:
	$(CC) -o $(WASM) $(SOURCE) -abigen

init:
	sed -i '0,/ACCOUNT =.*/{s/ACCOUNT = .*/ACCOUNT = $(ACCOUNT)/}' Makefile

install:
	cleos set contract $(ACCOUNT) ../$(TARGET)

clean:
	rm -f *.wasm
	rm -f *.abi
