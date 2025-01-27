import React, { useState } from 'react';

const Automation = () => {
  const [automations, setAutomations] = useState([]);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: '',
    action: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAutomation.name || !newAutomation.trigger || !newAutomation.action) return;

    setAutomations([...automations, { ...newAutomation, id: Date.now(), active: true }]);
    setNewAutomation({
      name: '',
      description: '',
      trigger: '',
      action: ''
    });
  };

  return (
    <div className="automation">
      <h2>Automations</h2>
      <div className="automation-form">
        <h3>Create New Automation</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newAutomation.name}
              onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
              placeholder="Automation name"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={newAutomation.description}
              onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
              placeholder="Describe what this automation does"
            />
          </div>
          <div className="form-group">
            <label>Trigger:</label>
            <input
              type="text"
              value={newAutomation.trigger}
              onChange={(e) => setNewAutomation({...newAutomation, trigger: e.target.value})}
              placeholder="When should this automation run?"
            />
          </div>
          <div className="form-group">
            <label>Action:</label>
            <input
              type="text"
              value={newAutomation.action}
              onChange={(e) => setNewAutomation({...newAutomation, action: e.target.value})}
              placeholder="What should this automation do?"
            />
          </div>
          <button type="submit">Create Automation</button>
        </form>
      </div>
      <div className="automations-list">
        <h3>Your Automations</h3>
        {automations.map(automation => (
          <div key={automation.id} className="automation-card">
            <h4>{automation.name}</h4>
            <p>{automation.description}</p>
            <div className="automation-details">
              <span>Trigger: {automation.trigger}</span>
              <span>Action: {automation.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Automation;
