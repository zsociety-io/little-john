if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/palong/.gradle/caches/8.10.2/transforms/c5862d95bd64ba1e04741bed7439072b/transformed/jetified-hermes-android-0.76.3-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/palong/.gradle/caches/8.10.2/transforms/c5862d95bd64ba1e04741bed7439072b/transformed/jetified-hermes-android-0.76.3-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

