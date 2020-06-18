cmake_minimum_required(VERSION 3.5)

#get_filename_component(PROJECT ${CMAKE_CURRENT_SOURCE_DIR} NAME)
#string(REPLACE " " "_" PROJECT ${PROJECT})
#project(${PROJECT})

project(multi)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package("eosio.cdt")

include(${EOSIO_CDT_ROOT}/lib/cmake/eosio.cdt/EosioWasmToolchain.cmake)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/${CMAKE_PROJECT_NAME})

add_contract(${CMAKE_PROJECT_NAME} ${CMAKE_PROJECT_NAME} src/${CMAKE_PROJECT_NAME}.cpp)
target_include_directories(multi PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
