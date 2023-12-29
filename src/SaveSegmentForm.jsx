import React, { useState } from 'react';
import './SaveSegmentPage.css'; // Import external CSS file

const SaveSegmentPage = () => {
  const [showSidenav, setShowSidenav] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [newDropdowns, setNewDropdowns] = useState([]);
  const [inputValues, setInputValues] = useState({});

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const handleAddNewSchema = () => {
    if (selectedSchema && !newDropdowns.includes(selectedSchema)) {
      setNewDropdowns([...newDropdowns, selectedSchema]);
      setSelectedSchema('');
    }
  };

  const handleClearInput = (dropdown) => {
    setInputValues({ ...inputValues, [dropdown]: '' });
    setNewDropdowns(newDropdowns.filter((item) => item !== dropdown));
  };

  const handleSaveSegment = () => {
    // Prepare data for sending to the server
    const segmentData = {
      segment_name: segmentName,
      schema: newDropdowns.map((dropdown) => ({
        [dropdown]: `${inputValues[dropdown] || ''}`,
      })),
    };

    fetch('	https://webhook.site/964ec559-9705-4cb7-b2f3-98e650068fce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segmentData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Data sent successfully:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    console.log('Segment Data:', segmentData);

    // Reset form after saving
    setSegmentName('');
    setNewDropdowns([]);
    setSelectedSchema('');
    setInputValues({});
    setShowSidenav(false); // Close the sidenav after saving
  };

  const handleCancel = () => {
    // Reset form on cancel
    setSegmentName('');
    setNewDropdowns([]);
    setSelectedSchema('');
    setInputValues({});
    setShowSidenav(false); // Close the sidenav on cancel
  };

  return (
    <div>
      <button onClick={() => setShowSidenav(true)}>Open Sidenav</button>

      {/* Sidenav */}
      <div className={`sidenav ${showSidenav ? 'open' : ''}`}>
        <div id="mySidenavHeader">
          <span>Saving Segment</span>
        </div>
        <label htmlFor="segmentName">Enter the Name of the Segment</label>
        <input
          type="text"
          placeholder={`Enter Name of the Segment`}
          id="segmentName"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
        />

        <label htmlFor="schemaDropdown">To save the segment, you need to add the schemas to build the query</label>
        <div id="circleContainer">
          <div className="circle green-circle"></div>
          <div className="text">- User Traits</div>
          <div className="circle red-circle"></div>
          <div className="text">- Group Traits</div>
        </div>
        <select
          id="schemaDropdown"
          value={selectedSchema}
          onChange={(e) => setSelectedSchema(e.target.value)}
        >
          <option value="" disabled>Select Schema</option>
          {schemaOptions
            .filter((option) => !newDropdowns.includes(option.value))
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>

        <button onClick={handleAddNewSchema}>+ Add new schema</button>

        {newDropdowns.map((dropdown, index) => (
          <div key={index} className="input-container">
            <input
              type="text"
              placeholder={`Enter ${schemaOptions.find((option) => option.value === dropdown)?.label}`}
              value={inputValues[dropdown] || ''}
              onChange={(e) => setInputValues({ ...inputValues, [dropdown]: e.target.value })}
            />
            <div className="cross-icon" onClick={() => handleClearInput(dropdown)}>
              ✕
            </div>
          </div>
        ))}

        {/* Container for Save and Cancel buttons */}
        <div className="button-container">
          <button className="save-button" onClick={handleSaveSegment}>
            Save Segment
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSegmentPage;
