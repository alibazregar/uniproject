const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// About page
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});

// Contact page
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/public/contact.html');
});


app.post('/save-contact', async(req, res) => {
    const { name, email, message } = req.body;
    const contactData = { name, email, message };
    await checkAndCreateFile("./contacts.json")
    fs.readFile('contacts.json', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred' });
      }
  
      const contacts = JSON.parse(data.toString() || '[]');
      contacts.push(contactData);
  
      fs.writeFile('contacts.json', JSON.stringify(contacts), err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'An error occurred' });
        }
  
        res.json({ message: 'Contact form data saved successfully' });
      });
    });
});

module.exports = app

function checkAndCreateFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            fs.writeFile(filePath, '', (err) => {
              if (err) {
                reject(`Error while creating file: ${err}`);
              } else {
                resolve();
              }
            });
          } else {
            reject(`Error while checking file: ${err}`);
          }
        } else {
          resolve();
        }
      });
    });
  }