document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('peripheralForm');
    const peripheralSelect = document.getElementById('peripheral');
    const addButton = document.getElementById('addPeripheral');
    const peripheralList = document.getElementById('peripheralList');
    const selectedPeripheralsInput = document.getElementById('selectedPeripherals');
    const cancelButton = document.getElementById('cancelButton');
    
    // Array to store selected peripherals
    let selectedPeripherals = [];
    
    // Add peripheral to the list
    addButton.addEventListener('click', function() {
        const peripheral = peripheralSelect.value;
        
        if (peripheral) {
            // Add to array
            selectedPeripherals.push(peripheral);
            
            // Create list item
            const li = document.createElement('li');
            li.className = 'peripheral-item';
            li.innerHTML = `
                <span>${peripheral}</span>
                <button type="button" class="btn-delete" data-peripheral="${peripheral}">×</button>
            `;
            
            // Add to list
            peripheralList.appendChild(li);
            
            // Update hidden input
            selectedPeripheralsInput.value = JSON.stringify(selectedPeripherals);
            
            // Reset select
            peripheralSelect.value = '';
        }
    });
    
    // Remove peripheral from the list
    peripheralList.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete')) {
            const button = e.target;
            const peripheral = button.getAttribute('data-peripheral');
            
            // Remove from array
            selectedPeripherals = selectedPeripherals.filter(p => p !== peripheral);
            
            // Remove list item
            button.parentElement.remove();
            
            // Update hidden input
            selectedPeripheralsInput.value = JSON.stringify(selectedPeripherals);
        }
    });
    
    // Cancel button
    cancelButton.addEventListener('click', function() {
        // Reset form
        form.reset();
        
        // Clear peripheral list
        peripheralList.innerHTML = '';
        selectedPeripherals = [];
        selectedPeripheralsInput.value = '';

    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            peripherals: selectedPeripherals
        };
        
        axios.post('/devices', formData).then(res => console.log(res)).catch(err => console.log(err))

        console.log('Form submitted:', formData);
        // Here you would typically send the data to a server
        
        alert('Form submitted successfully!\n' + JSON.stringify(formData, null, 2));
        
        // Reset form
        form.reset();
        peripheralList.innerHTML = '';
        selectedPeripherals = [];
        selectedPeripheralsInput.value = '';
        window.location.href = "/devices";

    });
});

