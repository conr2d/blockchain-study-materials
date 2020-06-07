#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using namespace eosio;

CONTRACT foodtracker : public contract {
public:
   using contract::contract;

   TABLE member {
      eosio::name  id;
      std::string  name;
      uint8_t      height;
      uint8_t      weight;

      uint64_t primary_key()const { return id.value; }
   };

   typedef eosio::multi_index<"members"_n, member> members;

   TABLE food {
      uint64_t id;
      time_point_sec time;
      std::string name;
      uint16_t cal;

      uint64_t primary_key()const { return id; }
   };

   typedef eosio::multi_index<"foods"_n, food> foods;

   ACTION createmember(eosio::name member, std::string name, uint8_t height, uint8_t weight) {
      require_auth(_self);

      members mbs(_self, _self.value);
      mbs.emplace(_self, [&](auto& m) {
         m.id = member;
         m.name = name;
         m.height = height;
         m.weight = weight;
      });
   }

   ACTION readmember(eosio::name member) {
      members mbs(_self, _self.value);
      auto itr = mbs.find(member.value);

      if (itr == mbs.end()) {
         print(eosio::name{member}, " not found");
      } else {
         auto m = *itr;
         print(m.id, ", ", m.name, ", ", (uint64_t)m.height, ", ", (uint64_t)m.weight);
      }
   }

   ACTION updatemember(eosio::name member, uint8_t height, uint8_t weight) {
      require_auth(member);

      members mbs(_self, _self.value);
      const auto itr = mbs.find(member.value);

      mbs.modify(itr, same_payer, [&](auto& m) {
         if (height > 0) m.height = height;
         if (weight > 0) m.weight = weight;
      });
   }

   ACTION deletemember(eosio::name member) {
      require_auth(member);

      foods fds(_self, member.value);

      auto itr = fds.begin();
      while (itr != fds.end()) {
         itr = fds.erase(itr);
      }

      members mbs(_self, _self.value);
      auto m = mbs.find(member.value);
      mbs.erase(m);
   }

   ACTION addfood(eosio::name member, std::string name, uint16_t cal) {
      require_auth(member);

      members mbs(_self, _self.value);
      auto itr = mbs.find(member.value);

      if (itr == mbs.end()) {
         print(eosio::name{member}, " not found");
      } else {
         foods fds(_self, member.value);

         fds.emplace(member, [&](auto& f) {
            f.id = fds.available_primary_key();
            f.time = current_time_point();
            f.name = name;
            f.cal = cal;
         });
      }
   }
};
