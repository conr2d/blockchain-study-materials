// include required header file
#include <...>

// (optional) declare using name space `eosio` for convenience
using namespace ...;

// declare class inheriting from eosio::contract
CONTRACT ... : public ... {
public:
   // declare using constructor of `contract` or declare your own constructor

   // declare action hi
   // 1. hi prints user account name (account name will be passed by 1st parameter)
   // 2. hi checks action is executed with permission of given user account

   ACTION ...(...) {
      ...
   }
};

EOSIO_DISPATCH(..., ...)
