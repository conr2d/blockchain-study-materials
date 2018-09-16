// include required header file
#include <...>

// (optional) declare using name space `eosio` for convenience
using namespace ...;

// declare class inheriting from eosio::contract
class ... : public ... {
public:
   // declare using constructor of `contract` or declare your own constructor

   // add @abi for table

   // declare struct to store members' info
   // struct `member` stores account name, real name, height, weight
   // eg. eosio, Jeeyong Um, 185, 74
   // use account name as primary key
   struct ... {
      ...

      // `primary_key()` is always necessary to use struct with multi_index table.
      uint64_t primary_key()const { return ...; }

      // add EOSLIB_SERIALIZE() macro
      ...
   };

   typedef eosio::multi_index<N(members), member> members;

   // add @abi for table

   // declare struct to store each members' eating
   // struct `food` stores id(auto-incremental), time, food name, calories
   // eg. 0, now(), apple, 52
   // use id as primary key
   struct ... {
      ...

      uint64_t primary_key()const { return ...; }

      // add EOSLIB_SERIALIZE() macro
      ...
   };

   typedef eosio::multi_index<N(foods), food> foods;

   // add actions for CRUD member
   // CRUD member should be performed by contract's publisher
   void createmember(...) {
      require_auth(...);
      members mbs(_self, _self);
   }

   // add action for add eating info
   // food info could be added by member himself
   void ...(...) {
      require_auth(...);
      foods fds(_self, member);
   }
};

EOSIO_ABI(..., ...)
