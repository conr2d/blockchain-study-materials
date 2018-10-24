#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT foodtracker : public contract {
public:
   using contract::contract;

   TABLE [[eosio::action]]
   member {
      name         id;
      std::string  _name;
      uint8_t      height;
      uint8_t      weight;

      uint64_t primary_key()const { return id.value; }

      EOSLIB_SERIALIZE(member, (id)(_name)(height)(weight))
   };

   typedef eosio::multi_index<"members"_n, member> members;

   TABLE [[eosio::action]]
   food {
      uint64_t id;
      time_t   time;
      std::string _name;
      uint16_t cal;

      uint64_t primary_key()const { return id; }

      EOSLIB_SERIALIZE(food, (id)(time)(_name)(cal))
   };

   typedef eosio::multi_index<"foods"_n, food> foods;

   ACTION createmember(name member, std::string _name, uint8_t height, uint8_t weight) {
      require_auth(_self);

      members mbs(_self, _self.value);
      mbs.emplace(_self, [&](auto& m) {
         m.id = member;
         m._name = _name;
         m.height = height;
         m.weight = weight;
      });
   }

   ACTION readmember(name member) {
      members mbs(_self, _self.value);
      auto itr = mbs.find(member.value);

      if (itr == mbs.end()) {
         print(name{member}, " not found");
      } else {
         auto m = *itr;
         print(m.id, ", ", m._name, ", ", (uint64_t)m.height, ", ", (uint64_t)m.weight);
      }
   }

   ACTION updatemember(name member, uint8_t height, uint8_t weight) {
      require_auth(member);

      members mbs(_self, _self.value);
      const auto itr = mbs.find(member.value);

      mbs.modify(itr, name(0), [&](auto& m) {
         if (height > 0) m.height = height;
         if (weight > 0) m.weight = weight;
      });
   }

   ACTION deletemember(name member) {
      require_auth(member);

      foods fds(_self, member.value);

      auto itr = fds.begin();
      while (itr != fds.end()) {
         fds.erase(itr);
         itr = fds.begin();
      }

      members mbs(_self, _self.value);
      auto m = mbs.find(member.value);
      mbs.erase(m);
   }

   ACTION addfood(name member, std::string _name, uint16_t cal) {
      require_auth(member);

      members mbs(_self, _self.value);
      auto itr = mbs.find(member.value);

      if (itr == mbs.end()) {
         print(name{member}, " not found");
      } else {
         foods fds(_self, member.value);

         fds.emplace(member, [&](auto& f) {
            f.id = fds.available_primary_key();
            f.time = now();
            f._name = _name;
            f.cal = cal;
         });
      }
   }
};

EOSIO_DISPATCH(foodtracker, (createmember)(readmember)(updatemember)(deletemember)(addfood))
