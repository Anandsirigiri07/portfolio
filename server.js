const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, 'data.json');

const DEFAULT_DATA = {
  status: {
    text: "Building the next generation workstation dashboard",
    indicator: "online",
    updatedAt: new Date().toISOString()
  },
  metrics: {
    coffeeCount: 3,
    currentFocus: "DSA in Java & Crime Analytics",
    commitsToday: 4
  },
  currentlyBuilding: [
    {
      id: "siddhi",
      name: "SIDDHI AI Analytics",
      status: "Optimizing geographic mapping coordinates",
      progress: 82,
      tag: "Active"
    },
    {
      id: "gitnest",
      name: "GitNest Platform",
      status: "Refining repository branching checks",
      progress: 65,
      tag: "Active"
    },
    {
      id: "agri-vision",
      name: "Agri-Vision Crop Analysis",
      status: "Tuning image classifier convolutional layers",
      progress: 45,
      tag: "Ongoing"
    },
    {
      id: "dsa-java",
      name: "DSA in Java Suite",
      status: "Solving balance trees node height logic",
      progress: 90,
      tag: "Active"
    }
  ],
  workStream: [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      category: "feature",
      text: "Designed workstation dashboard UI layout with glassmorphic cards."
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      category: "dsa",
      text: "Solved tree structure questions on LeetCode using Java recursion."
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      category: "bugfix",
      text: "Patched WebSocket frame parser crashes in GitNest server modules."
    }
  ]
};

// Check if data.json exists, if not create default
if (!fs.existsSync(DATA_FILE)) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
    console.log('Created default data.json file.');
  } catch (e) {
    console.error('Failed to create default data.json:', e);
  }
}

// GET portfolio configuration data
app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json, using defaults:', err);
      return res.json(DEFAULT_DATA);
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      console.error('Error parsing data.json, using defaults:', parseErr);
      res.json(DEFAULT_DATA);
    }
  });
});

// POST save modified data back to disk
app.post('/api/save', (req, res) => {
  const newData = req.body;
  if (!newData || typeof newData !== 'object') {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Ensure updatedAt is set to current time
  if (newData.status) {
    newData.status.updatedAt = new Date().toISOString();
  }

  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error saving data.json:', err);
      return res.status(500).json({ error: 'Failed to write data.json to workspace disk' });
    }
    console.log('Saved updated portfolio configuration to data.json.');
    res.json({ success: true, data: newData });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
