#include "animal.hpp"
#include "fruit.hpp"

extern "C" {

[[eosio::wasm_entry]]
void apply(uint64_t receiver, uint64_t code, uint64_t action) {
   if (code == receiver) {
      switch (action) {
         EOSIO_DISPATCH_HELPER(animal_contract, (buyanimal)(sellanimal))
         EOSIO_DISPATCH_HELPER(fruit_contract, (buyfruit)(sellfruit))
      }
   }
}

}
