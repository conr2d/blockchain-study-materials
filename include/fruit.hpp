#pragma once

#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract("multi")]] fruit_contract : public contract {
public:
   using contract::contract;

   struct [[eosio::table]] fruit {
      name fruitname;

      uint64_t primary_key() const { return fruitname.value; }
   };

   typedef multi_index<"fruit"_n, fruit> fruits;

   [[eosio::action]]
   void buyfruit(name fruitname) {
      fruits fs(_self, _self.value);
      fs.emplace(_self, [&](auto& f) {
         f.fruitname = fruitname;
      });
   }

   [[eosio::action]]
   void sellfruit(name fruitname) {
      fruits fs(_self, _self.value);
      auto it = fs.find(fruitname.value);
      fs.erase(it);
   }
};
