#include <Arduino.h>
#include <map>
#include <functional>
#include <variant>

// Define functions with different signatures
int add(int a, int b) {
  return a + b;
}

void sayHello() {
  Serial.println("Hello!");
}

void setup() {
  Serial.begin(115200);

  // Create a map to store functions with different signatures
  using FunctionArg = std::variant<std::pair<int, int>, std::monostate>;
  std::map<String, std::function<std::variant<int, void>(FunctionArg)>> functionMap;

  // Add functions to the map
  functionMap["add"] = [](FunctionArg args) -> std::variant<int, void> {
    auto params = std::get<std::pair<int, int>>(args);
    return add(params.first, params.second);
  };

  functionMap["sayHello"] = [](FunctionArg args) -> std::variant<int, void> {
    sayHello();
    return std::monostate{};  // Return nothing for void functions
  };

  // Call the functions
  std::variant<int, void> result;

  // Call add(3, 4)
  result = functionMap["add"](std::make_pair(3, 4));
  Serial.print("add(3, 4) = ");
  Serial.println(std::get<int>(result));  // Output: add(3, 4) = 7

  // Call sayHello()
  functionMap["sayHello"](std::monostate{});  // Output: Hello!
}

void loop() {
  // Nothing here for this example
}