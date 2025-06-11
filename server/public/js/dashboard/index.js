document.addEventListener("DOMContentLoaded", async function () {
  const editModeBtn = document.getElementById("editModeBtn");
  const eventLog = document.getElementById("eventLog");
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const themeToggle = document.getElementById("themeToggle");
  const statusText = document.getElementById("statusText");
  const connectionStatus = document.getElementById("connectionStatus");
  const cancelConfig = document.getElementById("cancelConfig");
  const saveConfig = document.getElementById("saveConfig");
  const closeModal = document.getElementById("closeModal");

  let isEditMode = false;
  let isDarkTheme = false;
  let isConnected = false;
  let prevConnected = false;
  let currentDeviceData = {};
  const devicesCards = {};
  const readComponents = {};
  const writeMethods = {};

  setInterval(async () => {
    isConnected = await socket.emitWithAck("brokerStatus", "");
    connectStatus();
  }, 5000);

  setInterval(() => {
    Object.entries(readComponents).forEach(([key, componentsArr]) => {
      componentsArr
        .filter((component) => component.getAttribute("method-type") === "read")
        .forEach((component) => sendImmediateCommand(component));
    });
  }, 3000);

  function connectStatus() {
    if (isConnected) {
      connectionStatus.className = "connection-status";
      connectionStatus.innerHTML =
        '<div class="connection-indicator"></div><span>Connected</span>';
      statusIndicator.className = "status-indicator";
      statusText.textContent = "Online";
      if (prevConnected != isConnected) {
        addLogEntry("Connected to the broker", "success");
        prevConnected = isConnected;
      }
    } else {
      connectionStatus.className = "connection-status connecting";
      connectionStatus.innerHTML =
        '<div class="connection-indicator"></div><span>Connecting...</span>';
    }
  }

  editModeBtn.addEventListener("click", function () {
    toggleEditMode();
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show corresponding content
      tabContents.forEach((content) => {
        if (content.getAttribute("data-tab-content") === tabName) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
    });
  });

  themeToggle.addEventListener("click", function () {
    toggleTheme();
  });

  cancelConfig.addEventListener("click", function () {
    configModal.classList.remove("show");
  });

  saveConfig.addEventListener("click", function () {
    saveComponentConfig();
  });

  document.querySelectorAll(".component-item").forEach((item) => {
    item.addEventListener("click", function () {
      const componentType = this.getAttribute("data-component");
      console.log("this is component type : ", componentType);

      addComponent(componentType);
    });
  });

  closeModal.addEventListener("click", function () {
    configModal.classList.remove("show");
  });

  function toggleEditMode() {
    isEditMode = !isEditMode;

    if (isEditMode) {
      // Enter edit mode
      editModeBtn.textContent = "Exit Edit Mode";
      editModeBtn.classList.remove("btn-secondary");
      editModeBtn.classList.add("btn-warning");
      componentToolbar.style.display = "block";

      // Make cards draggable
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        card.classList.add("draggable");
        const componentId = card.getAttribute("data-component-id");
        // Add edit button to each card
        const cardHeader = card.querySelector(".card-header");
        const cardFooter = card.querySelector(".card-footer");
        if (cardHeader) {
          const editBtn = document.createElement("button");
          editBtn.className = "btn btn-secondary edit-component";
          editBtn.innerHTML = "⚙️";
          editBtn.addEventListener("click", function (e) {
            e.stopPropagation();

            openComponentConfig(componentId);
          });

          const cardActions = cardHeader.querySelector(".card-actions");
          if (cardActions) {
            cardActions.prepend(editBtn);
          }
        }
        if (cardFooter) {
          cardFooter.innerHTML = "";
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "btn btn-secondary delete-component";
          deleteBtn.innerHTML = "🗑";
          deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
          });
          cardFooter.appendChild(deleteBtn);
        }
      });

      // Add log entry
      addLogEntry("Entered dashboard edit mode", "info");
    } else {
      // Exit edit mode
      editModeBtn.textContent = "Edit Dashboard";
      editModeBtn.classList.remove("btn-warning");
      editModeBtn.classList.add("btn-secondary");
      componentToolbar.style.display = "none";

      // Remove draggable and edit buttons
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        card.classList.remove("draggable");

        const editBtn = card.querySelector(".edit-component");
        if (editBtn) {
          editBtn.remove();
        }
        const deleteBtn = card.querySelector(".delete-component");
        if (deleteBtn) {
          deleteBtn.remove();
        }
      });

      // Add log entry
      addLogEntry("Exited dashboard edit mode", "info");

      // Save dashboard layout
      saveDashboardLayout();
    }
  }

  function addLogEntry(message, type = "info") {
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString();

    logEntry.innerHTML = `
                    <div class="log-message">${message}</div>
                    <div class="log-time">${timeString}</div>
                `;

    eventLog.prepend(logEntry);

    // Limit log entries to 50
    if (eventLog.children.length > 50) {
      eventLog.removeChild(eventLog.lastChild);
    }
  }

  function saveDashboardLayout() {
    // In a real application, you would save the layout to localStorage or server
    addLogEntry("Dashboard layout saved", "success");
    showNotification("Dashboard layout saved", "success");
  }

  function addLogEntry(message, type = "info") {
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString();

    logEntry.innerHTML = `
                    <div class="log-message">${message}</div>
                    <div class="log-time">${timeString}</div>
                `;

    eventLog.prepend(logEntry);

    // Limit log entries to 50
    if (eventLog.children.length > 50) {
      eventLog.removeChild(eventLog.lastChild);
    }
  }

  function showNotification(message, type = "success") {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    // Hide notification after 5 seconds
    setTimeout(() => {
      notification.className = "notification";
    }, 5000);
  }

  function toggleTheme() {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
      document.body.classList.add("dark-theme");
      themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-theme");
      themeToggle.textContent = "🌙";
    }

    // Save preference
    localStorage.setItem("darkTheme", isDarkTheme);

    // Update chart colors
    updateChartTheme();
  }

  function createCard(componentType, componentId) {
    const card = document.createElement("div");

    card.className = "card";

    if (componentType == "automation-rule") {
      card.classList.add("wide");
    }

    card.setAttribute("data-component-id", componentId);
    card.setAttribute("data-component-type", componentType);

    // Add card header
    const cardHeader = document.createElement("div");
    const cardFooter = document.createElement("div");

    cardHeader.className = "card-header";
    cardHeader.innerHTML = `
                    <div class="card-title">${componentTemplates[componentType].title}</div>
                    <div class="card-actions">
                        <button class="btn btn-secondary edit-component">⚙️</button>
                    </div>
                `;
    cardFooter.className = "card-footer";
    cardFooter.innerHTML = `
                        <button class="btn btn-secondary delete-component">🗑</button>
                `;
    // Add card content
    const cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.innerHTML = componentTemplates[componentType].content;

    // Assemble card
    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    card.appendChild(cardFooter);
    // Add to dashboard
    dashboardGrid.appendChild(card);

    // Add event listener for edit button
    const editBtn = card.querySelector(".edit-component");
    if (editBtn) {
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openComponentConfig(componentId);
      });
    }
    const deleteBtn = card.querySelector(".delete-component");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const component = document.querySelector(
          `[data-component-id="${componentId}"]`
        );

        const deviceName = components[componentId].formData.device;
        const pName = components[componentId].formData.source;
        delete devicesCards[deviceName][pName];
        delete components[componentId];

        component.remove();
      });
    }

    // Initialize the component
    initializeComponent(card);
  }

  function addComponent(componentType) {
    if (!componentTemplates[componentType]) {
      showNotification(`Unknown component type: ${componentType}`, "error");
      return;
    }

    // Generate unique ID
    const componentId = `component-${Date.now()}`;

    console.log(
      "this is component type before checking if automation : ",
      componentType
    );
    if (componentType === "automation-rule") {
      console.log("this is automation rule component type : ", componentType);
      createAutomationRule(componentId);
    }
    // Create card
    else createCard(componentType, componentId);
    // Open configuration modal
    openComponentConfig(componentId);

    // Add log entry
    addLogEntry(
      `Added new ${componentTemplates[componentType].title} component`,
      "info"
    );
  }

  function createAutomationRule(componentId) {
    console.log("this is automation rule ");
    const automationLine = document.createElement("div");
    automationLine.setAttribute("data-component-id", componentId);
    automationLine.setAttribute("data-component-type", "automation-rule");
    automationLine.classList.add("automation-rule");
    automationLine.innerHTML = `

          <label for="automation-info" class="automation-label"
            >Automation 1</label
          >

          <button class="stop-start-button btn-start" data-state="stopped">
            Start
          </button>
        <div class="action-buttons">
            <button class="btn btn-secondary edit-component">⚙️</button>
            <button class="btn btn-secondary delete-component">×</button>
        </div>
    `;

    const automationContainer = document.getElementById("automation-list");

    console.log("this is automation container : ", automationContainer);
    automationContainer.appendChild(automationLine);
  }

  function initializeComponent(component) {
    const type = component.getAttribute("data-component-type");

    switch (type) {
      case "circle-canvas":
        initializeCircleCanvas(component);
        break;
      case "chart":
        initializeChart(component, [1, 2, 3, 4, 5]);
        break;
      // Add other component initializations as needed
    }
  }

  function openComponentConfig(componentId) {
    const component = document.querySelector(
      `[data-component-id="${componentId}"]`
    );

    console.log("this is component :", component);

    if (!component) return;

    const componentType = component.getAttribute("data-component-type");
    if (!componentType || !componentTemplates[componentType]) return;

    // Set current component
    currentComponent = {
      id: componentId,
      type: componentType,
      element: component,
    };

    // Set modal title
    modalTitle.textContent = `Configure ${componentTemplates[componentType].title}`;

    // Clear form
    configForm.innerHTML = "";

    if (componentType === "automation-rule") {
    }

    // Create a container for device, source, and method fields
    const groupLine = document.createElement("div");
    groupLine.className = "full-line";

    // Store the fields to be grouped
    const groupedFields = {
      device: null,
      source: null,
      method: null,
    };

    // Add configuration fields
    componentTemplates[componentType].config.forEach((field) => {
      if (field.dynamic && field.name === "device") {
        field.options = devices.map((device) => ({
          value: device.name,
          label: device.name,
        }));
        field.default = devices[0];
      }
      if (field.dynamic && field.name === "source") {
        field.options = devices[0].pList.map(([key, value]) => ({
          value: [key, value],
          label: key,
        }));
      }
      if (field.dynamic && field.name === "method") {
        field.options = devices[0].pList.map(([key, value]) => ({
          value: [key, value],
          label: key,
        }));
      }

      const formGroup = document.createElement("div");
      formGroup.style.marginBottom = "15px";

      const label = document.createElement("label");
      label.textContent = field.label;
      label.setAttribute("for", `config-${field.name}`);

      let input;

      switch (field.type) {
        case "text":
        case "number":
        case "color":
          input = document.createElement("input");
          input.type = field.type;
          input.id = `config-${field.name}`;
          input.name = field.name;
          input.value = field.default;
          break;

        case "select":
          input = document.createElement("select");
          input.id = `config-${field.name}`;
          input.name = field.name;

          field.options.forEach((option) => {
            const optionEl = document.createElement("option");
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            if (option.value === field.default) {
              optionEl.selected = true;
            }
            input.appendChild(optionEl);
          });
          break;

        case "checkbox":
          input = document.createElement("input");
          input.type = "checkbox";
          input.id = `config-${field.name}`;
          input.name = field.name;
          input.checked = field.default;
          break;

        case "textarea":
          input = document.createElement("textarea");
          input.id = `config-${field.name}`;
          input.name = field.name;
          input.value = field.default;
          input.rows = 4;
          break;
      }

      // Get current value if component already exists
      if (component) {
        const cardTitle = component.querySelector(".card-title");
        if (cardTitle && field.name === "title") {
          input.value = cardTitle.textContent;
        }

        const contentElement = component.querySelector(`[data-${field.name}]`);
        if (contentElement) {
          const value = contentElement.getAttribute(`data-${field.name}`);
          if (value) {
            if (field.type === "checkbox") {
              input.checked = value === "true";
            } else {
              input.value = value;
            }
          }
        }
      }

      formGroup.appendChild(label);
      formGroup.appendChild(input);

      // Check if this is one of the fields to be grouped
      if (["device", "source", "method"].includes(field.name)) {
        groupedFields[field.name] = formGroup;
      } else {
        // Add non-grouped fields directly to the form
        configForm.appendChild(formGroup);
      }
    });

    // Add the grouped fields to the group line and then to the form
    if (groupedFields.device || groupedFields.source || groupedFields.method) {
      if (groupedFields.device) groupLine.appendChild(groupedFields.device);
      if (groupedFields.source) groupLine.appendChild(groupedFields.source);
      if (groupedFields.method) groupLine.appendChild(groupedFields.method);
      configForm.appendChild(groupLine);
    }

    let currentDevice = devices[0];
    let currentP = "";

    const configDevice = configModal.querySelector("#config-device");
    const configP = configModal.querySelector("#config-source");
    const configMethods = configModal.querySelector("#config-method");

    removeOptions(configDevice);
    removeOptions(configP);
    removeOptions(configMethods);

    devices.forEach((device) => {
      const option = document.createElement("option");
      option.text = device.name;
      option.value = device.name;
      configDevice.add(option);
    });

    deviceAutoSelect(
      currentDevice,
      { configDevice, configP, configMethods },
      componentType
    );

    configDevice.addEventListener("change", () => {
      removeOptions(configP);
      currentDevice = devices[configDevice.selectedIndex];
      deviceAutoSelect(
        currentDevice,
        { configDevice, configP, configMethods },
        componentType
      );
    });

    configP.addEventListener("change", () => {
      removeOptions(configMethods);

      currentP = configP.value.split(",");

      console.log(currentP[1]);
      console.log(peripherals_interface_info[currentP[1]]);
      Object.entries(peripherals_interface_info[currentP[1]].methods).forEach(
        ([name, body]) => {
          console.log(name);
          if (isAppropriateMethod(currentP[1], name, componentType)) {
            const option = document.createElement("option");
            option.text = body.label;
            option.value = name;
            configMethods.add(option);
          }
        }
      );

      console.log(configMethods.value);
      if (configMethods.value)
        methodAutoFill(currentP[1], configMethods.value, componentType);
    });

    configMethods.addEventListener("change", () => {
      methodAutoFill(currentP[1], configMethods.value, componentType);
    });

    // Show modal
    configModal.classList.add("show");
  }

  function methodAutoFill(
    selectedP,
    selectedMethod,
    componentType,
    configModal = document.querySelector("#configModal")
  ) {
    console.log("clicked");
    const methodObject =
      peripherals_interface_info[selectedP].methods[selectedMethod];

    if (componentTemplates[componentType].bounded) {
      let minValue = "";
      let maxValue = "";
      if (methodObject.returns.range) {
        minValue = methodObject.returns.range.min;
        maxValue = methodObject.returns.range.max;
      }
      if (methodObject.parameters)
        if (methodObject.parameters[0].range) {
          minValue = methodObject.parameters[0].range.min;
          maxValue = methodObject.parameters[0].range.max;
        }
      configModal.querySelector("#config-min").value = minValue;
      configModal.querySelector("#config-max").value = maxValue;
    }
    if (componentType === "automation-rule") {
      // Check if the additional selectors already exist to avoid duplicates
      const existingAdditionalLine = configModal.querySelector(
        "#automation-condition-line"
      );
      if (existingAdditionalLine) {
        existingAdditionalLine.remove();
      }

      // Add the additional line to the form
      const configForm = configModal.querySelector("#configForm");
      const initialGroup = configModal.querySelector(".full-line");
      // if (
      //   componentType === "automation-rule" &&
      //   methodObject.returns.dataType === "Void"
      // ) {
      //   const existingAdditionalLine = document.getElementById(
      //     "automation-output-line"
      //   );
      //   console.log(
      //     "this is old automation output line : ",
      //     existingAdditionalLine
      //   );
      //   if (existingAdditionalLine) {
      //     existingAdditionalLine.remove();
      //   }
      //   createAutomationOutputLine(configForm);
      //   return;
      // }
      const considtionSelect = createConditionLine(
        configForm,
        initialGroup,
        methodObject
      );

      considtionSelect.addEventListener("change", () => {
        console.log(considtionSelect.value);
        if (configModal.querySelector("#automation-output-line"))
          configModal.querySelector("#automation-output-line").remove();
        createAutomationOutputLine(configForm);
      });
    }
  }

  function createAutomationOutputLine(configForm) {
    const outputLine = document.createElement("div");
    outputLine.id = "automation-output-line";
    outputLine.className = "full-line";

    const outputDeviceField = createFieldSelect(
      "Device Output",
      "device-output",
      devices.map((d) => [d.name, d.name])
    );
    outputLine.appendChild(outputDeviceField);

    const deviceSelect = outputDeviceField.querySelector("select");
    console.log("this is device select : ");

    const outputPeripheralField = createFieldSelect(
      "Source Output",
      "source-output",
      Object.values(devices[0].dictVariables).map((d) => [
        peripherals_interface_info[d].title,
        d,
      ])
    );
    outputLine.appendChild(outputPeripheralField);

    console.log(
      "this is first method of first device : ",
      Object.keys(
        peripherals_interface_info[Object.values(devices[0].dictVariables)[0]]
          .methods
      )
    );
    const methodField = createFieldSelect(
      "Method Output",
      "method-output",
      Object.entries(
        peripherals_interface_info[Object.values(devices[0].dictVariables)[0]]
          .methods
      ).map(([key, body]) => [body.label, key])
    );

    outputLine.appendChild(methodField);

    const pSelect = outputPeripheralField.querySelector("select");
    const methodSelect = methodField.querySelector("select");

    deviceSelect.addEventListener("change", () => {
      removeOptions(pSelect);
      devices
        .find((d) => d.name === deviceSelect.value)
        .pList.forEach((p) => {
          const option = document.createElement("option");
          option.text = p[0];
          option.value = p;
          pSelect.add(option);
        });

      console.log("here is the method select options ", methodSelect.options);
      removeOptions(methodSelect);
      console.log("this is method select : ", methodSelect);
      addOptionsMethods(
        methodSelect,
        filterOutputMethod(pSelect.value.split(",")[1])
      );
    });

    pSelect.addEventListener("change", () => {
      console.log("here is the method select options ", methodSelect.options);
      removeOptions(methodSelect);
      console.log("this is method select : ", methodSelect);
      console.log("this is p select value : ", pSelect.value);
      addOptionsMethods(
        methodSelect,
        filterOutputMethod(pSelect.value.split(",")[1])
      );
    });

    configForm.appendChild(outputLine);

    methodSelect.addEventListener("change", () => {
      console.log(methodSelect.value);
      createAutomationResultLine(pSelect.value[1], methodSelect.value);
    });
  }

  function createAutomationResultLine(pName, methodName) {
    const configModal = document.querySelector("#configModal");
    const configForm = configModal.querySelector("#configForm");

    if (configModal.querySelector("#automation-result-line"))
      configModal.querySelector("#automation-result-line").remove();

    const line = document.createElement("div");
    line.id = "automation-result-line";
    line.className = "full-line";

    methodObject = peripherals_interface_info[pName].methods[methodName];
    if (methodObject.parameters)
      switch (methodObject.parameters[0].dataType) {
        case "Boolean":
          console.log("this is boolean");
          const selectField = createFieldSelect(
            "Value",
            "automation-result-value",
            [
              ["True", true],
              ["False", false],
            ]
          );
          line.appendChild(selectField);

          break;
        case "Number":
          console.log("this is number");
          const thresholdField = createThresholdField(pName, methodName);
          line.appendChild(thresholdField);
          break;
      }

    configForm.appendChild(line);
  }

  function createFieldSelect(title, name, dataArr) {
    const fieldGroup = document.createElement("div");
    fieldGroup.style.marginBottom = "15px";

    const fieldLabel = document.createElement("label");
    fieldLabel.textContent = title;
    fieldLabel.setAttribute("for", `config-${name}`);

    const fieldSelect = document.createElement("select");
    fieldSelect.id = `config-${name}`;
    fieldSelect.name = name;
    fieldSelect.className = `${name}-class`;

    const options = dataArr;

    console.log("this is dataArr : ", dataArr);

    // removeOptions(fieldSelect);

    if (name === "method-output") addOptionsMethods(fieldSelect, dataArr);
    else addOptions(fieldSelect, dataArr);

    fieldGroup.appendChild(fieldLabel);
    fieldGroup.appendChild(fieldSelect);

    return fieldGroup;
  }
  // Modified createConditionLine function with threshold input instead of action selector
  function createConditionLine(configForm, initialGroup, methodObject) {
    // Create a new group line for condition selector and threshold input
    console.log(methodObject);
    const conditionLine = document.createElement("div");
    conditionLine.id = "automation-condition-line";
    conditionLine.className = "full-line";

    // Create condition selector
    const conditionGroup = document.createElement("div");
    conditionGroup.style.marginBottom = "15px";

    const conditionLabel = document.createElement("label");
    conditionLabel.textContent = "Condition";
    conditionLabel.setAttribute("for", "config-condition");

    const conditionSelect = document.createElement("select");
    conditionSelect.id = "config-condition";
    conditionSelect.name = "condition";
    conditionSelect.className = "condition";

    let options = [];
    if (methodObject.interrupt) {
      options = [
        { value: true, label: "Rasing" },
        { value: false, label: "Failing" },
      ];

      options.forEach((option) => {
        const optionEl = document.createElement("option");
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        conditionSelect.appendChild(optionEl);
      });

      conditionGroup.appendChild(conditionLabel);
      conditionGroup.appendChild(conditionSelect);
      conditionLine.appendChild(conditionGroup);
    } else
      switch (methodObject.returns.dataType) {
        case "Boolean":
          options = [
            { value: true, label: methodObject.returns.values_meaning[true] },
            { value: false, label: methodObject.returns.values_meaning[false] },
          ];

          options.forEach((option) => {
            const optionEl = document.createElement("option");
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            conditionSelect.appendChild(optionEl);
          });

          conditionGroup.appendChild(conditionLabel);
          conditionGroup.appendChild(conditionSelect);
          conditionLine.appendChild(conditionGroup);
          break;
        case "Number":
          options = [
            { value: "gt", label: "Greater Than" },
            { value: "lt", label: "Less Than" },
            { value: "eq", label: "Equal To" },
          ];

          // Add condition options

          options.forEach((option) => {
            const optionEl = document.createElement("option");
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            conditionSelect.appendChild(optionEl);
          });

          conditionGroup.appendChild(conditionLabel);
          conditionGroup.appendChild(conditionSelect);
          conditionLine.appendChild(conditionGroup);

          // Create threshold input field instead of action selector
          const thresholdGroup = document.createElement("div");
          thresholdGroup.style.marginBottom = "15px";

          const thresholdLabel = document.createElement("label");
          thresholdLabel.textContent = "Threshold";
          thresholdLabel.setAttribute("for", "config-threshold");

          const thresholdInput = document.createElement("input");
          thresholdInput.type = "number";
          thresholdInput.id = "config-threshold";
          thresholdInput.name = "threshold";
          thresholdInput.className = "threshold";
          thresholdInput.value = "80";

          // If the method has a range, set min/max attributes
          if (
            methodObject &&
            methodObject.returns &&
            methodObject.returns.range
          ) {
            thresholdInput.min = methodObject.returns.range.min;
            thresholdInput.max = methodObject.returns.range.max;
          }

          thresholdGroup.appendChild(thresholdLabel);
          thresholdGroup.appendChild(thresholdInput);
          conditionLine.appendChild(thresholdGroup);
          break;
      }
    // Add the condition line to the form
    if (initialGroup) {
      configForm.insertBefore(conditionLine, initialGroup.nextSibling);
    } else {
      configForm.appendChild(conditionLine);
    }

    return conditionSelect;
  }
  function deviceAutoSelect(currentDevice, selectElements, componentType) {
    currentP = devices[0].pList[0];

    currentDevice.pList.forEach((p) => {
      const option = document.createElement("option");
      option.text = p[0];
      option.value = p;
      selectElements.configP.add(option);
    });

    selectElements.configP.value = currentP[0];

    Object.entries(peripherals_interface_info[currentP[1]].methods).forEach(
      ([name, body]) => {
        if (isAppropriateMethod(currentP[1], name, componentType)) {
          const option = document.createElement("option");
          option.text = body.label;
          option.value = name;
          selectElements.configMethods.add(option);
        }
      }
    );
    selectElements.configMethods.value = Object.keys(
      peripherals_interface_info[currentP[1]].methods
    );
    if (selectElements.configMethods.value)
      methodAutoFill(
        currentP[1],
        selectElements.configMethods.value,
        componentType
      );
  }

  function createThresholdField(pName, methodName) {
    // Create threshold input field instead of action selector
    const thresholdGroup = document.createElement("div");
    thresholdGroup.style.marginBottom = "15px";

    const thresholdLabel = document.createElement("label");
    thresholdLabel.textContent = "Value";
    thresholdLabel.setAttribute("for", "config-threshold");

    const thresholdInput = document.createElement("input");
    thresholdInput.type = "number";
    thresholdInput.id = "config-automation-result-value";
    thresholdInput.name = "threshold";
    thresholdInput.className = "threshold";
    thresholdInput.value = "80";

    const methodObject = peripherals_interface_info[pName].methods[methodName];

    // If the method has a range, set min/max attributes
    if (
      methodObject.parameters &&
      methodObject.parameters[0] &&
      methodObject.parameters.range
    ) {
      thresholdInput.min = methodObject.parameters.range.min;
      thresholdInput.max = methodObject.parameters.range.max;
    }

    thresholdGroup.appendChild(thresholdLabel);
    thresholdGroup.appendChild(thresholdInput);

    return thresholdGroup;
  }

  function addOptionsMethods(selectElement, listData) {
    listData.forEach((p) => {
      const option = document.createElement("option");
      option.text = p[0];
      option.value = p;
      selectElement.add(option);
    });
  }

  function addOptions(selectElement, listData) {
    listData.forEach((p) => {
      const option = document.createElement("option");
      option.text = p[0];
      option.value = p[1];
      selectElement.add(option);
    });
  }

  function removeOptions(selectElement) {
    console.log("here is remove option");
    var i;
    L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
      selectElement.remove(i);
    }
  }

  function filterOutputMethod(pName) {
    console.log(pName);
    const methodsDict = peripherals_interface_info[pName].methods;
    const outputMethods = Object.keys(methodsDict).filter(
      (method) => methodsDict[method].type === "write"
    );
    const outputMethodsOptions = outputMethods.map((method) => [
      methodsDict[method].label,
      method,
    ]);
    return outputMethodsOptions;
  }

  function isAppropriateMethod(pName, methodName, componentType) {
    console.log(methodName);
    if (
      componentTemplates[componentType].allowed_method_types.includes(
        peripherals_interface_info[pName].methods[methodName].type
      )
    ) {
      if (
        peripherals_interface_info[pName].methods[methodName].type == "read"
      ) {
        if (
          componentTemplates[componentType].allowed_method_returns.includes(
            peripherals_interface_info[pName].methods[methodName].returns
              .dataType
          )
        )
          return true;
      }
      if (
        peripherals_interface_info[pName].methods[methodName].type == "write"
      ) {
        console.log("this is write method ", methodName);
        if (!peripherals_interface_info[pName].methods[methodName].parameters) {
          if (componentType === "push-button") return true;
          return false;
        }
        if (
          componentTemplates[
            componentType
          ].allowed_method_parameter_type.includes(
            peripherals_interface_info[pName].methods[methodName].parameters[0]
              .dataType
          )
        )
          return true;
      }
      return false;
    }
  }
  function saveComponentConfig() {
    if (!currentComponent) return;

    const component = currentComponent.element;
    const componentType = currentComponent.type;
    const methodType =
      componentTemplates[componentType].allowed_method_types[0];
    component.setAttribute("method-type", methodType);

    // Get form values
    const formData = {};
    if (componentType == "automation-rule") {
      const fieldsNames = [
        "device",
        "source",
        "method",
        "condition",
        "threshold",
        "device-output",
        "source-output",
        "method-output",
        "automation-result-value",
      ];
      fieldsNames.forEach((fieldName) => {
        const input = document.getElementById(`config-${fieldName}`);

        console.log(input);
        if (input) {
          formData[fieldName] = input.value;
          component.setAttribute(fieldName, input.value);
        }
      });
    } else {
      componentTemplates[componentType].config.forEach((field) => {
        const input = document.getElementById(`config-${field.name}`);
        if (input) {
          if (field.type === "checkbox") {
            formData[field.name] = input.checked;
          } else {
            formData[field.name] = input.value;
          }
        }
        component.setAttribute(field.name, input.value);
      });

      console.log("this is form data : ");
      console.log(formData);
      formData.sourceArr = formData.source.split(",");
      console.log(formData.sourceArr);
      formData.source = formData.sourceArr[1];

      const parameters =
        peripherals_interface_info[formData.sourceArr[1]].methods[
          formData.method
        ].parameters;

      component.setAttribute(
        "parameter-length",
        parameters ? parameters.length : 0
      );

      if (methodType === "read") {
        if (readComponents[`${formData.device}-${formData.source}`])
          readComponents[`${formData.device}-${formData.source}`].push(
            component
          );
        else
          readComponents[`${formData.device}-${formData.source}`] = [component];
      }
    }

    // Update component content based on type
    switch (componentType) {
      case "text-display":
        updateTextDisplay(component, formData);
        break;
      case "circle-canvas":
        updateCircleCanvas(component, formData);
        break;
      case "onoff-indicator":
        updateOnOffIndicator(component, formData);
        break;
      case "gauge":
        updateGauge(component, formData);
        break;
      case "chart":
        components[currentComponent.id].dataArray = [];
        updateChart(component, formData, [1, 2, 3, 20, 5, 6, 7, 8]);
        break;
      case "text-input":
        updateTextInput(component, formData);
        break;
      case "switch-button":
        updateSwitchButton(component, formData);
        break;
      case "slider":
        updateSlider(component, formData);
        break;
      case "select-dropdown":
        updateSelectDropdown(component, formData);
        break;
      case "push-button":
        updatePushButton(component, formData);
        break;
      case "automation-rule":
        updateAutomationRule(component, formData);
        break;
    }

    // Close modal
    configModal.classList.remove("show");

    // Reset current component
    currentComponent = null;

    // Show notification
    showNotification("Component configuration saved", "success");

    // Update with current data
    if (currentDeviceData) {
      updateDynamicComponents(currentDeviceData);
    }
  }

  function updateTextDisplay(component, config) {
    const display = component.querySelector(".text-display");
    if (!display) return;

    display.dataset.source = config.source;
    display.dataset.format = config.format;

    const observer = new MutationObserver(() => {
      const newValue = component.getAttribute("return-value");
      display.textContent = newValue;
    });

    observer.observe(component, {
      attributes: true,
      attributeFilter: ["return-value"],
    });
  }

  function updateOnOffIndicator(component, config) {
    const indicator = component.querySelector(".onoff-indicator");
    if (!indicator) return;

    const observer = new MutationObserver(() => {
      const newValue = autoParse(component.getAttribute("return-value"));
      if (newValue) {
        indicator.classList.remove("off");
        indicator.classList.add("on");
        indicator.textContent = config.onText;
      } else {
        indicator.classList.remove("on");
        indicator.classList.add("off");
        indicator.textContent = config.offText;
      }
    });

    observer.observe(component, {
      attributes: true,
      attributeFilter: ["return-value"],
    });
  }

  function autoParse(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(value) && value.trim() !== "") return Number(value);
    return value;
  }

  function updateDynamicComponents(data) {
    // Update text displays
    document.querySelectorAll(".text-display").forEach((display) => {
      const source = display.getAttribute("data-source");
      const format = display.getAttribute("data-format") || "{value}";

      if (source && data[source] !== undefined) {
        let value = data[source];

        // Handle nested properties
        if (source.includes(".")) {
          const parts = source.split(".");
          value = data;
          for (const part of parts) {
            if (value && value[part] !== undefined) {
              value = value[part];
            } else {
              value = "N/A";
              break;
            }
          }
        }

        // Format the value
        const formattedValue = format.replace("{value}", value);
        display.textContent = formattedValue;
      }
    });

    // Update circle canvases
    document.querySelectorAll(".circle-canvas").forEach((canvas) => {
      const source = canvas.getAttribute("data-source");

      if (source && data[source] !== undefined && canvas._ctx) {
        let value = data[source];

        // Handle nested properties
        if (source.includes(".")) {
          const parts = source.split(".");
          value = data;
          for (const part of parts) {
            if (value && value[part] !== undefined) {
              value = value[part];
            } else {
              value = 0;
              break;
            }
          }
        }

        drawCircleCanvas(
          canvas._ctx,
          value,
          canvas._min,
          canvas._max,
          canvas._colorMin,
          canvas._colorMax
        );
      }
    });

    // Update on/off indicators
    document.querySelectorAll(".onoff-indicator").forEach((indicator) => {
      const source = indicator.getAttribute("data-source");
      const onText = indicator.getAttribute("data-on-text") || "ON";
      const offText = indicator.getAttribute("data-off-text") || "OFF";

      if (source && data[source] !== undefined) {
        let value = data[source];

        // Handle nested properties
        if (source.includes(".")) {
          const parts = source.split(".");
          value = data;
          for (const part of parts) {
            if (value && value[part] !== undefined) {
              value = value[part];
            } else {
              value = false;
              break;
            }
          }
        }

        if (value) {
          indicator.classList.remove("off");
          indicator.classList.add("on");
          indicator.textContent = onText;
        } else {
          indicator.classList.remove("on");
          indicator.classList.add("off");
          indicator.textContent = offText;
        }
      }
    });

    // Update charts
    document.querySelectorAll("canvas[data-source]").forEach((canvas) => {
      if (!canvas._chart) return;

      const source = canvas.getAttribute("data-source");

      if (source && data[source] !== undefined) {
        let value = data[source];

        // Handle nested properties
        if (source.includes(".")) {
          const parts = source.split(".");
          value = data;
          for (const part of parts) {
            if (value && value[part] !== undefined) {
              value = value[part];
            } else {
              value = 0;
              break;
            }
          }
        }

        // Add new data point
        canvas._data.push(value);
        if (canvas._data.length > 12) {
          canvas._data.shift();
        }

        // Update labels
        const now = new Date();
        const newLabel = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        canvas._chart.data.labels.push(newLabel);
        if (canvas._chart.data.labels.length > 12) {
          canvas._chart.data.labels.shift();
        }

        // Update dataset
        canvas._chart.data.datasets[0].data = canvas._data;

        // Update chart
        canvas._chart.update();
      }
    });
  }

  // Initialize circle canvas
  function initializeCircleCanvas(component) {
    const canvas = component.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const min = parseInt(component.getAttribute("min") || 0);
    const max = parseInt(component.getAttribute("max") || 100);
    const colorMin = component.getAttribute("colormin") || "#4caf50";
    const colorMax = component.getAttribute("colormax") || "#f44336";

    // Set canvas dimensions
    canvas.width = 150;
    canvas.height = 150;

    // Draw initial state
    drawCircleCanvas(ctx, 0, min, max, colorMin, colorMax);

    // Store context for updates
    canvas._ctx = ctx;
    canvas._min = min;
    canvas._max = max;
    canvas._colorMin = colorMin;
    canvas._colorMax = colorMax;
  }
  // Draw circle canvas
  function drawCircleCanvas(ctx, value, min, max, colorMin, colorMax) {
    // Clear canvas
    ctx.clearRect(0, 0, 150, 150);

    // Calculate percentage
    const percentage = Math.min(1, Math.max(0, (value - min) / (max - min)));

    // Calculate color
    const r1 = parseInt(colorMin.slice(1, 3), 16);
    const g1 = parseInt(colorMin.slice(3, 5), 16);
    const b1 = parseInt(colorMin.slice(5, 7), 16);

    const r2 = parseInt(colorMax.slice(1, 3), 16);
    const g2 = parseInt(colorMax.slice(3, 5), 16);
    const b2 = parseInt(colorMax.slice(5, 7), 16);

    const r = Math.floor(r1 + (r2 - r1) * percentage);
    const g = Math.floor(g1 + (g2 - g1) * percentage);
    const b = Math.floor(b1 + (b2 - b1) * percentage);

    const color = `rgb(${r}, ${g}, ${b})`;

    // Draw circle
    ctx.beginPath();
    ctx.arc(75, 75, 60, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Draw text
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, 75, 75);
  }
  // Update circle canvas component
  function updateCircleCanvas(component, config) {
    const canvas = component.querySelector("canvas");
    if (!canvas) return;

    // Reinitialize canvas
    initializeCircleCanvas(component);

    const observer = new MutationObserver(() => {
      const newValue = component.getAttribute("return-value");
      drawCircleCanvas(
        canvas._ctx,
        newValue,
        canvas._min,
        canvas._max,
        canvas._colorMin,
        canvas._colorMax
      );
    });

    observer.observe(component, {
      attributes: true,
      attributeFilter: ["return-value"],
    });
  }
  // Update gauge component
  function updateGauge(component, config) {
    const gauge = component.querySelector(".gauge");
    const gaugeFill = component.querySelector(".gauge-fill");
    const gaugeValue = component.querySelector(".gauge-value");
    const gaugeLabel = component.querySelector(".gauge-label");

    if (!gauge || !gaugeFill || !gaugeValue || !gaugeLabel) return;

    gauge.setAttribute("data-source", config.source);
    gauge.setAttribute("data-min", config.min);
    gauge.setAttribute("data-max", config.max);
    gaugeLabel.textContent = config.label;

    const min = parseInt(config.min);
    const max = parseInt(config.max);

    const observer = new MutationObserver(() => {
      const newValue = autoParse(component.getAttribute("return-value"));
      const percentage = Math.min(
        100,
        Math.max(0, ((newValue - min) / (max - min)) * 100)
      );
      gaugeFill.style.height = percentage + "%";
      gaugeValue.textContent = newValue;
    });

    observer.observe(component, {
      attributes: true,
      attributeFilter: ["return-value"],
    });
  }
  // Initialize chart
  function initializeChart(component, dataArray) {
    const canvas = component.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const source = canvas.getAttribute("data-source");
    const chartType = canvas.getAttribute("data-chart-type") || "line";
    const timeRange = parseInt(canvas.getAttribute("data-time-range") || 10);

    // Generate time labels based on timeRange
    const labels = Array.from({ length: dataArray.length }, (_, i) => {
      const date = new Date();
      date.setMinutes(
        date.getMinutes() -
          (dataArray.length - 1 - i) * (timeRange / dataArray.length)
      );
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    // Create chart
    const chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: source.charAt(0).toUpperCase() + source.slice(1),
            data: dataArray,
            borderColor: "#2196f3",
            backgroundColor:
              chartType === "line"
                ? "rgba(33, 150, 243, 0.1)"
                : "rgba(33, 150, 243, 0.7)",
            borderWidth: 2,
            tension: 0.4,
            fill: chartType === "line",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              stepSize: 20,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Store chart for updates
    canvas._chart = chart;
    canvas._data = dataArray;
  }
  // Update chart component
  function updateChart(component, config, dataArray) {
    const canvas = component.querySelector("canvas");
    if (!canvas) return;

    // Destroy existing chart if it exists
    if (canvas._chart) {
      canvas._chart.destroy();
    }

    canvas.setAttribute("data-source", config.source);
    canvas.setAttribute("data-chart-type", config.chartType);
    canvas.setAttribute("data-time-range", config.timeRange);
    canvas.setAttribute("data-time-range", config.timeRange);

    // Initialize new chart
    initializeChart(component, dataArray);
  }
  // Update text input component
  function updateTextInput(component, config) {
    const controlItem = component.querySelector(".control-item");
    const sendButton = component.querySelector(".send-component");
    const input = controlItem.querySelector(".text-input");
    sendButton.addEventListener("click", () => {
      component.setAttribute("return-value", input.value);
      sendImmediateCommand(component);
      //here is the function and acknowledge
      input.value = "";
    });
    if (!controlItem) return;

    const label = controlItem.querySelector(".control-label");

    if (label) label.textContent = config.label;

    if (input) {
      input.setAttribute("data-target", config.target);
      input.setAttribute("placeholder", config.placeholder);
    }
  }
  // Update switch button component
  function updateSwitchButton(component, config) {
    const controlItem = component.querySelector(".control-item");
    if (!controlItem) return;

    const label = controlItem.querySelector(".control-label");
    const input = controlItem.querySelector('input[type="checkbox"]');

    if (label) label.textContent = config.label;

    if (input) {
      input.setAttribute("data-target", config.target);
      input.checked = config.defaultState;

      // Add event listener if not already added
      if (!input._hasListener) {
        input.addEventListener("change", function () {
          // sendCommand(this.getAttribute('data-target'), { state: this.checked });
          component.setAttribute("return-value", input.checked);
          sendImmediateCommand(component);
          //here is the function and acknowledge
        });
        input._hasListener = true;
      }
    }
  }
  // Update slider component
  function updateSlider(component, config) {
    const controlItem = component.querySelector(".control-item");
    if (!controlItem) return;

    const label = controlItem.querySelector(".control-label");
    const slider = controlItem.querySelector(".range-slider");
    const value = controlItem.querySelector(".range-value");

    if (label) label.textContent = config.label;

    if (slider) {
      slider.setAttribute("data-target", config.target);
      slider.min = config.min;
      slider.max = config.max;
      slider.value = config.default;

      // Update value display
      if (value) value.textContent = config.default + "%";

      // Add event listener if not already added
      if (!slider._hasListener) {
        slider.addEventListener("input", function () {
          const valueDisplay = this.parentNode.querySelector(".range-value");
          if (valueDisplay) valueDisplay.textContent = this.value + "%";
        });

        slider.addEventListener("change", function () {
          component.setAttribute("return-value", this.value);
          sendImmediateCommand(component);
          //here is the function and acknowledge
        });

        slider._hasListener = true;
      }
    }
  }
  // Update select dropdown component
  function updateSelectDropdown(component, config) {
    const controlItem = component.querySelector(".control-item");
    if (!controlItem) return;

    const label = controlItem.querySelector(".control-label");
    const select = controlItem.querySelector("select");

    if (label) label.textContent = config.label;

    if (select) {
      select.setAttribute("data-target", config.target);

      // Clear existing options
      select.innerHTML = "";

      // Add new options
      const options = config.options.split("\n");
      options.forEach((option) => {
        if (option.trim()) {
          const [value, label] = option.split(":");
          const optionEl = document.createElement("option");
          optionEl.value = value.trim();
          optionEl.textContent = label ? label.trim() : value.trim();
          select.appendChild(optionEl);
        }
      });

      // Add event listener if not already added
      if (!select._hasListener) {
        select.addEventListener("change", function () {
          component.setAttribute("return-value", this.value);
          sendImmediateCommand(component);
          //here is the function and acknowledge
        });
        select._hasListener = true;
      }
    }
  }

  // Update push button component
  function updatePushButton(component, config) {
    const controlItem = component.querySelector(".control-item");
    if (!controlItem) return;

    const label = controlItem.querySelector(".control-label");
    const button = controlItem.querySelector("button");

    if (label) label.textContent = config.label;

    if (button) {
      button.textContent = config.buttonText;
      button.setAttribute("data-target", config.target);
      button.setAttribute("data-confirm", config.confirm);

      // Update button style
      button.className = `btn ${config.buttonStyle}`;

      // Add event listener if not already added
      if (!button._hasListener) {
        button.addEventListener("click", function () {
          const target = this.getAttribute("data-target");
          const requireConfirm = this.getAttribute("data-confirm") === "true";
          let returnValue = "";
          if (requireConfirm) {
            if (
              confirm(`Are you sure you want to execute the ${target} command?`)
            ) {
              returnValue = "hard";
            }
          } else {
            returnValue = "soft";
          }
          // component.setAttribute("return-value", "");
          sendImmediateCommand(component);
          //here is the function and acknowledge
        });
        button._hasListener = true;
      }
    }
  }

  function updateAutomationRule(component, formData) {
    console.log("this is form data : ", formData);
    console.log("this is component : ", component);

    socket.emit("addAutomationRule", formData);
  }

  async function sendImmediateCommand(component) {
    const device = component.getAttribute("device");
    const source = component.getAttribute("source");
    const method = component.getAttribute("method");
    const returnValue = component.getAttribute("return-value");
    const methodType = component.getAttribute("method-type");
    const parameterLength = autoParse(
      component.getAttribute("parameter-length")
    );
    const result = await socket.emitWithAck("immediateCommand", {
      device,
      source,
      method,
      methodType,
      returnValue,
      parameterLength,
    });

    if (component.getAttribute("method-type") === "read") {
      if (
        typeof result === "object" &&
        !Array.isArray(result) &&
        result !== null
      )
        component.setAttribute("return-value", JSON.stringify(result.value));
      else component.setAttribute("return-value", result.value);
    } else {
      if (readComponents[`${device}-${source}`]) {
        readComponents[`${device}-${source}`].forEach((component) => {
          sendImmediateCommand(component);
        });
      }
    }
    return await result;
  }
});
