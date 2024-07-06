# Storage-Device-Test
The Storage Device Speed Test is a cross-platform application designed to measure and analyze the read and write speeds of storage devices. 
It features a backend implemented in C++ and Flask to perform speed tests and handle data processing. 
The frontend, built with HTML, CSS, and JavaScript, offers a user-friendly interface to display test results, including latency metrics, through dynamic charts created using Chart.js. 

Table of Contents:
-Features-
-Installation-
-Usage-
-Project Structure-

-Features-
Measure read and write speeds of storage devices.
Display detailed latency metrics.
User-friendly web interface.
Dynamic charts for visualizing results.

-Installation-
Prerequisites
-Git
-Python 3.x
-Flask
-C++ compiler (e.g., g++)
-Web browser

-Usage- 
Running a Speed Test
Enter the device file path.
Select the desired file size and buffer size.
Click the "Start Speed Test" button.
View the results displayed on the web interface.

-Project Structure-
StorageDeviceTest/
├── backend/
│   ├── app.py               # Flask backend application
│   ├── speed_test.cpp       # C++ speed test program
│   └── speed_test           # Compiled C++ executable
├── frontend/
│   ├── index.html           # Frontend HTML file
│   ├── stylesheet.css       # Frontend CSS file
│   └── app.js               # Frontend JavaScript file
└── README.md                # Project README file
