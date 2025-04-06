console.log('this is devices : ', devices); 
let randomTemp = 0; 

setInterval(() => {
    randomTemp = Math.random() * 100;
}, 1000);

const componentTemplates = {
    'text-display': {
        title: 'Text Display',
        content: `
            <div class="text-display" data-source="temperature">
                Waiting for data...
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Text Display' },
            { name: 'device', type: 'select', label: 'Data Source', dynamic: true, 
                options: [],
                default: ''
            },
            { name: 'source', type: 'select', label: 'Data Source',dynamic: true, 
              options: [],
              default: ''
            },
            { name: 'format', type: 'text', label: 'Format String', default: '{value}' }
        ]
    },
    'circle-canvas': {
        title: 'Circle Canvas',
        content: `
            <canvas class="circle-canvas" data-source="cpuUsage" data-min="0" data-max="100"></canvas>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Circle Canvas' },
            { name: 'device', type: 'select', label: 'Data Source', dynamic: true, 
                options: [],
                default: ''
            },
            { name: 'source', type: 'select', label: 'Data Source', 
              options: [
                  { value: 'temperature', label: 'Temperature' },
                  { value: 'cpuUsage', label: 'CPU Usage' },
                  { value: 'memoryUsage', label: 'Memory Usage' }
              ],
              default: 'cpuUsage'
            },
            { name: 'min', type: 'number', label: 'Minimum Value', default: 0 },
            { name: 'max', type: 'number', label: 'Maximum Value', default: 100 },
            { name: 'colorMin', type: 'color', label: 'Min Color', default: '#4caf50' },
            { name: 'colorMax', type: 'color', label: 'Max Color', default: '#f44336' }
        ]
    },
    'onoff-indicator': {
        title: 'On/Off Indicator',
        content: `
            <div class="onoff-indicator off" data-source="power">
                OFF
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'On/Off Indicator' },
            { name: 'device', type: 'select', label: 'Data Source', dynamic: true, 
                options: [],
                default: ''
            },
            { name: 'source', type: 'select', label: 'Data Source', 
              options: [
                  { value: 'power', label: 'Power' },
                  { value: 'networkStatus', label: 'Network Status' }
              ],
              default: 'power'
            },
            { name: 'onText', type: 'text', label: 'On Text', default: 'ON' },
            { name: 'offText', type: 'text', label: 'Off Text', default: 'OFF' }
        ]
    },
    'gauge': {
        title: 'Gauge',
        content: `
            <div class="gauge-container">
                <div class="gauge">
                    <div class="gauge-fill" style="height: 0%"></div>
                    <div class="gauge-value">0%</div>
                </div>
                <div class="gauge-label">Value</div>
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Gauge' },
            { name: 'device', type: 'select', label: 'Data Source', dynamic: true, 
                options: [],
                default: ''
            },
            { name: 'source', type: 'select', label: 'Data Source', 
              options: [
                  { value: 'temperature', label: 'Temperature' },
                  { value: 'cpuUsage', label: 'CPU Usage' },
                  { value: 'memoryUsage', label: 'Memory Usage' },
                  { value: 'fanSpeed', label: 'Fan Speed' }
              ],
              default: 'cpuUsage'
            },
            { name: 'label', type: 'text', label: 'Label', default: 'Value' },
            { name: 'min', type: 'number', label: 'Minimum Value', default: 0 },
            { name: 'max', type: 'number', label: 'Maximum Value', default: 100 }
        ]
    },
    'chart': {
        title: 'Chart',
        content: `
            <div class="chart-container">
                <canvas></canvas>
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Chart' },
            { name: 'device', type: 'select', label: 'Data Source', dynamic: true, 
                options: [],
                default: ''
            },
            { name: 'source', type: 'select', label: 'Data Source', 
              options: [
                  { value: 'temperature', label: 'Temperature' },
                  { value: 'cpuUsage', label: 'CPU Usage' },
                  { value: 'memoryUsage', label: 'Memory Usage' }
              ],
              default: 'temperature'
            },
            { name: 'chartType', type: 'select', label: 'Chart Type', 
              options: [
                  { value: 'line', label: 'Line' },
                  { value: 'bar', label: 'Bar' }
              ],
              default: 'line'
            },
            { name: 'timeRange', type: 'select', label: 'Time Range', 
              options: [
                  { value: '5', label: '5 minutes' },
                  { value: '10', label: '10 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' }
              ],
              default: '10'
            }
        ]
    },
    'text-input': {
        title: 'Text Input',
        content: `
            <div class="control-item">
                <span class="control-label">Input</span>
                <input type="text" class="text-input" data-target="customCommand">
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Text Input' },
            { name: 'label', type: 'text', label: 'Label', default: 'Input' },
            { name: 'placeholder', type: 'text', label: 'Placeholder', default: 'Enter text...' },
            { name: 'target', type: 'text', label: 'Target Command', default: 'customCommand' }
        ]
    },
    'switch-button': {
        title: 'Switch Button',
        content: `
            <div class="control-item">
                <span class="control-label">Switch</span>
                <label class="switch">
                    <input type="checkbox" data-target="power">
                    <span class="slider"></span>
                </label>
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Switch Button' },
            { name: 'label', type: 'text', label: 'Label', default: 'Switch' },
            { name: 'target', type: 'select', label: 'Target Command', 
              options: [
                  { value: 'power', label: 'Power' },
                  { value: 'autoRestart', label: 'Auto Restart' }
              ],
              default: 'power'
            },
            { name: 'defaultState', type: 'checkbox', label: 'Default State', default: false }
        ]
    },
    'slider': {
        title: 'Slider',
        content: `
            <div class="control-item">
                <span class="control-label">Slider</span>
                <input type="range" min="0" max="100" value="50" class="range-slider" data-target="fanSpeed">
                <div class="range-value">50%</div>
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Slider' },
            { name: 'label', type: 'text', label: 'Label', default: 'Slider' },
            { name: 'min', type: 'number', label: 'Minimum Value', default: 0 },
            { name: 'max', type: 'number', label: 'Maximum Value', default: 100 },
            { name: 'default', type: 'number', label: 'Default Value', default: 50 },
            { name: 'target', type: 'select', label: 'Target Command', 
              options: [
                  { value: 'fanSpeed', label: 'Fan Speed' },
                  { value: 'brightness', label: 'Brightness' },
                  { value: 'volume', label: 'Volume' }
              ],
              default: 'fanSpeed'
            }
        ]
    },
    'select-dropdown': {
        title: 'Select Dropdown',
        content: `
            <div class="control-item">
                <span class="control-label">Select</span>
                <select class="btn" data-target="mode">
                    <option value="auto">Auto</option>
                    <option value="performance">Performance</option>
                    <option value="eco">Eco</option>
                </select>
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Select Dropdown' },
            { name: 'label', type: 'text', label: 'Label', default: 'Select' },
            { name: 'options', type: 'textarea', label: 'Options (one per line, value:label)', 
              default: 'auto:Auto\nperformance:Performance\neco:Eco' },
            { name: 'target', type: 'text', label: 'Target Command', default: 'mode' }
        ]
    },
    'push-button': {
        title: 'Push Button',
        content: `
            <div class="control-item">
                <span class="control-label">Button</span>
                <button class="btn btn-primary" data-target="restart">Press</button>
            </div>
        `,
        config: [
            { name: 'title', type: 'text', label: 'Title', default: 'Push Button' },
            { name: 'label', type: 'text', label: 'Label', default: 'Button' },
            { name: 'buttonText', type: 'text', label: 'Button Text', default: 'Press' },
            { name: 'buttonStyle', type: 'select', label: 'Button Style', 
              options: [
                  { value: 'btn-primary', label: 'Primary' },
                  { value: 'btn-secondary', label: 'Secondary' },
                  { value: 'btn-success', label: 'Success' },
                  { value: 'btn-warning', label: 'Warning' },
                  { value: 'btn-danger', label: 'Danger' }
              ],
              default: 'btn-primary'
            },
            { name: 'target', type: 'text', label: 'Target Command', default: 'restart' },
            { name: 'confirm', type: 'checkbox', label: 'Require Confirmation', default: false }
        ]
    },
    'automation-rule': {
        title: 'Automation Rule',
        content: `
            <div class="automation-rule">
                <select class="input-device">
                    <option value="">Select Input</option>
                    <option value="temperature">Temperature</option>
                    <option value="cpuUsage">CPU Usage</option>
                    <option value="memoryUsage">Memory Usage</option>
                </select>
                <select class="condition">
                    <option value="gt">Greater Than</option>
                    <option value="lt">Less Than</option>
                    <option value="eq">Equal To</option>
                </select>
                <input type="number" class="threshold" value="80">
                <select class="output-action">
                    <option value="">Select Action</option>
                    <option value="power">Toggle Power</option>
                    <option value="fanSpeed">Set Fan Speed</option>
                    <option value="mode">Change Mode</option>
                </select>
                <input type="text" class="action-value" placeholder="Value">
                <button class="delete-rule">×</button>
            </div>
        `,
        config: [
            { name: 'inputDevice', type: 'select', label: 'Input Device', 
              options: [
                  { value: 'temperature', label: 'Temperature' },
                  { value: 'cpuUsage', label: 'CPU Usage' },
                  { value: 'memoryUsage', label: 'Memory Usage' }
              ],
              default: 'cpuUsage'
            },
            { name: 'condition', type: 'select', label: 'Condition', 
              options: [
                  { value: 'gt', label: 'Greater Than' },
                  { value: 'lt', label: 'Less Than' },
                  { value: 'eq', label: 'Equal To' }
              ],
              default: 'gt'
            },
            { name: 'threshold', type: 'number', label: 'Threshold', default: 80 },
            { name: 'outputAction', type: 'select', label: 'Output Action', 
              options: [
                  { value: 'power', label: 'Toggle Power' },
                  { value: 'fanSpeed', label: 'Set Fan Speed' },
                  { value: 'mode', label: 'Change Mode' }
              ],
              default: 'fanSpeed'
            },
            { name: 'actionValue', type: 'text', label: 'Action Value', default: '100' }
        ]
    }
};
