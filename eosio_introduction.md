# EOSIO Private 테스트넷 구축

아래 내용은 우분투 18.04 또는 리눅스용 윈도우 하위 시스템(Windows Subsystem for Linux; WSL) 환경에서 진행하는 것을 가정하고 있다.

## EOSIO 설치

```
wget https://github.com/eosio/eos/releases/download/v2.0.6/eosio_2.0.6-1-ubuntu-18.04_amd64.deb
sudo apt install ./eosio_2.0.6-1-ubuntu-18.04_amd64.deb
```

## 싱글 노드 테스트넷 구축

```
nodeos -e -p eosio --plugin=eosio::chain_api_plugin
```

- `nodeos`: EOSIO 네트워크 접속을 위한 노드 클라이언트
- `-e`: 강제로 블록 생성을 시작하게 설정 (`--enable-stale-production`)
- `-p eosio`: 블록 생성자(Block Producer; BP) 계정을 `eosio` (시스템 특권 계정)로 설정 (`--producer-name`)
- `--plugin=eosio::chain_api_plugin`: 노드 외부에서 chain 관련 RPC를 호출할 수 있도록 노출

`-e -p eosio` 옵션을 생략하면 블록을 직접 생성하지 않고 외부에서 블록을 수신하기 위해 대기하게 되나 접속할 노드의 주소를 명시하지 않았으므로 수신하는 블록이 없어 계속 대기 상태로 있게 된다. `--plugin eosio::chain_api_plugin` 을 생략하면 노드에 접속할 수 없으므로 `cleos` 등으로 정보 조회를 시도할 경우 실행중인 `nodeos`가 없다는 에러 메시지가 출력된다.

블록을 정상적으로 생성하고 있는 경우 아래와 같은 메시지가 출력된다.

```
info  2020-06-06T04:04:43.900 nodeos    producer_plugin.cpp:2093      produce_block        ] Produced block 1d999bef29e2e247... #4 @ 2020-06-06T04:04:44.000 signed by eosio [trxs: 0, lib: 3, confirmed: 0]
info  2020-06-06T04:04:44.402 nodeos    producer_plugin.cpp:2093      produce_block        ] Produced block c62ca3ab27006f0f... #5 @ 2020-06-06T04:04:44.500 signed by eosio [trxs: 0, lib: 4, confirmed: 0]
info  2020-06-06T04:04:44.901 nodeos    producer_plugin.cpp:2093      produce_block        ] Produced block 35c695ad85c3000c... #6 @ 2020-06-06T04:04:45.000 signed by eosio [trxs: 0, lib: 5, confirmed: 0]
info  2020-06-06T04:04:45.403 nodeos    producer_plugin.cpp:2093      produce_block        ] Produced block 707da28314a818df... #7 @ 2020-06-06T04:04:45.500 signed by eosio [trxs: 0, lib: 6, confirmed: 0]
```

노드를 실행하고 있는 것과 별도의 터미널 창을 한 개 더 열어 아래 명령을 실행한다.

```
cleos get info
```

노드와 정상적으로 연결이 되었다면 아래와 같은 메시지가 출력된다.

```
$ cleos get info
{
  "server_version": "c6a7ec0d",
  "chain_id": "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
  "head_block_num": 19,
  "last_irreversible_block_num": 18,
  "last_irreversible_block_id": "00000012191616c4e27fc343f4a2b3988ad01503614100e06b9ba9f902a00a8b",
  "head_block_id": "00000013d9a470337be8f02460f1ca3fd97debb82dd391ff9efaf6386975df6e",
  "head_block_time": "2020-06-06T04:05:57.000",
  "head_block_producer": "eosio",
  "virtual_block_cpu_limit": 203627,
  "virtual_block_net_limit": 1067621,
  "block_cpu_limit": 200000,
  "block_net_limit": 1048576,
  "server_version_string": "v2.0.6",
  "fork_db_head_block_num": 19,
  "fork_db_head_block_id": "00000013d9a470337be8f02460f1ca3fd97debb82dd391ff9efaf6386975df6e",
  "server_full_version_string": "v2.0.6-c6a7ec0dd816f98a6840f59dca9fed04efd9f7a5"
}
```

`nodeos` 실행시 `--plugin eosio::chain_api_plugin`을 빠뜨렸거나 `nodeos`를 실행하지 않고 있다면 아래와 같은 메시지가 출력될 것이다.

```
$ cleos get info
Failed to connect to nodeos at http://127.0.0.1:8888/; is nodeos running?
```

위 에러 메시지로부터도 예상할 수 있듯이 별도의 주소(URL)를 명시하지 않는 경우 `cleos`는 `http://127.0.0.1:8888` 주소를 통해 `nodeos` 접속을 시도한다. 즉, `cleos get info` 명령은 `cleos -u http://127.0.0.1:8888 get info` 와 동일한 명령이라 할 수 있다.

만약 URL을 다른 주소로 입력하는 경우 해당 주소에서 실행 중인 노드에 접속해서 정보를 가져온다. 다음은 EOS 메인넷 노드 중 하나에 접속하는 명령의 예이다.

```
cleos -u https://eos.greymass.com get info
```

`nodeos` 실행시 뒤에 붙이는 옵션은 아래 파일에 추가하게 되면 매 번 입력하지 않아도 자동으로 입력된다. WSL을 사용하는 경우 탐색기를 열고 주소창에 `\\wsl$` 을 입력하면 아래 경로를 찾아갈 수 있다.

```
$HOME/.local/share/eosio/nodeos/config/config.ini
```

앞서 입력했던 명령을 `config.ini`에 추가하려면 다음과 같다.

```
enable-stale-production = true
producer-name = eosio
plugin = eosio::chain_api_plugin
```

실행 중인 블록체인을 일시 정지하려면 `nodeos`를 실행한 터미널 창에서 `[Ctrl] + [C]`를 입력한다. 방금 실행했던 네트워크는 본인 혼자 블록 생성하던 네트워크이므로 `nodeos`를 정지한 동안은 블록이 생성되지 않는다. 만약 이어서 다시 블록을 생성하고 싶다면 아까 입력했던 명령어를 동일하게 입력한다.

```
nodeos -e -p eosio --plugin=eosio::chain_api_plugin
```

예전에 입력했던 명령어를 쉽게 다시 입력하려면 `[↑]` 키를 입력하거나 `[Ctrl] + [R]`을 입력한다.

## 멀티 노드 테스트넷 구축

멀티 노드 네트워크를 구축하기 위해서는 노드 간 연결을 위해 IP 주소를 알아야 한다. 본인의 IP 주소는 아래 명령을 통해 알 수 있다.

```
ifconfig
```

본인의 장비에 따라 네트워크 장치가 여러 개 출력될 수 있는데 일반적으로 192.168.0.XXX 형태로 된 IP 주소가 내부 네트워크(같은 공유기에 접속한 사람들 간의 네트워크)를 통해 연결된 주소이다. 같은 강의실 내 사람들과 서로 연결하고자 하는 경우 이 값을 옆 사람에게 알려주면 된다.

```
// node1 (192.168.0.XXX)
nodeos -e -p eosio --plugin=eosio::chain_api_plugin --p2p-peer-address=192.168.0.XXX:9876

// node2 (192.168.0.YYY)
nodeos --plugin=eosio::chain_api_plugin --p2p-peer-address=192.168.0.YYY:9876
```

멀티 노드 환경에서 동시에 여러 노드가 강제로 블록 생성을 하게 되면 충돌이 발생하여 제대로 블록을 수신할 수 없으므로 한 명만 `-e` 옵션을 사용하여 블록을 생성하고 다른 사람은 블록 생성 없이 다른 노드에 접속하여 블록을 받아오도록 한다.

만약 충돌이 발생하거나 하여 노드를 다시 시작해야 하는 경우 아래 디렉토리를 삭제함으로써 블록체인을 초기화 할 수 있다.

```
$HOME/.local/share/eosio/nodeos/data
```

또는 `nodeos` 실행시 `--delete-all-blocks` 옵션을 붙여 실행하면 초기화 된다. 단, 정상적으로 실행되도록 복구한 이후 다시 한 번 정지했다가 실행할 때는 `--delete-all-blocks` 옵션을 빼고 실행해야 매 번 체인이 초기화되는 것을 피할 수 있다. 또한 지금과 같은 로컬 테스트넷 환경에서는 블록의 개수가 많지 않아서 모든 블록을 지우고 다시 받아오는 것이 오래 걸리지 않으나 메인넷 또는 오래된 테스트넷의 경우 이런 방식으로 초기화하면 싱크하는데 오래 걸리므로 다른 방법을 찾아야 한다. (현재 수준에서는 어려운 내용이므로 생략한다)

다른 사람이 자신의 노드를 통해 트랜잭션을 보낼 수 있도록 설정하고자 하는 경우 `nodeos` 실행시 다음과 같은 옵션을 추가해야 한다.

```
nodeos --http-server-address=0.0.0.0:8888 --http-validate-host=false
```

위와 같이 노드를 실행하고 다른 사람의 노드에 접속해서 정보가 정상적으로 조회되는지 테스트해보자.

```
cleos -u http://192.168.0.YYY:8888 get info
```

## 계정 생성

`cleos`를 사용하여 계정을 생성하고 트랜잭션을 보내기 위해서는 `keosd`를 실행하여야 한다. 단, `keosd`는 직접 실행하지 않아도 `cleos`로 지갑 관련 명령을 실행하면 자동으로 실행된다.

### 지갑 생성

지갑 생성을 위해 아래 명령을 실행해보자.

```
cleos wallet create --file ~/wallet.txt
```

정상적으로 지갑이 생성된 경우 아래와 같이 출력된다.

```
"/usr/opt/eosio/2.0.6/bin/keosd" launched
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
saving password to wallet.txt
```

첫 번째 줄을 보면 `"/usr/opt/eosio/2.0.6/bin/keosd" launched` 와 같이 `cleos`가 지갑과 관련하여 필요한 작업을 수행하기 위해 `keosd`를 자동으로 실행한 것을 알 수 있다. 지갑 안에는 EOSIO의 개인키를 저장하게 되는데 개인키를 안전하게 저장하기 위해서 지갑의 암호가 설정된다. 지갑 암호는 자신이 정하는 것이 아니라 지갑을 생성할 때 프로그램이 자동으로 설정해준다. 이 때 지갑 암호는 자신의 하드디스크에 키를 저장할 때 안전하게 저장하기 위해 사용하는 것으로 블록체인과의 통신을 위해서는 전혀 사용되지 않는다.

`--file ~/wallet.txt` 옵션을 설정하면 지갑 비밀번호를 자신의 HOME 디렉토리에 `wallet.txt` 라는 이름의 파일로 저장한다. 다음 명령을 입력해서 지갑의 비밀번호를 확인해보자.

```
cat ~/wallet.txt
```

지갑은 기본값으로 900초(15분)동안 사용하지 않으면 잠기게 된다. 잠긴 지갑과 관련한 명령을 실행하려 하면 다음과 같은 에러가 발생한다.

```
Error 3120003: Locked wallet
Ensure that your wallet is unlocked before using it!
Error Details:
You don't have any unlocked wallet!
```

지갑을 일부러 잠금해보도록 하자.

```
cleos wallet lock
cleos wallet keys
```

잠긴 지갑을 사용하기 위해서는 암호를 이용해서 다시 잠금을 해제(unlock)해야 하는데 실제 지갑을 사용할 때는 지갑 암호를 안전하게 보관해야 하지만 지금처럼 테스트를 위해서 파일에 저장해둔 암호를 이용하면 쉽게 지갑의 잠금을 해제할 수 있다.

```
cleos wallet unlock --password $(cat ~/wallet.txt)
```

### 계정 정보 조회

계정의 정보를 조회하기 위해서는 `nodeos`가 실행중이어야 한다. 본인의 PC에 `nodeos`를 실행하거나 다른 PC에 실행중인 노드에 접속하여 `eosio` 계정의 정보를 조회해보도록 한다. 

```
cleos get account eosio
```

정상적으로 조회가 된 경우 아래와 같이 출력된다.

```
created: 2018-06-01T12:00:00.000
privileged: true
permissions:
     owner     1:    1 EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
        active     1:    1 EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
memory:
     quota:       unlimited  used:      2.66 KiB

net bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited

cpu bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited
```

### 자신의 계정 생성

계정을 생성하는 것도 트랜잭션이므로 다른 계정에서 계정 생성 트랜잭션을 보내주어야 계정을 생성할 수 있다. 현재 새롭게 구축한 테스트넷 안에 있는 계정은 `eosio` 계정이 유일하므로 이 계정으로 계정 생성 트랜잭션을 보내도록 한다. `eosio` 계정의 개인키를 자신의 지갑에 추가해보자.

```
cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

다음과 같이 출력되면 정상적으로 키가 추가된 것이다.

```
$ cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
imported private key for: EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```

또는 다음 명령을 통해서도 키가 추가되었는지 확인할 수 있다.

```
$ cleos wallet keys
[
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
]
```

개인키까지 확인하고 싶다면 아래와 같이 입력한다.

```
$ cleos wallet private_keys --password $(cat ~/wallet.txt)
[[
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
  ]
]
```

이제 자신의 계정에서 사용할 키를 생성한다.

```
cleos wallet create_key
```

출력되는 내용이 방금 생성된 자신의 공개키가 된다.

```
$ cleos wallet create_key
Created new private key with a public key of: "EOS5wpEPhgL6dpzjGAMQDGqCzGqxBHz9GyzpSec3jNTTH9xC8Rjne"
```

계정 생성은 다음과 같이 한다. 계정 이름에는 점(.), 영어 소문자(a-z), 숫자(1-5)만 사용 가능하며 12자 이하로 정해야 한다. 현재 테스트넷에는 그러한 제한이 없지만 EOS 메인넷에서는 정확히 12자의 계정명만 정할 수 있다. (12보다 짧은 계정은 경매로 낙찰받아야만 생성 가능)

```
cleos create account eosio [본인계정이름] [방금생성한자신의공개키]
```

만약 `owner` 권한과 `active` 권한에 사용할 키를 분리하고 싶다면 (실제 메인넷에서는 두 키를 다르게 관리하는 것이 보안에 유리하다) 위 명령 뒤에 키를 하나 더 입력하도록 한다. 앞에 입력한 키가 `owner` 키, 뒤에 입력한 키가 `active` 키가 된다.

아래와 같이 출력되면 정상적으로 계정이 생성된 것이다.

```
$ cleos create account eosio conr2d EOS5wpEPhgL6dpzjGAMQDGqCzGqxBHz9GyzpSec3jNTTH9xC8Rjne
executed transaction: 3057e314c18e4e163bd1cdb4eeda1a52d50082e093a18a9ad982bf0c3d0af665  200 bytes  242 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"conr2d","owner":{"threshold":1,"keys":[{"key":"EOS5wpEPhgL6dpzjGAMQDGqCzG...
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```

생성된 계정을 노드로부터 조회하는 것도 가능하다.

```
$ cleos get account conr2d
created: 2020-06-06T04:56:44.500
permissions:
     owner     1:    1 EOS5wpEPhgL6dpzjGAMQDGqCzGqxBHz9GyzpSec3jNTTH9xC8Rjne
        active     1:    1 EOS5wpEPhgL6dpzjGAMQDGqCzGqxBHz9GyzpSec3jNTTH9xC8Rjne
memory:
     quota:       unlimited  used:      2.66 KiB

net bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited

cpu bandwidth:
     used:               unlimited
     available:          unlimited
     limit:              unlimited
```

현재 구축한 로컬 테스트넷은 CPU/NET/RAM과 같은 자원 요소나 이름 경매 등 EOS 메인넷의 기능이 활성화되지 않은 상태이므로 할당된 자원량이 무제한(unlimited)인 것을 볼 수 있다.

## 멀티 BP 테스트넷 구축

현재까지 만든 테스트넷은 여러 노드가 연결되어 있지만 블록 생성은 한 노드에서 전담하는 형태이다. 이제 여러 노드가 돌아가면서 블록 생성을 하기 위해서 자신의 노드를 정지시켰다가 다음과 같이 실행하도록 한다.

```
nodeos -p [본인계정이름] --signature-provider=[자신의공개키]=KEY:[자신의개인키]

nodeos -p conr2d --signature-provider=EOS5wpEPhgL6dpzjGAMQDGqCzGqxBHz9GyzpSec3jNTTH9xC8Rjne=KEY:5JQ8RJu21meQYXowAez6fnQdJfoqMviAbG5xJwasvQEfRn2Zv26
```

`--signature-provider` 옵션을 통해 설정하는 키는 본인이 블록을 생성할 때 블록에 서명할 용도로 사용하는 키이므로 계정 생성에 사용한 것과 별도로 다른 키를 사용하는 것이 보안에 유리하다. 테스트넷에서는 같은 키를 사용해도 무방하다.

위와 같이 설정하였다고 해서 바로 블록을 생성할 수 있는 것은 아니다. 시스템 컨트랙트를 통해 블록 생성 스케쥴을 변경해야 하는데 아래 과정은 한 명만 진행하면 되므로 강사가 진행하는 내용을 참고하도록 한다.

### 블록 생성 스케쥴 설정

시스템 컨트랙트를 빌드하고 배포하기 위해 컨트랙트 개발 툴킷을 설치한다.

```
wget https://github.com/eosio/eosio.cdt/releases/download/v1.7.0/eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
sudo apt install ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
```

컨트랙트를 다운로드하고 컴파일 한다.

```
sudo apt update && sudo apt install build-essential cmake -y
git clone https://github.com/conr2d/eosio.contracts -b disable-protocol-feature
cd eosio.contracts
mkdir build
cd build
cmake ..
make -j$(nproc)
```

빌드가 완료되면 `eosio.bios` 컨트랙트를 `eosio` 계정에 배포한다.

```
cleos set contract eosio contracts/eosio.bios
```

아래와 같이 실패할 수 있는데 이는 `nodeos`가 트랜잭션을 수신했을 때 트랜잭션 때 최대 실행시간의 기본값이 30ms로 지정되어 있기 때문이다.

```
$ cleos set contract eosio contracts/eosio.bios
Reading WASM from /home/conr2d/eosio.contracts/build/contracts/eosio.bios/eosio.bios.wasm...
Publishing contract...
Error 3080006: Transaction took too long
Error Details:
deadline exceeded 12904us
```

위 에러에서 `eosio.bios` 컨트랙트를 배포하는데 걸린 시간이 129ms를 초과하므로 이를 배포하기 위해서는 다음 두 가지 방법이 있다.

- `--max-transaction-time (시간)`: `nodeos` 실행 옵션의 트랜잭션의 최대 실행시간을 높게 설정
- `--enable-eos-vm-oc` : 고성능 스마트 컨트랙트 실행 환경인 `eos-vm-oc`를 활성화, 이를 활성화 할 경우 트랜잭션 실행 시간이 단축되므로 배포가 가능하다 (실제 메인넷에서는 아직 사용되지 않고 있음)

`eosio.bios` 컨트랙트를 배포하고 나면 `setprods` 액션을 통해 블록 생성 스케쥴을 설정할 수 있다.

```
cleos push action eosio setprods '[[{"producer_name": "eosio", "block_signing_key": "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"}, {"producer_name": "conr2d", "block_signing_key": "EOS5wpEPhgL6dpzjGAMQDGqCzGqxBHz9GyzpSec3jNTTH9xC8Rjne"}]]' -p eosio
```

위 액션이 정상적으로 블록에 담기고 나면 `eosio`, `conr2d` 두 명의 BP가 6초마다(12라운드) 번갈아가며 블록을 생성하게 된다.

## 블록 익스플로러 사용

bloks.io를 이용하여 로컬 테스트넷 데이터를 조회하려면 `nodeos` 실행시 다음 옵션을 추가한다.

```
nodeo --access-control-allow-origin=* --plugin=eosio::history_api_plugin --filter-on=* 
```

- `--access-control-allow-origin=*`: 브라우저에서 접속할 수 있도록 설정
- `--plugin=eosio::history_api_plugin`: 트랜잭션, 계정 등을 빠르게 조회할 수 있도록 인덱스 생성
- `--filter-on=*`: 인덱스를 생성할 트랜잭션 필터, `recipient:action:actor` 형태로 설정 가능 (예: eosio.token:transfer:)

# 토큰 발행

EOSIO는 코인이 없으며 시스템 운영에 활용되는 EOS도 `eosio.token` 계정에 배포된 토큰 컨트랙트를 통해 운영한다.

## 토큰 발행

### 토큰 컨트랙트 계정 생성

`eosio.token` 계정을  생성한다. 아래와 같이 키 대신 다른 계정의 권한을 넣으면 해당 계정에 등록된 키를 이용하여 새로 생성한 계정의 트랜잭션에 서명할 수 있다.

```
cleos create account eosio eosio.token eosio@active
```

### 토큰 컨트랙트 배포

```
cleos set contract eosio.token contracts/eosio.token
```

### 토큰 생성

`create` 액션의 전달인자는 다음과 같다.

- `issuer`: 토큰 발행 권한을 갖는 계정
- `maximum_supply`: 최대 발행량, 처음 생성할 때 적은 소수점 아래 자리수 만큼 쪼갤 수 있는 토큰으로 생성된다.

```
cleos push action eosio.token create '["eosio", "1000000000.0000 EOS"]' -p eosio.token
```

### 토큰 발행

`issue` 액션의 전달인자는 다음과 같다.

- `to `: 새로 발행한 토큰을 받을 계정, 이전에는 아무 계정에 발행할 수 있었으나 현재는 토큰발행자 자신에게만 발행할 수 있도록 변경되었다.
- `quantity`: 발행할 토큰의 양, 처음 설정한 소수점 자리수에 맞춰 정확하게 입력해야 한다. (소수점 아래가 없더라도 0으로 채움)
- `memo`: 메모

```
cleos push action eosio.token issue '["eosio", "1000000000.0000 EOS", ""]' -p eosio
```

### 토큰 전송

`transfer` 액션의 전달인자는 다음과 같다.

- `from`: 토큰을 보내는 계정
- `to`: 토큰을 받는 계정
- `quantity`: 전송할 토큰의 양
- `memo`: 메모

```
cleos push action eosio.token transfer '["eosio", "conr2d", "10000.0000 EOS", ""]' -p eosio
```

### 토큰 소각

`retire` 액션의 전달인자는 다음과 같다. `retire` 액션으로 소각한 토큰은 차후에 `issue` 액션을 통해 다시 발행할 수 있다.

- `quantity`: 소각할 토큰의 양
- `memo`: 메모

```
cleos push action eosio.token retire '["1000000.0000 EOS", ""]' -p eosio
```

# Dapp 실습

## 컨트랙트 예제

```
git clone https://github.com/conr2d/eosio-contract-practice -b decenter-eos-core
```

## nodejs 설치

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```
mkdir -p $HOME/.npm-packages
echo "prefix = $HOME/.npm-packages" > $HOME/.npmrc
echo -e "\nexport PATH=\"$HOME/.npm-packages/bin:\$PATH\"" >> $HOME/.bashrc
source $HOME/.bashrc
```

## Scatter 설치

```
https://github.com/GetScatter/ScatterDesktop/releases/download/11.0.1/win-scatter-11.0.1.exe

[
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
]
```

## demux 예제

```
git clone https://github.com/EOSIO/demux-js
cd demux-js
npm install
npm run example eos-transfers
```
