

// ** required libraries for peripherals if required

// ** initialize pins for peripherals :

// ** peripherals initialization from their libraries classes if required

struct VariablesDict
{
    // ** list all variables are required for each peripheral
} variables_dict;

String get_variable_types()
{
    DynamicJsonDocument doc(1024);
    // ** list all variables types and their ranges , each variable mapped : doc["peripheral"]["type"], doc["peripheral"]["range"]

    String output;
    serializeJson(doc, output);
    return output;
}

String get_peripheral_pins()
{
    DynamicJsonDocument doc(1024);
    // ** mapp all pins into doc dictionary ;

    String output;
    serializeJson(doc, output);
    return output;
}

void update_variables_dict()
{
    // ** loop through VariablesDict and update their values by reading the peripherals status
}
