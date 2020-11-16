# Ethereum Address Derivation

## 개발환경 세팅

### WSL

- Windows Subsystem for Linux. Windows 10 안에서 리눅스 사용이 가능하도록 만들어주는 기능.
- 제어판 - 프로그램 제거 - Windows 기능 켜기/끄기 -  Linux용 Windows 하위 시스템
- Microsoft Store에서 Ubuntu 18.04 검색 및 설치

### Node.js

- JavaScript 실행 환경
- WSL 우분투 터미널 실행해서 아래 명령문 입력

  ``` console
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt install -y nodejs
  ```

### Visual Studio Code

- 코드 편집기
- https://code.visualstudio.com/download
- Remote - WSL 확장 기능 설치
