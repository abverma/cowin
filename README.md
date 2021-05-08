
This program looks for available slots on cowin website for given pincode, district_id and age limit. When a slot is found a song is played. The purpose is to keep the program running while you continue your work and when a slot is found a song starts playing as a notification. Once a slot is found you still have to log in to cowin site and book the slot for yourself.

Nodejs should be install on your machine. Song will play only on macos so a mac is preferred. Also you should not be connected to Oracle vpn.

To run program, edit index.js and add your pincode, district_id (294 for BBPM), age limit. Then execute below commands.

npm install
node index.js

Program will make an http request every 1 sec and keep repeating until a slot is found.
