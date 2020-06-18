#pragma once

#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract("multi")]] animal_contract : public contract {
public:
   using contract::contract;

   struct [[eosio::table]] animal {
      name animalname;

      uint64_t primary_key() const { return animalname.value; }
   };

   typedef multi_index<"animal"_n, animal> animals;

   [[eosio::action]]
   void buyanimal(name animalname) {
      animals as(_self, _self.value);
      as.emplace(_self, [&](auto& a) {
         a.animalname = animalname;
      });
   }

   [[eosio::action]]
   void sellanimal(name animalname) {
      animals as(_self, _self.value);
      auto it = as.find(animalname.value);
      as.erase(it);
   }
};
