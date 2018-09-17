#include <eosiolib/eosio.hpp>

using namespace eosio;

class foodtracker : public contract {
public:
   using contract::contract;

   /// @abi table members i64
   struct member {
      account_name id;
      std::string  _name;
      uint8_t      height;
      uint8_t      weight;

      uint64_t primary_key()const { return id; }

      EOSLIB_SERIALIZE(member, (id)(_name)(height)(weight))
   };

   typedef eosio::multi_index<N(members), member> members;

   /// @abi table foods i64
   struct food {
      uint64_t id;
      time_t   time;
      std::string _name;
      uint16_t cal;

      uint64_t primary_key()const { return id; }

      EOSLIB_SERIALIZE(food, (id)(time)(_name)(cal))
   };

   typedef eosio::multi_index<N(foods), food> foods;

   void createmember(account_name member, std::string _name, uint8_t height, uint8_t weight) {
      require_auth(_self);

      members mbs(_self, _self);
      mbs.emplace(_self, [&](auto& m) {
         m.id = member;
         m._name = _name;
         m.height = height;
         m.weight = weight;
      });
   }

   void readmember(account_name member) {
      members mbs(_self, _self);
      auto itr = mbs.find(member);

      if (itr == mbs.end()) {
         print(name{member}, " not found");
      } else {
         auto m = *itr;
         print(name{m.id}, ", ", m._name, ", ", (uint64_t)m.height, ", ", (uint64_t)m.weight);
      }
   }

   void updatemember(account_name member, uint8_t height, uint8_t weight) {
      require_auth(member);

      members mbs(_self, _self);
      auto itr = mbs.find(member);

      mbs.modify(itr, 0, [&](auto& m) {
         if (height > 0) m.height = height;
         if (weight > 0) m.weight = weight;
      });
   }

   void deletemember(account_name member) {
      require_auth(member);

      foods fds(_self, member);

      auto itr = fds.begin();
      while (itr != fds.end()) {
         fds.erase(itr);
         itr = fds.begin();
      }

      members mbs(_self, _self);
      auto m = mbs.find(member);
      mbs.erase(m);
   }

   void addfood(account_name member, std::string _name, uint16_t cal) {
      require_auth(member);

      members mbs(_self, _self);
      auto itr = mbs.find(member);

      if (itr == mbs.end()) {
         print(name{member}, " not found");
      } else {
         foods fds(_self, member);

         fds.emplace(member, [&](auto& f) {
            f.id = fds.available_primary_key();
            f.time = now();
            f._name = _name;
            f.cal = cal;
         });
      }
   }
};

EOSIO_ABI(foodtracker, (createmember)(readmember)(updatemember)(deletemember)(addfood))
